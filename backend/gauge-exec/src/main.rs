// The only service allowed to touch execution credentials or call the Robinhood
// Trading MCP (review_equity_order / place_equity_order). Re-quotes on every
// confirm, refuses to execute outside rth, and should deploy separately from
// everything else in this workspace.
//
// Implemented and tested: the rth session gate (mod session_gate), the mandatory
// re-quote check (mod requote), the 401/429 live-trading gate (mod live_gate), a
// zeroizing credential wrapper (mod credential), and the confirm_and_execute
// orchestration (mod execute) against a TradingMcpClient trait (mod mcp).
//
// Deliberately NOT implemented: any concrete TradingMcpClient. The real Agentic
// Trading MCP wire protocol isn't something this has a verified spec for, and
// this is the highest-scrutiny, real-money part of the system — fabricating
// that integration isn't safe scaffolding. Wire a real client once you have the
// actual MCP details, then call confirm_and_execute with it.

mod credential;
mod execute;
mod live_gate;
mod mcp;
mod requote;
mod session_gate;

fn main() {
    println!("gauge-exec");
}
