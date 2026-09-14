use redis::AsyncCommands;
use redis::aio::ConnectionManager;
use serde::Serialize;
use serde::de::DeserializeOwned;
use shared_types::{CARD_EVENTS_CHANNEL, Card, CardEvent, User};

use crate::paper_ledger::Fill;

const CARD_KEY_PREFIX: &str = "gauge:carder:cards:";
const USER_KEY_PREFIX: &str = "gauge:carder:users:";
const FILL_KEY_PREFIX: &str = "gauge:carder:fills:";

/// The only place gauge-carder's state touches I/O. `CardStore`,
/// `PaperLedger`, and policy stay pure and unit-testable; this is a
/// write-through/rehydrate layer on top of them, keyed on Redis strings
/// (one JSON blob per card/user/fill) rather than hashes — simple, and
/// consistent with how gauge-market already stores ticks as JSON payloads.
#[derive(Clone)]
pub struct RedisStore {
    conn: ConnectionManager,
}

impl RedisStore {
    pub async fn connect(redis_url: &str) -> redis::RedisResult<Self> {
        let client = redis::Client::open(redis_url)?;
        let conn = client.get_connection_manager().await?;
        Ok(Self { conn })
    }

    pub async fn save_card(&mut self, card: &Card) -> redis::RedisResult<()> {
        save(&mut self.conn, CARD_KEY_PREFIX, &card.card_id, card).await
    }

    pub async fn load_card(&mut self, card_id: &str) -> redis::RedisResult<Option<Card>> {
        load_one(&mut self.conn, CARD_KEY_PREFIX, card_id).await
    }

    pub async fn load_all_cards(&mut self) -> redis::RedisResult<Vec<Card>> {
        load_all(&mut self.conn, CARD_KEY_PREFIX).await
    }

    pub async fn save_user(&mut self, user: &User) -> redis::RedisResult<()> {
        save(&mut self.conn, USER_KEY_PREFIX, &user.user_id, user).await
    }

    pub async fn load_user(&mut self, user_id: &str) -> redis::RedisResult<Option<User>> {
        load_one(&mut self.conn, USER_KEY_PREFIX, user_id).await
    }

    pub async fn load_all_users(&mut self) -> redis::RedisResult<Vec<User>> {
        load_all(&mut self.conn, USER_KEY_PREFIX).await
    }

    /// A card fills at most once, so `card_id` doubles as the fill's key too.
    pub async fn save_fill(&mut self, fill: &Fill) -> redis::RedisResult<()> {
        save(&mut self.conn, FILL_KEY_PREFIX, &fill.card_id, fill).await
    }

    pub async fn load_all_fills(&mut self) -> redis::RedisResult<Vec<Fill>> {
        load_all(&mut self.conn, FILL_KEY_PREFIX).await
    }

    /// Announces a card lifecycle change on `CARD_EVENTS_CHANNEL`. Anyone —
    /// gauge-carder opening/expiring a card, gauge-api confirming/rejecting
    /// one — calls this after a successful `save_card`, so every mutator
    /// goes through the same "state changed" signal.
    pub async fn publish_card_event(&mut self, event: &CardEvent) -> redis::RedisResult<()> {
        let json = serde_json::to_string(event).map_err(|e| {
            redis::RedisError::from((redis::ErrorKind::Client, "serialization failed", e.to_string()))
        })?;
        let _: usize = self.conn.publish(CARD_EVENTS_CHANNEL, json).await?;
        Ok(())
    }
}

async fn load_one<T: DeserializeOwned>(
    conn: &mut ConnectionManager,
    prefix: &str,
    id: &str,
) -> redis::RedisResult<Option<T>> {
    let json: Option<String> = conn.get(format!("{prefix}{id}")).await?;
    Ok(json.and_then(|j| serde_json::from_str(&j).ok()))
}

async fn save<T: Serialize>(
    conn: &mut ConnectionManager,
    prefix: &str,
    id: &str,
    value: &T,
) -> redis::RedisResult<()> {
    let json = serde_json::to_string(value).map_err(|e| {
        redis::RedisError::from((redis::ErrorKind::Client, "serialization failed", e.to_string()))
    })?;
    conn.set(format!("{prefix}{id}"), json).await
}

/// SCAN, not KEYS — safe to run against a stream of real traffic without
/// blocking the server, even though this crate's own load volume is tiny.
async fn load_all<T: DeserializeOwned>(
    conn: &mut ConnectionManager,
    prefix: &str,
) -> redis::RedisResult<Vec<T>> {
    let keys: Vec<String> = {
        let mut iter = conn.scan_match(format!("{prefix}*")).await?;
        let mut keys = Vec::new();
        while let Some(key) = iter.next_item().await {
            keys.push(key?);
        }
        keys
    };

    let mut items = Vec::with_capacity(keys.len());
    for key in keys {
        let json: String = conn.get(&key).await?;
        match serde_json::from_str(&json) {
            Ok(item) => items.push(item),
            // A record written by an older/incompatible shape shouldn't
            // take the whole load down — skip it rather than error out.
            Err(_) => continue,
        }
    }
    Ok(items)
}
