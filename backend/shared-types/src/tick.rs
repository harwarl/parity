use crate::decision::Decision;

#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum Session {
    Rth,
    Ext,
    Overnight,
    Weekend,
}

/// Which leg is the discounted one. `Neither` is the engine's `none`.
#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum CheapSide {
    Equity,
    Token,
    Neither,
}

/// The output of `engine::evaluate()` for one symbol, one poll. Published
/// by `mod market` onto the `BasisTick` bus.
///
/// Carries the haircut broken out and the feed/depth inputs, not just the
/// net result, so the user plane can re-run the gates with each user's own
/// rules (`carder::gates`) and the frontend can show fees · slip · buffer,
/// depth and quote age. Those fields default on ticks published before
/// they existed.
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct BasisTick {
    pub symbol: String,
    pub share_mid: f64,
    pub token_per_share: f64,
    pub basis_bps: f64,
    /// Net under the market-default buffer; the public tape's number.
    pub net_bps: f64,
    pub cheap_side: CheapSide,
    pub session: Session,
    /// Largest clip `mod carder` may size a card at for this tick.
    pub clip_max: f64,
    /// Market-default decision (public tape). Users' own decisions come
    /// from `carder::gates`, except `Halt`, which always wins.
    pub decision: Decision,
    pub ts_ms: u64,
    #[serde(default)]
    pub fee_bps: f64,
    #[serde(default)]
    pub slip_bps: f64,
    /// The market-default buffer that `net_bps` was computed with.
    #[serde(default)]
    pub buffer_bps: f64,
    /// Top-of-book size in USD.
    #[serde(default)]
    pub depth_usd: f64,
    /// Age of the older leg at `ts_ms`.
    #[serde(default)]
    pub quote_age_ms: u64,
}

impl BasisTick {
    /// Net after fees, slippage and the given buffer.
    pub fn net_with_buffer(&self, buffer_bps: f64) -> f64 {
        self.basis_bps.abs() - self.fee_bps - self.slip_bps - buffer_bps
    }
}
