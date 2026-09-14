// The only service allowed to touch execution credentials or call the Robinhood
// Trading MCP (review_equity_order / place_equity_order). Re-quotes on every
// confirm, refuses to execute outside rth, and should deploy separately from
// everything else in this workspace.

fn main() {
    println!("gauge-exec");
}
