// The only service the frontend talks to: /tape, /cards, /cards/:id/confirm,
// /cards/:id/skip, /log, and the You tab settings. Hands off to gauge-exec on
// confirm; never holds or sees MCP credentials.

fn main() {
    println!("gauge-api");
}
