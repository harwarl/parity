/// The Redis Pub/Sub channel card lifecycle changes are announced on.
/// Whoever mutates a `Card` (gauge-carder opening/expiring one, gauge-api
/// confirming/rejecting one) publishes here; gauge-api's SSE relay is the
/// only subscriber today, forwarding into its per-connection broadcast
/// channel. Pub/Sub, not Streams: this is a "tell whoever's listening right
/// now" signal, not a durable log — a missed event is caught up by the
/// client's next GET /cards, same as gauge-notif's design.
pub const CARD_EVENTS_CHANNEL: &str = "gauge:card_events";

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct CardEvent {
    pub card_id: String,
    pub user_id: String,
    pub kind: CardEventKind,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum CardEventKind {
    Opened,
    Confirmed,
    Rejected,
    Expired,
    StaleOnConfirm,
}
