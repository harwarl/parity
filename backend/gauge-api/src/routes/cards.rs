use axum::Json;
use axum::extract::{Path, Query, State};
use axum::http::StatusCode;
use axum::response::sse::{Event, KeepAlive, Sse};
use futures_util::StreamExt;
use futures_util::stream::Stream;
use gauge_carder::card_store::ConfirmOutcome;
use serde::{Deserialize, Serialize};
use shared_types::{Card, UserMode};
use tokio_stream::wrappers::BroadcastStream;

use crate::state::{AppState, CardEventKind, now_ms};

#[derive(Deserialize)]
pub struct CardsQuery {
    pub user_id: String,
}

pub async fn list_cards(State(state): State<AppState>, Query(query): Query<CardsQuery>) -> Json<Vec<Card>> {
    let store = state.store.lock().unwrap();
    Json(
        store
            .card_store
            .cards_for_user(&query.user_id)
            .into_iter()
            .cloned()
            .collect(),
    )
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
#[serde(tag = "status", rename_all = "snake_case")]
pub enum ConfirmResponse {
    /// `filled_at_price` is only set for paper fills recorded against the
    /// confirm-tick mid; `None` for a live confirm (gauge-exec owns that
    /// price) or when the tape had nothing cached for the symbol yet.
    Confirmed { filled_at_price: Option<f64> },
    StaleOnConfirm,
    LiveHandoffFailed { reason: String },
    AlreadyResolvedOrMissing,
}

/// "Confirm always re-quotes" is gauge-exec's job, not this handler's — this
/// only resolves the card's own lifecycle and, for a live user, hands off to
/// gauge-exec. gauge-api never sees or holds MCP credentials.
pub async fn confirm_card(
    State(state): State<AppState>,
    Path(card_id): Path<String>,
) -> (StatusCode, Json<ConfirmResponse>) {
    let now = now_ms();

    let (outcome, card, user_mode) = {
        let mut store = state.store.lock().unwrap();
        let outcome = store.card_store.confirm(&card_id, now);
        let card = store.card_store.get(&card_id).cloned();
        let user_mode = card
            .as_ref()
            .and_then(|c| store.users.get(&c.user_id))
            .map(|u| u.mode);
        (outcome, card, user_mode)
    };

    match outcome {
        None => (
            StatusCode::CONFLICT,
            Json(ConfirmResponse::AlreadyResolvedOrMissing),
        ),
        Some(ConfirmOutcome::StaleOnConfirm) => {
            let card = card.expect("stale-on-confirm outcome, card must exist");
            state.publish_card_event(&card_id, &card.user_id, CardEventKind::StaleOnConfirm);
            (StatusCode::CONFLICT, Json(ConfirmResponse::StaleOnConfirm))
        }
        Some(ConfirmOutcome::Confirmed) => {
            let card = card.expect("confirm succeeded, card must exist");
            // Local lifecycle state is Confirmed either way — a failed live
            // handoff is an execution problem, not an unconfirm.
            state.publish_card_event(&card_id, &card.user_id, CardEventKind::Confirmed);
            if user_mode == Some(UserMode::Live) {
                let fresh_tick = state.store.lock().unwrap().tape.get(&card.symbol).cloned();
                match hand_off_to_exec(&state, &card, fresh_tick).await {
                    Ok(()) => (
                        StatusCode::OK,
                        Json(ConfirmResponse::Confirmed { filled_at_price: None }),
                    ),
                    Err(reason) => (
                        StatusCode::BAD_GATEWAY,
                        Json(ConfirmResponse::LiveHandoffFailed { reason }),
                    ),
                }
            } else {
                let filled_at_price = {
                    let mut store = state.store.lock().unwrap();
                    let confirm_tick = store.tape.get(&card.symbol).cloned();
                    confirm_tick
                        .map(|tick| store.paper_ledger.record_fill(&card, &tick, now).fill_price)
                };
                (
                    StatusCode::OK,
                    Json(ConfirmResponse::Confirmed { filled_at_price }),
                )
            }
        }
    }
}

/// Calls gauge-exec's POST /execute. `side` is hardcoded to `"Buy"` — v1
/// only ever executes the equity leg live (README: "Token is research, not
/// a buy button"), but which leg a card's "Do it" should actually place is
/// a trading-strategy decision this hasn't resolved (see gauge-exec's
/// execute.rs), so treat this as a placeholder, not a settled answer.
/// `side`/`cheap_side` are sent as plain JSON strings rather than importing
/// gauge-exec's `OrderSide` type — gauge-api deliberately doesn't depend on
/// gauge-exec's crate, only its wire contract.
async fn hand_off_to_exec(
    state: &AppState,
    card: &Card,
    fresh_tick: Option<shared_types::BasisTick>,
) -> Result<(), String> {
    let fresh_tick = fresh_tick.ok_or_else(|| "no cached tape tick to re-quote against".to_string())?;
    state
        .http
        .post(format!("{}/execute", state.exec_url))
        .json(&serde_json::json!({
            "user_id": card.user_id,
            "symbol": card.symbol,
            "side": "Buy",
            "cheap_side": card.cheap_side,
            "clip_usd": card.clip_usd,
            "fresh_tick": fresh_tick,
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?;
    Ok(())
}

pub async fn skip_card(State(state): State<AppState>, Path(card_id): Path<String>) -> StatusCode {
    let (rejected, user_id) = {
        let mut store = state.store.lock().unwrap();
        let rejected = store.card_store.reject(&card_id);
        let user_id = store.card_store.get(&card_id).map(|c| c.user_id.clone());
        (rejected, user_id)
    };
    if rejected {
        if let Some(user_id) = user_id {
            state.publish_card_event(&card_id, &user_id, CardEventKind::Rejected);
        }
        StatusCode::OK
    } else {
        StatusCode::CONFLICT
    }
}

/// Live updates for one user's cards. Cards are opened server-side by
/// gauge-carder off a market tick — there's no client request to hang a
/// response on — so the frontend needs this instead of polling GET /cards
/// on a timer. Each event is `{"card_id", "user_id", "kind"}`; the client
/// still fetches the card body from GET /cards, this is only the "something
/// changed" signal (same "dumb push, smart fetch" split as gauge-notif).
pub async fn stream_cards(
    State(state): State<AppState>,
    Query(query): Query<CardsQuery>,
) -> Sse<impl Stream<Item = Result<Event, axum::Error>>> {
    let user_id = query.user_id;
    let receiver = state.card_events.subscribe();
    let stream = BroadcastStream::new(receiver).filter_map(move |msg| {
        let user_id = user_id.clone();
        async move {
            match msg {
                // A lagged receiver dropped some events — nothing to send
                // for those; the client's next GET /cards fetch catches up.
                Err(_lagged) => None,
                Ok(event) if event.user_id != user_id => None,
                Ok(event) => Some(Event::default().json_data(&event)),
            }
        }
    });
    Sse::new(stream).keep_alive(KeepAlive::default())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::routes::router;
    use axum::body::Body;
    use axum::http::Request;
    use http_body_util::BodyExt;
    use shared_types::{CheapSide, Decision, Session, User};
    use tower::ServiceExt;

    fn seed_state() -> AppState {
        // Port 1 is reserved/unlisted — connecting there fails fast and
        // deterministically, standing in for "gauge-exec isn't running".
        let state = AppState::new("http://127.0.0.1:1");
        {
            let mut store = state.store.lock().unwrap();
            store.users.insert(
                "alice".to_string(),
                User {
                    user_id: "alice".to_string(),
                    mode: UserMode::Paper,
                    nav_usd: 1_000.0,
                    max_clip_usd: 100.0,
                    name_pct: 0.1,
                    daily_card_cap: 3,
                    universe: Default::default(),
                    mutes: Default::default(),
                    kill_switch: false,
                },
            );
            let alice = store.users.get("alice").unwrap().clone();
            store.users.insert(
                "bob".to_string(),
                User {
                    user_id: "bob".to_string(),
                    mode: UserMode::Live,
                    ..alice
                },
            );
            store.tape.insert(
                "HOOD".to_string(),
                shared_types::BasisTick {
                    symbol: "HOOD".to_string(),
                    share_mid: 50.0,
                    token_per_share: 50.6,
                    basis_bps: 120.0,
                    net_bps: 90.0,
                    cheap_side: CheapSide::Equity,
                    session: Session::Rth,
                    clip_max: 100.0,
                    decision: Decision::CardEligible,
                    ts_ms: now_ms(),
                },
            );
            store.card_store.open(Card {
                card_id: "paper-card".to_string(),
                user_id: "alice".to_string(),
                symbol: "HOOD".to_string(),
                clip_usd: 40.0,
                cheap_side: CheapSide::Equity,
                basis_bps: 120.0,
                net_bps: 90.0,
                state: shared_types::CardState::Open,
                opened_at_ms: now_ms(),
                ttl_ms: 75_000,
            });
            store.card_store.open(Card {
                card_id: "live-card".to_string(),
                user_id: "bob".to_string(),
                symbol: "HOOD".to_string(),
                clip_usd: 40.0,
                cheap_side: CheapSide::Equity,
                basis_bps: 120.0,
                net_bps: 90.0,
                state: shared_types::CardState::Open,
                opened_at_ms: now_ms(),
                ttl_ms: 75_000,
            });
        }
        state
    }

    #[tokio::test]
    async fn list_cards_returns_only_that_users_cards() {
        let app = router(seed_state());
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/cards?user_id=alice")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let body = response.into_body().collect().await.unwrap().to_bytes();
        let cards: Vec<Card> = serde_json::from_slice(&body).unwrap();
        assert_eq!(cards.len(), 1);
        assert_eq!(cards[0].card_id, "paper-card");
    }

    #[tokio::test]
    async fn confirming_a_paper_card_records_a_fill_at_the_tape_mid() {
        let app = router(seed_state());
        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/cards/paper-card/confirm")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let body = response.into_body().collect().await.unwrap().to_bytes();
        let parsed: ConfirmResponse = serde_json::from_slice(&body).unwrap();
        assert_eq!(parsed, ConfirmResponse::Confirmed { filled_at_price: Some(50.0) });
    }

    #[tokio::test]
    async fn confirming_a_live_card_reports_the_handoff_failure_when_exec_is_unreachable() {
        let app = router(seed_state());
        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/cards/live-card/confirm")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::BAD_GATEWAY);
        let body = response.into_body().collect().await.unwrap().to_bytes();
        let parsed: ConfirmResponse = serde_json::from_slice(&body).unwrap();
        assert!(matches!(parsed, ConfirmResponse::LiveHandoffFailed { .. }));
    }

    #[tokio::test]
    async fn confirming_twice_is_conflict_not_a_double_fill() {
        let app = router(seed_state());
        let request = || {
            Request::builder()
                .method("POST")
                .uri("/cards/paper-card/confirm")
                .body(Body::empty())
                .unwrap()
        };
        let first = app.clone().oneshot(request()).await.unwrap();
        assert_eq!(first.status(), StatusCode::OK);
        let second = app.oneshot(request()).await.unwrap();
        assert_eq!(second.status(), StatusCode::CONFLICT);
    }

    #[tokio::test]
    async fn skip_resolves_an_open_card() {
        let app = router(seed_state());
        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/cards/paper-card/skip")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn stream_cards_responds_with_sse_content_type() {
        let app = router(seed_state());
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/cards/stream?user_id=alice")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(response.headers().get("content-type").unwrap(), "text/event-stream");
    }

    #[tokio::test]
    async fn stream_cards_only_delivers_events_for_the_requested_user() {
        let state = seed_state();
        let app = router(state.clone());
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/cards/stream?user_id=alice")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        let mut body = response.into_body().into_data_stream();

        // Published after the subscription above exists (oneshot already ran
        // the handler), so both are queued for delivery — only one should
        // pass the per-user filter.
        state.publish_card_event("bobs-card", "bob", CardEventKind::Confirmed);
        state.publish_card_event("paper-card", "alice", CardEventKind::Confirmed);

        let chunk = tokio::time::timeout(std::time::Duration::from_secs(2), body.next())
            .await
            .expect("timed out waiting for an SSE event")
            .expect("stream ended before any event arrived")
            .expect("chunk read error");
        let text = String::from_utf8(chunk.to_vec()).unwrap();
        assert!(text.contains("paper-card"), "got: {text}");
        assert!(!text.contains("bobs-card"), "got: {text}");
    }

    #[tokio::test]
    async fn skipping_an_unknown_card_is_conflict() {
        let app = router(seed_state());
        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/cards/nope/skip")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::CONFLICT);
    }
}
