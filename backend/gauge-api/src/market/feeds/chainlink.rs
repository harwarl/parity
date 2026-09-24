use crate::clock::now_ms;
use shared_types::ChainlinkQuote;

/// Assumed response shape for `GET {base_url}/chainlink/{symbol}` — this
/// implies an indexer/RPC-proxy sitting in front of the actual on-chain
/// Chainlink feed and `uiMultiplier()` call, not a direct RPC client. Swap
/// this out for a real RPC client (e.g. alloy) if that's not how you're
/// reading the chain. `ui_multiplier` is the raw on-chain value, still
/// needing `/ 1e18` — gauge-engine does that division, not this client.
#[derive(serde::Deserialize)]
struct ChainlinkResponse {
    token_price: f64,
    ui_multiplier: f64,
    oracle_paused: bool,
}

pub struct ChainlinkClient {
    http: reqwest::Client,
    base_url: String,
}

impl ChainlinkClient {
    pub fn new(base_url: impl Into<String>) -> Self {
        Self {
            http: reqwest::Client::new(),
            base_url: base_url.into(),
        }
    }

    pub async fn fetch_quote(&self, symbol: &str) -> reqwest::Result<ChainlinkQuote> {
        let url = format!("{}/chainlink/{symbol}", self.base_url);
        let body: ChainlinkResponse = self
            .http
            .get(url)
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;

        Ok(ChainlinkQuote {
            symbol: symbol.to_string(),
            token_price: body.token_price,
            ui_multiplier: body.ui_multiplier,
            oracle_paused: body.oracle_paused,
            updated_at_ms: now_ms(),
        })
    }
}
