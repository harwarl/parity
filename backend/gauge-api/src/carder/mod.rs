//! User-plane fan-out: the subscriber index, per-user policy, card
//! lifecycle/TTL store, paper ledger, Redis persistence, and the tick
//! consumer (ARCHITECTURE.md §2.3). Formerly the standalone gauge-carder
//! crate — folded in here so the whole non-exec backend is one deployable.
//! `runner` is the background loop (moved from gauge-carder's old main.rs)
//! that main.rs spawns; everything else is the same pure/tested logic as
//! before the merge, just at `crate::carder::*` instead of `gauge_carder::*`.

pub mod card_store;
pub mod index;
pub mod paper_ledger;
pub mod persistence;
pub mod policy;
pub mod runner;
pub mod tick_consumer;
