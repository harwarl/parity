use crate::tick::{BasisTick, CheapSide, Session};
use crate::user::UserMode;

#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum CardState {
    Open,
    Confirmed,
    Rejected,
    Expired,
    StaleOnConfirm,
    /// Confirmed inside the TTL, but the re-quote failed a gate (net under
    /// the floor, stale, closed, thin) or there was no fresh quote. Nothing
    /// is filled or placed.
    RequoteFail,
}

/// Prices and gate inputs at one moment: when the card opened, and again
/// at the confirm re-quote. What the card screen and History show.
#[derive(Debug, Clone, Copy, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct QuoteSnapshot {
    pub share_mid: f64,
    pub token_per_share: f64,
    pub basis_bps: f64,
    pub fee_bps: f64,
    pub slip_bps: f64,
    /// The user's buffer, not the market default.
    pub buffer_bps: f64,
    /// Net under the user's rules.
    pub net_bps: f64,
    pub quote_age_ms: u64,
    pub depth_usd: f64,
    pub session: Session,
    pub at_ms: u64,
}

impl QuoteSnapshot {
    pub fn from_tick(tick: &BasisTick, buffer_bps: f64, net_bps: f64, at_ms: u64) -> Self {
        Self {
            share_mid: tick.share_mid,
            token_per_share: tick.token_per_share,
            basis_bps: tick.basis_bps,
            fee_bps: tick.fee_bps,
            slip_bps: tick.slip_bps,
            buffer_bps,
            net_bps,
            quote_age_ms: tick.quote_age_ms,
            depth_usd: tick.depth_usd,
            session: tick.session,
            at_ms,
        }
    }
}

/// A per-user card opened by `mod carder` off a tick that passed the user's
/// gates. `card_id` is the idempotency key across open/confirm/skip.
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
    /// Fixed at `CARD_TTL_MS`.
    pub ttl_ms: u64,
    /// The user's mode when the card opened.
    #[serde(default)]
    pub mode: Option<UserMode>,
    /// Snapshot the card was opened against. `None` on older records.
    #[serde(default)]
    pub quote: Option<QuoteSnapshot>,
    /// The confirm re-quote, pass or fail. `None` until confirmed.
    #[serde(default)]
    pub requote: Option<QuoteSnapshot>,
}

impl Card {
    pub fn expires_at_ms(&self) -> u64 {
        self.opened_at_ms + self.ttl_ms
    }
}
