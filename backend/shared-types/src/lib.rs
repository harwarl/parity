//! Types shared across every gauge-* crate, so `BasisTick`/`Decision`/`Card`
//! definitions can't drift between the market plane and the user plane.

mod card;
mod card_event;
mod decision;
mod quotes;
mod reason_event;
mod tick;
mod user;

pub use card::{Card, CardState, QuoteSnapshot};
pub use card_event::{CardEvent, CardEventKind, CARD_EVENTS_CHANNEL};
pub use decision::{Decision, HaltReason, SkipCode};
pub use quotes::{ChainlinkQuote, DepthSnapshot, HaircutParams, RhjQuote};
pub use reason_event::ReasonEvent;
pub use tick::{BasisTick, CheapSide, Session};
pub use user::{CARD_TTL_MS, GateRules, MAX_DAILY_CARDS, NotifyPrefs, User, UserMode};

/// The Redis Streams key gauge-market publishes BasisTicks to and
/// gauge-carder consumes from. Lives here, not duplicated as a local const
/// in each crate, so the producer and consumer can't silently drift apart
/// on the topic name.
pub const TICK_STREAM_KEY: &str = "gauge:ticks";
