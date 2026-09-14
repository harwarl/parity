// The only service allowed to touch execution credentials or call the Robinhood
// Trading MCP (review_equity_order / place_equity_order). Re-quotes on every
// confirm, refuses to execute outside rth, and should deploy separately from
// everything else in this workspace.
//
// Implemented and tested: the rth session gate (mod session_gate), the mandatory
// re-quote check (mod requote), the 401/429 live-trading gate (mod live_gate), a
// zeroizing credential wrapper (mod credential), the confirm_and_execute
// orchestration (mod execute) against a TradingMcpClient trait (mod mcp), and now
// an HTTP server (mod server) exposing POST /execute — this is what gauge-api's
// confirm handler actually reaches.
//
// Deliberately NOT implemented: any concrete TradingMcpClient. The real Agentic
// Trading MCP wire protocol isn't something this has a verified spec for, and
// this is the highest-scrutiny, real-money part of the system — fabricating
// that integration isn't safe scaffolding. main() runs with NotImplementedClient,
// so every gate (rth, live, re-quote) is real and enforced, but the final MCP
// call always fails with McpOther — honest about what's missing rather than
// pretending a trade executed. Wire a real client once you have the actual MCP
// details, then swap it in here.

mod credential;
mod execute;
mod live_gate;
mod mcp;
mod requote;
mod server;
mod session_gate;

use mcp::NotImplementedClient;
use server::ServerState;

#[tokio::main]
async fn main() {
    let bind_addr =
        std::env::var("GAUGE_EXEC_ADDR").unwrap_or_else(|_| "127.0.0.1:8082".to_string());

    let app = server::router(ServerState::new(NotImplementedClient));

    let listener = tokio::net::TcpListener::bind(&bind_addr)
        .await
        .unwrap_or_else(|e| panic!("gauge-exec: failed to bind {bind_addr}: {e}"));
    println!("gauge-exec listening on {bind_addr}");
    axum::serve(listener, app)
        .await
        .unwrap_or_else(|e| panic!("gauge-exec: server error: {e}"));
}
