use std::collections::HashMap;

use shared_types::Decision;

use crate::market::halt::HaltController;

/// One `HaltController` per symbol, created on first sight. Owns nothing
/// about *how* ticks arrive — the ingest loop drives it.
pub struct HaltRegistry {
    resume_after_clean_ticks: u32,
    controllers: HashMap<String, HaltController>,
}

impl HaltRegistry {
    pub fn new(resume_after_clean_ticks: u32) -> Self {
        Self {
            resume_after_clean_ticks,
            controllers: HashMap::new(),
        }
    }

    /// Feed a symbol's tick decision in; returns whether it should be
    /// suppressed from the bus rather than published.
    pub fn observe(&mut self, symbol: &str, decision: Decision) -> bool {
        self.controllers
            .entry(symbol.to_string())
            .or_insert_with(|| HaltController::new(self.resume_after_clean_ticks))
            .observe(decision)
    }

    pub fn is_suppressed(&self, symbol: &str) -> bool {
        self.controllers
            .get(symbol)
            .is_some_and(HaltController::is_suppressed)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use shared_types::HaltReason;

    #[test]
    fn tracks_halt_state_independently_per_symbol() {
        let mut registry = HaltRegistry::new(3);
        registry.observe("HOOD", Decision::Halt(HaltReason::OraclePaused));

        assert!(registry.is_suppressed("HOOD"));
        assert!(!registry.is_suppressed("NVDA"), "unrelated symbol should be untouched");

        registry.observe("NVDA", Decision::CardEligible);
        assert!(!registry.is_suppressed("NVDA"));
    }
}
