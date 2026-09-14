use std::collections::HashSet;

#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum UserMode {
    /// Tape + alerts, no Robinhood connect, no cards.
    Watcher,
    /// Cards open, fills recorded against confirm-tick mid, no real orders.
    Paper,
    Live,
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
}
