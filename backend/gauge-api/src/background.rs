use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::Duration;

use futures_util::StreamExt;
use redis::AsyncCommands;
use redis::aio::ConnectionManagerConfig;
use redis::streams::{StreamReadOptions, StreamReadReply};
use shared_types::{BasisTick, CARD_EVENTS_CHANNEL, CardEvent, TICK_STREAM_KEY};
use tokio::sync::broadcast;

/// Same fix as gauge-carder's tick_consumer.rs: the default 500ms response
/// timeout is shorter than any real BLOCK duration, so every blocking read
/// would abort client-side before Redis could ever reply.
const RESPONSE_TIMEOUT: Duration = Duration::from_secs(30);

/// Mirrors gauge-market's tick stream into an in-memory `symbol -> latest
/// tick` cache (state.rs's `tape`). Deliberately NOT gauge-carder's
/// consumer-group `TickConsumer` — a consumer group splits messages across
/// its members, which is right for gauge-carder's at-least-once processing
/// but wrong here: every gauge-api instance needs to see every tick to
/// build its own complete cache, not compete for a share of them. Plain
/// XREAD, tracking its own last-seen id, starting from "$" (skip backlog —
/// this is a cache of current state, not a log that needs replaying).
pub async fn run_tape_consumer(redis_url: String, tape: Arc<Mutex<HashMap<String, BasisTick>>>) {
    loop {
        match tape_consumer_loop(&redis_url, &tape).await {
            Ok(()) => unreachable!("tape_consumer_loop only returns on error"),
            Err(e) => {
                eprintln!("gauge-api: tape consumer error, reconnecting in 1s: {e}");
                tokio::time::sleep(Duration::from_secs(1)).await;
            }
        }
    }
}

async fn tape_consumer_loop(
    redis_url: &str,
    tape: &Arc<Mutex<HashMap<String, BasisTick>>>,
) -> redis::RedisResult<()> {
    let client = redis::Client::open(redis_url)?;
    let config = ConnectionManagerConfig::new().set_response_timeout(Some(RESPONSE_TIMEOUT));
    let mut conn = client.get_connection_manager_with_config(config).await?;

    let mut last_id = "$".to_string();
    loop {
        let opts = StreamReadOptions::default().block(5_000).count(50);
        let reply: Option<StreamReadReply> = conn
            .xread_options(&[TICK_STREAM_KEY], &[last_id.as_str()], &opts)
            .await?;

        let Some(reply) = reply else { continue };
        for stream_key in reply.keys {
            for entry in stream_key.ids {
                last_id = entry.id.clone();
                if let Some(payload) = entry.get::<String>("payload") {
                    if let Ok(tick) = serde_json::from_str::<BasisTick>(&payload) {
                        tape.lock().unwrap().insert(tick.symbol.clone(), tick);
                    }
                }
            }
        }
    }
}

/// Subscribes to gauge-carder's (and gauge-api's own) card lifecycle
/// announcements and forwards each one into this process's local broadcast
/// channel, which routes/cards.rs's SSE handler fans out from. See
/// state.rs's note on `card_events` for why every mutator publishes to
/// Redis rather than calling `.send()` directly.
pub async fn run_card_event_relay(redis_url: String, sender: broadcast::Sender<CardEvent>) {
    loop {
        if let Err(e) = card_event_relay_loop(&redis_url, &sender).await {
            eprintln!("gauge-api: card event relay error, reconnecting in 1s: {e}");
        }
        tokio::time::sleep(Duration::from_secs(1)).await;
    }
}

async fn card_event_relay_loop(
    redis_url: &str,
    sender: &broadcast::Sender<CardEvent>,
) -> redis::RedisResult<()> {
    let client = redis::Client::open(redis_url)?;
    let mut pubsub = client.get_async_pubsub().await?;
    pubsub.subscribe(CARD_EVENTS_CHANNEL).await?;

    let mut messages = pubsub.into_on_message();
    while let Some(msg) = messages.next().await {
        if let Ok(payload) = msg.get_payload::<String>() {
            if let Ok(event) = serde_json::from_str::<CardEvent>(&payload) {
                // Send errors only mean no SSE clients are connected right
                // now — nothing to catch up, not a failure.
                let _ = sender.send(event);
            }
        }
    }
    Ok(())
}
