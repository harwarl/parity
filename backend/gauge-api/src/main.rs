// HTTP surface for the Next.js app: GET /tape (public), GET /cards, GET
// /cards/stream (SSE), POST /cards/:id/confirm, POST /cards/:id/skip, GET /log,
// and the You tab settings. gauge-api is the only service the frontend talks to.
// On confirm it hands off internally to gauge-exec and relays status back — it
// never holds or sees MCP credentials itself.
//
// State is Redis-backed via gauge_carder::persistence::RedisStore (state.rs) —
// the same store gauge-carder writes through, so card/user data is now actually
// shared across processes, not two disconnected in-memory copies. Two background
// tasks (background.rs) mirror gauge-market's tick stream into an in-memory tape
// cache and relay gauge-carder's card lifecycle Pub/Sub announcements into this
// process's local SSE broadcast channel. Every route but /tape requires a bearer
// token (auth.rs) — service-level auth only, not real per-user identity, which
// is still an undecided architecture question.

mod auth;
mod background;
mod routes;
mod state;
#[cfg(test)]
mod test_support;

use gauge_carder::persistence::RedisStore;
use state::AppState;

#[tokio::main]
async fn main() {
    let redis_url =
        std::env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1:6379".to_string());
    let exec_url =
        std::env::var("GAUGE_EXEC_URL").unwrap_or_else(|_| "http://127.0.0.1:8082".to_string());
    let bind_addr =
        std::env::var("GAUGE_API_ADDR").unwrap_or_else(|_| "127.0.0.1:8080".to_string());
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

    let state = AppState::new(persistence, exec_url, api_token);

    tokio::spawn(background::run_tape_consumer(redis_url.clone(), state.tape.clone()));
    tokio::spawn(background::run_card_event_relay(
        redis_url,
        state.card_events.clone(),
    ));

    let app = routes::router(state);

    let listener = tokio::net::TcpListener::bind(&bind_addr)
        .await
        .unwrap_or_else(|e| panic!("gauge-api: failed to bind {bind_addr}: {e}"));
    println!("gauge-api listening on {bind_addr}");
    axum::serve(listener, app)
        .await
        .unwrap_or_else(|e| panic!("gauge-api: server error: {e}"));
}
