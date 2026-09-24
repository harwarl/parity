use redis::aio::ConnectionManager;
use redis::AsyncCommands;
use shared_types::{BasisTick, TICK_STREAM_KEY};

/// Publishes `BasisTick`s to Redis Streams via `XADD`. `ConnectionManager`
/// reconnects on its own, which is what a long-running ingest loop needs.
pub struct TickPublisher {
    conn: ConnectionManager,
}

impl TickPublisher {
    pub async fn connect(redis_url: &str) -> redis::RedisResult<Self> {
        let client = redis::Client::open(redis_url)?;
        let conn = client.get_connection_manager().await?;
        Ok(Self { conn })
    }

    /// The whole tick goes in one `payload` field as JSON rather than
    /// flattened into per-field values — keeps `BasisTick`'s shape as the
    /// single source of truth instead of duplicating it into stream schema.
    pub async fn publish(&mut self, tick: &BasisTick) -> redis::RedisResult<String> {
        let payload = serde_json::to_string(tick).map_err(|e| {
            redis::RedisError::from((redis::ErrorKind::Client, "tick serialization failed", e.to_string()))
        })?;
        self.conn
            .xadd(TICK_STREAM_KEY, "*", &[("symbol", tick.symbol.as_str()), ("payload", payload.as_str())])
            .await
    }
}
