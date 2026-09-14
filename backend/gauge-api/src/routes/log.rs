use axum::Json;
use axum::extract::{Query, State};
use axum::http::StatusCode;
use gauge_carder::paper_ledger::Fill;
use serde::Deserialize;

use crate::state::AppState;

#[derive(Deserialize)]
pub struct LogQuery {
    pub user_id: String,
}

/// O(n) over every persisted fill, same caveat as list_cards.
pub async fn get_log(
    State(mut state): State<AppState>,
    Query(query): Query<LogQuery>,
) -> Result<Json<Vec<Fill>>, StatusCode> {
    let fills = state
        .persistence
        .load_all_fills()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(
        fills.into_iter().filter(|f| f.user_id == query.user_id).collect(),
    ))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::routes::router;
    use crate::state::now_ms;
    use crate::test_support::{test_state, unique_id};
    use axum::body::Body;
    use axum::http::Request;
    use http_body_util::BodyExt;
    use shared_types::CheapSide;
    use tower::ServiceExt;

    fn fill(card_id: &str, user_id: &str) -> Fill {
        Fill {
            card_id: card_id.to_string(),
            user_id: user_id.to_string(),
            symbol: "HOOD".to_string(),
            cheap_side: CheapSide::Equity,
            clip_usd: 40.0,
            fill_price: 50.0,
            filled_at_ms: now_ms(),
        }
    }

    #[tokio::test]
    async fn get_log_returns_only_that_users_fills() {
        let alice = unique_id("alice");
        let bob = unique_id("bob");
        let mut state = test_state().await;
        state.persistence.save_fill(&fill(&unique_id("card"), &alice)).await.unwrap();
        state.persistence.save_fill(&fill(&unique_id("card"), &bob)).await.unwrap();

        let app = router(state);
        let response = app
            .oneshot(
                Request::builder()
                    .uri(format!("/log?user_id={alice}"))
                    .header("authorization", "Bearer test-token")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let body = response.into_body().collect().await.unwrap().to_bytes();
        let fills: Vec<Fill> = serde_json::from_slice(&body).unwrap();
        assert_eq!(fills.len(), 1);
        assert_eq!(fills[0].user_id, alice);
    }
}
