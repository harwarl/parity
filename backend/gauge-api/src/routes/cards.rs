use axum::Json;
use axum::extract::{Path, Query, State};
use axum::http::StatusCode;
use axum::response::sse::{Event, KeepAlive, Sse};
use futures_util::StreamExt;
use futures_util::stream::Stream;
use gauge_carder::card_store::{CardStore, ConfirmOutcome};
use gauge_carder::paper_ledger::PaperLedger;
use serde::{Deserialize, Serialize};
use shared_types::{Card, CardEvent, CardEventKind, CheapSide, UserMode};
use tokio_stream::wrappers::BroadcastStream;

use crate::state::{AppState, now_ms};

#[derive(Deserialize)]
pub struct CardsQuery {
    pub user_id: String,
}

/// O(n) over every persisted card, not an indexed-by-user lookup — fine at
/// this scale, would want a Redis set per user (`gauge:carder:cards:by_user:
/// {id}`) if this ever needs to be fast.
pub async fn list_cards(
    State(mut state): State<AppState>,
    Query(query): Query<CardsQuery>,
) -> Result<Json<Vec<Card>>, StatusCode> {
    let cards = state
        .persistence
        .load_all_cards()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(
        cards.into_iter().filter(|c| c.user_id == query.user_id).collect(),
    ))
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
    /// The card is confirmed, but v1 can't execute it live — only the
    /// equity leg is tradable live (README: "Token is research, not a buy
    /// button"), so a card whose cheap side is the token leg has nothing
    /// for gauge-exec to place. Not an error — the confirm itself succeeded
    /// as an acknowledgement, there's just no live order to follow it with.
    LiveActionUnavailable { reason: String },
    AlreadyResolvedOrMissing,
}

/// "Confirm always re-quotes" is gauge-exec's job, not this handler's — this
/// only resolves the card's own lifecycle (via an ephemeral CardStore reused
/// for its tested TTL/idempotency rules, not a second implementation of
/// them) and, for a live-eligible user, hands off to gauge-exec. gauge-api
/// never sees or holds MCP credentials.
pub async fn confirm_card(
    State(mut state): State<AppState>,
    Path(card_id): Path<String>,
) -> (StatusCode, Json<ConfirmResponse>) {
    let now = now_ms();

    let loaded = match state.persistence.load_card(&card_id).await {
        Ok(Some(card)) => card,
        _ => {
            return (
                StatusCode::CONFLICT,
                Json(ConfirmResponse::AlreadyResolvedOrMissing),
            );
        }
    };

    let mut ephemeral = CardStore::new();
    ephemeral.open(loaded);
    let outcome = ephemeral.confirm(&card_id, now);
    let card = ephemeral
        .get(&card_id)
        .cloned()
        .expect("just registered via open()");

    match outcome {
        None => (
            StatusCode::CONFLICT,
            Json(ConfirmResponse::AlreadyResolvedOrMissing),
        ),
        Some(ConfirmOutcome::StaleOnConfirm) => {
            let _ = state.persistence.save_card(&card).await;
            publish_event(&mut state, &card_id, &card.user_id, CardEventKind::StaleOnConfirm).await;
            (StatusCode::CONFLICT, Json(ConfirmResponse::StaleOnConfirm))
        }
        Some(ConfirmOutcome::Confirmed) => {
            if let Err(e) = state.persistence.save_card(&card).await {
                return (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(ConfirmResponse::LiveHandoffFailed { reason: e.to_string() }),
                );
            }
            publish_event(&mut state, &card_id, &card.user_id, CardEventKind::Confirmed).await;

            let user_mode = state
                .persistence
                .load_user(&card.user_id)
                .await
                .ok()
                .flatten()
                .map(|u| u.mode);

            if user_mode == Some(UserMode::Live) {
                if card.cheap_side != CheapSide::Equity {
                    return (
                        StatusCode::OK,
                        Json(ConfirmResponse::LiveActionUnavailable {
                            reason: "only the equity leg is executable live in v1; this card's cheap side is the token leg".to_string(),
                        }),
                    );
                }
                let fresh_tick = state.tape.lock().unwrap().get(&card.symbol).cloned();
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
                let confirm_tick = state.tape.lock().unwrap().get(&card.symbol).cloned();
                let filled_at_price = match confirm_tick {
                    Some(tick) => {
                        let mut ledger = PaperLedger::new();
                        let fill = ledger.record_fill(&card, &tick, now).clone();
                        let price = fill.fill_price;
                        let _ = state.persistence.save_fill(&fill).await;
                        Some(price)
                    }
                    None => None,
                };
                (
                    StatusCode::OK,
                    Json(ConfirmResponse::Confirmed { filled_at_price }),
                )
            }
        }
    }
}

/// Calls gauge-exec's POST /execute. No `side` field — gauge-exec derives
/// Buy/Sell from `cheap_side` itself (its own execute::order_side_for) and
/// is the authoritative enforcer of "only the equity leg trades live in
/// v1," not this handler. The `cheap_side == Equity` check above is a
/// fast-path so gauge-api doesn't burn a network round trip on a request
/// gauge-exec would reject anyway — not the safety boundary itself.
/// `cheap_side` is sent as a plain JSON value rather than importing
/// gauge-exec's types — gauge-api deliberately doesn't depend on
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

pub async fn skip_card(State(mut state): State<AppState>, Path(card_id): Path<String>) -> StatusCode {
    let loaded = match state.persistence.load_card(&card_id).await {
        Ok(Some(card)) => card,
        _ => return StatusCode::CONFLICT,
    };

    let mut ephemeral = CardStore::new();
    ephemeral.open(loaded);
    if !ephemeral.reject(&card_id) {
        return StatusCode::CONFLICT;
    }
    let card = ephemeral.get(&card_id).expect("just rejected");
    if state.persistence.save_card(card).await.is_err() {
        return StatusCode::INTERNAL_SERVER_ERROR;
    }
    let user_id = card.user_id.clone();
    publish_event(&mut state, &card_id, &user_id, CardEventKind::Rejected).await;
    StatusCode::OK
}

/// Every card mutation goes through Redis Pub/Sub, even gauge-api's own —
/// see state.rs's note on `card_events`. Best-effort: a publish failure
/// only means SSE clients miss this one notification, not that the mutation
/// itself failed (it's already saved by the time this is called).
async fn publish_event(state: &mut AppState, card_id: &str, user_id: &str, kind: CardEventKind) {
    let _ = state
        .persistence
        .publish_card_event(&CardEvent {
            card_id: card_id.to_string(),
            user_id: user_id.to_string(),
            kind,
        })
        .await;
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
    use crate::test_support;
    use crate::test_support::{test_state, unique_id};
    use axum::body::Body;
    use axum::http::Request;
    use http_body_util::BodyExt;
    use shared_types::{BasisTick, CardState, Decision, Session, User, UserMode};
    use tower::ServiceExt;

    fn auth_header(builder: axum::http::request::Builder) -> axum::http::request::Builder {
        builder.header("authorization", "Bearer test-token")
    }

    fn user(user_id: &str, mode: UserMode) -> User {
        User {
            user_id: user_id.to_string(),
            mode,
            nav_usd: 1_000.0,
            max_clip_usd: 100.0,
            name_pct: 0.5,
            daily_card_cap: 3,
            universe: Default::default(),
            mutes: Default::default(),
            kill_switch: false,
        }
    }

    fn card(card_id: &str, user_id: &str, cheap_side: CheapSide) -> Card {
        Card {
            card_id: card_id.to_string(),
            user_id: user_id.to_string(),
            symbol: "HOOD".to_string(),
            clip_usd: 40.0,
            cheap_side,
            basis_bps: 120.0,
            net_bps: 90.0,
            state: CardState::Open,
            opened_at_ms: now_ms(),
            ttl_ms: 75_000,
        }
    }

    fn tick(symbol: &str) -> BasisTick {
        BasisTick {
            symbol: symbol.to_string(),
            share_mid: 50.0,
            token_per_share: 50.6,
            basis_bps: 120.0,
            net_bps: 90.0,
            cheap_side: CheapSide::Equity,
            session: Session::Rth,
            clip_max: 100.0,
            decision: Decision::CardEligible,
            ts_ms: now_ms(),
        }
    }

    #[tokio::test]
    async fn list_cards_returns_only_that_users_cards() {
        let alice = unique_id("alice");
        let bob = unique_id("bob");
        let card_id = unique_id("card");
        let mut state = test_state().await;
        state.persistence.save_card(&card(&card_id, &alice, CheapSide::Equity)).await.unwrap();
        state.persistence.save_card(&card(&unique_id("card"), &bob, CheapSide::Equity)).await.unwrap();

        let app = router(state);
        let response = app
            .oneshot(
                auth_header(Request::builder().uri(format!("/cards?user_id={alice}")))
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
        let body = response.into_body().collect().await.unwrap().to_bytes();
        let cards: Vec<Card> = serde_json::from_slice(&body).unwrap();
        assert_eq!(cards.len(), 1);
        assert_eq!(cards[0].card_id, card_id);
    }

    #[tokio::test]
    async fn requests_without_the_bearer_token_are_rejected() {
        let state = test_state().await;
        let app = router(state);
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/cards?user_id=anyone")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn tape_stays_public_without_auth() {
        let state = test_state().await;
        let app = router(state);
        let response = app
            .oneshot(Request::builder().uri("/tape").body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn confirming_a_paper_card_records_a_fill_at_the_tape_mid() {
        let user_id = unique_id("alice");
        let card_id = unique_id("card");
        let mut state = test_state().await;
        state.persistence.save_user(&user(&user_id, UserMode::Paper)).await.unwrap();
        state.persistence.save_card(&card(&card_id, &user_id, CheapSide::Equity)).await.unwrap();
        state.tape.lock().unwrap().insert("HOOD".to_string(), tick("HOOD"));

        let app = router(state);
        let response = app
            .oneshot(
                auth_header(Request::builder().method("POST").uri(format!("/cards/{card_id}/confirm")))
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
    async fn confirming_a_live_card_whose_cheap_side_is_the_token_has_no_live_action() {
        let user_id = unique_id("alice");
        let card_id = unique_id("card");
        let mut state = test_state().await;
        state.persistence.save_user(&user(&user_id, UserMode::Live)).await.unwrap();
        state.persistence.save_card(&card(&card_id, &user_id, CheapSide::Token)).await.unwrap();

        let app = router(state);
        let response = app
            .oneshot(
                auth_header(Request::builder().method("POST").uri(format!("/cards/{card_id}/confirm")))
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
        let body = response.into_body().collect().await.unwrap().to_bytes();
        let parsed: ConfirmResponse = serde_json::from_slice(&body).unwrap();
        assert!(matches!(parsed, ConfirmResponse::LiveActionUnavailable { .. }));
    }

    #[tokio::test]
    async fn confirming_a_live_equity_card_reports_the_handoff_failure_when_exec_is_unreachable() {
        let user_id = unique_id("alice");
        let card_id = unique_id("card");
        let mut state = test_state().await;
        state.persistence.save_user(&user(&user_id, UserMode::Live)).await.unwrap();
        state.persistence.save_card(&card(&card_id, &user_id, CheapSide::Equity)).await.unwrap();
        state.tape.lock().unwrap().insert("HOOD".to_string(), tick("HOOD"));

        let app = router(state);
        let response = app
            .oneshot(
                auth_header(Request::builder().method("POST").uri(format!("/cards/{card_id}/confirm")))
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
        let user_id = unique_id("alice");
        let card_id = unique_id("card");
        let mut state = test_state().await;
        state.persistence.save_user(&user(&user_id, UserMode::Paper)).await.unwrap();
        state.persistence.save_card(&card(&card_id, &user_id, CheapSide::Equity)).await.unwrap();
        state.tape.lock().unwrap().insert("HOOD".to_string(), tick("HOOD"));

        let app = router(state);
        let request = || {
            auth_header(Request::builder().method("POST").uri(format!("/cards/{card_id}/confirm")))
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
        let user_id = unique_id("alice");
        let card_id = unique_id("card");
        let mut state = test_state().await;
        state.persistence.save_card(&card(&card_id, &user_id, CheapSide::Equity)).await.unwrap();

        let app = router(state);
        let response = app
            .oneshot(
                auth_header(Request::builder().method("POST").uri(format!("/cards/{card_id}/skip")))
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn skipping_an_unknown_card_is_conflict() {
        let state = test_state().await;
        let app = router(state);
        let response = app
            .oneshot(
                auth_header(Request::builder().method("POST").uri("/cards/nope-at-all/skip"))
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::CONFLICT);
    }

    #[tokio::test]
    async fn stream_cards_relays_redis_pubsub_events_filtered_by_user() {
        let alice = unique_id("alice");
        let bob = unique_id("bob");
        let state = test_state().await;
        // The real relay, same as main.rs spawns — proves the whole
        // Pub/Sub -> broadcast -> SSE pipeline, not just the filter.
        tokio::spawn(crate::background::run_card_event_relay(
            test_support::test_redis_url(),
            state.card_events.clone(),
        ));
        // Give the relay a moment to subscribe before anything is published.
        tokio::time::sleep(std::time::Duration::from_millis(300)).await;

        let app = router(state.clone());
        let response = app
            .oneshot(
                auth_header(Request::builder().uri(format!("/cards/stream?user_id={alice}")))
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let mut body = response.into_body().into_data_stream();

        let mut persistence = state.persistence.clone();
        persistence
            .publish_card_event(&CardEvent {
                card_id: "bobs-card".to_string(),
                user_id: bob,
                kind: CardEventKind::Opened,
            })
            .await
            .unwrap();
        persistence
            .publish_card_event(&CardEvent {
                card_id: "alices-card".to_string(),
                user_id: alice,
                kind: CardEventKind::Opened,
            })
            .await
            .unwrap();

        let chunk = tokio::time::timeout(std::time::Duration::from_secs(3), body.next())
            .await
            .expect("timed out waiting for an SSE event")
            .expect("stream ended before any event arrived")
            .expect("chunk read error");
        let text = String::from_utf8(chunk.to_vec()).unwrap();
        assert!(text.contains("alices-card"), "got: {text}");
        assert!(!text.contains("bobs-card"), "got: {text}");
    }
}
