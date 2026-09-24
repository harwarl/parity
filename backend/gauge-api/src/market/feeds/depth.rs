use crate::market::clock::now_ms;
use shared_types::DepthSnapshot;

/// Assumed response shape for `GET {base_url}/depth/{symbol}` — placeholder,
/// matches `DepthSnapshot`'s $20/$50/$100 buckets.
#[derive(serde::Deserialize)]
struct DepthResponse {
    at_20: f64,
    at_50: f64,
    at_100: f64,
}

pub struct DepthClient {
    http: reqwest::Client,
    base_url: String,
}

impl DepthClient {
    pub fn new(base_url: impl Into<String>) -> Self {
        Self {
            http: reqwest::Client::new(),
            base_url: base_url.into(),
        }
    }

    pub async fn fetch_depth(&self, symbol: &str) -> reqwest::Result<DepthSnapshot> {
        let url = format!("{}/depth/{symbol}", self.base_url);
        let body: DepthResponse = self
            .http
            .get(url)
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;

        Ok(DepthSnapshot {
            at_20: body.at_20,
            at_50: body.at_50,
            at_100: body.at_100,
            updated_at_ms: now_ms(),
        })
    }
}
