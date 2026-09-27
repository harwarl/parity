use crate::decision::SkipCode;
use crate::decision::Decision;
use crate::tick::BasisTick;

/// "No card, and here's the one word why" for a name, pushed on the SSE
/// stream alongside card events (docs: Reason codes → Reason event). One
/// per name per state change, market-level: it reports the tape's default
/// decision, not any one user's gates.
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct ReasonEvent {
    pub symbol: String,
    pub code: SkipCode,
    /// feed · session · depth · net
    pub gate: String,
    pub basis_bps: f64,
    pub net_bps: f64,
    pub depth_usd: f64,
    pub quote_age_ms: u64,
    pub at_ms: u64,
}

impl ReasonEvent {
    /// `Some` only for a tick whose market decision is a skip.
    pub fn from_tick(tick: &BasisTick) -> Option<Self> {
        let Decision::Skip(code) = tick.decision else {
            return None;
        };
        Some(Self {
            symbol: tick.symbol.clone(),
            code,
            gate: code.gate().to_string(),
            basis_bps: tick.basis_bps,
            net_bps: tick.net_bps,
            depth_usd: tick.depth_usd,
            quote_age_ms: tick.quote_age_ms,
            at_ms: tick.ts_ms,
        })
    }
}
