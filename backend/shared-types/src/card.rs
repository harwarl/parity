use crate::tick::CheapSide;

#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum CardState {
    Open,
    Confirmed,
    Rejected,
    Expired,
    StaleOnConfirm,
}

/// A per-user card opened by `gauge-carder` off a `CardEligible` tick.
/// `card_id` is the idempotency key across open/confirm/skip.
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Card {
    pub card_id: String,
    pub user_id: String,
    pub symbol: String,
    pub clip_usd: f64,
    pub cheap_side: CheapSide,
    pub basis_bps: f64,
    pub net_bps: f64,
    pub state: CardState,
    pub opened_at_ms: u64,
    /// ~75s starting point, per ARCHITECTURE.md open decisions.
    pub ttl_ms: u64,
}
