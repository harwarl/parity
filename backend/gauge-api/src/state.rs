use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use gauge_carder::persistence::RedisStore;
use shared_types::{BasisTick, CardEvent};
use tokio::sync::broadcast;

/// gauge-api's process state. Card/user data is no longer held locally —
/// `persistence` is the same Redis-backed store gauge-carder writes
/// through (gauge_carder::persistence::RedisStore), so a card gauge-carder
/// opens and a confirm/skip gauge-api handles are the same record now, not
/// two disconnected copies.
#[derive(Clone)]
pub struct AppState {
    pub persistence: RedisStore,
    /// Latest tick per symbol — an in-memory read-through cache fed by a
    /// background Redis Streams consumer (main.rs's `run_tape_consumer`),
    /// not itself persisted. Losing it on restart just means a brief wait
    /// for the next tick before /tape and the exec re-quote have data.
    pub tape: Arc<Mutex<HashMap<String, BasisTick>>>,
    pub http: reqwest::Client,
    /// Base URL of a running gauge-exec instance. gauge-api never holds MCP
    /// credentials itself — live confirms are handed off here.
    pub exec_url: String,
    /// Local fan-out to this process's SSE connections. Fed exclusively by
    /// main.rs's `run_card_event_relay`, which subscribes to Redis Pub/Sub
    /// (shared_types::CARD_EVENTS_CHANNEL) — route handlers publish there,
    /// not here directly, so there's one path for "how do SSE clients learn
    /// about a change" regardless of which process made it.
    pub card_events: broadcast::Sender<CardEvent>,
    /// Service-level bearer token checked by auth.rs. Proves the caller
    /// holds a valid credential to talk to gauge-api at all — it does not
    /// prove the caller is the specific user named in a request path. Real
    /// per-user identity (session, OAuth, whatever) is still undecided.
    pub api_token: String,
}

impl AppState {
    pub fn new(persistence: RedisStore, exec_url: impl Into<String>, api_token: impl Into<String>) -> Self {
        let (card_events, _) = broadcast::channel(256);
        Self {
            persistence,
            tape: Arc::new(Mutex::new(HashMap::new())),
            http: reqwest::Client::new(),
            exec_url: exec_url.into(),
            card_events,
            api_token: api_token.into(),
        }
    }
}

pub fn now_ms() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .expect("system clock is before the Unix epoch")
        .as_millis() as u64
}
