use std::collections::HashMap;

use shared_types::{Card, CardState};

const MS_PER_DAY: u64 = 86_400_000;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ConfirmOutcome {
    Confirmed,
    StaleOnConfirm,
}

/// Card lifecycle (open -> confirmed | rejected | expired | stale_on_confirm),
/// TTL, idempotency on card_id, and the per-user daily-open counter that
/// `policy::evaluate` needs. In-memory — a real store needs a persistence
/// choice that hasn't been made yet.
pub struct CardStore {
    cards: HashMap<String, Card>,
    opened_today: HashMap<String, u32>,
    day_bucket: u64,
}

impl CardStore {
    pub fn new() -> Self {
        Self {
            cards: HashMap::new(),
            opened_today: HashMap::new(),
            day_bucket: 0,
        }
    }

    fn roll_day_bucket(&mut self, now_ms: u64) {
        let bucket = now_ms / MS_PER_DAY;
        if bucket != self.day_bucket {
            self.day_bucket = bucket;
            self.opened_today.clear();
        }
    }

    /// How many cards this user has opened in the current day bucket — feed
    /// this into `policy::evaluate` before deciding whether to open another.
    pub fn cards_opened_today(&mut self, user_id: &str, now_ms: u64) -> u32 {
        self.roll_day_bucket(now_ms);
        *self.opened_today.get(user_id).unwrap_or(&0)
    }

    /// Registers an already-built, `Open`-state card and counts it against
    /// the day's cap.
    pub fn open(&mut self, card: Card) -> &Card {
        self.roll_day_bucket(card.opened_at_ms);
        *self.opened_today.entry(card.user_id.clone()).or_insert(0) += 1;
        let id = card.card_id.clone();
        self.cards.insert(id.clone(), card);
        self.cards.get(&id).expect("just inserted")
    }

    pub fn get(&self, card_id: &str) -> Option<&Card> {
        self.cards.get(card_id)
    }

    pub fn cards_for_user(&self, user_id: &str) -> Vec<&Card> {
        self.cards.values().filter(|c| c.user_id == user_id).collect()
    }

    /// Idempotent: confirming an already-resolved card is a no-op (`None`)
    /// rather than double-filling. Confirming past TTL resolves to
    /// `StaleOnConfirm`, distinct from a background `expire_stale` sweep.
    pub fn confirm(&mut self, card_id: &str, now_ms: u64) -> Option<ConfirmOutcome> {
        let card = self.cards.get_mut(card_id)?;
        if card.state != CardState::Open {
            return None;
        }
        if now_ms.saturating_sub(card.opened_at_ms) > card.ttl_ms {
            card.state = CardState::StaleOnConfirm;
            Some(ConfirmOutcome::StaleOnConfirm)
        } else {
            card.state = CardState::Confirmed;
            Some(ConfirmOutcome::Confirmed)
        }
    }

    /// `true` if this call is the one that rejected it; `false` if it was
    /// already resolved (idempotent no-op) or doesn't exist.
    pub fn reject(&mut self, card_id: &str) -> bool {
        match self.cards.get_mut(card_id) {
            Some(card) if card.state == CardState::Open => {
                card.state = CardState::Rejected;
                true
            }
            _ => false,
        }
    }

    /// Flips every timed-out `Open` card to `Expired` and returns their ids
    /// — for a background sweep, not a confirm attempt.
    pub fn expire_stale(&mut self, now_ms: u64) -> Vec<String> {
        let mut expired = Vec::new();
        for card in self.cards.values_mut() {
            if card.state == CardState::Open
                && now_ms.saturating_sub(card.opened_at_ms) > card.ttl_ms
            {
                card.state = CardState::Expired;
                expired.push(card.card_id.clone());
            }
        }
        expired
    }
}

impl Default for CardStore {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use shared_types::CheapSide;

    fn card(card_id: &str, user_id: &str, opened_at_ms: u64, ttl_ms: u64) -> Card {
        Card {
            card_id: card_id.to_string(),
            user_id: user_id.to_string(),
            symbol: "HOOD".to_string(),
            clip_usd: 40.0,
            cheap_side: CheapSide::Equity,
            basis_bps: 130.0,
            net_bps: 100.0,
            state: CardState::Open,
            opened_at_ms,
            ttl_ms,
        }
    }

    #[test]
    fn confirm_within_ttl_confirms() {
        let mut store = CardStore::new();
        store.open(card("c1", "alice", 1_000, 75_000));
        assert_eq!(store.confirm("c1", 50_000), Some(ConfirmOutcome::Confirmed));
        assert_eq!(store.get("c1").unwrap().state, CardState::Confirmed);
    }

    #[test]
    fn confirm_past_ttl_is_stale_not_confirmed() {
        let mut store = CardStore::new();
        store.open(card("c1", "alice", 1_000, 75_000));
        assert_eq!(
            store.confirm("c1", 1_000 + 75_001),
            Some(ConfirmOutcome::StaleOnConfirm)
        );
        assert_eq!(store.get("c1").unwrap().state, CardState::StaleOnConfirm);
    }

    #[test]
    fn confirming_twice_is_a_no_op_the_second_time() {
        let mut store = CardStore::new();
        store.open(card("c1", "alice", 1_000, 75_000));
        store.confirm("c1", 2_000);
        assert_eq!(store.confirm("c1", 3_000), None);
        assert_eq!(store.get("c1").unwrap().state, CardState::Confirmed);
    }

    #[test]
    fn expire_stale_sweeps_only_timed_out_open_cards() {
        let mut store = CardStore::new();
        store.open(card("fresh", "alice", 1_000, 75_000));
        store.open(card("timed_out", "alice", 1_000, 75_000));
        store.confirm("fresh", 2_000);

        let expired = store.expire_stale(1_000 + 75_001);
        assert_eq!(expired, vec!["timed_out".to_string()]);
        assert_eq!(store.get("fresh").unwrap().state, CardState::Confirmed);
        assert_eq!(store.get("timed_out").unwrap().state, CardState::Expired);
    }

    #[test]
    fn daily_count_tracks_per_user_and_resets_on_a_new_day() {
        let mut store = CardStore::new();
        store.open(card("c1", "alice", 1_000, 75_000));
        store.open(card("c2", "alice", 2_000, 75_000));
        store.open(card("c3", "bob", 2_000, 75_000));

        assert_eq!(store.cards_opened_today("alice", 3_000), 2);
        assert_eq!(store.cards_opened_today("bob", 3_000), 1);

        let next_day = 3_000 + MS_PER_DAY;
        assert_eq!(store.cards_opened_today("alice", next_day), 0);
    }

    #[test]
    fn cards_for_user_only_returns_that_users_cards() {
        let mut store = CardStore::new();
        store.open(card("c1", "alice", 1_000, 75_000));
        store.open(card("c2", "bob", 1_000, 75_000));

        let alice_cards = store.cards_for_user("alice");
        assert_eq!(alice_cards.len(), 1);
        assert_eq!(alice_cards[0].card_id, "c1");
    }
}
