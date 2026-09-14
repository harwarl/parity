//! Card lifecycle, per-user policy, the subscriber index, and the paper
//! ledger — the user-plane fan-out logic (ARCHITECTURE.md §2.3). Exposed as
//! a library too so gauge-api can reuse the same, already-tested lifecycle
//! rules (TTL, idempotency, dust floor) instead of a second implementation.

pub mod card_store;
pub mod index;
pub mod paper_ledger;
pub mod persistence;
pub mod policy;
pub mod tick_consumer;
