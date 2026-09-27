use std::collections::HashMap;

use axum::Json;
use axum::extract::{Query, State};
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};
use shared_types::{CardState, MAX_DAILY_CARDS};

use crate::carder::runner::stats_day;
use crate::routes::cards::CardsQuery;
use crate::state::{AppState, now_ms};

/// Home · Today and "why no card", plus the daily cap.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct TodayStats {
    /// UTC day bucket (ms / 86_400_000).
    pub day: u64,
    /// Ticks evaluated today, market-wide.
    pub evaluations: u64,
    /// Today's ticks by market outcome: card, stale, closed, thin, dust, halt.
    pub outcomes: HashMap<String, u64>,
    pub cap: CapUsage,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CapUsage {
    pub limit: u32,
    /// Cards opened today, whatever happened to them — every card counts
    /// toward the cap.
    pub used: u32,
    /// Of those, still open and inside the TTL.
    pub pending: u32,
}

pub async fn get_stats(
    State(mut state): State<AppState>,
    Query(query): Query<CardsQuery>,
) -> Result<Json<TodayStats>, StatusCode> {
    let err = |_| StatusCode::INTERNAL_SERVER_ERROR;
    let now = now_ms();
    let day = stats_day(now);

    let mut outcomes = state.persistence.load_stats(day).await.map_err(err)?;
    let evaluations = outcomes.remove("evaluations").unwrap_or(0);

    let limit = state
        .persistence
        .load_user(&query.user_id)
        .await
        .map_err(err)?
        .map(|u| u.effective_daily_cap())
        .unwrap_or(MAX_DAILY_CARDS);
    let today: Vec<_> = state
        .persistence
        .load_all_cards()
        .await
        .map_err(err)?
        .into_iter()
        .filter(|c| c.user_id == query.user_id && stats_day(c.opened_at_ms) == day)
        .collect();
    let pending = today
        .iter()
        .filter(|c| c.state == CardState::Open && now <= c.expires_at_ms())
        .count() as u32;

    Ok(Json(TodayStats {
        day,
        evaluations,
        outcomes,
        cap: CapUsage { limit, used: today.len() as u32, pending },
    }))
}
