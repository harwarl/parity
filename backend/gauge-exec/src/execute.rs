use shared_types::{BasisTick, CheapSide};

use crate::live_gate::LiveTradingGate;
use crate::mcp::{McpError, OrderSide, PlaceResult, TradingMcpClient};
use crate::requote::{requote, RequoteRejection};
use crate::session_gate::allows_live_execution;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ExecutionRejection {
    OutsideRth,
    LiveDisabledForUser,
    Requote(RequoteRejection),
    McpUnauthorized,
    McpRateLimited,
    McpOther(String),
}

/// The confirm-time path: rth gate, then the per-user/global live gate,
/// then a mandatory re-quote against `fresh_tick` (never the card-open
/// price), and only then the two MCP calls. `side` is supplied by the
/// caller rather than derived from `card_cheap_side` here — which leg a
/// v1 "Do it" actually buys/sells is a trading-strategy decision this
/// scaffolding doesn't make on its own.
pub async fn confirm_and_execute<C: TradingMcpClient>(
    client: &C,
    live_gate: &mut LiveTradingGate,
    user_id: &str,
    symbol: &str,
    side: OrderSide,
    card_cheap_side: CheapSide,
    clip_usd: f64,
    fresh_tick: &BasisTick,
) -> Result<PlaceResult, ExecutionRejection> {
    if !allows_live_execution(fresh_tick.session) {
        return Err(ExecutionRejection::OutsideRth);
    }
    if !live_gate.allows_live(user_id) {
        return Err(ExecutionRejection::LiveDisabledForUser);
    }
    requote(card_cheap_side, fresh_tick).map_err(ExecutionRejection::Requote)?;

    let review = client
        .review_equity_order(user_id, symbol, side, clip_usd)
        .await
        .map_err(|e| record_and_map(live_gate, user_id, e))?;

    client
        .place_equity_order(&review.review_id)
        .await
        .map_err(|e| record_and_map(live_gate, user_id, e))
}

fn record_and_map(live_gate: &mut LiveTradingGate, user_id: &str, error: McpError) -> ExecutionRejection {
    match error {
        McpError::Unauthorized => {
            live_gate.record_unauthorized(user_id);
            ExecutionRejection::McpUnauthorized
        }
        McpError::RateLimited => {
            live_gate.record_rate_limited();
            ExecutionRejection::McpRateLimited
        }
        McpError::Other(msg) => ExecutionRejection::McpOther(msg),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use shared_types::{Decision, Session};
    use std::sync::Mutex;

    struct FakeClient {
        review_result: Result<ReviewResultStub, McpError>,
        place_result: Result<PlaceResult, McpError>,
        review_calls: Mutex<u32>,
    }

    struct ReviewResultStub(String);

    impl TradingMcpClient for FakeClient {
        async fn review_equity_order(
            &self,
            _user_id: &str,
            _symbol: &str,
            _side: OrderSide,
            _clip_usd: f64,
        ) -> Result<crate::mcp::ReviewResult, McpError> {
            *self.review_calls.lock().unwrap() += 1;
            self.review_result
                .as_ref()
                .map(|r| crate::mcp::ReviewResult { review_id: r.0.clone() })
                .map_err(Clone::clone)
        }

        async fn place_equity_order(&self, _review_id: &str) -> Result<PlaceResult, McpError> {
            self.place_result.clone()
        }
    }

    fn tick(session: Session, decision: Decision, cheap_side: CheapSide, net_bps: f64) -> BasisTick {
        BasisTick {
            symbol: "HOOD".to_string(),
            share_mid: 50.0,
            token_per_share: 50.6,
            basis_bps: 120.0,
            net_bps,
            cheap_side,
            session,
            clip_max: 100.0,
            decision,
            ts_ms: 5_000,
        }
    }

    fn eligible_tick() -> BasisTick {
        tick(Session::Rth, Decision::CardEligible, CheapSide::Equity, 80.0)
    }

    #[tokio::test]
    async fn happy_path_places_the_order() {
        let client = FakeClient {
            review_result: Ok(ReviewResultStub("rev1".to_string())),
            place_result: Ok(PlaceResult { broker_order_id: "order1".to_string() }),
            review_calls: Mutex::new(0),
        };
        let mut live_gate = LiveTradingGate::new();

        let result = confirm_and_execute(
            &client,
            &mut live_gate,
            "alice",
            "HOOD",
            OrderSide::Buy,
            CheapSide::Equity,
            40.0,
            &eligible_tick(),
        )
        .await;

        assert_eq!(result, Ok(PlaceResult { broker_order_id: "order1".to_string() }));
    }

    #[tokio::test]
    async fn refuses_outside_rth_without_calling_mcp() {
        let client = FakeClient {
            review_result: Ok(ReviewResultStub("rev1".to_string())),
            place_result: Ok(PlaceResult { broker_order_id: "order1".to_string() }),
            review_calls: Mutex::new(0),
        };
        let mut live_gate = LiveTradingGate::new();
        let overnight = tick(Session::Overnight, Decision::CardEligible, CheapSide::Equity, 80.0);

        let result = confirm_and_execute(
            &client, &mut live_gate, "alice", "HOOD", OrderSide::Buy, CheapSide::Equity, 40.0, &overnight,
        )
        .await;

        assert_eq!(result, Err(ExecutionRejection::OutsideRth));
        assert_eq!(*client.review_calls.lock().unwrap(), 0);
    }

    #[tokio::test]
    async fn stale_requote_blocks_execution() {
        let client = FakeClient {
            review_result: Ok(ReviewResultStub("rev1".to_string())),
            place_result: Ok(PlaceResult { broker_order_id: "order1".to_string() }),
            review_calls: Mutex::new(0),
        };
        let mut live_gate = LiveTradingGate::new();
        let collapsed = tick(Session::Rth, Decision::CardEligible, CheapSide::Equity, -10.0);

        let result = confirm_and_execute(
            &client, &mut live_gate, "alice", "HOOD", OrderSide::Buy, CheapSide::Equity, 40.0, &collapsed,
        )
        .await;

        assert_eq!(
            result,
            Err(ExecutionRejection::Requote(RequoteRejection::NetBpsCollapsed))
        );
        assert_eq!(*client.review_calls.lock().unwrap(), 0);
    }

    #[tokio::test]
    async fn a_401_on_review_disables_live_for_that_user_going_forward() {
        let client = FakeClient {
            review_result: Err(McpError::Unauthorized),
            place_result: Ok(PlaceResult { broker_order_id: "unused".to_string() }),
            review_calls: Mutex::new(0),
        };
        let mut live_gate = LiveTradingGate::new();

        let result = confirm_and_execute(
            &client, &mut live_gate, "alice", "HOOD", OrderSide::Buy, CheapSide::Equity, 40.0, &eligible_tick(),
        )
        .await;

        assert_eq!(result, Err(ExecutionRejection::McpUnauthorized));
        assert!(!live_gate.allows_live("alice"));
    }

    #[tokio::test]
    async fn a_429_on_place_pauses_live_globally() {
        let client = FakeClient {
            review_result: Ok(ReviewResultStub("rev1".to_string())),
            place_result: Err(McpError::RateLimited),
            review_calls: Mutex::new(0),
        };
        let mut live_gate = LiveTradingGate::new();

        let result = confirm_and_execute(
            &client, &mut live_gate, "alice", "HOOD", OrderSide::Buy, CheapSide::Equity, 40.0, &eligible_tick(),
        )
        .await;

        assert_eq!(result, Err(ExecutionRejection::McpRateLimited));
        assert!(live_gate.is_globally_paused());
    }
}
