mod cards;
mod health;
mod history;
mod log;
mod settings;
mod stats;
mod tape;

use axum::Router;
use axum::middleware;
use axum::routing::{get, post};

use crate::auth::require_api_token;
use crate::state::AppState;

/// The only HTTP surface the frontend talks to (ARCHITECTURE.md §2.4).
/// `/tape` stays public per the doc ("GET /tape (public)"), as does `/health`
/// (up/down and timings only); everything else
/// requires the bearer token (see auth.rs) — applied via `route_layer` so it
/// only covers routes added to `authenticated` before the merge, not `/tape`.
pub fn router(state: AppState) -> Router {
    let public = Router::new()
        .route("/tape", get(tape::get_tape))
        .route("/health", get(health::get_health));

    let authenticated = Router::new()
        .route("/cards", get(cards::list_cards))
        .route("/cards/stream", get(cards::stream_cards))
        .route("/cards/{id}/confirm", post(cards::confirm_card))
        .route("/cards/{id}/skip", post(cards::skip_card))
        .route("/log", get(log::get_log))
        .route("/history", get(history::get_history))
        .route("/stats", get(stats::get_stats))
        .route(
            "/users/{id}/settings",
            get(settings::get_settings).put(settings::put_settings),
        )
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            require_api_token,
        ));

    public.merge(authenticated).with_state(state)
}
