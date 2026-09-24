# GAUGE — TODO

What's left before the backend is a real, self-running flow rather than a tested pipeline that needs data hand-fed into it. See `ARCHITECTURE.md` for how the pieces fit together.

---

## Blocking — the flow doesn't run end to end without these

- [ ] **`mod market`'s poll loop.** Nothing currently fetches RHJ/Chainlink/depth on an interval, runs it through `mod engine`, and publishes to Redis Streams. `gauge-api` only does a Redis connectivity check at startup. Every tick this project has ever processed was pushed manually via `redis-cli XADD` for testing — without this loop, no real tick is ever produced.
- [ ] **`gauge-exec`'s real `TradingMcpClient`.** Currently `NotImplementedClient` — every gate (rth, live/pause, re-quote, side) is real and enforced, but the actual `review_equity_order` / `place_equity_order` call always fails on purpose rather than pretending to succeed. Blocked on having the real Robinhood Agentic Trading MCP protocol (connection details, tool schemas, auth flow) to build against — nothing in this repo currently has that.

---

## Backend — real gaps, not blocking, but open

- [ ] **RHJ/Chainlink/depth client shapes are guesses.** `mod market/feeds/{rhj,chainlink,depth}.rs` hit placeholder endpoint paths and expect a JSON shape I invented to match `RhjQuote`/`ChainlinkQuote`/`DepthSnapshot` — never verified against a real API. Needs the actual API docs once available.
- [ ] **Live symbol universe not decided.** Doc default is "10 names with real token depth," not the full 95 — needs a product decision.
- [ ] **Corporate-actions calendar source of truth not decided.** How `mod market` tells a real split/dividend from a bad oracle tick — currently just multiplier-delta heuristics in `mod engine`, no real calendar feed.
- [ ] **NAV source not decided.** Doc says "typed by the user first, pulled from MCP once connected" — affects clip-size math in `mod carder`'s policy.
- [ ] **Card TTL (75s) is a starting guess**, not tuned against any observed `stale_on_confirm` rate (no real traffic yet to observe).
- [ ] **No real per-user auth.** `gauge-api` only has a single shared service-level bearer token (`GAUGE_API_TOKEN`) — it proves "this caller is authorized to talk to gauge-api at all," not "this caller is user X." A `PUT /users/:id/settings` request is trusted on `:id` alone once past that gate. Needs a real auth provider decision (session, OAuth, whatever).
- [ ] **Push notifications (`mod notif`) don't exist.** No delivery mechanism chosen (APNs/FCM/web push), no code written — see `ARCHITECTURE.md` §2.2's note on where it'll live.
- [ ] **`GET /cards` and `GET /log` scan every persisted record and filter in memory** rather than an indexed-by-user lookup. Fine at current scale; would want a Redis set per user if this needs to get fast.

---

## Frontend — deliberately not wired yet

- [ ] **`SignalCard`'s "Confirm & Do It" doesn't call the real `POST /cards/:id/confirm`.** Real backend cards have a server-decided `clip_usd` (from `mod carder`'s policy); the current UI has the user pick their own clip as the buy action. That's a genuine UX-model mismatch, not an oversight — needs a product decision on which model wins before wiring it for real. Also currently untestable in practice since no real cards exist without the market poll loop above.
- [ ] **Settings ("You" page) stays local-only**, by its own existing code comment — every control is local UI state, nothing persists. Some fields map cleanly to `User` (mode, clip, universe, mutes, NAV); "min net edge to card" doesn't exist on the backend model at all.
- [ ] **Log page stays local-only** — its `LogRow` shape (day-grouped, includes skip reasons) doesn't map cleanly onto backend `Fill`, which has no skip entries or day grouping.

---

## Already resolved (kept here so it isn't re-litigated)

- [x] Order side (buy/sell) — `gauge-exec` derives `Buy` from `cheap_side == Equity` itself and rejects anything else; no longer a caller-supplied, unvalidated parameter.
- [x] `gauge-market`/`gauge-carder`/`gauge-engine`/`gauge-notif` merged into `gauge-api` as `mod market`/`mod carder`/`mod engine` (`mod notif` reserved for when there's real logic). `gauge-exec` stays separate — the one service holding real credentials.
- [x] Redis Streams (`gauge:ticks`) as the tick bus; Redis Pub/Sub (`gauge:card_events`) for cross-process card lifecycle events.
- [x] `gauge-api`'s tape cache and cards/settings/log all read/write the same Redis-backed state `mod carder`'s background loop uses — no more disconnected copies.
