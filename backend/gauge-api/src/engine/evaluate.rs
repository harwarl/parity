use shared_types::{
    BasisTick, ChainlinkQuote, CheapSide, DepthSnapshot, Decision, HaircutParams, HaltReason,
    RhjQuote, Session, SkipCode,
};

/// Beyond this, RHJ and Chainlink have stopped agreeing closely enough to
/// trust — no card, but still on the tape. Spec 5.1's "8-15s" window.
const STALE_AGREEMENT_MS: u64 = 15_000;

/// Beyond this, the feed isn't just stale, it's dead — suppress from the bus.
const DEAD_FEED_MS: u64 = 60_000;

/// Multiplier moves smaller than this aren't worth checking for a matching
/// price move (float/reporting noise).
const MULTIPLIER_JUMP_FLOOR: f64 = 0.001;

/// How far the actual price move is allowed to deviate from the move a real
/// corporate action would produce before we call it unexplained.
const MULTIPLIER_JUMP_TOLERANCE: f64 = 0.01;

/// Steps 1-3 of spec 5.1: share mid, the multiplier divided back out exactly
/// once (chain side only), and the raw gap between them.
fn measure(rhj: &RhjQuote, chainlink: &ChainlinkQuote) -> (f64, f64, f64) {
    let share_mid = (rhj.bid + rhj.ask) / 2.0;
    let token_per_share = chainlink.token_price / (chainlink.ui_multiplier / 1e18);
    let basis_bps = (token_per_share - share_mid) / share_mid * 10_000.0;
    (share_mid, token_per_share, basis_bps)
}

fn cheap_side(share_mid: f64, token_per_share: f64) -> CheapSide {
    if (token_per_share - share_mid).abs() < f64::EPSILON {
        CheapSide::Neither
    } else if token_per_share < share_mid {
        CheapSide::Token
    } else {
        CheapSide::Equity
    }
}

/// Step function over the $20/$50/$100 slip curve — good enough until a real
/// interpolation shape is needed.
fn slip_bps_for_clip(haircut: &HaircutParams, clip_usd: f64) -> f64 {
    if clip_usd <= 20.0 {
        haircut.slip_bps_at_20
    } else if clip_usd <= 50.0 {
        haircut.slip_bps_at_50
    } else {
        haircut.slip_bps_at_100
    }
}

/// Largest of the $20/$50/$100 buckets the book can actually absorb.
fn clip_max(depth: &DepthSnapshot) -> f64 {
    if depth.at_100 >= 100.0 {
        100.0
    } else if depth.at_50 >= 50.0 {
        50.0
    } else if depth.at_20 >= 20.0 {
        20.0
    } else {
        0.0
    }
}

/// A real corporate action moves the raw token price in inverse proportion to
/// the multiplier, so `token_per_share` stays continuous. A multiplier move
/// with no matching price move is a bad oracle tick, not a split/dividend —
/// this is the check that tells the two apart.
fn is_unexplained_multiplier_jump(prev: &ChainlinkQuote, current: &ChainlinkQuote) -> bool {
    let multiplier_ratio = current.ui_multiplier / prev.ui_multiplier;
    if (multiplier_ratio - 1.0).abs() < MULTIPLIER_JUMP_FLOOR {
        return false;
    }
    // token_per_share = token_price / multiplier, so a real corporate action
    // moves token_price by the same ratio as the multiplier to hold it
    // continuous. If the price didn't track the multiplier, it's a bad tick.
    let price_ratio = current.token_price / prev.token_price;
    (price_ratio / multiplier_ratio - 1.0).abs() > MULTIPLIER_JUMP_TOLERANCE
}

/// The whole of the engine's public surface: given one tick's raw inputs
/// (plus the previous Chainlink quote, needed only to classify a multiplier
/// move as a real corporate action vs a bad tick), returns the measured
/// `BasisTick` and its market-default `Decision`. Pure — no clock, no
/// retries, no state kept between calls; `prev_chainlink` is handed in by
/// the caller, not fetched.
///
/// Halts first (they suppress the tick entirely), then the four gates in
/// the order the product documents them: feed → session → depth → net.
/// The first gate to fail is the code. Session means regular hours only:
/// the cash leg can't be placed live outside RTH, so no card is emitted
/// that couldn't be acted on.
pub fn evaluate(
    rhj: &RhjQuote,
    chainlink: &ChainlinkQuote,
    prev_chainlink: Option<&ChainlinkQuote>,
    depth: &DepthSnapshot,
    session: Session,
    haircut: &HaircutParams,
    clip_usd: f64,
    ts_ms: u64,
) -> BasisTick {
    let (share_mid, token_per_share, basis_bps) = measure(rhj, chainlink);
    let side = cheap_side(share_mid, token_per_share);
    let max_clip = clip_max(depth);
    let slip_bps = slip_bps_for_clip(haircut, clip_usd);
    let net_bps = basis_bps.abs() - haircut.fee_bps - slip_bps - haircut.buffer_bps;
    let leg_skew_ms = rhj.updated_at_ms.abs_diff(chainlink.updated_at_ms);
    let quote_age_ms = ts_ms.saturating_sub(rhj.updated_at_ms.min(chainlink.updated_at_ms));

    let decision = if chainlink.oracle_paused {
        Decision::Halt(HaltReason::OraclePaused)
    } else if depth.at_20 == 0.0 && depth.at_50 == 0.0 && depth.at_100 == 0.0 {
        Decision::Halt(HaltReason::ZeroDepth)
    } else if prev_chainlink.is_some_and(|prev| is_unexplained_multiplier_jump(prev, chainlink))
    {
        Decision::Halt(HaltReason::MultiplierJump)
    } else if leg_skew_ms > DEAD_FEED_MS {
        Decision::Halt(HaltReason::FeedStale)
    } else if leg_skew_ms > STALE_AGREEMENT_MS {
        Decision::Skip(SkipCode::Stale)
    } else if session != Session::Rth {
        Decision::Skip(SkipCode::Closed)
    } else if max_clip < clip_usd {
        Decision::Skip(SkipCode::Thin)
    } else if net_bps <= 0.0 || net_bps < haircut.floor_bps {
        Decision::Skip(SkipCode::Dust)
    } else {
        Decision::CardEligible
    };

    BasisTick {
        symbol: rhj.symbol.clone(),
        share_mid,
        token_per_share,
        basis_bps,
        net_bps,
        cheap_side: side,
        session,
        clip_max: max_clip,
        decision,
        ts_ms,
        fee_bps: haircut.fee_bps,
        slip_bps,
        buffer_bps: haircut.buffer_bps,
        depth_usd: depth.top_of_book_usd,
        quote_age_ms,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn rhj(bid: f64, ask: f64) -> RhjQuote {
        RhjQuote {
            symbol: "HOOD".into(),
            bid,
            ask,
            updated_at_ms: 1_000,
        }
    }

    fn chainlink(token_price: f64, ui_multiplier: f64) -> ChainlinkQuote {
        ChainlinkQuote {
            symbol: "HOOD".into(),
            token_price,
            ui_multiplier,
            oracle_paused: false,
            updated_at_ms: 1_000,
        }
    }

    fn depth() -> DepthSnapshot {
        DepthSnapshot {
            at_20: 500.0,
            at_50: 500.0,
            at_100: 500.0,
            updated_at_ms: 1_000,
            top_of_book_usd: 250_000.0,
        }
    }

    fn haircut() -> HaircutParams {
        HaircutParams {
            fee_bps: 2.0,
            buffer_bps: 1.0,
            slip_bps_at_20: 1.0,
            slip_bps_at_50: 2.0,
            slip_bps_at_100: 4.0,
            floor_bps: 2.0,
        }
    }

    /// Flat 1.0x multiplier, agreeing prices — basis should be ~zero.
    #[test]
    fn baseline_1x_multiplier_is_near_zero_basis() {
        let rhj = rhj(50.0, 50.0);
        let chainlink = chainlink(50.0, 1e18);
        let tick = evaluate(&rhj, &chainlink, None, &depth(), Session::Rth, &haircut(), 50.0, 1_000);
        assert!(tick.basis_bps.abs() < 1.0, "basis_bps = {}", tick.basis_bps);
    }

    /// A ~1.008x dividend multiplier, price co-moving to match, must not be
    /// mistaken for an unexplained jump.
    #[test]
    fn dividend_multiplier_nudge_does_not_halt() {
        let prev = chainlink(50.0, 1e18);
        let rhj = rhj(50.0, 50.0);
        // token_price moves in inverse proportion to the multiplier so
        // token_per_share (and thus basis) stays continuous.
        let current = chainlink(50.0 * 1.008, 1.008 * 1e18);
        let tick = evaluate(&rhj, &current, Some(&prev), &depth(), Session::Rth, &haircut(), 50.0, 1_000);
        assert_ne!(tick.decision, Decision::Halt(HaltReason::MultiplierJump));
        assert!(tick.basis_bps.abs() < 1.0, "basis_bps = {}", tick.basis_bps);
    }

    /// A real 10:1 split: multiplier jumps 10x, but so does the raw token
    /// price in the opposite direction — token_per_share must stay
    /// continuous, not look like a 10x arb.
    #[test]
    fn ten_to_one_split_keeps_token_per_share_continuous() {
        let prev = chainlink(50.0, 1e18);
        let rhj = rhj(50.0, 50.0);
        // A real split scales token_price by the same 10x as the multiplier,
        // so token_per_share (500 / 10) lands back on 50 — continuous.
        let current = chainlink(500.0, 10.0 * 1e18);
        let tick = evaluate(&rhj, &current, Some(&prev), &depth(), Session::Rth, &haircut(), 50.0, 1_000);
        assert_ne!(tick.decision, Decision::Halt(HaltReason::MultiplierJump));
        assert!(
            (tick.token_per_share - 50.0).abs() < 1e-9,
            "token_per_share = {}",
            tick.token_per_share
        );
        assert!(tick.basis_bps.abs() < 1.0, "basis_bps = {}", tick.basis_bps);
    }

    /// Multiplier jumps 10x with no corresponding token-price move — that's
    /// a bad oracle tick, not a split, and must halt rather than card.
    #[test]
    fn unexplained_multiplier_jump_halts() {
        let prev = chainlink(50.0, 1e18);
        let rhj = rhj(50.0, 50.0);
        let current = chainlink(50.0, 10.0 * 1e18);
        let tick = evaluate(&rhj, &current, Some(&prev), &depth(), Session::Rth, &haircut(), 50.0, 1_000);
        assert_eq!(tick.decision, Decision::Halt(HaltReason::MultiplierJump));
    }

    /// A 60 bp gap in regular hours clears the default haircut and floor.
    fn wide(session: Session) -> BasisTick {
        let rhj = rhj(50.0, 50.0);
        let chainlink = chainlink(50.3, 1e18);
        evaluate(&rhj, &chainlink, None, &depth(), session, &haircut(), 50.0, 1_500)
    }

    #[test]
    fn a_wide_gap_in_rth_is_card_eligible_with_costs_broken_out() {
        let tick = wide(Session::Rth);
        assert_eq!(tick.decision, Decision::CardEligible);
        assert_eq!(tick.fee_bps, 2.0);
        assert_eq!(tick.slip_bps, 2.0); // the $50 bucket
        assert_eq!(tick.buffer_bps, 1.0);
        assert_eq!(tick.depth_usd, 250_000.0);
        assert_eq!(tick.quote_age_ms, 500);
        assert!((tick.net_bps - (tick.basis_bps.abs() - 5.0)).abs() < 1e-9);
    }

    /// Session means regular hours only, not just "not the weekend".
    #[test]
    fn any_session_outside_rth_is_closed() {
        for session in [Session::Ext, Session::Overnight, Session::Weekend] {
            assert_eq!(wide(session).decision, Decision::Skip(SkipCode::Closed), "{session:?}");
        }
    }

    /// Gates run feed → session → depth → net: an old price outside RTH
    /// reports STALE, not CLOSED.
    #[test]
    fn the_feed_gate_runs_before_the_session_gate() {
        let rhj = rhj(50.0, 50.0);
        let mut chainlink = chainlink(50.3, 1e18);
        chainlink.updated_at_ms = 1_000 + STALE_AGREEMENT_MS + 1;
        let tick = evaluate(&rhj, &chainlink, None, &depth(), Session::Ext, &haircut(), 50.0, chainlink.updated_at_ms);
        assert_eq!(tick.decision, Decision::Skip(SkipCode::Stale));
    }

    /// Positive but under the floor is still DUST.
    #[test]
    fn a_net_under_the_floor_is_dust() {
        let rhj = rhj(50.0, 50.0);
        // 6 bp gross − 5 bp costs = 1 bp net, under the 2 bp floor.
        let chainlink = chainlink(50.03, 1e18);
        let tick = evaluate(&rhj, &chainlink, None, &depth(), Session::Rth, &haircut(), 50.0, 1_000);
        assert!(tick.net_bps > 0.0 && tick.net_bps < 2.0, "net = {}", tick.net_bps);
        assert_eq!(tick.decision, Decision::Skip(SkipCode::Dust));
    }
}
