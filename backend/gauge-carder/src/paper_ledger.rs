use shared_types::{BasisTick, Card, CheapSide};

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Fill {
    pub card_id: String,
    pub user_id: String,
    pub symbol: String,
    pub cheap_side: CheapSide,
    pub clip_usd: f64,
    /// The confirm-tick mid for the leg actually bought — never the
    /// card-tick mid the card was opened against (ARCHITECTURE.md §2.3).
    pub fill_price: f64,
    pub filled_at_ms: u64,
}

/// Paper fills only. A live fill's price and `broker_order_id` come from
/// gauge-exec instead — this ledger never talks to Robinhood.
#[derive(Default)]
pub struct PaperLedger {
    fills: Vec<Fill>,
}

impl PaperLedger {
    pub fn new() -> Self {
        Self { fills: Vec::new() }
    }

    pub fn record_fill(&mut self, card: &Card, confirm_tick: &BasisTick, now_ms: u64) -> &Fill {
        let fill_price = match card.cheap_side {
            CheapSide::Equity => confirm_tick.share_mid,
            CheapSide::Token | CheapSide::Neither => confirm_tick.token_per_share,
        };
        self.fills.push(Fill {
            card_id: card.card_id.clone(),
            user_id: card.user_id.clone(),
            symbol: card.symbol.clone(),
            cheap_side: card.cheap_side,
            clip_usd: card.clip_usd,
            fill_price,
            filled_at_ms: now_ms,
        });
        self.fills.last().expect("just pushed")
    }

    pub fn fills_for(&self, user_id: &str) -> impl Iterator<Item = &Fill> {
        self.fills.iter().filter(move |f| f.user_id == user_id)
    }

    /// Rehydrates from already-computed `Fill`s (e.g. loaded from
    /// persistence) — unlike `record_fill`, doesn't recompute a price.
    pub fn hydrate(&mut self, fills: Vec<Fill>) {
        self.fills = fills;
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use shared_types::{CardState, Decision, Session};

    fn card() -> Card {
        Card {
            card_id: "c1".to_string(),
            user_id: "alice".to_string(),
            symbol: "HOOD".to_string(),
            clip_usd: 40.0,
            cheap_side: CheapSide::Token,
            basis_bps: 130.0,
            net_bps: 100.0,
            state: CardState::Confirmed,
            opened_at_ms: 1_000,
            ttl_ms: 75_000,
        }
    }

    fn tick(share_mid: f64, token_per_share: f64) -> BasisTick {
        BasisTick {
            symbol: "HOOD".to_string(),
            share_mid,
            token_per_share,
            basis_bps: 120.0,
            net_bps: 90.0,
            cheap_side: CheapSide::Token,
            session: Session::Rth,
            clip_max: 100.0,
            decision: Decision::CardEligible,
            ts_ms: 40_000,
        }
    }

    #[test]
    fn fills_at_confirm_tick_mid_for_the_cheap_side_not_the_card_tick() {
        let mut ledger = PaperLedger::new();
        // Card opened against a different (stale) mid than what confirm sees.
        let fill = ledger.record_fill(&card(), &tick(50.0, 49.4), 40_000);
        assert_eq!(fill.fill_price, 49.4);
    }

    #[test]
    fn fills_are_queryable_per_user() {
        let mut ledger = PaperLedger::new();
        ledger.record_fill(&card(), &tick(50.0, 49.4), 40_000);
        assert_eq!(ledger.fills_for("alice").count(), 1);
        assert_eq!(ledger.fills_for("bob").count(), 0);
    }

    #[test]
    fn hydrate_restores_previously_recorded_fills_without_recomputing_price() {
        let mut ledger = PaperLedger::new();
        ledger.hydrate(vec![Fill {
            card_id: "c1".to_string(),
            user_id: "alice".to_string(),
            symbol: "HOOD".to_string(),
            cheap_side: CheapSide::Token,
            clip_usd: 40.0,
            fill_price: 49.4,
            filled_at_ms: 40_000,
        }]);
        assert_eq!(ledger.fills_for("alice").count(), 1);
        assert_eq!(ledger.fills_for("alice").next().unwrap().fill_price, 49.4);
    }
}
