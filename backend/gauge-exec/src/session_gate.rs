use shared_types::Session;

/// gauge-exec refuses to execute outside rth, full stop — ext/overnight/
/// weekend cards are paper/watch only, no matter how the re-quote comes out.
pub fn allows_live_execution(session: Session) -> bool {
    session == Session::Rth
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn only_rth_allows_live_execution() {
        assert!(allows_live_execution(Session::Rth));
        assert!(!allows_live_execution(Session::Ext));
        assert!(!allows_live_execution(Session::Overnight));
        assert!(!allows_live_execution(Session::Weekend));
    }
}
