# GAUGE — Architecture

One line: two prices for the same name, one measured gap, a confirm-gated card. This document describes how that's actually built — services, data flow, trust boundaries, and build order.

---

## 1. System overview

GAUGE splits cleanly into two planes, per the product spec:

- **Market plane** (runs once, shared) — ingests prices, computes the basis, halts bad data. Knows nothing about users.
- **User plane** (per account) — turns a published basis tick into a personal card, handles confirm/execute, and owns the paper ledger.

```
                     ┌─────────────────────────────────────────┐
                     │              MARKET PLANE                │
                     │                                           │
  RHJ feed  ───────► │   gauge-market                          │
  Chainlink ───────► │   (ingest, halt controller,               │
  Depth     ───────► │    calls gauge-engine per tick)          │
  Calendar  ───────► │                                           │
                     │        │ publishes BasisTick               │
                     └────────┼───────────────────────────────────┘
                              ▼
                     ┌─────────────────────────────────────────┐
                     │              USER PLANE                   │
                     │                                           │
                     │   gauge-carder                          │
                     │   (symbol → users index, card decisions,  │
                     │    TTL, caps, paper ledger)                │
                     │        │                                  │
                     │        ▼                                  │
                     │   gauge-api ◄──────── Next.js frontend   │
                     │        │                                  │
                     │        ▼ (on confirm only)                │
                     │   gauge-exec ────► Robinhood Trading MCP │
                     │        │                                  │
                     │        ▼                                  │
                     │   gauge-notif (push: card_id only)       │
                     └─────────────────────────────────────────┘
```

`gauge-engine` isn't in this diagram as a box of its own — it's a library, not a service. Both `gauge-market` (ticks) and anything doing fixture/backtest work links against it directly.

---

## 2. Services

### 2.1 `gauge-engine` — pure math (lib crate, no I/O)

Given `RhjQuote` + `ChainlinkQuote` + `DepthSnapshot` + `Session` + `HaircutParams`, returns a `BasisTick` and a `Decision` (`CardEligible` / `Skip(code)` / `Halt(reason)`).

Core computation (spec 5.1–5.2):
1. `share_mid` = (RHJ bid + ask) / 2
2. `token_per_share` = Chainlink token price ÷ (uiMultiplier / 1e18) — multiplier applied **once, chain side only**
3. `basis_bps` = (token_per_share − share_mid) / share_mid × 10,000
4. `net_bps` = |basis_bps| − fee_bps − slip(clip) − buffer_bps
5. `cheap_side` ∈ {equity, token, none}

Skip codes: `Stale / Closed / Thin / Dust`. Halt reasons: `MultiplierJump / OraclePaused / FeedStale / ZeroDepth`.

Fixture tests (mandatory, not optional): 1.0× baseline, ~1.008× dividend, 10:1 split (continuity of `token_per_share` across the split is the actual assertion), and an unexplained-multiplier-jump case that must halt rather than card.

No retries, no clocks, no persistence, no knowledge of users. If a change needs any of those, it belongs one layer up.

### 2.2 `gauge-market` — ingest + halt controller (bin)

Owns the RHJ client, Chainlink client, depth client, and corporate-actions calendar. Calls `gauge-engine::measure()` / `decide()` per symbol per tick. Runs the halt state machine (section 6 of the product doc): multiplier jump or `oraclePaused` → halt; stale `updatedAt` → no live cards; zero depth → shrink/halt live; resumes manually or after N clean ticks.

Publishes `BasisTick`s to a bus (Kafka/NATS/Redis streams — pick one, doesn't need to be exotic). Also serves the **public, unauthenticated tape** that powers Watcher mode and the marketing site's live widget.

Time budgets it's responsible for enforcing (spec section 7):
- RHJ vs Chainlink agreement: 8–15s, else stale
- Multiplier vs price: same poll, else halt
- Depth vs price: 30s, else shrink clip_max

### 2.3 `gauge-carder` — user-plane fan-out (bin)

Subscribes to the `BasisTick` bus. Maintains the **inverted index**: symbol → subscribed users (with universe/mute filters already applied), so a tick for HOOD only touches users actually watching HOOD — this is the piece that makes 30k users tractable instead of a per-tick scan.

Per matching user, applies policy: clip size = `min(user.max_clip, nav × name_pct, tick.clip_max)`, drops if clip < $15 (Dust), enforces the daily card cap (default 3), respects session (`rth` = live-eligible, `ext`/overnight/weekend = watch/paper only), respects personal mute/kill-switch state.

Owns the card lifecycle: `open → confirmed | rejected | expired | stale_on_confirm`, TTL ~75s, idempotency on `card_id`. Also owns the **paper ledger** — fills recorded against confirm-tick mid, never card-tick mid.

Time budget it enforces: tick vs confirm — 75s TTL, else `expired`/`stale_on_confirm`.

### 2.4 `gauge-api` — the only service the frontend talks to (bin)

HTTP surface for the Next.js app. Endpoints roughly: `GET /tape` (public), `GET /cards`, `POST /cards/:id/confirm`, `POST /cards/:id/skip`, `GET /log`, and the `You` tab settings (mode, clip size, universe, mutes, MCP connection status, kill switch).

On confirm, hands off internally to `gauge-exec` and relays status back — `gauge-api` itself never holds or sees MCP credentials. This is a deliberate boundary, not a convenience split.

### 2.5 `gauge-exec` — MCP-only execution boundary (bin)

The **only** service allowed to touch execution credentials or call `review_equity_order` / `place_equity_order`. Treat this as the highest-scrutiny part of the system:

- Credentials decrypted only at point of use, never held plaintext longer than the call; ideally a separate deploy, separate IAM role, separate log pipeline from everything else.
- **Re-quotes on every confirm** — spec 5.3 is explicit: "Confirm always re-quotes." This service re-validates the basis is still live before calling `review_equity_order`; it does not trust the price the card was opened with.
- Refuses to execute outside `rth`.
- Handles MCP `401` (disable live for that user, paper continues) and Robinhood `429` (pause live globally, paper continues) as first-class states, not exceptions.
- Captures `broker_order_id` and hands it back — this service executes, it doesn't own the record.

### 2.6 `gauge-notif` — push (bin)

Deliberately dumb. Payload is `card_id` only — the client fetches the actual card from `gauge-api`. No sensitive data ever transits this service, which is intentional: it can run with much weaker trust guarantees than everything else.

---

## 3. Repo layout (Cargo workspace + frontend)

```
parity/
  frontend/                  # Next.js app (see GAUGE frontend CLAUDE.md)
  backend/
    Cargo.toml                # workspace root
    gauge-engine/            # lib — no I/O, see 2.1
    gauge-market/            # bin — ingest + halt, see 2.2
    gauge-carder/            # bin — fan-out + cards + paper ledger, see 2.3
    gauge-api/                # bin — HTTP surface, see 2.4
    gauge-exec/                # bin — MCP-only, isolated deploy, see 2.5
    gauge-notif/                # bin — push, see 2.6
    shared-types/               # BasisTick, SkipCode, HaltReason, Session, Card — shared across bins
```

One monorepo, one workspace: the market-plane/user-plane split needs tight type coordination, and a shared `shared-types` crate keeps `BasisTick`/`Decision`/`Card` definitions from drifting between services. Each `bin` still deploys and scales independently — `gauge-exec` in particular should have its own deploy pipeline and secrets scope, separate from everything else, even though it lives in the same repo.

---

## 4. Data flow, end to end

1. `gauge-market` polls RHJ + Chainlink + depth for a symbol.
2. Calls `gauge-engine::measure()` → `BasisTick`, then `decide()` → `Decision`.
3. If `Halt`, the halt controller suppresses the tick from the bus until resume conditions are met. If `Skip`, no card, tick still visible on the public tape (marked with the skip code). If `CardEligible`, publishes the tick.
4. `gauge-carder` receives the tick, looks up watching users via the inverted index, applies per-user policy (clip, cap, session, mute), opens `Card`s where eligible.
5. `gauge-notif` pushes `{card_id}` to relevant users.
6. Frontend fetches the full card via `gauge-api`.
7. User taps **Do it** → `gauge-api` → `gauge-exec`: re-quote against latest tick → if still eligible, `review_equity_order` → user confirms on Robinhood's own review surface → `place_equity_order` executes inside the user's ring-fenced Agentic Account.
8. `broker_order_id` flows back to `gauge-api`, recorded in `Log`. Paper-mode users skip steps 7–8 entirely; `gauge-carder` fills the ledger against confirm-tick mid.

---

## 5. Trust boundaries (the part that matters most)

- **GAUGE never holds funds or keys.** The Agentic Account lives on Robinhood; `gauge-exec` only calls MCP on the user's already-authorized connection.
- **`gauge-exec` is the sole holder of anything sensitive.** Every other service — including `gauge-api`, which talks to the frontend — should be buildable and testable with zero knowledge of execution credentials.
- **`gauge-engine` has zero trust surface by design** — it's pure functions, so its correctness is a testing problem, not a security problem.
- **The market plane doesn't know users exist.** `gauge-market` publishes ticks; it has no reason to ever see a user ID, a clip size, or an MCP token. If a future feature needs it to, that's a sign the boundary is being violated.

---

## 6. Build sequence (spec section 11, as an engineering checklist)

**Days 1–21 — prove the measurement is trustworthy**
`gauge-engine` + `gauge-market` (ingest + halt controller) + public tape. Fixtures pass the split/dividend/jump cases. No accounts, no cards, no `gauge-carder`, no `gauge-exec`.

**Days 22–45 — prove the fan-out, paper only**
`gauge-carder` + `gauge-api` (cards, paper ledger) + `gauge-notif`. Skip-code histogram live and monitored. Zero live keys exist anywhere in the system — `gauge-exec` is stubbed or doesn't exist yet.

**Days 46–90 — prove execution, small cohort**
`gauge-exec` + MCP confirm flow, US-only. ~1k waitlist. Scale toward 30k only once the `stale_on_confirm` rate and single-name halt/resume behavior are proven — this is explicitly called the dashboard that matters (spec section 11).

The ordering is the point: measurement correctness → fan-out at scale → real money, in that order, even though `gauge-exec` is the most "exciting" piece to build.

---

## 7. Open engineering decisions (mirrors spec section 12, backend lens)

- **Bus choice** for `BasisTick` publish/subscribe — Kafka/NATS/Redis streams; pick based on ops familiarity, this isn't a differentiator.
- **Live universe**: 10 names with real token depth, not the full 95 — keeps `gauge-market`'s ingest surface and `gauge-carder`'s index small while trust is being established.
- **Corporate-actions source of truth**: how `gauge-market` distinguishes a legitimate split/dividend from a bad oracle tick — needs a real calendar feed, not just multiplier-delta heuristics, before halts stop being overly trigger-happy.
- **NAV source**: typed by the user first, pulled from MCP once connected — affects clip-size math in `gauge-carder`.
- **Card TTL**: 75s starting point, tune against observed `stale_on_confirm` rate once live.
