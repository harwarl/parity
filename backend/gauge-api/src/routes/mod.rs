mod cards;
mod log;
mod settings;
mod tape;

use axum::Router;
use axum::routing::get;

use crate::state::AppState;

/// The only HTTP surface the frontend talks to (ARCHITECTURE.md §2.4).
pub fn router(state: AppState) -> Router {
    Router::new()
        .route("/tape", get(tape::get_tape))
        .route("/cards", get(cards::list_cards))
        .route("/cards/{id}/confirm", axum::routing::post(cards::confirm_card))
        .route("/cards/{id}/skip", axum::routing::post(cards::skip_card))
        .route("/log", get(log::get_log))
        .route(
            "/users/{id}/settings",
            get(settings::get_settings).put(settings::put_settings),
        )
        .with_state(state)
}
