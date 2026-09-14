use std::collections::HashSet;

/// MCP `401` and Robinhood `429` as first-class states (ARCHITECTURE.md
/// §2.5), not exceptions: a `401` disables live for that one user, a `429`
/// pauses live globally — in both cases paper keeps running untouched, since
/// this gate only ever answers "is *live* execution allowed."
#[derive(Default)]
pub struct LiveTradingGate {
    globally_paused: bool,
    unauthorized_users: HashSet<String>,
}

impl LiveTradingGate {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn allows_live(&self, user_id: &str) -> bool {
        !self.globally_paused && !self.unauthorized_users.contains(user_id)
    }

    /// MCP returned 401 for this user — their connection needs reauth.
    pub fn record_unauthorized(&mut self, user_id: &str) {
        self.unauthorized_users.insert(user_id.to_string());
    }

    /// User reconnected / reauthorized.
    pub fn clear_unauthorized(&mut self, user_id: &str) {
        self.unauthorized_users.remove(user_id);
    }

    /// Robinhood returned 429 — back off for everyone until resumed.
    pub fn record_rate_limited(&mut self) {
        self.globally_paused = true;
    }

    pub fn resume_globally(&mut self) {
        self.globally_paused = false;
    }

    pub fn is_globally_paused(&self) -> bool {
        self.globally_paused
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn fresh_gate_allows_everyone() {
        let gate = LiveTradingGate::new();
        assert!(gate.allows_live("alice"));
    }

    #[test]
    fn a_401_disables_only_that_user() {
        let mut gate = LiveTradingGate::new();
        gate.record_unauthorized("alice");
        assert!(!gate.allows_live("alice"));
        assert!(gate.allows_live("bob"));
    }

    #[test]
    fn a_429_pauses_everyone_globally() {
        let mut gate = LiveTradingGate::new();
        gate.record_rate_limited();
        assert!(!gate.allows_live("alice"));
        assert!(!gate.allows_live("bob"));
        assert!(gate.is_globally_paused());
    }

    #[test]
    fn resuming_and_reauthorizing_restore_access_independently() {
        let mut gate = LiveTradingGate::new();
        gate.record_unauthorized("alice");
        gate.record_rate_limited();

        gate.resume_globally();
        assert!(!gate.allows_live("alice"), "alice is still individually disabled");
        assert!(gate.allows_live("bob"));

        gate.clear_unauthorized("alice");
        assert!(gate.allows_live("alice"));
    }
}
