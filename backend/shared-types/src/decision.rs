/// No card, but still visible on the public tape, tagged with the code.
#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum SkipCode {
    Stale,
    Closed,
    Thin,
    Dust,
}

/// Suppresses the tick from the bus entirely until resume conditions are met.
#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum HaltReason {
    MultiplierJump,
    OraclePaused,
    FeedStale,
    ZeroDepth,
}

/// What `gauge-engine::decide()` hands back for a tick — no downstream
/// service re-derives card-worthiness from raw numbers.
#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum Decision {
    CardEligible,
    Skip(SkipCode),
    Halt(HaltReason),
}
