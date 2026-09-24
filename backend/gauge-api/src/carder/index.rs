use std::collections::HashMap;

use shared_types::User;

/// symbol -> subscribed user_ids (universe minus mutes, already applied).
/// This is what keeps a HOOD tick from touching all 30k users — only ever
/// look up `subscribers_for("HOOD")`, never scan every user.
pub struct SubscriberIndex {
    by_symbol: HashMap<String, Vec<String>>,
}

impl SubscriberIndex {
    pub fn build<'a>(users: impl IntoIterator<Item = &'a User>) -> Self {
        let mut by_symbol: HashMap<String, Vec<String>> = HashMap::new();
        for user in users {
            for symbol in &user.universe {
                if user.mutes.contains(symbol) {
                    continue;
                }
                by_symbol
                    .entry(symbol.clone())
                    .or_default()
                    .push(user.user_id.clone());
            }
        }
        Self { by_symbol }
    }

    pub fn subscribers_for(&self, symbol: &str) -> &[String] {
        self.by_symbol
            .get(symbol)
            .map(Vec::as_slice)
            .unwrap_or(&[])
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use shared_types::UserMode;
    use std::collections::HashSet;

    fn user(id: &str, universe: &[&str], mutes: &[&str]) -> User {
        User {
            user_id: id.to_string(),
            mode: UserMode::Paper,
            nav_usd: 1_000.0,
            max_clip_usd: 100.0,
            name_pct: 0.1,
            daily_card_cap: 3,
            universe: universe.iter().map(|s| s.to_string()).collect::<HashSet<_>>(),
            mutes: mutes.iter().map(|s| s.to_string()).collect::<HashSet<_>>(),
            kill_switch: false,
        }
    }

    #[test]
    fn a_tick_only_reaches_subscribed_unmuted_users() {
        let alice = user("alice", &["HOOD", "NVDA"], &[]);
        let bob = user("bob", &["HOOD"], &["HOOD"]);
        let carol = user("carol", &["NVDA"], &[]);
        let index = SubscriberIndex::build([&alice, &bob, &carol]);

        assert_eq!(index.subscribers_for("HOOD"), ["alice".to_string()]);
        assert_eq!(index.subscribers_for("NVDA").len(), 2);
    }

    #[test]
    fn unknown_symbol_has_no_subscribers() {
        let index = SubscriberIndex::build(std::iter::empty());
        assert!(index.subscribers_for("TSLA").is_empty());
    }
}
