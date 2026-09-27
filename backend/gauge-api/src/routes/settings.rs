use axum::Json;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use shared_types::User;

use crate::state::AppState;

pub async fn get_settings(
    State(mut state): State<AppState>,
    Path(user_id): Path<String>,
) -> Result<Json<User>, StatusCode> {
    match state.persistence.load_user(&user_id).await {
        Ok(Some(user)) => Ok(Json(user)),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

/// Upsert. The `:id` in the path is authoritative over whatever `user_id` is
/// in the body. `require_api_token` (auth.rs) proves *some* valid caller,
/// not that this specific caller is `:id` — real per-user identity is still
/// undecided, so this endpoint trusts the path once past that gate.
pub async fn put_settings(
    State(mut state): State<AppState>,
    Path(user_id): Path<String>,
    Json(mut user): Json<User>,
) -> Result<Json<User>, (StatusCode, String)> {
    user.user_id = user_id;
    // Out-of-range gates (a 4th card, a negative floor, …) are refused,
    // not clamped, so the Settings screen can show why.
    user.validate().map_err(|reason| (StatusCode::UNPROCESSABLE_ENTITY, reason))?;
    state
        .persistence
        .save_user(&user)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(user))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::routes::router;
    use crate::test_support::{test_state, unique_id};
    use axum::body::Body;
    use axum::http::Request;
    use http_body_util::BodyExt;
    use shared_types::UserMode;
    use std::collections::HashSet;
    use tower::ServiceExt;

    fn user(user_id: &str) -> User {
        User {
            user_id: user_id.to_string(),
            mode: UserMode::Paper,
            nav_usd: 500.0,
            max_clip_usd: 50.0,
            name_pct: 0.2,
            daily_card_cap: 3,
            universe: HashSet::from(["HOOD".to_string()]),
            mutes: HashSet::new(),
            kill_switch: false,
            rules: Default::default(),
            notify: Default::default(),
        }
    }

    #[tokio::test]
    async fn put_then_get_round_trips_through_redis() {
        let user_id = unique_id("alice");
        let state = test_state().await;
        let app = router(state);

        let put = app
            .clone()
            .oneshot(
                Request::builder()
                    .method("PUT")
                    .uri(format!("/users/{user_id}/settings"))
                    .header("authorization", "Bearer test-token")
                    .header("content-type", "application/json")
                    .body(Body::from(serde_json::to_vec(&user(&user_id)).unwrap()))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(put.status(), StatusCode::OK);

        let get = app
            .oneshot(
                Request::builder()
                    .uri(format!("/users/{user_id}/settings"))
                    .header("authorization", "Bearer test-token")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(get.status(), StatusCode::OK);
        let body = get.into_body().collect().await.unwrap().to_bytes();
        let loaded: User = serde_json::from_slice(&body).unwrap();
        assert_eq!(loaded.user_id, user_id);
        assert_eq!(loaded.nav_usd, 500.0);
    }

    #[tokio::test]
    async fn put_ignores_a_mismatched_user_id_in_the_body() {
        let path_id = unique_id("alice");
        let state = test_state().await;
        let app = router(state);

        let mut body_user = user("someone-else-entirely");
        body_user.nav_usd = 999.0;

        let response = app
            .oneshot(
                Request::builder()
                    .method("PUT")
                    .uri(format!("/users/{path_id}/settings"))
                    .header("authorization", "Bearer test-token")
                    .header("content-type", "application/json")
                    .body(Body::from(serde_json::to_vec(&body_user).unwrap()))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let body = response.into_body().collect().await.unwrap().to_bytes();
        let saved: User = serde_json::from_slice(&body).unwrap();
        assert_eq!(saved.user_id, path_id, "path id must win over the body's");
    }

    #[tokio::test]
    async fn get_settings_for_an_unknown_user_is_not_found() {
        let state = test_state().await;
        let app = router(state);
        let response = app
            .oneshot(
                Request::builder()
                    .uri(format!("/users/{}/settings", unique_id("nobody")))
                    .header("authorization", "Bearer test-token")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::NOT_FOUND);
    }

    #[tokio::test]
    async fn gate_rules_round_trip_and_a_fourth_card_is_refused() {
        let user_id = unique_id("alice");
        let app = router(test_state().await);
        let put = |body: User| {
            Request::builder()
                .method("PUT")
                .uri(format!("/users/{user_id}/settings"))
                .header("authorization", "Bearer test-token")
                .header("content-type", "application/json")
                .body(Body::from(serde_json::to_vec(&body).unwrap()))
                .unwrap()
        };

        let mut u = user(&user_id);
        u.rules.floor_bps = 3.5;
        u.rules.min_depth_usd = 50_000.0;
        u.notify.sound_on_card = true;
        let ok = app.clone().oneshot(put(u.clone())).await.unwrap();
        assert_eq!(ok.status(), StatusCode::OK);
        let body = ok.into_body().collect().await.unwrap().to_bytes();
        let saved: User = serde_json::from_slice(&body).unwrap();
        assert_eq!(saved.rules.floor_bps, 3.5);
        assert!(saved.notify.sound_on_card);

        u.daily_card_cap = 4;
        let refused = app.oneshot(put(u)).await.unwrap();
        assert_eq!(refused.status(), StatusCode::UNPROCESSABLE_ENTITY);
        let body = refused.into_body().collect().await.unwrap().to_bytes();
        assert!(String::from_utf8_lossy(&body).contains("daily_card_cap"));
    }

    /// Users saved before gate rules existed still load, with defaults.
    #[test]
    fn a_user_without_rules_deserialises_with_defaults() {
        let legacy = serde_json::json!({
            "user_id": "old", "mode": "Paper", "nav_usd": 500.0, "max_clip_usd": 50.0,
            "name_pct": 0.2, "daily_card_cap": 3, "universe": ["HOOD"], "mutes": [],
            "kill_switch": false
        });
        let user: User = serde_json::from_value(legacy).unwrap();
        assert_eq!(user.rules, shared_types::GateRules::default());
        assert_eq!(user.notify, shared_types::NotifyPrefs::default());
    }
}
