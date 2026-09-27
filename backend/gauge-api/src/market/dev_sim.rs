//! Dev-only price simulator (`GAUGE_DEV_SIM=1`). The real poll loop
//! (feeds → engine → halt controller → publish) doesn't exist yet
//! (TODO.md), so without this nothing ever reaches the tick bus and the
//! frontend has nothing to show. This synthesises RHJ/Chainlink/depth
//! quotes for design.md's sample watchlist, runs them through the real
//! `engine::evaluate`, and publishes the real `BasisTick`s — so everything
//! downstream (tape, carder, gates, cards, confirm, SSE) is the production
//! path. Never enabled unless the env var is set.
//!
//! The session is always reported as RTH so cards flow at any hour; the
//! CLOSED path is covered by tests, not by this.

use std::time::Duration;

use shared_types::{ChainlinkQuote, DepthSnapshot, HaircutParams, RhjQuote, Session};

use crate::engine;
use crate::market::clock::now_ms;
use crate::market::publish::TickPublisher;

/// design.md §5B.3: sym, cash, token/share, slippage bps, depth $k, age s.
const NAMES: &[(&str, f64, f64, f64, f64, f64)] = &[
    ("NVDA", 182.40, 182.71, 2.1, 420.0, 0.3),
    ("HOOD", 118.40, 118.93, 3.0, 45.0, 0.4),
    ("PLTR", 178.20, 178.49, 2.9, 60.0, 0.4),
    ("COIN", 318.20, 317.84, 2.4, 260.0, 3.8),
    ("META", 742.10, 742.75, 2.1, 510.0, 0.3),
    ("AMD", 162.40, 162.52, 2.2, 380.0, 0.5),
    ("TSLA", 428.90, 428.63, 2.3, 640.0, 0.2),
    ("GOOGL", 246.12, 246.19, 1.9, 450.0, 0.3),
    ("AAPL", 231.55, 231.64, 1.8, 720.0, 0.2),
    ("MSFT", 512.30, 512.41, 1.8, 560.0, 0.3),
    ("AMZN", 224.80, 224.76, 1.9, 480.0, 0.3),
];

/// xorshift — no rand dependency for a dev tool.
struct Rng(u64);
impl Rng {
    /// Uniform in [-0.5, 0.5).
    fn next(&mut self) -> f64 {
        self.0 ^= self.0 << 13;
        self.0 ^= self.0 >> 7;
        self.0 ^= self.0 << 17;
        (self.0 >> 11) as f64 / (1u64 << 53) as f64 - 0.5
    }
}

pub fn enabled() -> bool {
    std::env::var("GAUGE_DEV_SIM").is_ok_and(|v| v == "1" || v == "true")
}

/// Publishes one tick per name every `interval`, forever.
pub async fn run(redis_url: String, interval: Duration) {
    let mut publisher = match TickPublisher::connect(&redis_url).await {
        Ok(p) => p,
        Err(e) => {
            eprintln!("gauge-api/dev_sim: can't connect to Redis at {redis_url}: {e}");
            return;
        }
    };
    println!("gauge-api/dev_sim: publishing simulated ticks for {} names (GAUGE_DEV_SIM)", NAMES.len());
    let mut rng = Rng(now_ms() | 1);
    // Per name: level drift (both legs) and spread drift (token only), in $.
    let mut drift = vec![(0.0_f64, 0.0_f64); NAMES.len()];
    let mut prev: Vec<Option<ChainlinkQuote>> = vec![None; NAMES.len()];

    loop {
        let now = now_ms();
        for (i, &(sym, cash, token, slip, depth_k, age_s)) in NAMES.iter().enumerate() {
            let (lvl, off) = &mut drift[i];
            *lvl = *lvl * 0.85 + rng.next() * cash * 0.0003;
            *off = *off * 0.7 + rng.next() * cash * 0.00012;
            let mid = cash + *lvl;
            let rhj = RhjQuote { symbol: sym.into(), bid: mid, ask: mid, updated_at_ms: now };
            let chainlink = ChainlinkQuote {
                symbol: sym.into(),
                token_price: token + *lvl + *off,
                ui_multiplier: 1e18,
                oracle_paused: false,
                updated_at_ms: now.saturating_sub((age_s * 1000.0 + rng.next() * 100.0) as u64),
            };
            let depth = DepthSnapshot {
                at_20: 500.0,
                at_50: 500.0,
                at_100: 500.0,
                updated_at_ms: now,
                top_of_book_usd: depth_k * 1000.0 * (1.0 + rng.next() * 0.08),
            };
            let haircut = HaircutParams {
                fee_bps: 3.5,
                buffer_bps: 2.0,
                slip_bps_at_20: slip,
                slip_bps_at_50: slip,
                slip_bps_at_100: slip,
                floor_bps: 2.0,
            };
            let tick = engine::evaluate(&rhj, &chainlink, prev[i].as_ref(), &depth, Session::Rth, &haircut, 50.0, now);
            prev[i] = Some(chainlink);
            if let Err(e) = publisher.publish(&tick).await {
                eprintln!("gauge-api/dev_sim: publish failed for {sym}: {e}");
            }
        }
        tokio::time::sleep(interval).await;
    }
}
