/// Raw underlying bid/ask from Robinhood's own feed. Not multiplier-adjusted.
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct RhjQuote {
    pub symbol: String,
    pub bid: f64,
    pub ask: f64,
    pub updated_at_ms: u64,
}

/// The token's raw price plus `uiMultiplier` (as read from the contract, i.e.
/// still needing `/ 1e18`), and whether the oracle is paused.
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct ChainlinkQuote {
    pub symbol: String,
    pub token_price: f64,
    pub ui_multiplier: f64,
    pub oracle_paused: bool,
    pub updated_at_ms: u64,
}

/// Order-book depth at $20/$50/$100, for sizing slippage.
#[derive(Debug, Clone, Copy, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct DepthSnapshot {
    pub at_20: f64,
    pub at_50: f64,
    pub at_100: f64,
    pub updated_at_ms: u64,
}

/// Fee/buffer/slippage inputs to the haircut. Slippage is quoted at the same
/// clip sizes as `DepthSnapshot` so the engine can interpolate against depth.
#[derive(Debug, Clone, Copy, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct HaircutParams {
    pub fee_bps: f64,
    pub buffer_bps: f64,
    pub slip_bps_at_20: f64,
    pub slip_bps_at_50: f64,
    pub slip_bps_at_100: f64,
}
