use axum::Json;
use axum::extract::State;
use shared_types::BasisTick;

use crate::state::AppState;

/// Public, unauthenticated — powers Watcher mode and the marketing site's
/// live widget (see routes/mod.rs, this route sits outside the auth layer).
/// Populated by main.rs's `run_tape_consumer` background task, which reads
/// gauge-market's Redis Streams tick bus directly; no longer always empty.
pub async fn get_tape(State(state): State<AppState>) -> Json<Vec<BasisTick>> {
    let tape = state.tape.lock().unwrap();
    Json(tape.values().cloned().collect())
}
