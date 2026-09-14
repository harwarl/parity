// Ingests RHJ, Chainlink, depth, and the corporate-actions calendar; calls gauge-engine
// per tick; runs the halt controller; publishes BasisTicks to Redis Streams and serves
// the public tape.
//
// The halt state machine (mod halt/registry), the Redis Streams publisher (mod publish),
// and the RHJ/Chainlink/depth HTTP clients (mod feeds) are implemented and tested/wired
// individually. Not done yet: the corporate-actions calendar, the live symbol universe,
// and the actual poll loop that ties feeds -> gauge-engine -> halt controller -> publish
// together — that needs the universe decision from ARCHITECTURE.md §7 first.

mod clock;
mod feeds;
mod halt;
mod publish;
mod registry;

use publish::TickPublisher;

#[tokio::main]
async fn main() {
    let redis_url =
        std::env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1:6379".to_string());

    match TickPublisher::connect(&redis_url).await {
        Ok(_publisher) => println!("gauge-market: connected to Redis at {redis_url}"),
        Err(e) => eprintln!("gauge-market: failed to connect to Redis at {redis_url}: {e}"),
    }
}
