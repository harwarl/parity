PARITY — Product Requirements Document
Version: 1.0

Status: Draft for build

Product: PARITY

One-liner: Two prices for the same name. One gap. You tap. PARITY does not place.

1. Summary
   PARITY is a basis tape for Robinhood cash equities vs Robinhood Chain stock tokens. It measures the gap, haircuts fees/slip/session, and emits a confirm-gated card. v1 live path is equity in the Agentic Account via official Trading MCP. Paper is default. We do not hold funds. We do not split tokens (that is PARE). We do not ship a $ token.

2. Problem

#ProblemP1The same name now has two prices (cash vs token). Retail cannot see a trusted net basis.P2/rhj/prices is raw; Chainlink is already × uiMultiplier. Wrong math invents edge.P3Tokens trade 24/7; cash does not. Overnight premium is not a live trade.P4Multiplier jumps (div/split) look like a 10× gap if unhalted.P5People will bind an LLM to MCP and type “buy good stocks.” Unbounded model + funded wallet.

3. Goals / non-goals
   Goals

G1 Shared tape, 10 names at launch (≤50), 1–2s freshness in RTH
G2 Per-user clip, 3 cards/day, 75s TTL, re-quote on confirm
G3 Paper default (≥7 days)
G4 Live equity via official MCP only (review then place)
G5 One-name freeze in seconds
G6 Designed for 30k users (shared market plane)

Non-goals (v1)

Two-leg atomic hedge / US token buys
Per-user always-on LLM that places
Custody, deposits, $PARITY
Unofficial Robinhood HTTP
PARE-style PT/YT split/merge
Portfolio, Discover, Chat, leaderboard

4. Users

PersonaModeJobWatcherNo RH connectSee the tape + alertsPaper userDefaultLearn skip codes; fake fills at confirm midLive userUS + Agentic MCPConfirm a sized equity clip in the agentic wallet
Geo: token venue not assumed for US. v1 live = equity.

5. User stories

As a watcher, I see cash, token-per-share, and net bps per name.
As a user, I only get a card if net bps, session, depth, and clip all pass.
As a user, I can Do it / smaller / Skip; Skip never retries that tick.
As a paper user, a tap writes a fill at confirm mid, not card mid.
As a live user, tap runs review_equity_order then I confirm place_equity_order.
As a live user, an expired or stale card cannot place.
As any user, a multiplier jump freezes that name with HALT.
As an operator, I can halt/resume a symbol with an audit row.

6. Functional requirements
   6.1 Tape — MUST

IDRequirementT1Show all universe names: cash mid, token-per-share, basis_bps, net_bps, session, halt/stale.T2Shared tape (one market plane). Per-user clip/mute, not per-user prices.T3Session ∈ {rth, ext, overnight, weekend} from exchange calendar, not last print.T4Gray/disable live affordance when stale or halted.
6.2 Math — MUST

IDRequirementM1token_per_share = chainlink_usd / (uiMultiplier / 1e18). Multiplier never applied to RHJ.M2basis_bps = (token_per_share − share_mid) / share_mid × 10_000.M3net_bps = |basis| − fee − slip(clip) − buffer. Cards use net.M4Fixtures pass: 1.0×, ~1.008× dividend, 10:1 split (continuity of token-per-share).M5Multiplier jump above threshold or oraclePaused → Halt, not a tick.
6.3 Cards — MUST

IDRequirementC1Emit only if net, session (RTH for live), clip ≥ $15, depth, 3/day, not muted.C2expires_at = now + 75s.C3Confirm re-reads latest tick; collapse/halt → stale_on_confirm.C4Idempotency key = card_id. Double tap no-ops.C5States: open | confirmed | rejected | expired | stale_on_confirm.C6Skip codes: STALE CLOSED THIN DUST (+ halt, muted, cap).C7Push body = card_id only.C8LLM (if any) captions only. Never on place path.
6.4 Execution — MUST

IDRequirementE1Paper: fill at confirm mid; no MCP.E2Live: review*equity_order success then place_equity_order.E3Live only in Agentic Account. Never primary RH account as bot purse.E4No live token buy in v1 for US.E5MCP 401 → live off, paper on. 429 → pause live globally.E6Never retry place*\* without reading broker order state.
6.5 Policy — MUST

IDRequirementU1Universe (default Top 10), max clip $25/$50/$100, name %, min net bps, mutes.U2Mode: Watcher / Paper / Live (Live locked until MCP green).U3Kill switch: freeze live for that user.U4NAV typed at signup; optional MCP refresh ≤ every 2 min on app open.
6.6 Halt — MUST
Operator and automated halt/resume per symbol; carder + exec both subscribe; resume manual or N clean ticks.

7. UX requirements
   App nav: Tape · Cards · Log · You

Tape — home.
Cards — badge only if something is still open.
Log — paper + live broker_order_id (not a brokerage statement).
You — mode, clip, universe, MCP, kill, export.

Card UI (one component, marketing + app): Across-style ticket inside Linear chrome: net bps (large), cash vs token panes, haircut line, clip, Do it Gap fill, $15 / Skip ghost, TTL on the card.
Landing follows PARE section order (hero widget, series-like tape cards, 01–03, timeline, reject tiles, rails). Copy and widget are PARITY, not split/pToken/$.

8. Non-functional

IDRequirementN1Market freshness 1–2s RTH for 10–20 names.N2RHJ vs Chainlink join budget 8–15s else stale.N330k users: inverted symbol → users; no 30k loop on tick.N4MCP tokens vaulted; exec-only decrypt. Market plane has zero user secrets.N5Tick hot store 1–2h; not Postgres. Cards/users in SQL.N6SLO watch: stale_on_confirm rate.

9. Compliance

Signals / software; user self-directed.
Disclose: token ≠ share; basis can persist; overnight ≠ free money; paper ≠ live.
No live APY ads. No token. No “managed PARITY fund.”
Geo: do not offer token buy where RH does not.

10. Success metrics

PhaseMetricTargetTapeNames with non-stale ticks in RTH≥ 8 / 10PaperUsers who tap ≥1 card in week 1> 30% of waitlistQualitystale*on_confirm / confirms< 15% after TTL tuneSafetyHalt fires on fixture split100% in CILiveZero place*\* without review + tap100%
Vanity APY and “AI win rate” are not metrics.

11. Phasing

PhaseScopeExitP0Engine + market + public tape. Split fixtures. No accounts.HOOD/NVDA/AAPL survive a split in fixturesP1Paper accounts, cards, 3/day, skip histogram7-day paper diary, no live keysP2MCP live equity, US waitlist ~1kHalt + stale-on-confirm provenP330k only if N2–N3 hold—

12. Out of scope / explicit nos
    PARE split, $PARE-style burn, Morpho lending as our product, unofficial APIs, memecoins, 95-name universe, extended-hours live, LLM auto-place.
    Optional later (not v1): consume PARE oracle SYNCED as an extra halt bit.

13. Open decisions (block P0 if unset)

Live universe size: 10 (recommended).
Ext hours: paper/alerts only.
TTL: 75s.
NAV: manual first.
Caption: templates until tape is trusted.

14. Acceptance (P0)

Multiplier applied only on chain feed
Public tape shows cash, token-per-share, net bps, session
Halt on multiplier jump in fixtures
No user MCP, no place path, no token CTA

Product rule: If you cannot point at two prices, PARITY does not trade.
