use shared_types::{BasisTick, CheapSide, Decision};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum RequoteRejection {
    /// The fresh tick isn't CardEligible any more (Skip or Halt).
    NoLongerEligible,
    /// The cheap side flipped since the card was opened — a different trade
    /// than the one the user was shown.
    SideFlipped,
    /// Net edge has collapsed since the card was opened.
    NetBpsCollapsed,
}

/// "Confirm always re-quotes" (spec 5.3) — gauge-exec never trusts the price
/// a card was opened with. Call this with a *fresh* BasisTick (re-run
/// through gauge-engine at confirm time, not the one on the card) before
/// calling `review_equity_order`.
pub fn requote(card_cheap_side: CheapSide, fresh_tick: &BasisTick) -> Result<(), RequoteRejection> {
    if fresh_tick.decision != Decision::CardEligible {
        return Err(RequoteRejection::NoLongerEligible);
    }
    if fresh_tick.cheap_side != card_cheap_side {
        return Err(RequoteRejection::SideFlipped);
    }
    if fresh_tick.net_bps <= 0.0 {
        return Err(RequoteRejection::NetBpsCollapsed);
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use shared_types::Session;

    fn tick(decision: Decision, cheap_side: CheapSide, net_bps: f64) -> BasisTick {
        BasisTick {
            symbol: "HOOD".to_string(),
            share_mid: 50.0,
            token_per_share: 50.6,
            basis_bps: 120.0,
            net_bps,
            cheap_side,
            session: Session::Rth,
            clip_max: 100.0,
            decision,
            ts_ms: 5_000,
        }
    }

    #[test]
    fn still_eligible_matching_side_and_positive_edge_passes() {
        let fresh = tick(Decision::CardEligible, CheapSide::Equity, 80.0);
        assert_eq!(requote(CheapSide::Equity, &fresh), Ok(()));
    }

    #[test]
    fn rejects_when_no_longer_card_eligible() {
        let fresh = tick(Decision::CardEligible, CheapSide::Equity, 80.0);
        let mut halted = fresh.clone();
        halted.decision = shared_types::Decision::Halt(shared_types::HaltReason::FeedStale);
        assert_eq!(requote(CheapSide::Equity, &halted), Err(RequoteRejection::NoLongerEligible));
    }

    #[test]
    fn rejects_when_the_cheap_side_flipped() {
        let fresh = tick(Decision::CardEligible, CheapSide::Token, 80.0);
        assert_eq!(requote(CheapSide::Equity, &fresh), Err(RequoteRejection::SideFlipped));
    }

    #[test]
    fn rejects_when_edge_has_collapsed() {
        let fresh = tick(Decision::CardEligible, CheapSide::Equity, -5.0);
        assert_eq!(requote(CheapSide::Equity, &fresh), Err(RequoteRejection::NetBpsCollapsed));
    }
}
