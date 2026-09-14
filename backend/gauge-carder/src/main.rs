// Subscribes to the BasisTick bus, maintains the symbol -> users inverted index,
// applies per-user policy (clip, caps, session, mutes), and owns the card lifecycle
// and the paper ledger.
//
// The inverted index, per-user policy sizing, card lifecycle/TTL store, and paper
// ledger live in lib.rs (gauge-api reuses them too) and are implemented and tested.
// Not wired up yet: actually subscribing to gauge-market's Redis Streams (consumer
// side of the "gauge:ticks" stream gauge-market publishes to), and any persistence
// — both still in-memory / not yet chosen.

fn main() {
    println!("gauge-carder");
}
