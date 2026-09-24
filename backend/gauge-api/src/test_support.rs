//! Shared by routes/*.rs test modules. These are real integration tests —
//! gauge-api's state is genuinely Redis-backed now, so testing it means
//! testing it against Redis, same as gauge-carder. Needs a local
//! `redis-server` running; point `TEST_REDIS_URL` elsewhere if that's not
//! DB 15 on localhost. Every seeded key uses a unique id (below) so
//! parallel `cargo test` runs don't collide — nothing here flushes the DB.

use std::sync::atomic::{AtomicU64, Ordering};

use crate::carder::persistence::RedisStore;

use crate::state::{AppState, now_ms};

pub fn test_redis_url() -> String {
    std::env::var("TEST_REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1:6379/15".to_string())
}

pub async fn test_state() -> AppState {
    let persistence = RedisStore::connect(&test_redis_url()).await.expect(
        "gauge-api's integration tests need a local Redis reachable at TEST_REDIS_URL \
         (default redis://127.0.0.1:6379/15) — start one with `redis-server`",
    );
    AppState::new(persistence, "http://127.0.0.1:1", "test-token")
}

pub fn unique_id(prefix: &str) -> String {
    static COUNTER: AtomicU64 = AtomicU64::new(0);
    format!("{prefix}-{}-{}", now_ms(), COUNTER.fetch_add(1, Ordering::Relaxed))
}
