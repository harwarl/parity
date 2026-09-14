use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use gauge_carder::card_store::CardStore;
use gauge_carder::paper_ledger::PaperLedger;
use serde::Serialize;
use shared_types::{BasisTick, User};
use tokio::sync::broadcast;

/// Why cards need a push channel at all: a card is opened by gauge-carder
/// off a market tick, with no request from the user to hang a response on —
/// GET /cards alone would leave the frontend polling on a timer to notice
/// new ones. This is the fan-out point: anything that changes a card's
/// state broadcasts here, and GET /cards/stream (routes/cards.rs) turns it
/// into SSE, scoped per user.
#[derive(Clone, Debug, Serialize)]
pub struct CardEvent {
    pub card_id: String,
    pub user_id: String,
    pub kind: CardEventKind,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum CardEventKind {
    Opened,
    Confirmed,
    Rejected,
    Expired,
    StaleOnConfirm,
}

/// Everything gauge-api holds in-process right now. This is a stand-in for
/// real cross-service state: in a deployment where gauge-carder is its own
/// process, gauge-api wouldn't own its own CardStore/PaperLedger instance
/// like this — it'd read/write through a database or an RPC call to the
/// real gauge-carder service. Neither of those has been chosen yet, so this
/// keeps the HTTP layer real and testable in the meantime.
pub struct Store {
    pub card_store: CardStore,
    pub paper_ledger: PaperLedger,
    pub users: HashMap<String, User>,
    /// Latest published tick per symbol. Stays empty until gauge-api
    /// subscribes to gauge-market's Redis Streams (or reads its tape some
    /// other way) — not wired up yet.
    pub tape: HashMap<String, BasisTick>,
}

impl Store {
    fn new() -> Self {
        Self {
            card_store: CardStore::new(),
            paper_ledger: PaperLedger::new(),
            users: HashMap::new(),
            tape: HashMap::new(),
        }
    }
}

#[derive(Clone)]
pub struct AppState {
    pub store: Arc<Mutex<Store>>,
    pub http: reqwest::Client,
    /// Base URL of a running gauge-exec instance. gauge-api never holds MCP
    /// credentials itself — live confirms are handed off here.
    pub exec_url: String,
    /// Broadcast, not mpsc — an SSE connection per browser tab, all wanting
    /// their own copy of every event they're subscribed to. Sender is cheap
    /// to clone and fine to hold directly (no Arc/Mutex needed); each SSE
    /// handler calls `.subscribe()` for its own receiver.
    pub card_events: broadcast::Sender<CardEvent>,
}

impl AppState {
    pub fn new(exec_url: impl Into<String>) -> Self {
        let (card_events, _) = broadcast::channel(256);
        Self {
            store: Arc::new(Mutex::new(Store::new())),
            http: reqwest::Client::new(),
            exec_url: exec_url.into(),
            card_events,
        }
    }

    /// Best-effort: `send` errors only when there are no subscribers right
    /// now, which is fine — there's nothing to catch up.
    pub fn publish_card_event(&self, card_id: &str, user_id: &str, kind: CardEventKind) {
        let _ = self.card_events.send(CardEvent {
            card_id: card_id.to_string(),
            user_id: user_id.to_string(),
            kind,
        });
    }
}

pub fn now_ms() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .expect("system clock is before the Unix epoch")
        .as_millis() as u64
}
