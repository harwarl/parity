use std::collections::HashSet;

/// The fourth card never exists (design.md §5.8): the daily cap is a gate,
/// not a preference, so settings are clamped to 1..=MAX_DAILY_CARDS.
pub const MAX_DAILY_CARDS: u32 = 3;

/// Fixed card lifetime. Read-only in the frontend's Settings.
pub const CARD_TTL_MS: u64 = 75_000;

#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum UserMode {
    /// Tape + alerts, no Robinhood connect, no cards.
    Watcher,
    /// Cards open, fills recorded against confirm-tick mid, no real orders.
    Paper,
    Live,
}

/// The user's own gates (frontend Settings → Gates). The market plane
/// publishes measurements plus a market-default decision for the public
/// tape; `carder::gates` re-derives the per-user decision from these, so a
/// user can make them stricter *or* looser than the tape's defaults.
/// Fees are not here: they come from the fee schedule on each tick.
#[derive(Debug, Clone, Copy, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(default)]
pub struct GateRules {
    /// Minimum net bps after fees, slippage and buffer. Below it: DUST.
    pub floor_bps: f64,
    /// Safety margin taken off every gap, in bps.
    pub buffer_bps: f64,
    /// Either leg older than this: STALE.
    pub max_quote_age_ms: u64,
    /// Top-of-book size needed to fill. Below it: THIN.
    pub min_depth_usd: f64,
    /// Turns captured bps into paper P&L.
    pub paper_notional_usd: f64,
}

impl Default for GateRules {
    fn default() -> Self {
        Self {
            floor_bps: 2.0,
            buffer_bps: 2.0,
            max_quote_age_ms: 2_000,
            min_depth_usd: 100_000.0,
            paper_notional_usd: 100_000.0,
        }
    }
}

/// Stored now so Settings round-trips; nothing delivers them yet (`mod notif`
/// doesn't exist — see ARCHITECTURE.md §2.2).
#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
#[serde(default)]
pub struct NotifyPrefs {
    pub push_on_card: bool,
    pub sound_on_card: bool,
    pub daily_summary_email: bool,
    pub stale_feed_alert: bool,
}

impl Default for NotifyPrefs {
    fn default() -> Self {
        Self {
            push_on_card: true,
            sound_on_card: false,
            daily_summary_email: true,
            stale_feed_alert: true,
        }
    }
}

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct User {
    pub user_id: String,
    pub mode: UserMode,
    pub nav_usd: f64,
    pub max_clip_usd: f64,
    /// Fraction of NAV allowed in a single name's clip.
    pub name_pct: f64,
    pub daily_card_cap: u32,
    pub universe: HashSet<String>,
    pub mutes: HashSet<String>,
    pub kill_switch: bool,
    /// Missing on users saved before these existed → defaults.
    #[serde(default)]
    pub rules: GateRules,
    #[serde(default)]
    pub notify: NotifyPrefs,
}

impl User {
    /// The cap actually enforced, whatever was stored.
    pub fn effective_daily_cap(&self) -> u32 {
        self.daily_card_cap.clamp(1, MAX_DAILY_CARDS)
    }

    /// Why these settings can't be saved, if they can't. Checked on PUT.
    pub fn validate(&self) -> Result<(), String> {
        let r = &self.rules;
        let finite_non_neg = |v: f64| v.is_finite() && v >= 0.0;
        if !(1..=MAX_DAILY_CARDS).contains(&self.daily_card_cap) {
            return Err(format!("daily_card_cap must be 1..={MAX_DAILY_CARDS}"));
        }
        if !finite_non_neg(r.floor_bps) {
            return Err("rules.floor_bps must be a number >= 0".into());
        }
        if !finite_non_neg(r.buffer_bps) {
            return Err("rules.buffer_bps must be a number >= 0".into());
        }
        if r.max_quote_age_ms == 0 || r.max_quote_age_ms > 60_000 {
            return Err("rules.max_quote_age_ms must be 1..=60000".into());
        }
        if !finite_non_neg(r.min_depth_usd) {
            return Err("rules.min_depth_usd must be a number >= 0".into());
        }
        if !(r.paper_notional_usd.is_finite() && r.paper_notional_usd > 0.0) {
            return Err("rules.paper_notional_usd must be > 0".into());
        }
        Ok(())
    }
}
