use shared_types::{BasisTick, Decision, GateRules, Session, SkipCode};

/// One user's verdict on one tick.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum GateOutcome {
    /// Every gate passed; `net_bps` is under this user's buffer.
    Pass { net_bps: f64 },
    Fail(SkipCode),
    /// The market plane halted the name. Never cards, whatever the rules.
    Halted,
}

/// The four gates, in order (feed → session → depth → net), under one
/// user's rules. Pure: `now_ms` is handed in. Used both when a card opens
/// (`runner`) and again on confirm, against the fresh quote (`routes::cards`)
/// — "confirm re-quotes and re-checks every gate".
///
/// The feed gate counts the tick's own age too, so a tick that was fresh
/// when measured but has sat in the tape cache fails a later re-quote.
pub fn check(tick: &BasisTick, rules: &GateRules, now_ms: u64) -> GateOutcome {
    if matches!(tick.decision, Decision::Halt(_)) {
        return GateOutcome::Halted;
    }
    let age_ms = tick.quote_age_ms + now_ms.saturating_sub(tick.ts_ms);
    if tick.decision == Decision::Skip(SkipCode::Stale) || age_ms > rules.max_quote_age_ms {
        return GateOutcome::Fail(SkipCode::Stale);
    }
    if tick.session != Session::Rth {
        return GateOutcome::Fail(SkipCode::Closed);
    }
    // The market's THIN means the book can't take even the smallest clip;
    // the user's min depth can only add to that.
    if tick.decision == Decision::Skip(SkipCode::Thin) || tick.depth_usd < rules.min_depth_usd {
        return GateOutcome::Fail(SkipCode::Thin);
    }
    let net_bps = tick.net_with_buffer(rules.buffer_bps);
    if net_bps <= 0.0 || net_bps < rules.floor_bps {
        return GateOutcome::Fail(SkipCode::Dust);
    }
    GateOutcome::Pass { net_bps }
}

#[cfg(test)]
mod tests {
    use super::*;
    use shared_types::{CheapSide, HaltReason};

    const NOW: u64 = 10_000;

    /// design.md's NVDA sample: 17.0 gross, fees 3.5, slip 2.1, depth $420k.
    fn nvda() -> BasisTick {
        BasisTick {
            symbol: "NVDA".into(),
            share_mid: 182.40,
            token_per_share: 182.71,
            basis_bps: 17.0,
            net_bps: 9.4,
            cheap_side: CheapSide::Equity,
            session: Session::Rth,
            clip_max: 100.0,
            decision: Decision::CardEligible,
            ts_ms: NOW,
            fee_bps: 3.5,
            slip_bps: 2.1,
            buffer_bps: 2.0,
            depth_usd: 420_000.0,
            quote_age_ms: 300,
        }
    }

    #[test]
    fn nvda_passes_the_default_rules_at_net_9_4() {
        match check(&nvda(), &GateRules::default(), NOW) {
            GateOutcome::Pass { net_bps } => assert!((net_bps - 9.4).abs() < 1e-9),
            other => panic!("{other:?}"),
        }
    }

    #[test]
    fn the_users_buffer_and_floor_decide_dust_not_the_markets() {
        let tick = nvda();
        let strict = GateRules { buffer_bps: 8.0, ..GateRules::default() }; // net 3.4
        assert!(matches!(check(&tick, &strict, NOW), GateOutcome::Pass { .. }));
        let stricter = GateRules { floor_bps: 4.0, ..strict };
        assert_eq!(check(&tick, &stricter, NOW), GateOutcome::Fail(SkipCode::Dust));
    }

    /// A user can also be looser than the tape: the market's DUST at its
    /// own floor doesn't stop a user whose floor is lower.
    #[test]
    fn a_lower_user_floor_can_card_what_the_tape_calls_dust() {
        let mut tick = nvda();
        tick.basis_bps = 8.8; // META: 8.8 − 3.5 − 2.1 − 2.0 = 1.2
        tick.decision = Decision::Skip(SkipCode::Dust);
        assert_eq!(check(&tick, &GateRules::default(), NOW), GateOutcome::Fail(SkipCode::Dust));
        let loose = GateRules { floor_bps: 1.0, ..GateRules::default() };
        assert!(matches!(check(&tick, &loose, NOW), GateOutcome::Pass { .. }));
    }

    #[test]
    fn gates_run_in_order_feed_session_depth_net() {
        let mut tick = nvda();
        tick.quote_age_ms = 3_800; // COIN
        tick.session = Session::Ext;
        tick.depth_usd = 45_000.0;
        tick.basis_bps = 1.0;
        let rules = GateRules::default();
        assert_eq!(check(&tick, &rules, NOW), GateOutcome::Fail(SkipCode::Stale));
        tick.quote_age_ms = 300;
        assert_eq!(check(&tick, &rules, NOW), GateOutcome::Fail(SkipCode::Closed));
        tick.session = Session::Rth;
        assert_eq!(check(&tick, &rules, NOW), GateOutcome::Fail(SkipCode::Thin));
        tick.depth_usd = 420_000.0;
        assert_eq!(check(&tick, &rules, NOW), GateOutcome::Fail(SkipCode::Dust));
    }

    /// A tick that was fresh when measured goes stale sitting in the cache.
    #[test]
    fn a_tick_ages_while_it_waits() {
        let rules = GateRules::default();
        assert!(matches!(check(&nvda(), &rules, NOW + 1_700), GateOutcome::Pass { .. }));
        assert_eq!(check(&nvda(), &rules, NOW + 1_701), GateOutcome::Fail(SkipCode::Stale));
    }

    #[test]
    fn a_halt_never_passes() {
        let mut tick = nvda();
        tick.decision = Decision::Halt(HaltReason::OraclePaused);
        let loose = GateRules { floor_bps: 0.0, min_depth_usd: 0.0, ..GateRules::default() };
        assert_eq!(check(&tick, &loose, NOW), GateOutcome::Halted);
    }
}
