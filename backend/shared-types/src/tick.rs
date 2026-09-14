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

/// The output of `gauge-engine::measure()` + `decide()` for one symbol, one
/// poll. Published by `gauge-market` onto the `BasisTick` bus.
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct BasisTick {
    pub symbol: String,
    pub share_mid: f64,
    pub token_per_share: f64,
    pub basis_bps: f64,
    pub net_bps: f64,
    pub cheap_side: CheapSide,
    pub session: Session,
    /// Largest clip `gauge-carder` may size a card at for this tick.
    pub clip_max: f64,
    pub decision: Decision,
    pub ts_ms: u64,
}
