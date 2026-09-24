use shared_types::{Decision, HaltReason};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum HaltState {
    Live,
    Halted { reason: HaltReason, clean_ticks: u32 },
}

/// Per-symbol halt/resume state machine. `gauge-engine::evaluate()` decides
/// per tick whether *this* tick looks halt-worthy; this turns a run of those
/// decisions into the actual gate — halt immediately, but only resume after
/// `resume_after_clean_ticks` consecutive non-halt ticks (or a manual clear),
/// so the bus doesn't flap on a single good tick right after a bad one.
pub struct HaltController {
    resume_after_clean_ticks: u32,
    state: HaltState,
}

impl HaltController {
    pub fn new(resume_after_clean_ticks: u32) -> Self {
        Self {
            resume_after_clean_ticks,
            state: HaltState::Live,
        }
    }

    pub fn state(&self) -> HaltState {
        self.state
    }

    pub fn is_suppressed(&self) -> bool {
        matches!(self.state, HaltState::Halted { .. })
    }

    /// Feed this tick's engine `Decision` in. Returns whether the tick should
    /// be suppressed from the bus.
    pub fn observe(&mut self, decision: Decision) -> bool {
        if let Decision::Halt(reason) = decision {
            self.state = HaltState::Halted {
                reason,
                clean_ticks: 0,
            };
            return true;
        }
        match &mut self.state {
            HaltState::Live => false,
            HaltState::Halted { clean_ticks, .. } => {
                *clean_ticks += 1;
                if *clean_ticks >= self.resume_after_clean_ticks {
                    self.state = HaltState::Live;
                    false
                } else {
                    true
                }
            }
        }
    }

    /// Operator override — clears a halt without waiting for clean ticks.
    pub fn resume_manually(&mut self) {
        self.state = HaltState::Live;
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use shared_types::SkipCode;

    #[test]
    fn halts_immediately_on_a_halt_decision() {
        let mut controller = HaltController::new(3);
        let suppressed = controller.observe(Decision::Halt(HaltReason::OraclePaused));
        assert!(suppressed);
        assert!(controller.is_suppressed());
    }

    #[test]
    fn skip_and_eligible_ticks_do_not_halt_a_live_controller() {
        let mut controller = HaltController::new(3);
        assert!(!controller.observe(Decision::CardEligible));
        assert!(!controller.observe(Decision::Skip(SkipCode::Thin)));
        assert!(!controller.is_suppressed());
    }

    #[test]
    fn stays_suppressed_until_enough_clean_ticks() {
        let mut controller = HaltController::new(3);
        controller.observe(Decision::Halt(HaltReason::MultiplierJump));

        assert!(controller.observe(Decision::CardEligible));
        assert!(controller.observe(Decision::CardEligible));
        assert!(controller.is_suppressed());

        assert!(!controller.observe(Decision::CardEligible));
        assert!(!controller.is_suppressed());
    }

    #[test]
    fn another_halt_during_recovery_resets_the_clean_tick_count() {
        let mut controller = HaltController::new(2);
        controller.observe(Decision::Halt(HaltReason::FeedStale));
        controller.observe(Decision::CardEligible);
        controller.observe(Decision::Halt(HaltReason::ZeroDepth));

        assert!(controller.observe(Decision::CardEligible));
        assert!(controller.is_suppressed(), "should need 2 fresh clean ticks after the second halt");
    }

    #[test]
    fn manual_resume_clears_a_halt_immediately() {
        let mut controller = HaltController::new(10);
        controller.observe(Decision::Halt(HaltReason::OraclePaused));
        controller.resume_manually();
        assert!(!controller.is_suppressed());
        assert_eq!(controller.state(), HaltState::Live);
    }
}
