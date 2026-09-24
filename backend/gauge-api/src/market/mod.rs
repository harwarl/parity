//! Ingest side: RHJ/Chainlink/depth clients, the halt state machine, and the
//! Redis Streams tick publisher (ARCHITECTURE.md §2.2). Formerly the
//! standalone gauge-market crate — folded in here so the whole non-exec
//! backend is one deployable (gauge-exec stays separate: it's the one
//! service that will hold real MCP credentials).
//!
//! Still missing, same gap as before the merge: the actual poll loop tying
//! feeds -> gauge-engine -> halt controller -> publish together. Nothing
//! here calls `TickPublisher::publish` yet — see main.rs's startup check.

pub mod clock;
pub mod feeds;
pub mod halt;
pub mod publish;
pub mod registry;
