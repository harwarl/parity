// The single non-exec backend service: pure math (mod engine), ingest (mod market),
// user-plane fan-out (mod carder), and the HTTP surface for the Next.js app (mod
// routes) — GET /tape (public), GET /cards, GET /cards/stream (SSE), POST
// /cards/:id/confirm, POST /cards/:id/skip, GET /log, and the You tab settings. On
// confirm it hands off to gauge-exec over HTTP and relays status back — it never
// holds or sees MCP credentials itself. gauge-exec stays its own deployable on
// purpose: it's the one service that will hold real MCP credentials, and merging
// it in here would put those credentials in the same process/crash domain as
// everything else.
//
// This used to be four separate binaries (gauge-engine, gauge-market, gauge-carder,
// gauge-api) talking over Redis and HTTP (plus a fifth, gauge-notif, that never had
// any real logic to bring over). They're folded in here as mod engine, mod market,
// and mod carder — same code, same tests, just one deployable instead of four.
// Push notifications (formerly gauge-notif, always just `println!("gauge-notif")`
// with nothing else in it) have no code to preserve; their future home is a
// `mod notif` here, once there's an actual implementation to put in it.
//
// State is Redis-backed via carder::persistence::RedisStore (state.rs) — the
// same store carder::runner's background loop writes through, so a card that
// loop opens and a confirm/skip an HTTP request handles are the same record.
// Two more background tasks (background.rs) mirror the tick stream into an
// in-memory tape cache and relay card lifecycle Pub/Sub announcements into this
// process's local SSE broadcast channel. Every route but /tape requires a
// bearer token (auth.rs) — service-level auth only, not real per-user identity,
// which is still an undecided architecture question.

mod auth;
mod background;
mod carder;
mod engine;
mod market;
mod routes;
mod state;
#[cfg(test)]
mod test_support;

use carder::persistence::RedisStore;
use market::publish::TickPublisher;
use state::AppState;

#[tokio::main]
async fn main() {
    let redis_url =
        std::env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1:6379".to_string());
    let exec_url =
        std::env::var("GAUGE_EXEC_URL").unwrap_or_else(|_| "http://127.0.0.1:8082".to_string());
    let bind_addr =
        std::env::var("GAUGE_API_ADDR").unwrap_or_else(|_| "127.0.0.1:8080".to_string());
    let carder_consumer_name = std::env::var("GAUGE_CARDER_CONSUMER_NAME")
        .unwrap_or_else(|_| "gauge-api-carder-1".to_string());
    let api_token = std::env::var("GAUGE_API_TOKEN").unwrap_or_else(|_| {
        panic!(
            "gauge-api: GAUGE_API_TOKEN must be set — every route but /tape requires it \
             (Authorization: Bearer <token>). Refusing to start without one rather than \
             serving user data with no auth at all."
        )
    });

    let persistence = RedisStore::connect(&redis_url)
        .await
        .unwrap_or_else(|e| panic!("gauge-api: failed to connect to Redis at {redis_url}: {e}"));

    // Ingest side: still just the startup connectivity check gauge-market had
    // before the merge — the real poll loop (feeds -> mod engine -> halt
    // controller -> publish) was never built (see market/mod.rs). Folding the
    // services together didn't add that; it's the same gap, now living in one
    // binary instead of an undeployed separate one.
    match TickPublisher::connect(&redis_url).await {
        Ok(_publisher) => println!("gauge-api/market: connected to Redis at {redis_url}"),
        Err(e) => eprintln!("gauge-api/market: failed to connect to Redis at {redis_url}: {e}"),
    }

    let state = AppState::new(persistence, exec_url, api_token);

    tokio::spawn(background::run_tape_consumer(redis_url.clone(), state.tape.clone()));
    tokio::spawn(background::run_card_event_relay(
        redis_url.clone(),
        state.card_events.clone(),
    ));
    tokio::spawn(carder::runner::run(redis_url, carder_consumer_name));

    let app = routes::router(state);

    let listener = tokio::net::TcpListener::bind(&bind_addr)
        .await
        .unwrap_or_else(|e| panic!("gauge-api: failed to bind {bind_addr}: {e}"));
    println!("gauge-api listening on {bind_addr}");
    axum::serve(listener, app)
        .await
        .unwrap_or_else(|e| panic!("gauge-api: server error: {e}"));
}
