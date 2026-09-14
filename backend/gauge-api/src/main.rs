// HTTP surface for the Next.js app: GET /tape (public), GET /cards, POST
// /cards/:id/confirm, POST /cards/:id/skip, GET /log, and the You tab settings.
// gauge-api is the only service the frontend talks to. On confirm it hands off
// internally to gauge-exec and relays status back — it never holds or sees MCP
// credentials itself.
//
// Routes are real and tested (see routes/cards.rs, routes/settings.rs) against
// an in-memory AppState (state.rs). That in-memory store is a stand-in for real
// cross-service state: gauge-api doesn't yet subscribe to gauge-market's tape,
// and card/settings state isn't shared with a real gauge-carder process — both
// need a persistence/RPC decision that hasn't been made. The confirm handler's
// call to gauge-exec (GAUGE_EXEC_URL, default matches gauge-exec's own default
// bind address) now reaches a real POST /execute — gauge-exec's HTTP server is
// implemented — but gauge-exec still runs with NotImplementedClient (no real
// MCP), so a live confirm will pass every gate and then fail honestly at the
// MCP step, not silently pretend to succeed.

mod routes;
mod state;

use state::AppState;

#[tokio::main]
async fn main() {
    let exec_url =
        std::env::var("GAUGE_EXEC_URL").unwrap_or_else(|_| "http://127.0.0.1:8082".to_string());
    let bind_addr =
        std::env::var("GAUGE_API_ADDR").unwrap_or_else(|_| "127.0.0.1:8080".to_string());

    let app = routes::router(AppState::new(exec_url));

    let listener = tokio::net::TcpListener::bind(&bind_addr)
        .await
        .unwrap_or_else(|e| panic!("gauge-api: failed to bind {bind_addr}: {e}"));
    println!("gauge-api listening on {bind_addr}");
    axum::serve(listener, app)
        .await
        .unwrap_or_else(|e| panic!("gauge-api: server error: {e}"));
}
