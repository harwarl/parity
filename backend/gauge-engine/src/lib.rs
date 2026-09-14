//! Pure gauge maths, no I/O — takes RhjQuote/ChainlinkQuote/DepthSnapshot/Session/HaircutParams,
//! returns a BasisTick and a Decision (CardEligible / Skip / Halt). Linked by gauge-market.

mod evaluate;

pub use evaluate::evaluate;
