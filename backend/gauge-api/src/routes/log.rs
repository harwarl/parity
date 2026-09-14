use axum::Json;
use axum::extract::{Query, State};
use gauge_carder::paper_ledger::Fill;
use serde::Deserialize;

use crate::state::AppState;

#[derive(Deserialize)]
pub struct LogQuery {
    pub user_id: String,
}

pub async fn get_log(State(state): State<AppState>, Query(query): Query<LogQuery>) -> Json<Vec<Fill>> {
    let store = state.store.lock().unwrap();
    Json(store.paper_ledger.fills_for(&query.user_id).cloned().collect())
}
