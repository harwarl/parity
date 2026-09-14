#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum OrderSide {
    Buy,
    Sell,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ReviewResult {
    pub review_id: String,
}

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub struct PlaceResult {
    /// This service executes, it doesn't own the record — the caller is
    /// responsible for persisting this against the card/Log.
    pub broker_order_id: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum McpError {
    /// MCP 401 — this user's connection needs reauth.
    Unauthorized,
    /// Robinhood 429 — back off globally.
    RateLimited,
    Other(String),
}

/// The boundary gauge-exec calls through to execute — not a concrete
/// Robinhood client. There is no implementation of this trait in the crate
/// yet: the real Agentic Trading MCP wire protocol (auth, request/response
/// shape for `review_equity_order`/`place_equity_order`) isn't something I
/// have a verified spec for, and this is the highest-scrutiny, real-money
/// part of the system — guessing at that protocol isn't a safe thing to
/// scaffold. Wire a real impl once you have the actual MCP details.
pub trait TradingMcpClient {
    async fn review_equity_order(
        &self,
        user_id: &str,
        symbol: &str,
        side: OrderSide,
        clip_usd: f64,
    ) -> Result<ReviewResult, McpError>;

    async fn place_equity_order(&self, review_id: &str) -> Result<PlaceResult, McpError>;
}

/// Always fails — stands in for "no real MCP client wired yet" so the HTTP
/// server (mod server) is honestly reachable and its gating logic runnable
/// end-to-end, without pretending a trade actually executed. Replace with a
/// real client once the Agentic Trading MCP protocol is in hand.
#[derive(Debug, Clone, Copy, Default)]
pub struct NotImplementedClient;

impl TradingMcpClient for NotImplementedClient {
    async fn review_equity_order(
        &self,
        _user_id: &str,
        _symbol: &str,
        _side: OrderSide,
        _clip_usd: f64,
    ) -> Result<ReviewResult, McpError> {
        Err(McpError::Other(
            "no TradingMcpClient implementation wired yet".to_string(),
        ))
    }

    async fn place_equity_order(&self, _review_id: &str) -> Result<PlaceResult, McpError> {
        Err(McpError::Other(
            "no TradingMcpClient implementation wired yet".to_string(),
        ))
    }
}
