// Subscribes to the BasisTick bus, maintains the symbol -> users inverted index,
// applies per-user policy (clip, caps, session, mutes), and owns the card lifecycle
// and the paper ledger.
//
// Everything lives in lib.rs (gauge-api reuses the pure pieces too) and is unit
// tested there. main() now actually runs: it consumes gauge-market's Redis
// Streams tick bus (tick_consumer) and persists card/user/fill state to Redis
// (persistence), both implemented and exposed from the library.
//
// Known gap this doesn't close: gauge-api still keeps its own separate in-memory
// CardStore (see gauge-api/src/state.rs) rather than reading/writing this same
// Redis-backed state — so a card this process opens and a confirm/skip gauge-api
// handles are not, today, the same record. This loop only ever opens and expires
// cards; confirm/reject still only happen in gauge-api's disconnected copy. Wiring
// those together is the natural next step, not done here.

use std::collections::HashMap;

use gauge_carder::card_store::CardStore;
use gauge_carder::index::SubscriberIndex;
use gauge_carder::paper_ledger::PaperLedger;
use gauge_carder::persistence::RedisStore;
use gauge_carder::policy::{self, PolicyOutcome};
use gauge_carder::tick_consumer::TickConsumer;
use shared_types::{Card, CardState, Decision, User};

fn now_ms() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .expect("system clock is before the Unix epoch")
        .as_millis() as u64
}

#[tokio::main]
async fn main() {
    let redis_url =
        std::env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1:6379".to_string());
    let consumer_name = std::env::var("GAUGE_CARDER_CONSUMER_NAME")
        .unwrap_or_else(|_| "gauge-carder-1".to_string());

    let mut persistence = RedisStore::connect(&redis_url)
        .await
        .unwrap_or_else(|e| panic!("gauge-carder: failed to connect to Redis at {redis_url}: {e}"));
    let mut consumer = TickConsumer::connect(&redis_url, consumer_name)
        .await
        .unwrap_or_else(|e| panic!("gauge-carder: failed to set up tick consumer: {e}"));

    let mut card_store = CardStore::new();
    let mut loaded_cards = persistence
        .load_all_cards()
        .await
        .unwrap_or_else(|e| panic!("gauge-carder: failed to load persisted cards: {e}"));
    // Chronological order matters here — CardStore::open()'s daily-cap
    // bucket tracks opened_at_ms as it replays, and an out-of-order replay
    // would clear and rebuild that count incorrectly.
    loaded_cards.sort_by_key(|c| c.opened_at_ms);
    let loaded_card_count = loaded_cards.len();
    for card in loaded_cards {
        card_store.open(card);
    }

    let mut paper_ledger = PaperLedger::new();
    let loaded_fills = persistence
        .load_all_fills()
        .await
        .unwrap_or_else(|e| panic!("gauge-carder: failed to load persisted fills: {e}"));
    let loaded_fill_count = loaded_fills.len();
    paper_ledger.hydrate(loaded_fills);

    println!(
        "gauge-carder: rehydrated {loaded_card_count} cards, {loaded_fill_count} fills from Redis"
    );

    loop {
        // Reloaded each pass rather than cached — gauge-api can write new
        // user settings to the same Redis keys at any time (once it's
        // updated to do so; see the top-of-file note) and this picks them
        // up without a restart.
        let users = persistence
            .load_all_users()
            .await
            .unwrap_or_else(|e| panic!("gauge-carder: failed to load users: {e}"));
        let users_by_id: HashMap<String, User> =
            users.into_iter().map(|u| (u.user_id.clone(), u)).collect();
        let index = SubscriberIndex::build(users_by_id.values());

        let ticks = match consumer.next_batch(5_000).await {
            Ok(ticks) => ticks,
            Err(e) => {
                eprintln!("gauge-carder: tick read error: {e}");
                continue;
            }
        };

        for tick in &ticks {
            if tick.decision != Decision::CardEligible {
                continue;
            }
            for user_id in index.subscribers_for(&tick.symbol) {
                let Some(user) = users_by_id.get(user_id) else {
                    continue;
                };
                let now = now_ms();
                let cards_opened_today = card_store.cards_opened_today(user_id, now);
                match policy::evaluate(user, tick, cards_opened_today) {
                    PolicyOutcome::Card { clip_usd } => {
                        let card = Card {
                            card_id: format!("{}-{}-{}", tick.symbol, user_id, tick.ts_ms),
                            user_id: user_id.clone(),
                            symbol: tick.symbol.clone(),
                            clip_usd,
                            cheap_side: tick.cheap_side,
                            basis_bps: tick.basis_bps,
                            net_bps: tick.net_bps,
                            state: CardState::Open,
                            opened_at_ms: now,
                            ttl_ms: 75_000,
                        };
                        card_store.open(card.clone());
                        if let Err(e) = persistence.save_card(&card).await {
                            eprintln!("gauge-carder: failed to persist card {}: {e}", card.card_id);
                        }
                        println!("gauge-carder: opened card {} for {user_id}", card.card_id);
                    }
                    PolicyOutcome::Drop(reason) => {
                        println!("gauge-carder: dropped {} for {user_id}: {reason:?}", tick.symbol);
                    }
                }
            }
        }

        for card_id in card_store.expire_stale(now_ms()) {
            if let Some(card) = card_store.get(&card_id) {
                if let Err(e) = persistence.save_card(card).await {
                    eprintln!("gauge-carder: failed to persist expiry of {card_id}: {e}");
                }
            }
        }
    }
}
