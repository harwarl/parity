use std::sync::Arc;

use axum::extract::State;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::routing::post;
use axum::{Json, Router};
use serde::Deserialize;
use shared_types::{BasisTick, CheapSide};
use tokio::sync::Mutex;

use crate::execute::{ExecutionRejection, confirm_and_execute};
use crate::live_gate::LiveTradingGate;
use crate::mcp::{NotImplementedClient, OrderSide, PlaceResult};

/// Fixed to `NotImplementedClient` rather than generic over `TradingMcpClient`
/// — axum's `#[debug_handler]`/Handler-trait machinery doesn't play well
/// with a generic handler fn, and there's only one implementation to plug
/// in anyway right now. Swap this for the real client's concrete type once
/// it exists, or revisit genericizing it then.
///
/// `tokio::sync::Mutex`, not `std::sync::Mutex` — the guard needs to stay
/// held across the `.await`s inside `confirm_and_execute`, which a std
/// guard can't do (it isn't `Send`, so the handler future wouldn't be
/// either).
#[derive(Clone)]
pub struct ServerState {
    client: NotImplementedClient,
    live_gate: Arc<Mutex<LiveTradingGate>>,
}

impl ServerState {
    pub fn new(client: NotImplementedClient) -> Self {
        Self {
            client,
            live_gate: Arc::new(Mutex::new(LiveTradingGate::new())),
        }
    }
}

#[derive(Debug, Deserialize)]
struct ExecuteRequest {
    user_id: String,
    symbol: String,
    side: OrderSide,
    cheap_side: CheapSide,
    clip_usd: f64,
    /// The re-quote input — gauge-exec never trusts a price it didn't just
    /// receive fresh; see requote.rs.
    fresh_tick: BasisTick,
}

impl IntoResponse for ExecutionRejection {
    fn into_response(self) -> Response {
        let status = match &self {
            ExecutionRejection::OutsideRth => StatusCode::CONFLICT,
            ExecutionRejection::LiveDisabledForUser => StatusCode::FORBIDDEN,
            ExecutionRejection::Requote(_) => StatusCode::CONFLICT,
            ExecutionRejection::McpUnauthorized => StatusCode::BAD_GATEWAY,
            ExecutionRejection::McpRateLimited => StatusCode::SERVICE_UNAVAILABLE,
            ExecutionRejection::McpOther(_) => StatusCode::BAD_GATEWAY,
        };
        (status, Json(self)).into_response()
    }
}

#[axum::debug_handler]
async fn execute_handler(
    State(state): State<ServerState>,
    Json(req): Json<ExecuteRequest>,
) -> Result<Json<PlaceResult>, ExecutionRejection> {
    let mut live_gate = state.live_gate.lock().await;
    let result = confirm_and_execute(
        &state.client,
        &mut *live_gate,
        &req.user_id,
        &req.symbol,
        req.side,
        req.cheap_side,
        req.clip_usd,
        &req.fresh_tick,
    )
    .await?;
    Ok(Json(result))
}

/// The only route gauge-exec exposes — everything else about it (session
/// gate, live gate, re-quote, credentials) is invisible to callers on
/// purpose. gauge-api is meant to be the only caller.
pub fn router(state: ServerState) -> Router {
    Router::new()
        .route("/execute", post(execute_handler))
        .with_state(state)
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::Request;
    use http_body_util::BodyExt;
    use shared_types::{Decision, Session};
    use tower::ServiceExt;

    fn request_body(session: Session, net_bps: f64) -> serde_json::Value {
        serde_json::json!({
            "user_id": "alice",
            "symbol": "HOOD",
            "side": "Buy",
            "cheap_side": "Equity",
            "clip_usd": 40.0,
            "fresh_tick": BasisTick {
                symbol: "HOOD".to_string(),
                share_mid: 50.0,
                token_per_share: 50.6,
                basis_bps: 120.0,
                net_bps,
                cheap_side: CheapSide::Equity,
                session,
                clip_max: 100.0,
                decision: Decision::CardEligible,
                ts_ms: 5_000,
            },
        })
    }

    async fn post_execute(app: Router, body: serde_json::Value) -> axum::http::Response<Body> {
        app.oneshot(
            Request::builder()
                .method("POST")
                .uri("/execute")
                .header("content-type", "application/json")
                .body(Body::from(body.to_string()))
                .unwrap(),
        )
        .await
        .unwrap()
    }

    #[tokio::test]
    async fn a_request_outside_rth_never_reaches_mcp() {
        let app = router(ServerState::new(NotImplementedClient));
        let response = post_execute(app, request_body(Session::Overnight, 80.0)).await;
        assert_eq!(response.status(), StatusCode::CONFLICT);
        let body = response.into_body().collect().await.unwrap().to_bytes();
        let rejection: ExecutionRejection = serde_json::from_slice(&body).unwrap();
        assert_eq!(rejection, ExecutionRejection::OutsideRth);
    }

    #[tokio::test]
    async fn a_stale_requote_is_rejected_before_mcp() {
        let app = router(ServerState::new(NotImplementedClient));
        let response = post_execute(app, request_body(Session::Rth, -5.0)).await;
        assert_eq!(response.status(), StatusCode::CONFLICT);
    }

    #[tokio::test]
    async fn a_request_that_clears_every_gate_fails_honestly_at_the_unimplemented_mcp_step() {
        let app = router(ServerState::new(NotImplementedClient));
        let response = post_execute(app, request_body(Session::Rth, 80.0)).await;
        // Every gate passes; there's just no real MCP client to call yet.
        assert_eq!(response.status(), StatusCode::BAD_GATEWAY);
        let body = response.into_body().collect().await.unwrap().to_bytes();
        let rejection: ExecutionRejection = serde_json::from_slice(&body).unwrap();
        assert!(matches!(rejection, ExecutionRejection::McpOther(_)));
    }
}
