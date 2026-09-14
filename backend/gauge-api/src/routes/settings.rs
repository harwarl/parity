use axum::Json;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use shared_types::User;

use crate::state::AppState;

pub async fn get_settings(
    State(state): State<AppState>,
    Path(user_id): Path<String>,
) -> Result<Json<User>, StatusCode> {
    let store = state.store.lock().unwrap();
    store
        .users
        .get(&user_id)
        .cloned()
        .map(Json)
        .ok_or(StatusCode::NOT_FOUND)
}

/// Upsert. The `:id` in the path is authoritative over whatever `user_id` is
/// in the body — there's no auth layer yet to derive it from a session, so
/// this trusts the path.
pub async fn put_settings(
    State(state): State<AppState>,
    Path(user_id): Path<String>,
    Json(mut user): Json<User>,
) -> Json<User> {
    user.user_id = user_id.clone();
    let mut store = state.store.lock().unwrap();
    store.users.insert(user_id, user.clone());
    Json(user)
}
