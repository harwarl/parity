// Subscribes to the BasisTick bus, maintains the symbol -> users inverted index,
// applies per-user policy (clip, caps, session, mutes), and owns the card lifecycle
// and the paper ledger.
//
// The inverted index (mod index), per-user policy sizing (mod policy), card
// lifecycle/TTL store (mod card_store), and paper ledger (mod paper_ledger) are
// implemented and tested. Not wired up yet: actually subscribing to gauge-market's
// Redis Streams (consumer side of the same "gauge:ticks" stream gauge-market
// publishes to), and any persistence — both still in-memory / not yet chosen.

mod card_store;
mod index;
mod paper_ledger;
mod policy;

fn main() {
    println!("gauge-carder");
}
