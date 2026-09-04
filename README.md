# PARITY

**Two prices. One gap. You tap.**

Robinhood lists the stock and an on-chain token of that stock. Those prices drift. PARITY measures the gap, haircuts fees and slip, and only then sends a card. You confirm. Confirm re-quotes. The model writes the sentence. It does not place.

## Problem

Robinhood opened agents and a chain in the same year.

People are connecting Grok/Claude to the Trading MCP and typing "buy good stocks." That is not a product. It is an unconstrained model with a funded wallet.

At the same time, Robinhood Chain stock tokens print a second price for names you already trade in cash. Chainlink's token feed is already `× multiplier`. The off-chain `/rhj/prices` feed is not. Mix them and you invent edge. Ignore the session (tokens 24/7, cash is not) and you trade a weekend premium as if it were arb.

Retail cannot see that number. The bots that will, will either be wrong on the math or unbounded on size.

## Product

A shared basis tape and a per-user clip.

You see:

> HOOD token is 1.3% cheap vs HOOD. Cash market open. $40 clip after haircut.
>
> **Do it · $15** · Skip

No gap → no card.

Fail `STALE` / `CLOSED` / `THIN` / `DUST` → no card.

Overnight → watch, not live.

v1 live path for US users: equity in the ring-fenced Agentic Account via official MCP (`review_equity_order` → `confirm` → `place_equity_order`). Token is research, not a buy button. You never hold funds. Paper is default for seven days.

## Why now

- Official Agentic Trading MCP (equities live; crypto rolling).
- Official Crypto API (not this product).
- Robinhood Chain stock tokens + Chainlink total-return feeds + public `uiMultiplier()`.
- ~30k-user shape is a shared market plane, not 30k LLM loops.

This spread only exists on Robinhood. That is the wedge.

## How it works

1. **Measure** — cash mid vs token USD ÷ (`uiMultiplier` / 1e18). One function. Fixture-tested on 1.0×, dividend 1.008×, 10:1 split.
2. **Haircut** — fees, depth-aware slip, session tag (`rth` | `ext` | `overnight` | `weekend`).
3. **Card** — clip = min(user cap, name %, book-safe notional). TTL ~75s. Confirm re-quotes. Idempotency = `card_id`.

The LLM is optional and write-only. It never holds keys.

## Who it's for

| Mode | Who | What happens |
|---|---|---|
| Watcher | Anyone | Tape + alerts. No Robinhood connect. |
| Paper | Default | Fills at confirm mid. |
| Live equity | US + Agentic MCP | Review, then place in the agentic wallet only. |

Basic user setup: universe (Top 10), clip $25 / $50 / $100, paper week.

## Why it wins

| Usual RH agent | PARITY |
|---|---|
| Prompt = strategy | Basis = strategy |
| One chat session | Shared tape, your clip |
| "Buy good stocks" | Two prices or it doesn't trade |
| Model can `place_*` | Model captions a legal card |
| Unofficial HTTP | Official MCP + public chain/RHJ only |

## Architecture (one line)

Market plane runs once (20–50 names). User plane is a row: policy, NAV, mutes, paper vs live. Notifications fan out `card_id` only. Exec gateway is the only process that can talk MCP.

At 30k users the expensive part is push + stale confirms, not compute.

## GTM

- Public tape (no accounts). Screenshot two prices.
- Paper waitlist. Skip-code histogram. Zero live keys.
- MCP confirm for US. Cap 3 cards/day.
- X thread: "Seven names flat. One gap. Four hours later it was gone. Here's paper P&L after fees."

Do not advertise live APY. Do not launch a token.

## What we will not ship in v1

Two-leg atomic hedge. Memecoins. Per-user always-on Grok that places. Unofficial Robinhood HTTP. 95-name universe. "Fully autonomous PARITY fund."

## Risks (say them)

- Token ≠ share (Jersey economic exposure). US often cannot buy the token on RH's own venue.
- Basis can persist; overnight gaps are not free money.
- Paper ≠ live. Stale cards must die on confirm.
- A split handled wrong is a fake 10×. That's why the engine is the product.
- Auto-place without a tap is a different company and a different lawyer.

## The line

If you can't point at two prices, PARITY doesn't trade.
