//! Pure gauge maths, no I/O — takes RhjQuote/ChainlinkQuote/DepthSnapshot/Session/HaircutParams,
//! returns a BasisTick and a Decision (CardEligible / Skip / Halt). Formerly the standalone
//! gauge-engine crate — folded in here so the whole non-exec backend is one deployable
//! (see §1/§5 of ARCHITECTURE.md for why gauge-exec alone stays separate). Called by
//! `mod market`'s ingest loop, once that loop exists (still not built — see market/mod.rs).
//!
//! Kept deliberately pure even after the merge: no clock, no retries, no persistence, no
//! knowledge of users. If a change needs any of those, it belongs in `mod market` or
//! `mod carder`, not here — that boundary is still worth enforcing even as a plain Rust
//! module instead of a separate crate.

mod evaluate;

pub use evaluate::evaluate;
