//! The consumer-loop side of the user plane — moved verbatim (logic
//! unchanged) from gauge-carder's old standalone `main.rs`. Rehydrates
//! cards/fills from Redis, then loops: reload users, consume a batch of
//! ticks, run policy per subscriber, open/persist/announce cards, sweep
//! TTL expiries. Spawned by gauge-api's main.rs as a background task
//! alongside the HTTP server and the other background tasks in
//! `background.rs`.

use std::collections::HashMap;

use shared_types::{Card, CardEvent, CardEventKind, CardState, Decision, User};

use crate::carder::card_store::CardStore;
use crate::carder::index::SubscriberIndex;
use crate::carder::paper_ledger::PaperLedger;
use crate::carder::persistence::RedisStore;
use crate::carder::policy::{self, PolicyOutcome};
use crate::carder::tick_consumer::TickConsumer;
use crate::state::now_ms;

/// Runs forever. `persistence` is this task's own `RedisStore` (a cheap
/// clone of the `ConnectionManager` — separate from `AppState.persistence`,
/// which the HTTP handlers use) so this loop's request pattern (long
/// blocking reads) never competes with request-handling latency.
pub async fn run(redis_url: String, consumer_name: String) {
    let mut persistence = RedisStore::connect(&redis_url)
        .await
        .unwrap_or_else(|e| panic!("gauge-api/carder: failed to connect to Redis at {redis_url}: {e}"));
    let mut consumer = TickConsumer::connect(&redis_url, consumer_name)
        .await
        .unwrap_or_else(|e| panic!("gauge-api/carder: failed to set up tick consumer: {e}"));

    let mut card_store = CardStore::new();
    let mut loaded_cards = persistence
        .load_all_cards()
        .await
        .unwrap_or_else(|e| panic!("gauge-api/carder: failed to load persisted cards: {e}"));
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
        .unwrap_or_else(|e| panic!("gauge-api/carder: failed to load persisted fills: {e}"));
    let loaded_fill_count = loaded_fills.len();
    paper_ledger.hydrate(loaded_fills);

    println!(
        "gauge-api/carder: rehydrated {loaded_card_count} cards, {loaded_fill_count} fills from Redis"
    );

    loop {
        // Reloaded each pass rather than cached — gauge-api's HTTP side can
        // write new user settings to the same Redis keys at any time and
        // this picks them up without a restart.
        let users = persistence
            .load_all_users()
            .await
            .unwrap_or_else(|e| panic!("gauge-api/carder: failed to load users: {e}"));
        let users_by_id: HashMap<String, User> =
            users.into_iter().map(|u| (u.user_id.clone(), u)).collect();
        let index = SubscriberIndex::build(users_by_id.values());

        let ticks = match consumer.next_batch(5_000).await {
            Ok(ticks) => ticks,
            Err(e) => {
                eprintln!("gauge-api/carder: tick read error: {e}");
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
                            eprintln!("gauge-api/carder: failed to persist card {}: {e}", card.card_id);
                        } else if let Err(e) = persistence
                            .publish_card_event(&CardEvent {
                                card_id: card.card_id.clone(),
                                user_id: user_id.clone(),
                                kind: CardEventKind::Opened,
                            })
                            .await
                        {
                            eprintln!("gauge-api/carder: failed to publish open event for {}: {e}", card.card_id);
                        }
                        println!("gauge-api/carder: opened card {} for {user_id}", card.card_id);
                    }
                    PolicyOutcome::Drop(reason) => {
                        println!("gauge-api/carder: dropped {} for {user_id}: {reason:?}", tick.symbol);
                    }
                }
            }
        }

        for card_id in card_store.expire_stale(now_ms()) {
            if let Some(card) = card_store.get(&card_id) {
                let user_id = card.user_id.clone();
                if let Err(e) = persistence.save_card(card).await {
                    eprintln!("gauge-api/carder: failed to persist expiry of {card_id}: {e}");
                } else if let Err(e) = persistence
                    .publish_card_event(&CardEvent {
                        card_id: card_id.clone(),
                        user_id,
                        kind: CardEventKind::Expired,
                    })
                    .await
                {
                    eprintln!("gauge-api/carder: failed to publish expiry event for {card_id}: {e}");
                }
            }
        }
    }
}
