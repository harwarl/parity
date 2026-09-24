use crate::market::clock::now_ms;
use shared_types::RhjQuote;

/// Assumed response shape for `GET {base_url}/rhj/prices/{symbol}` — not
/// verified against a real Robinhood endpoint, just matches the field names
/// `RhjQuote` needs. Adjust once the real schema is known.
#[derive(serde::Deserialize)]
struct RhjPriceResponse {
    bid: f64,
    ask: f64,
}

pub struct RhjClient {
    http: reqwest::Client,
    base_url: String,
}

impl RhjClient {
    pub fn new(base_url: impl Into<String>) -> Self {
        Self {
            http: reqwest::Client::new(),
            base_url: base_url.into(),
        }
    }

    pub async fn fetch_quote(&self, symbol: &str) -> reqwest::Result<RhjQuote> {
        let url = format!("{}/rhj/prices/{symbol}", self.base_url);
        let body: RhjPriceResponse = self
            .http
            .get(url)
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;

        Ok(RhjQuote {
            symbol: symbol.to_string(),
            bid: body.bid,
            ask: body.ask,
            updated_at_ms: now_ms(),
        })
    }
}
