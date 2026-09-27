use std::time::{Duration, Instant};

use axum::Json;
use axum::extract::State;
use serde::{Deserialize, Serialize};

use crate::state::{AppState, now_ms};

/// Home · System health, for what gauge-api can actually see. Feed
/// latencies (quotes, Chainlink, RPC) need the market poll loop, which
/// doesn't exist yet (TODO.md), so `tape` reports how fresh the newest
/// tick is instead.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Health {
    /// "ok" when every check passes, else "degraded".
    pub status: String,
    pub redis: Check,
    pub exec: Check,
    pub tape: TapeHealth,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Check {
    pub ok: bool,
    pub latency_ms: Option<u64>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct TapeHealth {
    pub symbols: usize,
    /// `None` when no tick has arrived since this instance started.
    pub freshest_tick_age_ms: Option<u64>,
}

/// Public, like /tape: no user data, no credentials, only up/down and
/// timings.
pub async fn get_health(State(mut state): State<AppState>) -> Json<Health> {
    let redis = match state.persistence.ping_ms().await {
        Ok(ms) => Check { ok: true, latency_ms: Some(ms) },
        Err(_) => Check { ok: false, latency_ms: None },
    };

    let started = Instant::now();
    let exec_ok = state
        .http
        .get(format!("{}/health", state.exec_url))
        .timeout(Duration::from_secs(2))
        .send()
        .await
        .is_ok_and(|r| r.status().is_success());
    let exec = Check {
        ok: exec_ok,
        latency_ms: exec_ok.then(|| started.elapsed().as_millis() as u64),
    };

    let tape = {
        let tape = state.tape.lock().unwrap();
        let now = now_ms();
        TapeHealth {
            symbols: tape.len(),
            freshest_tick_age_ms: tape.values().map(|t| now.saturating_sub(t.ts_ms)).min(),
        }
    };

    let status = if redis.ok && exec.ok { "ok" } else { "degraded" }.to_string();
    Json(Health { status, redis, exec, tape })
}
