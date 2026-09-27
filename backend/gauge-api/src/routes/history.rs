use std::collections::HashMap;

use axum::Json;
use axum::extract::{Query, State};
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};
use shared_types::{Card, CardState, QuoteSnapshot, UserMode};

use crate::carder::paper_ledger::Fill;
use crate::routes::cards::CardsQuery;
use crate::state::{AppState, now_ms};

/// History's outcome column (design.md §5B.1 outcome pills).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Outcome {
    Active,
    Taken,
    Skipped,
    Expired,
    RequoteFail,
    /// Confirmed after the TTL. The UI shows it with EXPIRED.
    StaleOnConfirm,
}

/// One ledger row: every card, whatever happened to it, joined with its
/// paper fill when there is one.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct HistoryRow {
    pub card_id: String,
    pub symbol: String,
    pub mode: Option<UserMode>,
    pub outcome: Outcome,
    pub opened_at_ms: u64,
    pub expires_at_ms: u64,
    pub net_at_card_bps: f64,
    /// The re-quote's net, for taken and re-quote-fail cards.
    pub net_at_confirm_bps: Option<f64>,
    pub quote: Option<QuoteSnapshot>,
    pub requote: Option<QuoteSnapshot>,
    /// Paper fills only.
    pub fill_price: Option<f64>,
    pub notional_usd: Option<f64>,
}

/// Pure join, newest first, with the active card pinned to the top.
/// An `Open` card past its TTL that the sweep hasn't reached yet reads as
/// expired, not active.
pub fn build_history(cards: Vec<Card>, fills: Vec<Fill>, now_ms: u64) -> Vec<HistoryRow> {
    let fills: HashMap<String, Fill> = fills.into_iter().map(|f| (f.card_id.clone(), f)).collect();
    let mut rows: Vec<HistoryRow> = cards
        .into_iter()
        .map(|card| {
            let outcome = match card.state {
                CardState::Open if now_ms <= card.expires_at_ms() => Outcome::Active,
                CardState::Open | CardState::Expired => Outcome::Expired,
                CardState::Confirmed => Outcome::Taken,
                CardState::Rejected => Outcome::Skipped,
                CardState::RequoteFail => Outcome::RequoteFail,
                CardState::StaleOnConfirm => Outcome::StaleOnConfirm,
            };
            let fill = fills.get(&card.card_id);
            let net_at_confirm_bps = fill
                .filter(|f| f.net_at_card_bps != 0.0 || f.net_at_confirm_bps != 0.0)
                .map(|f| f.net_at_confirm_bps)
                .or_else(|| card.requote.map(|q| q.net_bps))
                .filter(|_| matches!(outcome, Outcome::Taken | Outcome::RequoteFail));
            HistoryRow {
                expires_at_ms: card.expires_at_ms(),
                card_id: card.card_id,
                symbol: card.symbol,
                mode: card.mode,
                outcome,
                opened_at_ms: card.opened_at_ms,
                net_at_card_bps: card.net_bps,
                net_at_confirm_bps,
                quote: card.quote,
                requote: card.requote,
                fill_price: fill.map(|f| f.fill_price),
                notional_usd: fill.map(|f| f.notional_usd).filter(|n| *n > 0.0),
            }
        })
        .collect();
    rows.sort_by(|a, b| {
        (b.outcome == Outcome::Active)
            .cmp(&(a.outcome == Outcome::Active))
            .then(b.opened_at_ms.cmp(&a.opened_at_ms))
    });
    rows
}

/// Same O(n) scan caveat as `GET /cards` (TODO.md).
pub async fn get_history(
    State(mut state): State<AppState>,
    Query(query): Query<CardsQuery>,
) -> Result<Json<Vec<HistoryRow>>, StatusCode> {
    let err = |_| StatusCode::INTERNAL_SERVER_ERROR;
    let cards = state.persistence.load_all_cards().await.map_err(err)?;
    let fills = state.persistence.load_all_fills().await.map_err(err)?;
    let cards = cards.into_iter().filter(|c| c.user_id == query.user_id).collect();
    let fills = fills.into_iter().filter(|f| f.user_id == query.user_id).collect();
    Ok(Json(build_history(cards, fills, now_ms())))
}

#[cfg(test)]
mod tests {
    use super::*;
    use shared_types::CheapSide;

    fn card(id: &str, state: CardState, opened_at_ms: u64) -> Card {
        Card {
            card_id: id.into(),
            user_id: "u".into(),
            symbol: "NVDA".into(),
            clip_usd: 50.0,
            cheap_side: CheapSide::Equity,
            basis_bps: 17.0,
            net_bps: 9.4,
            state,
            opened_at_ms,
            ttl_ms: 75_000,
            mode: Some(UserMode::Paper),
            quote: None,
            requote: None,
        }
    }

    #[test]
    fn outcomes_map_and_the_active_card_is_pinned_first() {
        let now = 1_000_000;
        let rows = build_history(
            vec![
                card("old-taken", CardState::Confirmed, 10),
                card("active", CardState::Open, now - 5_000),
                card("skipped", CardState::Rejected, 500_000),
                card("unswept", CardState::Open, 20),
            ],
            vec![Fill {
                card_id: "old-taken".into(),
                user_id: "u".into(),
                symbol: "NVDA".into(),
                cheap_side: CheapSide::Equity,
                clip_usd: 50.0,
                fill_price: 182.41,
                filled_at_ms: 40,
                net_at_card_bps: 9.4,
                net_at_confirm_bps: 8.9,
                notional_usd: 100_000.0,
            }],
            now,
        );
        let ids: Vec<_> = rows.iter().map(|r| (r.card_id.as_str(), r.outcome)).collect();
        assert_eq!(
            ids,
            [
                ("active", Outcome::Active),
                ("skipped", Outcome::Skipped),
                ("unswept", Outcome::Expired),
                ("old-taken", Outcome::Taken),
            ]
        );
        let taken = &rows[3];
        assert_eq!(taken.net_at_confirm_bps, Some(8.9));
        assert_eq!(taken.fill_price, Some(182.41));
        assert_eq!(taken.notional_usd, Some(100_000.0));
        assert_eq!(rows[1].net_at_confirm_bps, None, "a skipped card never re-quoted");
    }
}
