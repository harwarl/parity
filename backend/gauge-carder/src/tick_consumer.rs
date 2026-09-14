use std::time::Duration;

use redis::AsyncCommands;
use redis::aio::{ConnectionManager, ConnectionManagerConfig};
use redis::streams::{StreamReadOptions, StreamReadReply};
use shared_types::{BasisTick, TICK_STREAM_KEY};

const GROUP_NAME: &str = "gauge-carder";

/// `ConnectionManager`'s default response timeout is 500ms — far shorter
/// than a `BLOCK`ing XREADGROUP is meant to wait, so with the default
/// config every blocking read aborts client-side well before Redis would
/// ever reply, even when there's nothing wrong. Must stay comfortably
/// above whatever `block_ms` callers pass to `next_batch`.
const RESPONSE_TIMEOUT: Duration = Duration::from_secs(30);

/// Consumer-group reader for the same stream gauge-market publishes
/// `BasisTick`s to (gauge-market/src/publish.rs). A consumer group means
/// Redis itself tracks this reader's delivery position — restart-safe
/// without gauge-carder needing to persist its own cursor.
pub struct TickConsumer {
    conn: ConnectionManager,
    consumer_name: String,
}

impl TickConsumer {
    /// `consumer_name` should be unique per running gauge-carder process
    /// (e.g. hostname + pid) once this scales past one instance — sharing a
    /// name between two live consumers would split one consumer's pending
    /// entries across both without either meaning to.
    pub async fn connect(redis_url: &str, consumer_name: impl Into<String>) -> redis::RedisResult<Self> {
        let client = redis::Client::open(redis_url)?;
        let config = ConnectionManagerConfig::new().set_response_timeout(Some(RESPONSE_TIMEOUT));
        let mut conn = client.get_connection_manager_with_config(config).await?;

        // "$" = start from ticks published after the group is created, not
        // the whole backlog. MKSTREAM so this doesn't require gauge-market
        // to have published at least once first.
        let created: redis::RedisResult<()> =
            conn.xgroup_create_mkstream(TICK_STREAM_KEY, GROUP_NAME, "$").await;
        if let Err(e) = created {
            // BUSYGROUP just means a previous run (or another instance)
            // already created it — not a real failure.
            if !e.to_string().contains("BUSYGROUP") {
                return Err(e);
            }
        }

        Ok(Self {
            conn,
            consumer_name: consumer_name.into(),
        })
    }

    /// Blocks server-side (via Redis `BLOCK`) up to `block_ms` waiting for
    /// new ticks, then returns whatever arrived — possibly empty on
    /// timeout. Acks every message it successfully decodes; an undecodable
    /// payload is acked too (retrying it will never succeed) but skipped.
    pub async fn next_batch(&mut self, block_ms: usize) -> redis::RedisResult<Vec<BasisTick>> {
        let opts = StreamReadOptions::default()
            .group(GROUP_NAME, &self.consumer_name)
            .block(block_ms)
            .count(50);

        let reply: Option<StreamReadReply> = self
            .conn
            .xread_options(&[TICK_STREAM_KEY], &[">"], &opts)
            .await?;

        let Some(reply) = reply else {
            return Ok(Vec::new());
        };

        let mut ticks = Vec::new();
        let mut ids_to_ack = Vec::new();
        for stream_key in reply.keys {
            for entry in stream_key.ids {
                ids_to_ack.push(entry.id.clone());
                if let Some(payload) = entry.get::<String>("payload") {
                    if let Ok(tick) = serde_json::from_str::<BasisTick>(&payload) {
                        ticks.push(tick);
                    }
                }
            }
        }

        if !ids_to_ack.is_empty() {
            let _: usize = self.conn.xack(TICK_STREAM_KEY, GROUP_NAME, &ids_to_ack).await?;
        }

        Ok(ticks)
    }
}
