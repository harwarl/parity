use shared_types::{BasisTick, User, UserMode};

const DUST_FLOOR_USD: f64 = 15.0;

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum PolicyOutcome {
    Card { clip_usd: f64 },
    Drop(DropReason),
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DropReason {
    KillSwitch,
    WatcherMode,
    DailyCapReached,
    Dust,
}

/// Sizes (or drops) a card for one user against one already-`CardEligible`
/// tick. Subscription/mute filtering happens upstream in `SubscriberIndex`,
/// not here. `cards_opened_today` is supplied by the caller (the card
/// store owns that count) so this stays a pure, easily tested function.
pub fn evaluate(user: &User, tick: &BasisTick, cards_opened_today: u32) -> PolicyOutcome {
    if user.kill_switch {
        return PolicyOutcome::Drop(DropReason::KillSwitch);
    }
    if user.mode == UserMode::Watcher {
        return PolicyOutcome::Drop(DropReason::WatcherMode);
    }
    if cards_opened_today >= user.daily_card_cap {
        return PolicyOutcome::Drop(DropReason::DailyCapReached);
    }

    let clip_usd = user
        .max_clip_usd
        .min(user.nav_usd * user.name_pct)
        .min(tick.clip_max);

    if clip_usd < DUST_FLOOR_USD {
        PolicyOutcome::Drop(DropReason::Dust)
    } else {
        PolicyOutcome::Card { clip_usd }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use shared_types::{CheapSide, Decision, Session};
    use std::collections::HashSet;

    fn user() -> User {
        User {
            user_id: "alice".to_string(),
            mode: UserMode::Paper,
            nav_usd: 1_000.0,
            max_clip_usd: 100.0,
            name_pct: 0.1,
            daily_card_cap: 3,
            universe: HashSet::new(),
            mutes: HashSet::new(),
            kill_switch: false,
        }
    }

    fn tick(clip_max: f64) -> BasisTick {
        BasisTick {
            symbol: "HOOD".to_string(),
            share_mid: 50.0,
            token_per_share: 51.0,
            basis_bps: 200.0,
            net_bps: 150.0,
            cheap_side: CheapSide::Equity,
            session: Session::Rth,
            clip_max,
            decision: Decision::CardEligible,
            ts_ms: 1_000,
        }
    }

    #[test]
    fn clip_is_the_smallest_of_cap_nav_share_and_book_depth() {
        // max_clip 100, nav*pct = 1000*0.1 = 100, tick.clip_max = 50 -> 50 wins.
        let outcome = evaluate(&user(), &tick(50.0), 0);
        assert_eq!(outcome, PolicyOutcome::Card { clip_usd: 50.0 });
    }

    #[test]
    fn below_dust_floor_is_dropped_not_carded() {
        let outcome = evaluate(&user(), &tick(10.0), 0);
        assert_eq!(outcome, PolicyOutcome::Drop(DropReason::Dust));
    }

    #[test]
    fn kill_switch_overrides_everything() {
        let mut u = user();
        u.kill_switch = true;
        assert_eq!(evaluate(&u, &tick(100.0), 0), PolicyOutcome::Drop(DropReason::KillSwitch));
    }

    #[test]
    fn watcher_mode_never_gets_a_card() {
        let mut u = user();
        u.mode = UserMode::Watcher;
        assert_eq!(evaluate(&u, &tick(100.0), 0), PolicyOutcome::Drop(DropReason::WatcherMode));
    }

    #[test]
    fn daily_cap_reached_drops_further_cards() {
        let u = user();
        assert_eq!(
            evaluate(&u, &tick(100.0), u.daily_card_cap),
            PolicyOutcome::Drop(DropReason::DailyCapReached)
        );
    }
}
