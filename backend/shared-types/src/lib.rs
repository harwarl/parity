//! Types shared across every gauge-* crate, so `BasisTick`/`Decision`/`Card`
//! definitions can't drift between the market plane and the user plane.

mod card;
mod decision;
mod quotes;
mod tick;
mod user;

pub use card::{Card, CardState};
pub use decision::{Decision, HaltReason, SkipCode};
pub use quotes::{ChainlinkQuote, DepthSnapshot, HaircutParams, RhjQuote};
pub use tick::{BasisTick, CheapSide, Session};
pub use user::{User, UserMode};

/// The Redis Streams key gauge-market publishes BasisTicks to and
/// gauge-carder consumes from. Lives here, not duplicated as a local const
/// in each crate, so the producer and consumer can't silently drift apart
/// on the topic name.
pub const TICK_STREAM_KEY: &str = "gauge:ticks";
