use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use gauge_carder::card_store::CardStore;
use gauge_carder::paper_ledger::PaperLedger;
use shared_types::{BasisTick, User};

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
}

impl AppState {
    pub fn new(exec_url: impl Into<String>) -> Self {
        Self {
            store: Arc::new(Mutex::new(Store::new())),
            http: reqwest::Client::new(),
            exec_url: exec_url.into(),
        }
    }
}

pub fn now_ms() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .expect("system clock is before the Unix epoch")
        .as_millis() as u64
}
