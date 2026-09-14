use axum::Json;
use axum::extract::State;
use shared_types::BasisTick;

use crate::state::AppState;

/// Public, unauthenticated — powers Watcher mode and the marketing site's
/// live widget. Empty until gauge-api actually subscribes to gauge-market's
/// tape (see state.rs); the route itself is real.
pub async fn get_tape(State(state): State<AppState>) -> Json<Vec<BasisTick>> {
    let store = state.store.lock().unwrap();
    Json(store.tape.values().cloned().collect())
}
