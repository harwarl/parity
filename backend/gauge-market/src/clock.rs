/// gauge-market owns the clock (per ARCHITECTURE.md §5) — it's the only
/// place a wall-clock timestamp gets stamped onto data. gauge-engine never
/// calls this; it only ever compares timestamps it's handed.
pub fn now_ms() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .expect("system clock is before the Unix epoch")
        .as_millis() as u64
}
