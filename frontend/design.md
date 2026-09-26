# GAUGE: design.md

|                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Status          | Landing page approved for handoff                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Rev             | 6 · 2026-09-26                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Changelog       | r6: added §5C Docs (4 screens: shell, reading typography, components, per-page specs, interactions, full copy deck); docs motion K1–K7; docs code-comment grey raised to #80848A for AA. r5: added §5B.12, the full app copy deck (every label, list and state-dependent string), exact sample-data generators with code, and the remaining geometry; META net corrected to 1.2. r4: added the app (§5B: 6 screens, shell, shared data model, interactions), app motion J1–J12, app placeholders and accessibility. r3: 4th won't-do panel is now "Go past 3 a day". r2: GAUGE will have a token; removed the "Ship a token" refusal (won't-do is now 3 panels) and the token line from the FAQ. r1: landing page with 10 sections, per-section motion, asset pack |
| Companion files | `animations.md` (every animation, with code), `assets/` (brand, favicon, social, css, tokens, fonts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| System          | rain-design-skill-2 (v2 language). GAUGE is the reference build.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Source          | Design canvas "GAUGE": landing `Main.dc.html` (1440 × 7400, expand fill) + app `Home`, `Watchlist`, `Card`, `History`, `Token`, `Settings` + docs `DocsHome`, `DocsQuickstart`, `DocsCard`, `DocsReasons` `.dc.html` (1440 wide, interactive, linked)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

## 1. Product in one line

GAUGE watches the Robinhood stock and the Robinhood Chain stock token for the same name. It emits a 75-second card only when the net gap clears fees, slippage, buffer, session, depth and a cap of 3 a day. You tap. Confirm re-quotes. The model does not place.

## 2. Tokens

```css
:root {
  --bg: #0a0b0d; /* page ground, cool near-black */
  --hero: #07080a; /* hero base */
  --panel: #111316; /* flat panel */
  --panel-2: #16181c;
  --panel-grad: linear-gradient(180deg, #131519 0%, #0f1113 100%);
  --inset: #0a0b0d; /* blocks inside panels (formula, ticket, route) */
  --track: #1c1f23; /* empty bars, ring track */
  --line: rgba(249, 247, 244, 0.08);
  --line-2: rgba(249, 247, 244, 0.14);
  --line-row: rgba(249, 247, 244, 0.06); /* mono data rows */
  --ink: #f9f7f4; /* brand cream, sampled from logo sheet */
  --ink-2: #c9cbcf; /* nav links, formula text */
  --muted: #a6a9ae;
  --dim: #80848a; /* captions >= 13px, mono labels */
  --accent: #b2d450; /* sampled from logo G bar */
  --accent-hover: #c2e062;
  --accent-soft: #e4f5a6; /* arc rim highlight, travelling tick */
  --accent-ink: #0b0d07; /* text on lime */
  --glow: rgba(178, 212, 80, 0.35);
  --neg: #ff6b5e; /* costs, won't-do marks, stale end-state */
  --dead: #5a5d62; /* stale timestamp end-state */
}
```

**Radii:** panel 20 · inset block 14 · card mock 22 · closing CTA block 28 · pills/buttons 999 · stamp 8.

| Colour              | Means                                                                      |
| ------------------- | -------------------------------------------------------------------------- |
| `--accent`          | Passes, net value, live state, token price, primary action, eyebrows       |
| `--ink`             | Cash price, headlines, neutral values                                      |
| `--neg`             | Costs peeled off the gap, things GAUGE won't do, a quote that has aged out |
| `--dim` / `--muted` | Gross (pre-cost) values, labels, gaps below threshold                      |

A colour always ships with a word (✓, STALE, net, FILLED).

## 3. Type

| Family                                       | Weights            | Use                                                                                   |
| -------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------- |
| **Unbounded**                                | 600, 700, 800      | Display H1/H2 (800), H3 (600), big numbers (700/800)                                  |
| **Doto**                                     | 900                | Dot-matrix accent words, one or two per headline, plus reason codes and the FAQ title |
| **Satoshi** (stand-in **Plus Jakarta Sans**) | 400, 500, 600, 700 | Body, UI, buttons                                                                     |
| **IBM Plex Mono**                            | 400, 500, 600      | Eyebrows, labels, prices, codes, pills, formulas                                      |

```html
<link
  href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&family=Doto:wght@700;900&display=swap"
  rel="stylesheet"
/>
```

To switch to Satoshi, put `Satoshi-{Regular,Medium,Bold}.woff2` in `assets/fonts/`, add `@font-face` rules to `fonts.css`, and set `--f-body:'Satoshi','Plus Jakarta Sans',system-ui`.

| Role                   | Spec                                                                            |
| ---------------------- | ------------------------------------------------------------------------------- |
| Hero H1                | Unbounded 800, 104px, lh .98, ls -0.045em                                       |
| Hero accent line       | Doto 900, 118px, ls -0.01em, lime + `text-shadow:0 0 28px rgba(178,212,80,.35)` |
| Section H2             | Unbounded 800, 72px (won't-do: 84px)                                            |
| Section H2 accent word | Doto 900, 80px (won't-do: 96px; FAQ: 84px)                                      |
| Closing H2             | Unbounded 800, 136px, lh .92, ls -0.055em, `--accent-ink`                       |
| H3 (panel title)       | Unbounded 600, 22px, ls -0.03em (paper/live: 34px; won't-do: 19px)              |
| Big number (cap "3")   | Unbounded 800, 120px, ls -0.06em, lh .9                                         |
| Card net               | Unbounded 700, 34px, ls -0.04em                                                 |
| Reason code            | Doto 900, 46px                                                                  |
| Lede                   | 19px / 1.6, `--muted`; optional bold `--ink` lead sentence                      |
| Body (`.g-p`)          | 16px / 1.6, `--muted`                                                           |
| Eyebrow                | Plex Mono 12px, uppercase, `0.22em`, `--accent`                                 |
| Mono labels            | Plex Mono 10–12px, `0.12–0.18em`, `--dim`                                       |
| Data rows              | Plex Mono 13px                                                                  |
| Buttons                | Jakarta 700, 16px (nav 15px)                                                    |
| Nav links              | Jakarta 500, 15px, `--ink-2`                                                    |

`font-variant-numeric: tabular-nums` on `body`.

## 4. Atmosphere

- The ground is `--bg`; the hero is `--hero` plus a radial lime glow from below: `radial-gradient(90% 70% at 70% 110%, rgba(178,212,80,.14), transparent 60%)`.
- **Edge glows.** Three blurred radial blobs at 8–10% lime alpha: 760–820px, `blur(40–50px)`, positioned at y ≈ 1500 / 2900 / 4500, alternating left and right, half off-canvas. They drift on `g-drift` over 38s, 46s (−12s) and 42s (−20s).
- **Hero grid.** A 48px square pattern, 3.5% cream strokes.
- The root is `overflow: clip`, never `hidden`, so the sticky nav keeps working.

## 5. Page: landing

Container: 1200px centred. Sections are `padding-top:150px`. Panel grids use `gap:20px`.

| #   | Section             | id        | Layout                                                  | Motion (see animations.md) |
| --- | ------------------- | --------- | ------------------------------------------------------- | -------------------------- |
| 0   | Announcement bar    | –         | 44px, centred                                           | –                          |
| 1   | Floating nav        | –         | sticky pill glass                                       | ping dots                  |
| 2   | Hero                | `top`     | full-bleed 100vh, copy left, widget bottom-right        | A1–A6                      |
| 3   | Ticker strip        | –         | full-width masked marquee                               | B1–B2                      |
| 4   | How it works        | `how`     | header grid + 3 panels (3rd featured)                   | C1–C3                      |
| 5   | The card            | `card`    | header grid + 7fr/5fr (featured card panel + cap panel) | D1–D4                      |
| 6   | Reason codes        | `reasons` | header grid + 4 panels                                  | E1–E4                      |
| 7   | Paper vs live       | `paper`   | header grid + 2 panels (live featured)                  | F1–F2                      |
| 8   | What GAUGE won't do | `wont`    | centred header + 4 panels                               | G1–G2                      |
| 9   | FAQ                 | `faq`     | 4fr/7fr: title left, divider rows right                 | H1–H2                      |
| 10  | Closing CTA         | –         | lime block, inset 24px, radius 28                       | I1–I2                      |
| 11  | Footer              | –         | 5fr/2fr/2fr/3fr + bottom bar                            | ping dot                   |

**Section header pattern (4–7):** `grid 1fr 1fr; gap 80px; align-items:end; margin-bottom:56px`. Left: eyebrow `0N · Title`, then an H2 in which one word is Doto. Right: the lede.

### 5.0 Announcement bar

44px tall. Background `linear-gradient(90deg, transparent, rgba(178,212,80,.10), transparent), #0D0F0B`, with a bottom border in lime at 18%. Contents: mono `PAPER` in lime, the sentence, and a link "See paper vs live →" in lime 600 pointing to `#paper`.

### 5.1 Nav

- `position:sticky; top:16px; width:1232px; height:68px; margin:16px auto -84px` (the negative margin lets the hero run under it).
- Radius 999. Background `rgba(12,13,15,.62)` with `backdrop-filter: blur(18px) saturate(140%)`. Border at 10% cream. Shadow `0 16px 50px rgba(0,0,0,.45)` plus `inset 0 1px 0 rgba(249,247,244,.06)`.
- **Left:** wordmark at 112×24, then pills "● Paper live" (lime ping dot) and "● RTH open" (static cream dot at 70% opacity).
- **Centre:** How it works · The card · FAQ · Docs, with a 34px gap.
- **Right:** "Read the docs" (secondary) and "Open GAUGE ↗" (primary), both 48px tall.

### 5.2 Hero

- Height `min(100vh, 980px)`, `min-height: 820px`, `overflow:hidden`.
- SVG stage 1440×980, `preserveAspectRatio="xMidYMax slice"`, `inset:0`.
- Veils: a left gradient `90deg rgba(7,8,10,.92) 0% → .55 38% → 0 60%`, and a 120px bottom fade into `--bg`.
- Copy column: max-width 760, gap 30, vertically centred with `padding-top:40px`. It enters on `g-rise` (1s, delay .2s). Top to bottom:
  1. Eyebrow "Robinhood stock · Robinhood Chain stock token" in `--muted`.
  2. H1 "Two prices." with a `<br>`, then "One gap." in Doto.
  3. Lede, max-width 560.
  4. CTA row: "Open GAUGE ↗" (primary) and "How it works" (secondary).
  5. Pills: "Net gap or nothing" (lime), "3 cards a day", "75s per card", "You tap. It doesn't."
- **Live gap widget:**
  - Position: absolute, `right:max(32px, calc(50% - 600px)); bottom:130px`, width 360, padding 20/22. Glass: `rgba(15,17,19,.72)`, blur 16, border at 12% cream.
  - Header: "● LIVE GAP · NVDA" with "ILLUSTRATIVE" on the right.
  - Rows: Cash mid $182.40 · Token / share $182.71 (lime) · |Gap| 17.0 bps · Fees · slip · buffer −7.6 bps (`--neg`) · Net +9.4 bps (lime, 20px 600).
  - Gate pills: Session ✓, Depth ✓ (lime), Cap 1/3.
- **Sample-data maths:** (182.71 − 182.40) / 182.40 = 16.996 bps, shown as 17.0. Fees 3.5 + slippage 2.1 + buffer 2.0 = 7.6, so net = 9.4. Every screen uses these numbers.

### 5.3 Ticker strip

- Top and bottom hairlines at 6%, padding 26/30.
- Header row: mono "ROBINHOOD CHAIN STOCK TOKENS · GROSS GAP" on the left, "ILLUSTRATIVE" on the right.
- Marquee: the list is duplicated, the track is `width:max-content`, and edges are masked `transparent → #000 10% … 90% → transparent`.
- Chip: 52px pill with a 1px border at 9%, background `#0F1113`. Contents: a 36px round badge with the ticker in mono 10px, the symbol in mono 600 15px, the name in 14px `--dim`, and the gap in mono 14px.
- Data: AAPL +4.1 · NVDA +17.0 · TSLA −6.3 · MSFT +2.2 · AMZN −1.8 · META +8.7 · GOOGL +3.0 · COIN −11.4.
- Threshold |gap| ≥ 7.6 bps (the total cost): values at or above it are lime and the chip flashes; values below are `--dim`.

### 5.4 How it works

- Three panels: padding 36, min-height 460, flex column, gap 18.
- Each panel: eyebrow `0N / Word`, H3, body, a visual, then an inset formula block (`margin-top:auto`, padding 16/18, radius 14, `--inset`, mono 14 `--ink-2`).

| Panel                | H3                          | Visual                                     | Formula                                |
| -------------------- | --------------------------- | ------------------------------------------ | -------------------------------------- |
| 01 / Measure         | Cash mid vs token-per-share | 300×84 SVG ruler (C1)                      | `gap = token × mult − cash_mid`        |
| 02 / Haircut         | Net basis points            | 14px segmented bar + labels + readout (C2) | `net = \|gap\| − fees − slip − buffer` |
| 03 / Emit (featured) | Four gates, then a card     | 2×2 gate pills + mini card (C3)            | –                                      |

### 5.5 The card

- **Left panel (featured, 7fr):** padding 44, flex row, gap 44. A 1px scan light runs along the top edge (D4).
- **Card mock:**
  - 360px wide, radius 22, `--inset` fill, 12% border, padding 24, gap 18, shadow `0 30px 80px -20px rgba(0,0,0,.8)`. `position:relative; overflow:hidden` so the shimmer (D2) is clipped.
  - Header: "CARD · NVDA" and a "● PAPER" pill.
  - Countdown ring (D1): 124px, r 54, stroke 7, track `#1C1F23`, lime arc with round caps and `drop-shadow(0 0 6px rgba(178,212,80,.6))`. The clock inside is `m:ss` in Unbounded 700 24px.
  - Net block: label "NET", "+9.4" in Unbounded 700 34px lime, "bps after costs".
  - Rows: Cash mid · Token / share · Leg "Cash equity only".
  - Re-quote line (conditional): "Re-quoted · still clears · paper fill at $182.40" in mono 12 lime.
  - Buttons: "Do it" (primary, grows) and "Skip" (secondary).
- **Anatomy column:** three blocks (COUNTDOWN, RE-QUOTE, DO IT), each a mono 12 lime label plus body text.
- **Right panel (5fr):** eyebrow "Daily cap", a big "3", a caption, three 8px bars in a 3-column grid (D3), and "3/3 · CAP LOCKED UNTIL TOMORROW" (mono 12 lime) animated in.
- **Interaction (DC state):**
  - `t` starts at 52 and ticks down every 1s. At 0 it resets to 75 and `requoted` is cleared.
  - When `t` reaches 31, `requoted` is set to true (auto-demo).
  - "Do it" sets `requoted = true`. "Skip" resets `t = 75` and `requoted = false`.

### 5.6 Reason codes

Four panels: padding 32, min-height 340, gap 20. Each has a mono gate label, a 64px visual, the Doto code, and body text (`margin-top:auto`).

| Gate    | Code   | Visual                                                               | Copy                                                                                        |
| ------- | ------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| FEED    | STALE  | timestamp `14:31:07.112` + 4px age bar (E1)                          | One of the two prices is too old to trust. No card on a stale quote.                        |
| SESSION | CLOSED | 28px session track, RTH window at 35%/32% width, marker (E2)         | The cash market is outside the session GAUGE trades. The token may still tick. GAUGE waits. |
| DEPTH   | THIN   | 10 depth bars; heights 22,34,48,60,56 lime / 56,60,48,34,22 red (E3) | Not enough depth to fill without eating the gap. The book is too thin.                      |
| NET GAP | DUST   | Doto "0.3" + 8 dots, "NET BPS" (E4)                                  | A gap exists, but after fees, slippage and buffer it rounds to nothing.                     |

### 5.7 Paper vs live

Two panels: padding 44, min-height 480. Each has H3 34px with a pill on the right, body text, a visual, and three mono rows at the bottom.

- **Paper** (pill "Default"): a 300px dashed ticket reading "PAPER TICKET · NVDA", "@ 182.40" (mono 22) and "confirm mid · no broker", with the "FILLED @ MID" stamp (F1). Rows: Fill price / Confirm mid · Broker / None · Risk / Zero.
- **Live** (featured, lime pill "Agentic Account only"): a 440×64 route with nodes YOU (x10), CONFIRM (x150, lime), MCP (x290) and ROBINHOOD (x430). The rail runs at y 21, is 2px, and has a gradient that is lime in the middle. The packet and tap ring are F2. Rows: Orders per card / 1 · Route / Robinhood Trading MCP · Trigger / Your tap (lime).
- "Robinhood" appears as a text label only. Never draw their logo.

### 5.8 What GAUGE won't do

- Centred header: eyebrow, H2 84px "The token is **not** / the share." (Doto "not", G2), and a lede of max-width 640.
- Four panels: padding 32, min-height 220. Each has a 28px ✕ icon (circle stroke `--neg` at 60%, cross 1.6px, G1), an H3 at 19px and body text at 15px.
- Items: Hold your funds · Go past 3 a day ("The cap is a gate, not a suggestion. The fourth card never exists.") · Hedge both legs · Place without Do it.
- GAUGE will have a token. Never claim otherwise. Token copy is not written yet: [TOKEN_DETAILS].

### 5.9 FAQ

- Left column: eyebrow, Doto "FAQ" at 84px, one line of body text.
- Right column: rows with a top border and a 1px bottom border at 10%. The button is full-width, padding 26/0, 20px 600, with a lime `+`/`−` on the right. Focus ring: 2px lime, offset 4.
- The first item is open by default. One item is open at a time, and the button carries `aria-expanded`.
- The answer is 16px `--muted` with 60px of right padding. It enters on H1 and has the H2 scan line below it.

### 5.10 Closing CTA

- Section padding is 150px top and 24px sides. The block is lime, radius 28, padding 120/40/110, centred, gap 36.
- Background art: two identical brand-line paths (ink stroke 2.5, one dashed 6/8) over the whole block at 20% opacity, animated by I1.
- Contents:
  - Mono eyebrow "GAUGE · CASH VS TOKEN · CONFIRM-GATED" at 70% ink.
  - H2 "NO GAP. / NO CARD." (I2).
  - Lede at 78% ink, max-width 600.
  - Buttons: "Open GAUGE ↗" (ink fill, lime text) and "Read the docs" (transparent, 1.5px ink border at 50%).

### 5.11 Footer

- Padding 90/48.
- Top grid: `5fr 2fr 2fr 3fr`, with a bottom hairline at 8%.
  - **Brand block:** wordmark 150×32, "Two prices. One gap. You tap.", and a "● Paper live" pill.
  - **PRODUCT:** How it works, The card, Reason codes, Paper vs live.
  - **RESOURCES:** Docs, FAQ, Open GAUGE.
  - **Right column:** a "● Watches Robinhood Chain" pill and `[CONTACT_EMAIL]`.
- Bottom bar: the disclaimer (13px `--dim`) and "© 2026 GAUGE".

## 5B. App (6 screens)

The artboards sit to the right of the landing page under the canvas title "GAUGE · App". Each is 1440 wide and interactive.

| Artboard            | x, y       | h    | Rail item                |
| ------------------- | ---------- | ---- | ------------------------ |
| `Home.dc.html`      | 1560, 0    | 2080 | Home                     |
| `Watchlist.dc.html` | 3080, 0    | 1640 | Watchlist                |
| `Card.dc.html`      | 4600, 0    | 1360 | Active card (lime badge) |
| `History.dc.html`   | 1560, 2200 | 1480 | History                  |
| `Token.dc.html`     | 3080, 2200 | 1260 | Token                    |
| `Settings.dc.html`  | 4600, 2200 | 1900 | Settings (pinned bottom) |

### 5B.1 App tokens (in addition to §2)

| Token      | Value     | Use                                                         |
| ---------- | --------- | ----------------------------------------------------------- |
| `--rail`   | `#08090B` | Icon rail background                                        |
| `--thin`   | `#E8B04A` | THIN state, unsaved changes, token placeholders, pre-launch |
| `--closed` | `#8FA6DA` | CLOSED state, SESSION log events                            |
| `--dead`   | `#5A5D62` | Expired cards                                               |
| `--track`  | `#1C1F23` | Empty pips, ring track, bar track                           |
| `--ink-2`  | `#C9CBCF` | Secondary values, skipped cards, token/share column         |

**State pills** (with tint = the colour at 6–10% fill and 40–50% border):

| State  | Colour           |
| ------ | ---------------- |
| CARD   | lime             |
| THIN   | `--thin`         |
| STALE  | `--neg`          |
| DUST   | `--dim`, no fill |
| CLOSED | `--closed`       |

**Outcome pills:**

| Outcome       | Style                     |
| ------------- | ------------------------- |
| TAKEN         | lime                      |
| SKIPPED       | `--ink-2`                 |
| EXPIRED       | `--dim` with an 8% border |
| RE-QUOTE FAIL | `--neg`                   |
| ACTIVE        | solid lime with ink text  |

### 5B.2 Shell

- **Root:** `display:flex; width:1440px; min-height:<h>px; background:--bg`.
- **Rail:**
  - `position:sticky; top:0; height:100vh; min-height:900px; width:76px`, background `--rail`, right hairline at 7%. Flex column, gap 8, padding 18/0.
  - Items from the top: G mark (34px, links to the landing page), Search, a 28px divider, Home, Watchlist, Active card, History, Token. Pinned at the bottom (`margin-top:auto`): Settings, a health dot, and an avatar `[AV]` (36px).
  - Item: 44×44, radius 12, `--dim`. Hover: 5% cream fill. Active: lime at 12% fill, `inset 0 0 0 1px rgba(178,212,80,.3)`, lime icon, plus `aria-current="page"`.
  - Tooltip: `::after` with `content: attr(data-tip)`, 56px right of the item, `#16181C` fill, border at 14%, radius 8, 12px text, opacity 0 → 1 on hover (.15s).
  - Badge: 8px lime dot at the top-right of Active card while a card is open.
  - Icons: 18px, stroke 1.6, `currentColor`.

| Icon      | Path                                                               |
| --------- | ------------------------------------------------------------------ |
| Home      | `M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z`   |
| Watchlist | `M3 17l5-5 4 3 8-8` + `M3 21h18`                                   |
| Card      | rect 3,5 18×14 rx3 + `M3 10h18`                                    |
| History   | circle r9 + `M12 7v5l3 2`                                          |
| Token     | hexagon `M12 2.5l8.2 4.75v9.5L12 21.5l-8.2-4.75v-9.5z` + `M9 12h6` |
| Settings  | three slider lines with circles r2                                 |
| Search    | circle r7 + `M20 20l-4-4`                                          |

- **Main:** `flex-grow:1; padding:0 32px 56px`, so content is 1300 wide.
- **Top bar:** 80px tall, bottom hairline at 7%, `margin-bottom:24px`.
  - Left: H1 in Unbounded 700, 26px, -0.04em, plus a mono context label (e.g. "Fri 26 Sep · 14:02:41 ET").
  - Right: status pills (`● RTH · 1h 57m left` lime, `Cap 1/3`, `Feeds 6/6 OK`), then the mode toggle.
- **Mode toggle:**
  - A segmented pill: 4px padding, `--bg` fill, 1px border at 10%. Buttons are 32px, Jakarta 600 13px.
  - Paper selected: cream fill with ink text. Live selected: lime fill, ink text, glow `0 0 18px -2px rgba(178,212,80,.7)`. Buttons carry `aria-pressed`.
  - Live also shows a strip under the top bar: lime at 8% fill, border at 35%, radius 14, text: "LIVE · Do it places one cash-equity order on your Agentic Account through the Robinhood Trading MCP. Nothing else moves."
- **Panels:** the landing `.p` / `.f` (radius 20). The panel header `.ph` has padding 16/22 (Settings: 18/24), a bottom hairline at 6%, a mono label on the left and a meta or pill on the right.

### 5B.3 Shared data model

Every screen computes from the same constants, so numbers agree.

```
FEES 3.5 bps · BUFFER 2.0 bps · FLOOR (min net) 2.0 bps · MAX_AGE 2.0 s · MIN_DEPTH $100k · CAP 3/day · CARD_LIFE 75 s · NOTIONAL $100,000 (paper)
gap = |token×mult − cash| / cash × 1e4 ; costs = FEES + slippage + BUFFER ; net = gap − costs
state (in gate order): age > MAX_AGE → STALE ; depth < MIN_DEPTH → THIN ; net < FLOOR → DUST ; else CARD
paper P&L = captured_bps × NOTIONAL / 1e4
```

**Watchlist** (`sym, cash, token/share, slippage bps, depth $k, age s`). All values are illustrative.

| Sym   | Cash   | Token  | Slip | Depth | Age | Gap   | Net   | State |
| ----- | ------ | ------ | ---- | ----- | --- | ----- | ----- | ----- |
| NVDA  | 182.40 | 182.71 | 2.1  | 420   | .3  | +17.0 | +9.4  | CARD  |
| HOOD  | 118.40 | 118.93 | 3.0  | 45    | .4  | +44.8 | +36.3 | THIN  |
| PLTR  | 178.20 | 178.49 | 2.9  | 60    | .4  | +16.3 | +7.9  | THIN  |
| COIN  | 318.20 | 317.84 | 2.4  | 260   | 3.8 | −11.3 | +3.4  | STALE |
| META  | 742.10 | 742.75 | 2.1  | 510   | .3  | +8.8  | +1.2  | DUST  |
| AMD   | 162.40 | 162.52 | 2.2  | 380   | .5  | +7.4  | −0.3  | DUST  |
| TSLA  | 428.90 | 428.63 | 2.3  | 640   | .2  | −6.3  | −1.5  | DUST  |
| GOOGL | 246.12 | 246.19 | 1.9  | 450   | .3  | +2.8  | −4.6  | DUST  |
| AAPL  | 231.55 | 231.64 | 1.8  | 720   | .2  | +3.9  | −3.4  | DUST  |
| MSFT  | 512.30 | 512.41 | 1.8  | 560   | .3  | +2.1  | −5.2  | DUST  |
| AMZN  | 224.80 | 224.76 | 1.9  | 480   | .3  | −1.8  | −5.6  | DUST  |

**Ledger** (13 closed cards plus 1 active):

| Session | Time  | Sym  | @card | @confirm | Outcome       | Captured |
| ------- | ----- | ---- | ----- | -------- | ------------- | -------- |
| Mon 22  | 10:22 | NVDA | 9.6   | 9.0      | TAKEN         | +8.3     |
| Mon 22  | 11:58 | META | 6.1   | –        | SKIPPED       | –        |
| Mon 22  | 15:30 | AMZN | 3.2   | 2.4      | TAKEN         | −1.2     |
| Tue 23  | 09:47 | PLTR | 11.2  | 10.1     | TAKEN         | +9.4     |
| Tue 23  | 12:30 | TSLA | 3.9   | –        | EXPIRED       | –        |
| Tue 23  | 14:55 | AAPL | 4.4   | 3.6      | TAKEN         | +2.7     |
| Wed 24  | 10:05 | AMD  | 7.2   | 6.9      | TAKEN         | +6.2     |
| Wed 24  | 13:44 | COIN | 9.8   | –        | SKIPPED       | –        |
| Wed 24  | 15:48 | NVDA | 5.5   | 4.8      | TAKEN         | −1.9     |
| Thu 25  | 09:52 | NVDA | 8.1   | 7.4      | TAKEN         | +6.8     |
| Thu 25  | 11:37 | HOOD | 12.4  | –        | EXPIRED       | –        |
| Thu 25  | 15:21 | META | 4.6   | 1.4      | RE-QUOTE FAIL | –        |
| Fri 26  | 10:14 | TSLA | 6.8   | 5.9      | TAKEN         | +5.1     |
| Fri 26  | 14:02 | NVDA | 9.4   | –        | ACTIVE        | –        |

- **Derived:**
  - Taken 8, skipped 2, expired 2, fail 1.
  - Paper P&L +$354.00 (today +$51.00). Hit rate 75% (6/8).
  - Avg net @ card 7.0, @ confirm 6.3, re-quote drift −0.7.
- **"Now":** Fri 26 Sep, 14:02:41 ET, RTH, 1h 57m left.
  - The NVDA card (`card_7f3a91`) was emitted at 14:02:18.412 and expires at 14:03:33.412, with 52 s left.
  - Re-quote after Do it: cash 182.41, token 182.71, net 8.9.
- **Illustrative-only values:** "Why no card" (DUST 71 / THIN 12 / STALE 9 / CLOSED 8 %), evaluations 14,382, and feed latencies (Robinhood quotes 38 ms, Chainlink heartbeat 1.1 s, RPC 212 ms, Redis lag 3 ms, SSE 250 ms, Trading MCP 164 ms when live).

### 5B.4 Home (1440 × 2080)

| Row | Grid          | Modules                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `5fr 4fr 3fr` | **Active card** (featured). **Gates · NVDA**: 4 rows (check badge, name, rule, value) plus a net-vs-floor bar (net fill 55%, floor tick at 11.7%). **Today**: big "1/3" and three pips (used lime, pending striped lime blinking, empty track), plus rows for evaluations, cards emitted, paper P&L today and best raw gap.                                                                                                                      |
| 2   | full          | **Live gap board** (§5B.9 grid). Header pills: SSE · 250 ms, state counts, "Open watchlist →". Footer: the rule line in mono 11px.                                                                                                                                                                                                                                                                                                               |
| 3   | `8fr 4fr`     | **Performance · last 5 sessions**: range toggle (5D/1M/All), 4 KPI cells, and a cumulative P&L chart (SVG 800×206; lime line with drop-shadow, area gradient 28% → 0, dots at r4 lime or red, HTML labels under it). **Outcomes · 13 cards**: stacked bar (12px, 2px gaps), a legend with counts and %, and "why no card" bars (6px).                                                                                                            |
| 4   | `4fr 5fr 3fr` | **Session timeline** (spans all 3 columns): an 8px track from 04:00 to 20:00, the RTH band at 34.4–75%, elapsed RTH filled lime to 62.7%, event ticks (2×28px) at 38.96 / 43.96 / 54.17 / 62.7 %, and a NOW needle with a glow. **System health**: 6 rows (name, what, metric, pill). **Activity**: 9 mono rows (time 70, kind 70, message). **Route**: 4 steps (dot, name, sub) that change with the mode, plus an "Execution settings" button. |

**Active card module:**

- 24px padding and a scan light along the top.
- Header: eyebrow "Active card · #2 today" and a mode pill.
- A 132px ring (r54, stroke 7, lime arc with drop-shadow), the clock in Unbounded 700 24px, and "EXPIRES" in mono 8px.
- Token badge, "+9.4" in Unbounded 800 44px lime with a glow, and the formula line.
- Three inset cells: cash, token, leg.
- The re-quote line (conditional).
- Buttons: Do it (grows), Skip, and "Open card →".

### 5B.5 Watchlist (1440 × 1640)

- **Layout:** `236px 1fr`, gap 20.
- **Filter rail** (sticky):
  - "State": 5 buttons, 40px tall, radius 12, each with a colour dot and a count. The selected one has lime at 10% fill and a 1px lime ring at 30%.
  - "Rules": five mono rows.
  - "Feeds": three rows.
  - "+ Add name" (secondary, full width).
- **Search row:** a 46px pill input with a search icon, plus a sort toggle (Net, Gap, Depth, A–Z).
- **Table:**
  - Columns `1.5fr .9fr .9fr .7fr .55fr .55fr .6fr .7fr .7fr .5fr 92px`: Name, Cash, Token/sh, Gap, Fees, Slip, Buffer, Net, Depth, Age, State.
  - Each row is a `<button>`, 58px tall, with `aria-pressed`. The selected row gets lime at 7% and a 3px inset lime bar on the left.
- **Detail panel** (featured):
  - Header: badge, symbol, name, and a state pill with its reason (e.g. "CARD · all gates pass").
  - Left: 60-minute chart (SVG 700×220). The cost band is a red area at 14% between the gross and net lines. Gross is `--ink-2` 1.5px, net is lime 2.5px, the floor is a dashed dim line, zero is a cream line at 20%, plus an end dot. X labels: 13:03, 13:33, 14:02.
  - Right (300px): "Gap math" rows (cash, token, |gap|, −fees, −slippage, −buffer, net 18px) and 4 gate pills in a 2×2 grid (✓ lime, ✕ red).

### 5B.6 Active card (1440 × 1360)

- **Row 1** (`5fr 7fr`):
  - **Card panel** (featured, padding 28):
    - A 200px ring with an inner dotted ring (r46, `dasharray 1 4.82`) and a sub-label that reads "UNTIL EXPIRY", or "HELD · CONFIRMING" once tapped.
    - Net in Unbounded 800 64px, with "floor 2.0 · headroom +7.4 bps".
    - Three cells, then a **confirm flow** of 4 steps: You tap Do it → Re-quote both legs → Re-check 4 gates → Paper fill / Send order via Trading MCP. Each step's dot shows wait (number), now (lime ring with glow) or done (✓ on lime tint).
    - A done message, then the buttons: Do it (label goes Do it → Confirming… → Done) and Skip.
  - **Right column:**
    - **Both legs** chart (SVG 760×230): 99 samples over 98 s, y-axis 182.30–182.90, a gap band at lime 14%, a dashed lime line at the card moment (14:02:18), and a now line.
    - **Haircut waterfall:** 5 rows (`110px 1fr 56px`), with bars at |gap| 100%, fees 79.4→100%, slip 67.1→79.4%, buffer 55.3→67.1%, and net 0→55.3% with a floor marker at 11.8%.
- **Row 2** (`7fr 5fr`):
  - **Audit trail:** 8 mono rows (time, kind, message, value).
  - **On Do it:** 4 numbered steps that change with the mode, plus the size (paper: $100,000 notional; live: `[ORDER_SIZE]`).

### 5B.7 History (1440 × 1480)

- **KPI strip:** one panel split into 5 cells (P&L, hit rate, avg @ card, avg @ confirm with drift, cards with a breakdown).
- **Cap usage:** a panel with a `180px repeat(5, 1fr)` grid. Each session shows its day, P&L and 3 pips: taken lime with glow, skipped `--ink-2`, expired `--dead`, fail red, empty `--track`, and today's pending pip striped.
- **Ledger + drawer:** `1fr 390px`.
  - **Ledger:** a segmented tab filter (All 14, Taken 8, Skipped 2, Expired 2, Fail 1), then rows (`<button>`, 56px tall) with columns `.9fr .7fr 1fr .8fr .9fr 1.2fr .8fr .9fr`: session, time, name, @card, @confirm, outcome, captured, P&L. The ACTIVE card is pinned at the top, and @confirm below the floor is red.
  - **Drawer** (featured, sticky): card id, outcome pill, symbol, two inset cells (@card, @confirm), a timeline (dot, event, time) generated from the outcome, captured, P&L, and a CTA to the card.
- **Export CSV** sits in the top bar.

### 5B.8 Token (1440 × 1260)

- **Pre-launch:** every value is a placeholder, set in `--thin` so it can't be mistaken for data.
- **Hero panel** (featured, `380px 1fr`):
  - Left: a 300px mark (a hexagon with a lime stroke at 50% breathing, the flat G, a dashed orbit ring at 40s, and a lime arc ring at 26s reverse), captioned "MARK · PLACEHOLDER UNTIL TOKEN ART".
  - Right: eyebrow, `$[TICKER]` (Unbounded 800 56px, ticker in Doto 60px lime), `[TOKEN_NAME] · on [CHAIN]`, buttons "Add to wallet" and "Get notified at launch", 4 stat cells (price, 24h, market cap, holders), and a dashed chart placeholder with a flowing dashed line.
- **Row** (`4fr 4fr 4fr`):
  - Your position (balance, value, wallet, "Link a wallet").
  - Token facts (chain, contract, supply, decimals, launch, explorer).
  - Launch checklist (5 unchecked items, pill 0/5).
- **Utility:** 3 panels, `[UTILITY_1–3]`.

### 5B.9 Settings (1440 × 1900)

- **Layout:** `220px 1fr`, gap 28. The sticky section nav links to anchors.
- **Top bar right:** an "Unsaved changes" pill (`--thin`, shown only while there are changes), Revert, and Save (label becomes "Saved ✓").
- **Field row:** `1fr 200px`, padding 18/24. On the left, a `<label>` (16px 600) and help text (14px `--muted`). On the right, an input: 46px, radius 12, `--bg` fill, border at 14%, mono 15 right-aligned, with a unit suffix. A changed value gets an amber border; a read-only field is at 60% opacity.
- **Sections:**
  1. **Mode & account** (featured): the mode toggle; the Agentic Account row (RH badge, status line, "Link via Trading MCP" primary, or "Linked ✓"); and "Confirm before every order" as a locked pill.
  2. **Gates:** floor, buffer, fees (read-only 3.5), max age, min depth; a cap stepper (36px round buttons, value 1–3); and card lifetime (read-only 75). The header preview recomputes live, e.g. "With these rules, now: NVDA would card".
  3. **Paper:** notional input, plus a ledger link.
  4. **Watchlist:** removable chips (34px, with a ✕ button), plus a dashed "+ Add name".
  5. **Notifications:** 4 switches (46×28). On = cream track with an ink knob at left 21. Off = `--track` with a 14% ring and a dim knob at left 3. `role="switch"` with `aria-checked`.
  6. **Danger zone:** border in red at 30%. Destructive buttons are outlined red: "Reset paper", "Unlink".

### 5B.10 Gap board grid (Home)

- Columns `1.9fr 1fr 1fr .8fr .8fr .8fr .8fr .6fr 132px 110px`: Name, Cash mid, Token/share, Gap, Costs, Net, Depth, Age, 60 min, State.
- Header row 42px, mono 10.5px `.14em` `--dim`. Body rows 56px, mono 13px, with a 5% bottom hairline.
- The name cell has a 32px token badge, the symbol (Jakarta 700 14px) and the name (12px `--dim`).
- Colours: token/share `--ink-2`; costs `--neg`; net lime when CARD, otherwise `--ink-2` if ≥ floor or `--dim` if below; depth `--thin` when under the minimum; age `--neg` when stale.
- **Sparkline:** 112×28, a 24-point seeded series ending on the live net, a dashed floor line, a 1.5px stroke in the net colour, and a 2.5px end dot.
- The CARD row pulses (see J3).
- These are CSS grids, not `<table>`. Template loops such as `<sc-for>` inside `<tbody>` get hoisted out of the table by the HTML parser.

### 5B.11 Interactions

| Screen    | Control                                         | Effect                                                                        |
| --------- | ----------------------------------------------- | ----------------------------------------------------------------------------- |
| All       | Paper/Live toggle                               | Pill labels, live strip, route steps, fill copy. The state is per artboard.   |
| Home      | Do it / Skip                                    | Re-quote line appears / the timer resets to 75                                |
| Watchlist | State filter                                    | Filters rows; the title shows the count                                       |
| Watchlist | Row                                             | Selects the name, and the detail panel re-renders                             |
| Card      | Do it                                           | Phases 1 → 4 at 0 / 700 / 1400 / 2100 ms, the clock holds, shimmer at phase 2 |
| Card      | Skip                                            | Resets the phase and t = 75                                                   |
| History   | Tabs / rows                                     | Filters the ledger / changes the drawer                                       |
| Settings  | Inputs, stepper, chips, switches, Save / Revert | Live preview, dirty state, persisted to the component state                   |

### 5B.12 Copy deck, generators, geometry

Everything below is taken from the artboard source. Dynamic lists come from running each screen's `renderVals()`; static copy comes from the markup in document order. Rebuilding from this section plus §5B.1–5B.11 reproduces every screen exactly.

#### A. Common copy (all six screens)

**Rail tooltips (`data-tip`)**, top to bottom:

| Item        | Tooltip            |
| ----------- | ------------------ |
| Search      | Search ⌘K          |
| Home        | Home               |
| Watchlist   | Watchlist · 11     |
| Active card | Active card · NVDA |
| History     | History            |
| Token       | Token              |
| Settings    | Settings           |
| Health dot  | All systems OK     |

- Avatar: `[AV]`.
- **Mode toggle:** Paper · Live.
- **Live strip:** mono "LIVE" + "Do it places one cash-equity order on your Agentic Account through the Robinhood Trading MCP. Nothing else moves." (Home only.)
- **Status pills:**
  - `● RTH · 1h 57m left`: Home, Watchlist, Card.
  - `Cap 1/3`: Home, Watchlist, Card.
  - `Feeds 6/6 OK`: Home only.

**Top-bar titles and context labels:**

| Screen    | H1          | Context label                                        |
| --------- | ----------- | ---------------------------------------------------- |
| Home      | Home        | Fri 26 Sep · **14:02:41 ET**                         |
| Watchlist | Watchlist   | 11 names · **14:02:41 ET**                           |
| Card      | Card · NVDA | card_7f3a91 · #2 today · **emitted 14:02:18.412 ET** |
| History   | History     | Mon 22 → Fri 26 Sep · 5 sessions                     |
| Token     | Token       | $[TICKER] · details pending                          |
| Settings  | Settings    | rules are yours · the model never places             |

Bold marks the part rendered in `--ink`; the rest is `--dim`.

**Extra top-bar controls:**

- History: "Export CSV" (secondary, 40px).
- Token: an amber "Pre-launch" pill.
- Settings: "Unsaved changes" (shown only while there are changes), "Revert", and "Save changes", which becomes "Saved ✓".

#### B. Home copy

**Active card panel:**

- Eyebrow: "Active card · #2 today". Mode pill: PAPER or LIVE.
- Ring sub-label: "EXPIRES".
- Name block: "NVDA" · "NVIDIA".
- Value: "+9.4" plus "net bps".
- Formula line: "|gap| 17.0 − fees 3.5 − slip 2.1 − buffer 2.0".
- Cells: Cash mid $182.40 · Token / share $182.71 · Leg: Cash only.
- Re-quote line: "Re-quoted · cash 182.41 · net 8.9 bps · still clears · " followed by "paper fill at $182.41" (paper) or "order sent via Trading MCP" (live).
- Buttons: Do it · Skip · Open card →.

**Gates · NVDA** (header pill "4/4 pass"):

| Gate    | Rule                | Value  |
| ------- | ------------------- | ------ |
| Net gap | net ≥ 2.0 bps floor | 9.4    |
| Session | RTH 09:30–16:00 ET  | 1h 57m |
| Depth   | top of book ≥ $100k | $420k  |
| Cap     | ≤ 3 cards per day   | 1/3    |

Bar block: "NET VS FLOOR" · "floor 2.0 · net 9.4" · axis labels "0" and "17.0 bps gross".

**Today** (header meta: "since 09:30"):

- "Daily cap" · 1/3 · "used 1 · pending 1 (NVDA)".
- Rows: Evaluations 14,382 · Cards emitted 2 · Paper P&L today +$51.00 · Best raw gap HOOD 44.8 · THIN.

**Live gap board:**

- Header: pill "SSE · 250 ms" · "ILLUSTRATIVE" · pills Card 1 / Thin 2 / Stale 1 / Dust 7 · "Open watchlist →".
- Footer, left: "costs = fees 3.5 + slippage + buffer 2.0 · floor: net ≥ 2.0 bps · depth ≥ $100k · age ≤ 2.0 s".
- Footer, right: "evaluated every tick · gates in order: feed → session → depth → net".

**Performance · last 5 sessions:**

- Range toggle: 5D · 1M · All.
- Chart caption: "Cumulative paper P&L · per taken card". Meta: "notional $100,000 per card · illustrative".
- Y labels: "$400" (top) and "$0". X labels: `Mon NVDA`, `Mon AMZN`, `Tue PLTR`, `Tue AAPL`, `Wed AMD`, `Wed NVDA`, `Thu NVDA`, `Fri TSLA`.

| KPI                | Value           | Sub                  |
| ------------------ | --------------- | -------------------- |
| Paper P&L          | +$354.00 (lime) | 8 taken cards        |
| Hit rate           | 75%             | 6 of 8 positive      |
| Avg net at confirm | 6.3             | bps · taken cards    |
| Cards emitted      | 14              | 13 closed · 1 active |

**Outcomes · 13 cards** (link "History →"):

| Outcome       | Count · % | Colour    |
| ------------- | --------- | --------- |
| Taken         | 8 · 62%   | lime      |
| Skipped       | 2 · 15%   | `--ink-2` |
| Expired       | 2 · 15%   | `--dead`  |
| Re-quote fail | 1 · 8%    | `--neg`   |

"Why no card · today's evaluations": DUST 71% · THIN 12% · STALE 9% · CLOSED 8%.

**Session · Fri 26 Sep · ET** (meta: "live orders RTH only"):

- Axis labels: "04:00 PRE", "09:30 RTH" (lime), "16:00 AFTER", "20:00".
- Needle: "NOW 14:02".
- Tick titles: 10:14 TSLA taken · 11:02 COIN stale · 12:40 HOOD thin · 14:02 NVDA card.

**System health** (pill "6/6 OK"):

| Service             | What                                             | Metric             | State                 |
| ------------------- | ------------------------------------------------ | ------------------ | --------------------- |
| Robinhood quotes    | cash mid · 11 names                              | 38 ms              | OK                    |
| Chainlink           | token / share feed                               | hb 1.1 s           | OK                    |
| Robinhood Chain RPC | block + depth reads                              | 212 ms             | OK                    |
| Redis bus           | market → user plane                              | lag 3 ms           | OK                    |
| SSE stream          | this client                                      | 250 ms             | OK                    |
| Trading MCP         | idle in paper · _live:_ Agentic Account · linked | — · _live:_ 164 ms | IDLE · _live:_ LINKED |

**Activity · today** (meta: "9 events"):

| Time     | Kind    | Colour     | Message                        |
| -------- | ------- | ---------- | ------------------------------ |
| 09:30:00 | SESSION | `--closed` | RTH open · 11 names armed      |
| 10:14:07 | CARD    | lime       | TSLA · net 6.8 bps · cap 1/3   |
| 10:14:31 | DO IT   | lime       | TSLA re-quote 5.9 bps · clears |
| 10:14:31 | FILL    | lime       | TSLA paper fill at confirm mid |
| 11:02:44 | STALE   | `--neg`    | COIN chain feed 3.8 s old      |
| 12:40:10 | THIN    | `--thin`   | HOOD depth $45k < $100k        |
| 13:15:02 | DUST    | `--dim`    | META net 1.2 < floor 2.0       |
| 14:02:18 | CARD    | lime       | NVDA · net 9.4 bps · #2 today  |
| 14:02:41 | NOW     | `--ink`    | awaiting your tap · {t} s left |

**Route** (pill = mode; button "Execution settings"):

| #   | Paper                                                       | Live                                                   |
| --- | ----------------------------------------------------------- | ------------------------------------------------------ |
| 1   | You tap Do it · _the only trigger_ (lime)                   | same                                                   |
| 2   | Re-quote + gate re-check · _both legs, fresh prices_ (lime) | same                                                   |
| 3   | Paper engine · _fill at confirm mid_ (`--ink-2`)            | Robinhood Trading MCP · _one cash-equity order_ (lime) |
| 4   | Paper ledger · _no money moves_ (`--ink-2`)                 | Agentic Account · _your account, your funds_ (lime)    |

#### C. Watchlist copy

**Filter rail:**

- "State" · "which gate stopped it": All names 11 · Card 1 · Thin 2 · Stale 1 · Dust 7.
- "Rules" · "edit in Settings": Net floor 2.0 bps · Fees 3.5 bps · Buffer 2.0 bps · Min depth $100k · Max age 2.0 s.
- "Feeds": Cash · Robinhood 38 ms · Token · Chainlink 1.1 s hb · SSE 250 ms (values in lime).
- Button: "+ Add name".

**Search and sort:**

- Placeholder "Search 11 names", with a visually hidden label "Search names".
- Sort toggle: Net · Gap · Depth · A–Z.

**Table:**

- Title is `{filter} · {count}` ("All names · 11", "CARD · 1", …).
- Meta: "click a row for detail · ILLUSTRATIVE". Headers as in §5B.5.
- Fees always −3.5 and buffer always −2.0.

**Detail panel:**

- Sub-line: "cash mid vs token × multiplier · last 60 min".
- Pill: `{STATE} · {reason}`.

| State | Reason             |
| ----- | ------------------ |
| CARD  | all gates pass     |
| DUST  | net under floor    |
| THIN  | depth under $100k  |
| STALE | chain feed > 2.0 s |

- Legend: "|gap| gross" · "net" · "costs" · "floor 2.0". X labels: 13:03 · 13:33 · 14:02.
- "Gap math" rows: Cash mid · Token / share · |gap| · − fees 3.5 · − slippage · − buffer 2.0 · Net `{±n.n} bps`.
- "Gates" pills: `Feed ✓/✕` · `Session ✓` · `Depth ✓/✕` · `Net ✓/✕`.

#### D. Card copy

**Card panel:**

- Name block: "NVDA" · "NVIDIA · token rich".
- Ring sub-label: "UNTIL EXPIRY", or "HELD · CONFIRMING" once `phase > 0`.
- Value block: "Net after costs" · "+9.4" (then "+8.9" from phase 2) · "bps" · "floor 2.0 · headroom +7.4 bps" (then "+6.9 bps").
- Cells: Cash mid $182.40 (then $182.41) · Token / share $182.71 · Leg: Cash only.
- Footnote: "The model does not place. Do it re-quotes both legs and re-checks every gate. If net falls under 2.0 bps, nothing happens."

**Confirm flow** (the meta shows "—" until the step is reached):

| #   | Step                                                         | Meta                                                     |
| --- | ------------------------------------------------------------ | -------------------------------------------------------- |
| 1   | You tap Do it                                                | 14:02:41.090                                             |
| 2   | Re-quote both legs                                           | cash 182.41 · token 182.71                               |
| 3   | Re-check 4 gates                                             | net 8.9 ≥ 2.0 · RTH · $420k · 1/3                        |
| 4   | Paper fill at confirm mid · _live:_ Send order · Trading MCP | $182.41 · no money moves · _live:_ one cash-equity order |

- Done message, paper: "Paper fill recorded at $182.41 · cap now 2/3 · see History."
- Done message, live: "Order sent to your Agentic Account through the Robinhood Trading MCP · cap now 2/3."
- Button labels: Do it → Confirming… → Done.

**Both legs · card window** (meta: "last 98 s · card at 14:02:18 · ILLUSTRATIVE"):

- Legend: token × mult · cash mid · gap.
- Y labels: 182.90 / 182.70 / 182.50 / 182.30. X labels: 14:01:03 · "14:02:18 · card" · 14:02:41.

**Haircut · gross to net** (meta "bps"): |gap| 17.0 · − fees 3.5 · − slippage 2.1 · − buffer 2.0 · Net 9.4, with the marker "FLOOR 2.0".

**Audit trail · card_7f3a91** (meta: "immutable · exported with History"):

| Time         | Kind    | Message                                                      | Value      |
| ------------ | ------- | ------------------------------------------------------------ | ---------- |
| 14:02:18.180 | FEED    | cash mid 182.40 · Robinhood quotes                           | age 0.3 s  |
| 14:02:18.201 | FEED    | token/share 182.71 · Chainlink                               | hb 1.1 s   |
| 14:02:18.244 | GAP     | \|gap\| 17.0 bps · token rich                                |            |
| 14:02:18.245 | HAIRCUT | fees 3.5 · slip 2.1 · buffer 2.0                             | −7.6       |
| 14:02:18.246 | GATES   | net 9.4 ≥ 2.0 · RTH · $420k ≥ $100k · 1/3                    | 4/4        |
| 14:02:18.412 | CARD    | emitted card_7f3a91 · expires 14:03:33.412                   | 75 s       |
| 14:02:18.460 | SSE     | pushed to 1 client                                           | 48 ms      |
| 14:02:41.000 | NOW     | awaiting your tap, or "confirm in progress" once `phase > 0` | {t} s left |

Kind colours: FEED and SSE `--dim`, GAP `--ink-2`, HAIRCUT `--neg`, GATES and CARD lime, NOW `--ink`.

**On Do it · {PAPER|LIVE}:**

| #   | Head                   | Paper                                                                  | Live                                                                                |
| --- | ---------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 01  | Hold the clock         | The countdown freezes while GAUGE confirms. No double taps.            | same                                                                                |
| 02  | Re-quote               | Fresh cash mid and token/share. The card numbers are never reused.     | same                                                                                |
| 03  | Re-check gates         | All four gates again, on the new prices. One fail and nothing happens. | same                                                                                |
| 04  | Paper fill / One order | Recorded at the confirm mid. No broker, no money.                      | One cash-equity order via the official Robinhood Trading MCP, Agentic Account only. |

Size row: "$100,000 notional · paper", or `[ORDER_SIZE]` in live mode.

#### E. History copy

**KPIs:**

| Label             | Value    | Sub                               |
| ----------------- | -------- | --------------------------------- |
| Paper P&L         | +$354.00 | 8 taken cards                     |
| Hit rate          | 75%      | 6 of 8 positive                   |
| Avg net @ card    | 7.0      | bps · taken                       |
| Avg net @ confirm | 6.3      | bps · re-quote drift -0.7         |
| Cards             | 14       | 8 taken · 2 skip · 2 exp · 1 fail |

**Cap usage** · "cards per session · max 3":

| Session | P&L      | Pips                            |
| ------- | -------- | ------------------------------- |
| Mon 22  | +$71.00  | taken, skipped, taken           |
| Tue 23  | +$121.00 | taken, expired, taken           |
| Wed 24  | +$43.00  | taken, skipped, taken           |
| Thu 25  | +$68.00  | taken, expired, fail            |
| Fri 26  | +$51.00  | taken, pending (striped), empty |

- **Tabs:** All 14 · Taken 8 · Skipped 2 · Expired 2 · Fail 1. Ledger meta: "ILLUSTRATIVE · notional $100k".
- Empty cells show "—".
- **Drawer:**
  - Card id: `card_7f3a91` for the active card. Otherwise `'card_' + (0x3b10 + index × 37).toString(16)`, where index is the row's position in the list with the active card first.
  - Sub-line: `{Day} Sep · {HH:MM} ET · paper`.
  - CTA: "Open active card →" or "Open audit trail →".

**Drawer timeline rules** (first row always "Card emitted · net {@card}" at `{HH:MM}:18`, lime):

| Outcome       | Following rows (text · time · colour)                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ACTIVE        | Awaiting your tap · now · `--ink`                                                                                                                       |
| TAKEN         | Do it · re-quote {@confirm} clears · `:41` · lime → Paper fill at confirm mid · `:41` · lime → Captured {±c} bps at session close · 16:00 · lime or red |
| RE-QUOTE FAIL | Do it · re-quote {@confirm} < floor 2.0 · `:52` · red → No order · card closed · `:52` · `--dim`                                                        |
| SKIPPED       | You skipped · `:30` · `--ink-2`                                                                                                                         |
| EXPIRED       | Expired after 75 s · no tap · `:33` · `--dead`                                                                                                          |

#### F. Token copy

- Mark caption: "MARK · PLACEHOLDER UNTIL TOKEN ART". Eyebrow: "GAUGE token".
- Title: `$` + `[TICKER]` (Doto). Sub-line: "[TOKEN_NAME] · on [CHAIN]".
- Buttons: "Add to wallet" (secondary) · "Get notified at launch" (primary).
- Stat cells: Price [PRICE] · 24h [CHANGE_24H] · Market cap [MCAP] · Holders [HOLDERS]. Chart placeholder text: "PRICE CHART APPEARS AT LAUNCH".
- **Your position** (pill "Wallet not linked"): Balance [AMOUNT] $[TICKER] · Value [USD_VALUE] · Wallet —, then a "Link a wallet" button and the note "GAUGE never holds funds. Wallet flow is a placeholder until launch."
- **Token facts** (meta "fill before launch"): Chain [CHAIN] · Contract [CONTRACT_ADDRESS] · Supply [SUPPLY] · Decimals [DECIMALS] · Launch [LAUNCH_DATE] · Explorer [EXPLORER_URL].
- **Launch checklist** (pill "0/5"): Ticker and name · Utility inside GAUGE · Contract address · Chain and explorer · Launch date.
- **Utility inside GAUGE** (meta "three slots · defined at launch"):
  - 01 [UTILITY_1]: "What holding $[TICKER] changes inside GAUGE. Written once the token design is final."
  - 02 [UTILITY_2]: "A second benefit, if any. Leave empty rather than invent one."
  - 03 [UTILITY_3]: "A third benefit, if any. Leave empty rather than invent one."

#### G. Settings copy

- **Section nav:** Mode & account · Gates · Paper · Watchlist · Notifications · Danger zone.
- **Mode & account:**
  - Mode: "Paper fills at the confirm mid. Live places one cash-equity order after you tap Do it."
  - Robinhood Agentic Account (badge "RH"):
    - Status: "Not linked · paper only" (`--dim`), or "Linked via Robinhood Trading MCP · live orders RTH only" (lime).
    - Button: "Link via Trading MCP" (primary), or "Linked ✓" (secondary).
    - Selecting Live also sets linked = true.
  - Confirm before every order: "Always on. GAUGE has no auto-place setting." Pill: "Locked on".
- **Gates:**

| Field                     | Help                                             | Unit | Default |
| ------------------------- | ------------------------------------------------ | ---- | ------- |
| Net floor                 | Minimum net bps after all costs. Below it: DUST. | bps  | 2.0     |
| Buffer                    | Safety margin taken off every gap.               | bps  | 2.0     |
| Fees (read-only)          | From the fee schedule. Not editable.             | bps  | 3.5     |
| Max quote age             | Either leg older than this: STALE.               | s    | 2.0     |
| Min depth                 | Top-of-book size needed to fill. Below it: THIN. | $k   | 100     |
| Daily cap (stepper 1–3)   | Cards per session. Maximum 3.                    | –    | 3       |
| Card lifetime (read-only) | Fixed. A card that isn't tapped in time is gone. | s    | 75      |

- Header preview: "With these rules, now: {names} would card", or "no name would card".
- The preview recomputes net per name as `|gap| − 3.5 − slip − buffer ≥ floor`, and also checks age and depth. Removed watchlist names are excluded.
- **Paper:**
  - Notional per card: "Used to turn captured bps into paper P&L." Value 100,000 USD.
  - Paper ledger: "13 closed cards · since Mon 22 Sep", with an "Open history" button.
- **Watchlist · {n}** (meta: "Robinhood Chain stock tokens · [LIST_TBD]"): 11 chips with ✕ buttons (`aria-label` "Remove {SYM}"), plus "+ Add name", which restores all names in the mock.
- **Notifications:**

| Switch              | Help                                           | Default |
| ------------------- | ---------------------------------------------- | ------- |
| Push on new card    | A card lasts 75 s. Get it on your phone.       | on      |
| Sound on new card   | Short chime in the browser tab.                | off     |
| Daily summary email | Cards, outcomes and paper P&L after the close. | on      |
| Alert on stale feed | When either leg goes older than max quote age. | on      |

- **Danger zone:**
  - Reset paper ledger: "Clears 13 paper cards and P&L. Live history is untouched." Button: "Reset paper".
  - Unlink Agentic Account: "GAUGE drops back to paper. Nothing in your account changes." Button: "Unlink".

#### H. Sample-data generators (exact)

All three charts share one seeded LCG, so curves are identical on every render:

```js
seed = (seed * 9301 + 49297) % 233280;
const r = seed / 233280 - 0.5; // r ∈ [-0.5, 0.5)
```

**Home sparkline** (per row, 112 × 28, 24 points):

```js
let seed = sym.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0),
  v = [];
for (let i = 0; i < 24; i++) {
  seed = (seed * 9301 + 49297) % 233280;
  v.push(net + (seed / 233280 - 0.5) * 8 * (1 - i / 30));
}
v[23] = net; // always ends on the live net
const lo = Math.min(...v, FLOOR) - 1,
  hi = Math.max(...v, FLOOR) + 1;
const y = (x) => 26 - ((x - lo) / (hi - lo)) * 24; // x step = 110/23; end dot at x=110
// path: 'M' then 'L' points; floor line at y(FLOOR), dashed 2 3, cream 12%
```

**Watchlist detail** (700 × 220, 60 points, one per minute from 13:03 to 14:02):

```js
let seed = sym.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0) * 7;
const g = [];
for (let i = 0; i < 60; i++) {
  seed = (seed * 9301 + 49297) % 233280;
  g.push(
    Math.max(
      0.2,
      gap + (seed / 233280 - 0.5) * 12 * (1 - i / 70) + Math.sin(i / 6) * 2,
    ),
  );
}
g[59] = gap;
const nv = g.map((x) => x - costs),
  lo = Math.min(...nv, 0) - 2,
  hi = Math.max(...g) + 2;
const Y = (v) => 190 - ((v - lo) / (hi - lo)) * 180,
  X = (i) => (i * 696) / 59;
// cost band = gross path + reversed net path + 'Z'; end dot at (696, Y(nv[59]))
```

**Card price window** (760 × 230, 99 samples, 1 per second from 14:01:03 to 14:02:41):

```js
let seed = 777;
const cash = [],
  tok = [];
for (let i = 0; i < 99; i++) {
  seed = (seed * 9301 + 49297) % 233280;
  const r = seed / 233280 - 0.5;
  const base = 182.4 + Math.sin(i / 9) * 0.06 + r * 0.04;
  cash.push(i === 98 ? 182.4 : base);
  tok.push(i === 98 ? 182.71 : base + 0.28 + Math.sin(i / 5) * 0.04 + r * 0.03);
}
const X = (i) => 50 + (i * 706) / 98,
  Y = (v) => 200 - ((v - 182.3) / 0.6) * 180;
// card marker at X(75) (14:02:18, 23 s before now); gap band = token path + reversed cash path + 'Z'
```

**Home P&L chart** (800 × 206):

```js
cum_i = Σ captured_bps × 100000 / 1e4 over taken cards in order
maxV = ceil(max(cum) / 100) × 100            // 400
X(i) = 70 + i × 720 / (n − 1) ;  Y(v) = 200 − v / maxV × 180
dots: path 'M(x−4) y a4 4 0 1 0 8 0 a4 4 0 1 0 −8 0' per point (lime if captured ≥ 0, else red)
area = line + ' L lastX 200 L firstX 200 Z', gradient lime 28% → 0
labels: HTML spans at left = X(i)/8 %, text = first 3 letters of the day + ' ' + sym
```

`<sc-for>` is not used inside `<svg>`, because the HTML parser moves unknown elements out of SVG. Repeated SVG marks are built as one precomputed `d` string.

#### I. Remaining geometry

| Element                     | Spec                                                                                                                                                                                                                                               |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rail G mark                 | 34 × 34, viewBox `-2 -2 62 62`, arc `M45.6 12.4A23.5 23.5 0 1 0 52.5 29` stroke 11 cream + rect 29,23.5 29×11 lime                                                                                                                                 |
| Token badge `.tk`           | 32 (Home), 40 (detail/card header), 28 (History). Round, `#1A1D21`, 1px border at 10%, mono 500 9px `--muted`                                                                                                                                      |
| Inset cell                  | padding 12/14 (Home) or 14/16 (Card), radius 14, `--bg`, 1px `--line`. Label 10px mono; value mono 16–17px                                                                                                                                         |
| Gate row (Home)             | grid `28px 1fr auto`, padding 14/0; badge 24px round (lime 12% fill, 50% border, ✓ 12px); name 15/600; rule mono 11.5 `--dim`; value mono 14 lime                                                                                                  |
| Net-vs-floor bar            | 8px track; fill `linear-gradient(90deg, rgba(178,212,80,.4), #B2D450)` width 55% + glow; floor tick 2px cream at 11.7% (2.0/17.0), overhanging 4px each side                                                                                       |
| Home ring                   | 132px, viewBox 124, r54 stroke 7; clock Unbounded 700 24 at y62; "EXPIRES" mono 8 at y80                                                                                                                                                           |
| Card ring                   | 200px, viewBox 124, r54 stroke 6, inner r46 cream 8% `dasharray 1 4.82` (≈60 ticks); clock 22 at y62; sub-label mono 6.5 at y78                                                                                                                    |
| Confirm step dot            | 22px round, 11px glyph. wait: 1px border at 18%, number in `--dim`. now: 1.5px lime border + `0 0 12px` glow, "•". done: lime 15% fill, 60% border, "✓"                                                                                            |
| Health row                  | grid `1fr auto auto`, padding 12/0; name 14/600; what mono 11 `--dim`; metric mono 12 `--ink-2`; pill 22px 9.5px                                                                                                                                   |
| Log / audit row             | mono 12; Home grid `70px 70px 1fr` (message ellipsised); Card grid `110px 92px 1fr auto`; padding 10–11/0, 5% hairline                                                                                                                             |
| Route step                  | grid `22px 1fr`; dot 12px with `0 0 10px` glow in its colour, offset 4px/5px                                                                                                                                                                       |
| KPI cell                    | padding 18/22 (Home) or 20/22 (History), right hairline at 6%; value Unbounded 700 26/28 −0.04em                                                                                                                                                   |
| Outcome bar                 | 12px, radius 999, `overflow:hidden`, 2px gaps, `flex-grow` = count                                                                                                                                                                                 |
| Why-no-card row             | grid `64px 1fr 42px`, 6px bars                                                                                                                                                                                                                     |
| Session track               | 40px box; 8px track at top 16; RTH band lime 25% fill + 50% border; elapsed fill lime + glow; ticks 2×28 at top 6; NOW needle 2px full height, cream glow, label mono 10 at top −14                                                                |
| Cap pips                    | 6px (Home) or 8px (History), 3-column grid, gap 6/4                                                                                                                                                                                                |
| Filter button               | 40px, radius 12, padding 0 12, 14px `--ink-2`; 7px dot; count mono 12                                                                                                                                                                              |
| Watchlist row button        | `all:unset` then redeclare the grid (see §5B.5), 58px                                                                                                                                                                                              |
| Ledger row button           | `all:unset` then redeclare grid `.9fr .7fr 1fr .8fr .9fr 1.2fr .8fr .9fr`, padding 0 22, 56px                                                                                                                                                      |
| History drawer cells        | padding 14, radius 14; value Unbounded 700 24                                                                                                                                                                                                      |
| Timeline dot                | 9px, `0 0 8px` glow in its colour, margin-top 5                                                                                                                                                                                                    |
| Token mark SVG              | 300 × 300: dotted ring r136 (`2 8`, cream 8%) + satellite r4 lime at (286,150); arc ring r112 lime 25% `dasharray 60 644`; hexagon `M150 54l83 48v96l-83 48-83-48v-96z` fill `#0F1113`, stroke lime 50% 1.5; G at `translate(111 111) scale(1.34)` |
| Token hero left             | 380px column, radial `60% 60% at 50% 50%` lime 14% → 0 at 70%                                                                                                                                                                                      |
| Placeholder value `.ph-val` | `--thin` (#E8B04A), so it reads as unfilled                                                                                                                                                                                                        |
| Settings input              | 46px, radius 12, padding 0 14; input mono 15 right-aligned; unit mono 12 `--dim` with 8px left margin                                                                                                                                              |
| Stepper                     | 36px round, 1px border at 18%, glyph 18px; value Unbounded 700 26, 28px wide                                                                                                                                                                       |
| Switch                      | 46 × 28, knob 22px at top 3; on: track `--ink`, knob `#0B0D07` at left 21; off: track `--track` + inset 1px at 14%, knob `--dim` at left 3                                                                                                         |
| Chip                        | 34px, padding 0 8 0 14, radius 999, `#0F1113`, 1px at 12%, mono 500 13; ✕ in a 20px round at 5% cream                                                                                                                                              |
| Danger button `.bd`         | transparent, `--neg` text, 1px `--neg` border at 45%                                                                                                                                                                                               |

## 5C. Docs (4 screens)

The docs row sits below the app under the canvas title "GAUGE · Docs" (note at 1560, 4160). All four screens are 1440 wide and interactive, and they link to each other.

| Artboard                 | x, y       | h    | Page                          |
| ------------------------ | ---------- | ---- | ----------------------------- |
| `DocsHome.dc.html`       | 1560, 4420 | 1760 | Docs home (overview)          |
| `DocsQuickstart.dc.html` | 3080, 4420 | 3000 | Quickstart (straight to live) |
| `DocsCard.dc.html`       | 4600, 4420 | 3900 | How a card is made            |
| `DocsReasons.dc.html`    | 6120, 4420 | 3700 | Reason codes                  |

**Treatment, "calm reading mode":** the same tokens as §2 and §5B.1, dialled down.

- **Kept from the landing page:**
  - one lime glow (docs home only);
  - panels and the featured panel for tiles and callouts;
  - Doto only on the home headline and the reason-code words.
- **Dropped:** grid texture, edge glows and planet art.
- **Type:** smaller display, and a 720px reading column.

### 5C.1 Shell

- **Root:** `width:1440px; min-height:<h>px; background:--bg`.
- **Docs nav (`.dnav`)**, a floating glass pill:
  - `position:sticky; top:16px; width:1376px; height:60px; margin:16px auto 0; padding:0 8px 0 22px; radius 999`, fill `rgba(12,13,15,.7)`, `blur(18px) saturate(140%)`, border at 10%, shadow `0 16px 50px rgba(0,0,0,.45)` plus `inset 0 1px 0 rgba(249,247,244,.06)`.
  - **Left:** wordmark at 96×21, then a "DOCS" pill (mono 11px `.2em`, lime, lime border at 40%, padding 3/9), then links at a 26px gap (Jakarta 500 14px `--ink-2`; active: lime).
  - **Right:** search button (`.srch`: 300×40, radius 999, `--bg` fill, border at 12%, 15px icon, "Search docs", `⌘K` kbd chip: mono 500 11px, 1px border at 14%, radius 6, padding 2/8), then "Open GAUGE ↗" primary (44px) linking to `Home.dc.html`.
- **Layout grid:** `width:1300px; margin:0 auto; padding-top:48px; display:grid; gap:56px`.
  - Home: `248px 1fr`.
  - Articles: `248px 1fr 220px`, which gives a 720px centre column.
- **Sidebar (`.side`):** `position:sticky; top:100px`, flex column, gap 22.
  - Group label: mono 500 10.5px `.2em` uppercase `--dim`, margin 0 0 6 12.
  - Link `.nl`: 34px, padding 0 12, radius 10, 14px `--muted`. Hover: 4% fill. Active: lime, lime 8% fill, `inset 0 0 0 1px rgba(178,212,80,.25)`, plus `aria-current="page"`.
  - Tree:
    - GET STARTED: Overview · Quickstart · Link your Agentic Account · Paper vs live
    - HOW GAUGE WORKS: How a card is made · The four gates · Reason codes · Card lifecycle · Daily cap
    - SAFETY: What GAUGE won't do · The token is not the share
    - DEVELOPERS + `DRAFT` chip: Architecture · Gap math spec · Event stream (SSE) · Card event · Reason event
    - REFERENCE: Glossary · FAQ · Changelog
  - Undrawn pages link to `#`.
- **DRAFT chip (`.draft`):** 18px, padding 0 7, radius 999, border `rgba(232,176,74,.45)`, `--thin` text, mono 500 9px `.14em`. It marks every developer item and every drafted code block.
- **TOC (`.toc`):** sticky at top 100.
  - Label "ON THIS PAGE" (mono 10.5 `.2em` `--dim`).
  - Links sit in a column with 16px left padding and a 1px left rule at 8%. Each link is 13px `--dim`, padding 6/0. The active link is ink with a 6px lime dot and glow placed via `::before` (`margin-left:-16px`).
  - Below: "Edit this page ↗" and "Report an issue ↗" (mono 12 `--dim`).

### 5C.2 Article typography (`.art`)

| Element           | Spec                                                                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Breadcrumb        | mono 12 `--dim`, `/` separators, current page in `--ink`, margin-bottom 18                                                                         |
| H1                | Unbounded 700, 40px, −0.045em, lh 1.08                                                                                                             |
| Lede              | 19px `--muted`, margin 16/0/20                                                                                                                     |
| Meta row          | mono 12 `--dim` ("N min read · type · note"), bottom hairline at 8%, padding-bottom 28                                                             |
| H2                | Unbounded 600, 23px, −0.03em, margin 56/0/14, `scroll-margin-top:100px`. An optional `.n` prefix is mono 500 13px lime `.1em` ("01" … "06", "DEV") |
| Body `p`, `li`    | Jakarta 16.5px / 1.75 `--ink-2`; `strong` in `--ink` 600                                                                                           |
| Inline `code`     | mono 13.5, 6% fill, 1px border at 8%, padding 1/6, radius 6, `--ink`                                                                               |
| Path chip `.path` | mono 500 13px, padding 4/10, radius 999, 4% fill, border at 10%. Used for UI paths ("Settings → Gates")                                            |
| Link in body      | lime                                                                                                                                               |

### 5C.3 Components

| Component                    | Spec                                                                                                                                                                                                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Callout `.note`              | flex, gap 14, padding 16/18, radius 14, 15px/1.65. Starts with a mono 12 tag (TIP, NOTE, RULE, ORDER, REQUIRED) and a bold lead-in. `.tip`: lime 6% fill, border at 30%, text `#D9EBA0`. `.warn`: amber 6% fill, border at 35%, text `#F0D39A`. It has a full border, not a left-border accent.        |
| Code block `.code`           | radius 14, `#0C0D10`, border at 9%. Header 40px: filename or event name (mono 500 11.5 `--dim`), DRAFT chip, and a Copy button (`.cp`: 26px pill, border at 14%, mono 11; label goes "Copy" → "Copied ✓" for 1.6s). `pre`: padding 16/18, mono 13.5/1.75, `white-space:pre`                            |
| Syntax colours               | keyword/key `.k` `#8FA6DA` · string/number literal `.s` lime · type, fn name, numeric value `.nm` `#E4F5A6` · comment `.c` `#80848A` (5.2:1; was #6B6F75 at 3.8:1, below AA) · plain `--ink-2`                                                                                                         |
| Formula block `.formula`     | padding 22/24, radius 16, background `radial-gradient(120% 120% at 0 0, rgba(178,212,80,.08), transparent 60%), #0C0D10`, lime border at 30%, mono 500 17/1.7 `--ink`. Label `.lab`: 10.5px `.2em` lime. A worked-example variant is 15px on a plain background with a 10% border and a `--dim` label. |
| Doc table `.dt`              | full width, 14.5px. `th`: mono 500 10.5 `.14em` `--dim`, padding 10/12, bottom border at 10%. `td`: padding 12, border at 6%. Value cells `.v`: mono `--ink`, nowrap, tinted by state. These are real `<table>` elements because the tables are static.                                                |
| Step (Quickstart) `.step`    | grid `40px 1fr`, gap 18. Number badge: 36px round, mono 600 13 lime, lime border at 50%, 8% fill. Its H2 has no `.n` prefix, so the number only appears once.                                                                                                                                          |
| Prev/next `.pn`              | 2-column grid at gap 14, margin-top 48. Each is a panel with padding 18/20, radius 16. Label mono 11 `--dim` ("← PREVIOUS" / "NEXT →"), title 16/600. Hover: lime border at 45%.                                                                                                                       |
| Reason panel `.rc` (Reasons) | grid `200px 1fr`, gap 28, padding 26, radius 20, panel gradient. Left: code in Doto 900 40px in its state colour, gate label mono 11 `.16em`. Right: H3 in Unbounded 600 18, body, "What to do:", and an example box `.ex` (padding 12/14, radius 12, `--bg`, mono 12.5/1.6)                           |
| Jump tile `.jump` (Reasons)  | padding 16, radius 16, `#0C0D10`, border at 8% (hover: lime at 40%). Doto 26px code plus a mono 11 gate label                                                                                                                                                                                          |

### 5C.4 Docs home (1440 × 1760)

- **Atmosphere:** one lime radial glow (1100×760, 10%, blur 30) centred above the nav at top −420.
- **Header** (padding 24/0/44, gap 20):
  - Eyebrow "GAUGE docs".
  - H1 in Unbounded 800 52px −0.05em lh 1.02: "Two prices." with "One gap." in Doto 58px lime, then a break and "Everything else, explained."
  - Lede: 18/1.65, max-width 640.
  - A large search pill: 640×56, 16px text, `⌘K` chip 12px.
- **Start here:** 3 tiles in `repeat(3,1fr)` at gap 16. Each is a link panel with padding 26, min-height 210, gap 14. Contents: mono 12 lime label, Unbounded 600 21px title, 14.5/1.6 `--muted` body, and a lime CTA (`margin-top:auto`). The first tile is featured.
- **The whole product in one line:**
  - Panel, padding 28/30.
  - SVG 900×96: a dashed lime flow line at y 30 (`dasharray 4 8`, K2), and 7 stations at x 40 / 177 / 314 / 451 / 588 / 725 / 860.
  - Station circles are r9 on a `--bg` fill with a 1.5px stroke. HAIRCUT is red; YOU TAP and ONE ORDER are lime. CARD is filled lime at r12 with an r20 halo at 18%.
  - Labels: mono 11 at y 66, sub-labels mono 10 `--dim` at y 84.
- **Guides / For developers** (`1fr 1fr`, gap 16):
  - Guides: 5 link rows (16/0, bottom hairline at 7%, meta mono 12 `--dim`).
  - Developers: a "DRAFT SCHEMAS" chip and an architecture SVG (440×150).
    - Six boxes, 120×40 at rx 10: market plane (0,10), Redis bus (160,10, lime), engine · gates (320,10), SSE → client (320,100), exec gateway (160,100), Trading MCP (0,100, lime).
    - Dashed lime connectors (K3), and "Do it only" at (300,80).
    - Then 4 link rows in 2 columns.
- **Popular questions:** 5 link rows, each answered with a lime short answer and an arrow.
- **Footer:** hairline, mono 12 `--dim`: disclaimer on the left, `Docs · [DOCS_VERSION] · © 2026 GAUGE` on the right.

### 5C.5 Quickstart (1440 × 3000)

- Seven numbered steps, straight to live, then a DEV section. See §5C.9 for the full copy.
- **Visual inserts:**
  - **Step 03:** a copy of the app's live strip (lime 8% fill, border at 35%, radius 14, pinging dot, "LIVE", text).
  - **Step 05:** a figure (`300px 1fr`, gap 24). On the left, a mini card: padding 20, radius 20, featured background, an 84px ring (r54, stroke 8, dashoffset 104 = 52 s), "+9.4" in Unbounded 800 30px lime, and inert Do it / Skip pills. On the right, a 4-item annotated list.
- **Callouts:** REQUIRED (warn) in step 02; TIP (Paper practice) in step 03; RULE ("The model does not place.") in step 06.
- **Table:** gates with their defaults and failure codes, each code in its state colour.
- **DEV:** a shell code block with the SSE `curl` (DRAFT).

### 5C.6 How a card is made (1440 × 3900)

Sections 01–06 plus DEV.

| #                 | Content                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01 Two prices     | Bullet list, a NOTE callout (the multiplier only touches the chain feed), and a sources table (cash mid · Robinhood quotes · $182.40; token per share · Chainlink · token × multiplier · $182.71)                                                                                                                                                              |
| 02 The gap        | GAP formula block; the NVDA worked example → 17.0 bps; a rich/cheap explanation                                                                                                                                                                                                                                                                                |
| 03 The haircut    | Cost table (fees 3.5 · slippage 2.1 · buffer 2.0); NET formula block; a waterfall figure (the same geometry as Card §5B.6 at 20px bars, `100px 1fr 44px`, floor marker at 11.8%)                                                                                                                                                                               |
| 04 The four gates | Gate-order SVG (680×150): pills FEED (0,22, 92w) · SESSION (145, 104w) · DEPTH (302, 92w) · NET GAP (447, 104w) · CARD (590, 90w, lime fill). Dashed lime flow at y 44 (K2). Drop lines at x 46/197/348/499 in their state colours, then codes at y 124 (14/600) and thresholds at y 142 (10px `--dim`). Followed by a pass-condition table with NVDA values ✓ |
| 05 Emit           | Bullets: lives 75 s, shows net/prices/leg, counts toward the cap whatever the outcome                                                                                                                                                                                                                                                                          |
| 06 Re-quote       | Table at card vs at confirm (182.40 → 182.41, 9.4 → 8.9 clears); the RE-QUOTE FAIL example (META Thu 25, 4.6 → 1.4); RULE callout                                                                                                                                                                                                                              |
| DEV Spec          | `gauge-engine / src/gap.rs` (Rust `Costs`, `gap_bps`, `net_bps`) and `event: card` JSON, both DRAFT                                                                                                                                                                                                                                                            |

The TOC adds an "NVDA AT A GLANCE" box: padding 14, radius 14, `#0C0D10`, mono rows gap 17.0 · costs −7.6 · net 9.4.

### 5C.7 Reason codes (1440 × 3700)

- **At a glance:** 4 jump tiles (codes in their state colours; DUST animated with K5), a summary table (code, gate, fires when, default), and an ORDER callout.
- **The four codes:** one `.rc` panel each, with an example drawn from the shared data:
  - STALE: COIN, 3.8 s.
  - CLOSED: any name at 17:40 ET.
  - THIN: HOOD, 44.8 gross, $45k.
  - DUST: META, 8.8 − 7.6 = 1.2.
- **Re-quote fail:** a compact `.rc` with the META example.
- **How often:** a 16px stacked bar (DUST 71 / THIN 12 / STALE 9 / CLOSED 8, 2px gaps) with a mono legend, labelled illustrative.
- **Reason event (DRAFT):** Rust `Reason` enum plus a `gate()` function that encodes the order, and a JSON reason event for HOOD THIN at 12:40:10.

### 5C.8 Interactions and accessibility

- **Links:** each Copy button flips its label to "Copied ✓" for 1.6 s (state per block). Sidebar, TOC, tiles, prev/next and popular questions all link between the four artboards; H2s are anchor targets with `scroll-margin-top:100px`.
- **Search:** static. The `⌘K` pill is a `<button>` with `aria-label="Search docs"`.
- **Landmarks:** `nav[aria-label=Docs]`, `aside[aria-label="Docs navigation"]`, `article`, `nav[aria-label="On this page"]`.
- **Figures:** every figure and diagram has `role="img"` with a sentence-long `aria-label`.
- **Colour:** state is never shown by colour alone; the code word is always printed.
- **Contrast:** body `--ink-2` on `--bg` is about 12:1, meta `--dim` 5.2:1. Tip-callout text `#D9EBA0` on its tint is 14.1:1, syntax keys `#8FA6DA` 8.0:1, comments `#80848A` 5.2:1.

### 5C.9 Copy deck (extracted from the markup, in document order)

Items are separated by `·`. `svg:` marks text drawn inside an SVG. Code blocks are verbatim.

##### Docs home (`DocsHome.dc.html`)

- **Docs nav:** DOCS · Guide · Developers · FAQ · Site · Search docs · ⌘K · Open GAUGE ↗
- **Sidebar:** Get started · Overview · Quickstart · Link your Agentic Account · Paper vs live · How GAUGE works · How a card is made · The four gates · Reason codes · Card lifecycle · Daily cap · Safety · What GAUGE won't do · The token is not the share · Developers · DRAFT · Architecture · Gap math spec · Event stream (SSE) · Card event · Reason event · Reference · Glossary · FAQ · Changelog
- **Header:** GAUGE docs
- **H1: Two prices. One gap. Everything else, explained.:** How GAUGE measures the gap between a Robinhood stock and its Robinhood Chain token, when it shows you a card, and what happens when you tap Do it. · Search gates, reason codes, events… · ⌘K
- **Panel: Start here:** Start here · 01 · 5 min · Quickstart · Link your Agentic Account, set your gates, and read your first card. · Start → · 02 · concept · How a card is made · Measure, haircut, gate, emit. The math behind every card, with a worked NVDA example. · Read → · 03 · reference · Reason codes · STALE, CLOSED, THIN, DUST. What each one means and what to do about it. · Look up →
- **Panel: The card in one line:** The whole product in one line · Full walkthrough → · svg:MEASURE · svg:cash vs token · svg:HAIRCUT · svg:fees·slip·buffer · svg:4 GATES · svg:feed→session→depth→net · svg:CARD · svg:lives 75 s · svg:YOU TAP · svg:Do it · svg:RE-QUOTE · svg:gates again · svg:ONE ORDER · svg:or paper fill
- **Panel: Guides:** Guides · Link your Agentic Account · setup · Paper vs live · modes · The four gates · concept · Card lifecycle · concept · What GAUGE won't do · safety
- **Panel: For developers:** For developers · DRAFT SCHEMAS · svg:market plane · svg:Redis bus · svg:engine · gates · svg:SSE → client · svg:exec gateway · svg:Trading MCP · svg:Do it only · Architecture → · Gap math spec → · Event stream (SSE) → · Card event →
- **Panel: Popular questions:** Popular questions · Does GAUGE ever place a trade on its own? · No → · Why am I not seeing any cards? · Reason codes → · What counts as a cost? · The haircut → · Why only 3 cards a day? · Daily cap → · Is the token the same as the share? · No → · GAUGE is not affiliated with Robinhood. Signals, not advice. · Docs · [DOCS_VERSION] · © 2026 GAUGE

##### Quickstart (`DocsQuickstart.dc.html`)

- **Docs nav:** same as Docs home.
- **Sidebar:** same tree as Docs home; the active item is this page.
- **Header:** Docs · / · Get started · / · Quickstart
- **H1: Quickstart:** From zero to your first live card in seven steps. You link your Robinhood Agentic Account, check your gates, and tap Do it when a card clears. · 5 min read · · · Live mode · · · Updated [DATE]
- **H2: Open GAUGE:** 01 · Go to · [APP_URL] · and sign in with · [AUTH_METHOD] · . You land on Home: the active card, the four gates, and the live gap board for every name you watch.
- **H2: Link your Agentic Account:** 02 · Open · Settings → Mode & account · and choose · Link via Trading MCP · . GAUGE connects through the official Robinhood Trading MCP. · REQUIRED · Agentic Account only. · Live orders go through a Robinhood Agentic Account, and only during regular trading hours (09:30–16:00 ET). GAUGE never holds your funds. · When the link works, the account row reads · Linked via Robinhood Trading MCP · live orders RTH only · .
- **H2: Switch to Live:** 03 · Use the · Paper · Live · toggle in the top bar. In Live, a lime strip stays under the top bar so you always know what a tap does: · LIVE · Do it places one cash-equity order on your Agentic Account through the Robinhood Trading MCP. · TIP · Want to practice first? · Paper runs the same gates and the same card. It fills at the confirm mid and moves no money.
- **H2: Check your gates:** 04 · A card only appears when every gate passes. The defaults are strict on purpose. Change them in · Settings → Gates · . · Gate · Default · Fails as · Max quote age · 2.0 s · STALE · Session · RTH · CLOSED · Min depth · $100k · THIN · Net floor · after fees 3.5, slippage, buffer 2.0 · 2.0 bps · DUST · Daily cap · 3 cards · no 4th card
- **H2: Read your first card:** 05 · When a name clears, you get a card. It lives for 75 seconds. · CARD · NVDA · ● LIVE · svg:0:52 · +9.4 · net bps · Do it · Skip · Countdown. · 75 s, then it's gone. · Net. · What's left of the gap after every cost. · Do it. · The only way an order is ever placed. · Skip. · Nothing happens. The card still counts toward the cap. · For the math behind the net number, read · How a card is made · .
- **H2: Tap Do it:** 06 · A tap doesn't send the card as-is. GAUGE checks again first: · The countdown holds while GAUGE confirms. · Both legs are · re-quoted · at fresh prices. · All four gates are · re-checked · on the new prices. · If everything still clears, GAUGE places · one cash-equity order · on your Agentic Account. If not, nothing happens. · RULE · The model does not place. · GAUGE never trades the token, never hedges both legs, and never places without your tap.
- **H2: Review it in History:** 07 · Every card lands in · History · with its net at card, its net at confirm, the outcome, and a full audit trail. You can export the ledger as CSV.
- **H2: DEV Stream cards yourself DRAFT:** Cards and reasons are pushed over Server-Sent Events. The endpoint and payload below are drafts until the API is published. · shell · DRAFT

```
# subscribe to your card and reason events
curl -N "[API_BASE]/v1/stream" \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Accept: text/event-stream"
```

← PREVIOUS · Overview · NEXT → · How a card is made

- **On this page:** ON THIS PAGE · Open GAUGE · Link your Agentic Account · Switch to Live · Check your gates · Read your first card · Tap Do it · Review it in History · Stream cards yourself · Edit this page ↗ · Report an issue ↗

##### How a card is made (`DocsCard.dc.html`)

- **Docs nav:** same as Docs home.
- **Sidebar:** same tree as Docs home; the active item is this page.
- **Header:** Docs · / · How GAUGE works · / · How a card is made
- **H1: How a card is made:** Every card goes through the same four steps: measure the gap, take the costs off, pass the gates, emit. This page walks through all four with one real-shaped example: NVDA at 14:02:18 ET. · 8 min read · · · Concept · · · Numbers are illustrative
- **H2: 01 Two prices:** GAUGE watches two prices for the same name: · Cash mid. · The Robinhood stock's mid price. · Token per share. · The Robinhood Chain stock token, priced per share. The token feed is multiplied by the token's multiplier so both prices are in the same unit. · NOTE · The multiplier only touches the chain feed. · The cash price is never adjusted. · Leg · Source · NVDA · Cash mid · Robinhood quotes · $182.40 · Token per share · Chainlink · token × multiplier · $182.71
- **H2: 02 The gap, in basis points:** GAP · |gap| = | token_per_share − cash_mid | ÷ cash_mid × 10,000 · Basis points make every name comparable. A 31¢ gap on a $182 stock and a 53¢ gap on a $118 stock are very different trades, and bps shows it. · NVDA · | 182.71 − 182.40 | ÷ 182.40 × 10,000 = · 17.0 bps · The token is trading · rich · : above the cash price. A negative gap (token cheap) is measured the same way. GAUGE uses the absolute value.
- **H2: 03 The haircut:** A gap that looks good before costs isn't a gap. GAUGE takes three things off every time: · Cost · What it is · NVDA · Fees · From the fee schedule. Same for every name. · −3.5 · Slippage · Estimated for this name. Thinner books cost more. · −2.1 · Buffer · Your safety margin. Set in · Settings → Gates · . · −2.0 · NET · net = |gap| − fees − slippage − buffer · 17.0 − 3.5 − 2.1 − 2.0 = · 9.4 bps · |gap| · 17.0 · − fees · 3.5 · − slippage · 2.1 · − buffer · 2.0 · Net · 9.4
- **H2: 04 The four gates:** Gates run · in order · . The first one that fails becomes the reason you see instead of a card. · svg:FEED · svg:SESSION · svg:DEPTH · svg:NET GAP · svg:CARD · svg:STALE · svg:CLOSED · svg:THIN · svg:DUST · svg:age > 2.0 s · svg:outside RTH · svg:depth < $100k · svg:net < 2.0 bps · Gate · Passes when · NVDA · Feed · Both legs are younger than the max quote age (2.0 s) · 0.3 s ✓ · Session · The cash market is in regular hours, 09:30–16:00 ET · RTH ✓ · Depth · Top of book is at least $100k · $420k ✓ · Net gap · Net is at least the floor (2.0 bps) · 9.4 ✓ · Cap · You have had fewer than 3 cards today · 1/3 ✓ · See · Reason codes · for what each failure means and what to do about it.
- **H2: 05 Emit the card:** When every gate passes, GAUGE emits one card and pushes it to you. For NVDA that happened at · 14:02:18.412 ET · . The card: · lives for · 75 seconds · , then expires on its own; · shows the net, both prices and the leg GAUGE would trade (cash equity only); · counts toward your cap of 3 whether you take it, skip it or let it expire.
- **H2: 06 Re-quote on confirm:** The numbers on a card are never traded as-is. When you tap · Do it · , GAUGE holds the clock, fetches fresh prices for both legs and runs every gate again. · At card · At confirm · Cash mid · $182.40 · $182.41 · Token per share · $182.71 · $182.71 · Net · 9.4 bps · 8.9 bps · clears · If the re-quote drops net under the floor, the card closes as · RE-QUOTE FAIL · and nothing is placed. Example from the ledger: META on Thu 25 Sep went from 4.6 at card to 1.4 at confirm. · RULE · The model does not place. · In live mode a clear re-quote results in exactly one cash-equity order through the official Robinhood Trading MCP. In paper mode it fills at the confirm mid.
- **H2: DEV Spec DRAFT:** The same math as code. Names, types and field names are drafts until the engine API is published. · gauge-engine / src/gap.rs · DRAFT

```
pub struct Costs { pub fees_bps: f64, pub slip_bps: f64, pub buffer_bps: f64 }

/// |token×mult − cash| / cash × 1e4. The multiplier only touches the chain leg.
pub fn gap_bps(cash_mid: f64, token: f64, mult: f64) -> f64 {
    ((token * mult - cash_mid) / cash_mid).abs() * 1e4
}

pub fn net_bps(gap: f64, c: &Costs) -> f64 {
    gap - c.fees_bps - c.slip_bps - c.buffer_bps
}
```

event: card · DRAFT

```
{
  "type": "card",
  "id": "card_7f3a91",
  "sym": "NVDA",
  "cash_mid": 182.40,
  "token_per_share": 182.71,
  "gap_bps": 17.0,
  "costs": { "fees_bps": 3.5, "slip_bps": 2.1, "buffer_bps": 2.0 },
  "net_bps": 9.4,
  "gates": { "feed_age_s": 0.3, "session": "RTH", "depth_usd": 420000, "cap": "1/3" },
  "leg": "cash_equity",
  "emitted_at": "2026-09-26T14:02:18.412-04:00",
  "expires_at": "2026-09-26T14:03:33.412-04:00",
  "mode": "live"
}
```

← PREVIOUS · Quickstart · NEXT → · Reason codes

- **On this page:** ON THIS PAGE · Two prices · The gap, in basis points · The haircut · The four gates · Emit the card · Re-quote on confirm · Spec (draft) · NVDA AT A GLANCE · gap · 17.0 · costs · −7.6 · net · 9.4 · Edit this page ↗ · Report an issue ↗

##### Reason codes (`DocsReasons.dc.html`)

- **Docs nav:** same as Docs home.
- **Sidebar:** same tree as Docs home; the active item is this page.
- **Header:** Docs · / · How GAUGE works · / · Reason codes
- **H1: Reason codes:** No gap, no card. When a name doesn't clear, GAUGE tells you why in one word. The word is the first gate that failed. · 4 min read · · · Reference · · · Examples from the sample watchlist
- **H2: At a glance:** STALE · FEED gate · CLOSED · SESSION gate · THIN · DEPTH gate · DUST · NET GAP gate · Code · Gate · Fires when · Default · STALE · Feed · Either price is older than the max quote age · 2.0 s · CLOSED · Session · The cash market is outside regular hours · 09:30–16:00 ET · THIN · Depth · Top of book is below the minimum size · $100k · DUST · Net gap · Net after fees, slippage and buffer is below the floor · 2.0 bps · ORDER · Gates run feed → session → depth → net. · A name with an old price and a tiny gap shows STALE, not DUST. Fix the first failure and the next one may appear.
- **Panel: STALE:** STALE · FEED GATE · A price is too old to trust · Both legs have to be fresh at the same moment. If either the cash quote or the chain token price is older than your max quote age, the gap might not exist anymore, so GAUGE stays quiet. · What to do: · usually nothing. It clears on the next fresh tick. If a name stays STALE, check · Home → System health · . · COIN · chain feed 3.8 s old · max 2.0 s → · STALE · net would have been 3.4 bps, but the price was too old to use
- **Panel: CLOSED:** CLOSED · SESSION GATE · The cash market isn't in its session · Stock tokens can keep trading after hours. The cash leg can't be placed live outside regular hours, so GAUGE doesn't emit a card it can't act on. · What to do: · wait for 09:30 ET. Cards resume at the open. · any name · 17:40 ET · after hours → · CLOSED · the token may still tick; GAUGE waits for the cash market
- **Panel: THIN:** THIN · DEPTH GATE · Not enough size to fill · A wide gap on a thin book usually disappears the moment you trade into it. GAUGE needs at least your minimum depth at the top of the book before it believes the gap. · What to do: · treat a big THIN gap as a warning, not a miss. You can lower min depth in · Settings → Gates · , at your own risk. · HOOD · |gap| 44.8 bps · depth $45k · min $100k → · THIN · the biggest raw gap of the day, and the least fillable
- **Panel: DUST:** DUST · NET GAP GATE · A gap, but not after costs · The prices differ, but once fees, slippage and your buffer are taken off, what's left is below the floor. This is the most common reason by far. · What to do: · nothing. DUST is GAUGE working as intended. · META · |gap| 8.8 − costs 7.6 = net 1.2 · floor 2.0 → · DUST
- **H2: Not a reason code: re-quote fail:** A card can pass every gate and still not trade. When you tap · Do it · , GAUGE re-quotes both legs and runs the gates again. If net has dropped below the floor, the card closes as · RE-QUOTE FAIL · and nothing is placed. · RE-QUOTE FAIL · META · Thu 25 Sep 15:21 · net 4.6 at card → 1.4 at confirm · floor 2.0 → no order
- **H2: How often each one fires:** On a normal session almost every evaluation ends in DUST. That's the point: GAUGE is built to say no. · ■ · DUST 71% · ■ · THIN 12% · ■ · STALE 9% · ■ · CLOSED 8% · illustrative
- **H2: Reason event DRAFT:** Reasons are streamed like cards, one per name per state change. Field names are drafts. · gauge-engine / src/reason.rs · DRAFT

```
/// First failing gate wins. Order matters.
pub enum Reason { Stale, Closed, Thin, Dust }

pub fn gate(q: &Quote, r: &Rules) -> Result<(), Reason> {
    if q.age_s > r.max_age_s          { return Err(Reason::Stale) }
    if !q.session.is_rth()             { return Err(Reason::Closed) }
    if q.depth_usd < r.min_depth_usd   { return Err(Reason::Thin) }
    if q.net_bps < r.floor_bps         { return Err(Reason::Dust) }
    Ok(())
}
```

event: reason · DRAFT

```
{
  "type": "reason",
  "sym": "HOOD",
  "code": "THIN",
  "gate": "depth",
  "observed": { "depth_usd": 45000, "gap_bps": 44.8 },
  "threshold": { "min_depth_usd": 100000 },
  "at": "2026-09-26T12:40:10-04:00"
}
```

← PREVIOUS · How a card is made · NEXT → · Card lifecycle

- **On this page:** ON THIS PAGE · At a glance · STALE · CLOSED · THIN · DUST · Re-quote fail · How often · Reason event (draft) · Edit this page ↗ · Report an issue ↗

## 6. Components

| Component                | Spec                                                                                                                                                                                                                                               |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Panel `.g-panel`         | `--panel-grad`, 1px `--line`, radius 20. Transition on border/box-shadow .4s. Hover: border `rgba(178,212,80,.35)`, shadow `0 0 0 1px rgba(178,212,80,.12), 0 20px 60px -20px rgba(178,212,80,.18)`                                                |
| Featured panel `.g-feat` | Border `rgba(178,212,80,.45)`, background `radial-gradient(120% 90% at 0 0, rgba(178,212,80,.10), transparent 55%)` over the panel gradient, shadow `0 0 0 1px rgba(178,212,80,.10), 0 30px 80px -30px rgba(178,212,80,.30)`. At most one per row. |
| Primary button           | 52px, padding 0 26, radius 999, lime, `--accent-ink`, Jakarta 700 16. Shadow `0 0 0 1px rgba(178,212,80,.6), 0 10px 40px -6px rgba(178,212,80,.55)`. Hover `#C2E062` with the glow up to `0 12px 56px -4px .7`.                                    |
| Secondary button         | `rgba(249,247,244,.03)` fill, 1px border at 18% cream; hover border at 40%                                                                                                                                                                         |
| Button on lime           | Ink fill with lime text, or transparent with a 1.5px ink border at 50%                                                                                                                                                                             |
| Pill `.g-pill`           | 28px, padding 0 12, 1px border at 14%, mono 11 uppercase `.16em` `--muted`. Lime variant: lime text, border at 40%. Small variant: 24px, 10px text.                                                                                                |
| Live dot `.g-live`       | 6px lime, `box-shadow:0 0 10px lime`, `g-ping` 2.4s                                                                                                                                                                                                |
| Data row `.g-row`        | Flex space-between, padding 9/0, bottom border at 6%, mono 13. Label `--muted`, value `--ink` or lime.                                                                                                                                             |
| Inset block              | `--inset`, 1px `--line`, radius 14, padding 16/18                                                                                                                                                                                                  |
| Ticker chip              | See 5.3                                                                                                                                                                                                                                            |
| Countdown ring           | See 5.5. `dasharray 339.29` (2π·54), `dashoffset = 339.29·(1 − t/75)`, rotated −90°                                                                                                                                                                |
| Icons                    | Inline stroke SVG, 1.6px, `currentColor` or a token colour. No emoji.                                                                                                                                                                              |

## 7. Brand

- The wordmark is a vector redraw on a 270×58 grid, stroke 11.
  - G: arc `M45.6 12.4 A23.5 23.5 0 1 0 52.5 29`, with the bar as a rect at 29,23.5, 29×11. The first G's bar is lime; the second G's bar is ink.
  - A: polygon `62,58 85,0 108,58 96.5,58 85,23 73.5,58`.
  - U: `M117.5 0 V34 A18.5 18.5 0 0 0 154.5 34 V0`.
  - E: stem 230,0 11×58, with bars 40 / 36 / 40 wide at y 0 / 23.5 / 47.
- Replace it with the master SVG when that exists.
- The 3D G is used only for the favicon and app icon.
- Clearspace is one G-bar height on every side. The wordmark's minimum width is 88px.

## 8. Hero art (stage 1440 × 980)

| Layer             | Geometry                                                                                                                                                                                |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Grid              | `<pattern>` 48×48, path `M48 0H0V48`, cream at 3.5%                                                                                                                                     |
| Atmosphere        | circle cx 980, cy 1640, r 1260, filled with a radial gradient (user space): stops .84 → 0, .95 → .22 lime, 1 → 0                                                                        |
| Planet body       | same centre, r 1200, fill `--hero`                                                                                                                                                      |
| Rim glow          | r 1200, stroke `gRim` (0 transparent → .35 `#E4F5A6` .9 → .62 lime → 1 transparent), width 10, `feGaussianBlur` σ18, opacity .9                                                         |
| Rim line          | r 1200, the same gradient, width 1.5                                                                                                                                                    |
| Light shafts      | 1px rects at x 1012 / 1184 / 842, cream at 5–20%                                                                                                                                        |
| Cash line         | `M640 452 C720 446,780 470,850 460 S960 430,1030 442 S1130 470,1200 448 S1330 430,1440 440`, stroke `gFade` (cream fading in from the left), width 2                                    |
| Cash flow overlay | the same path, cream at 35%, `dasharray 2 22`                                                                                                                                           |
| Token line        | `M640 470 C720 466,780 482,850 470 S960 400,1030 386 S1130 378,1200 364 S1330 350,1440 346`, stroke `gFadeL` (lime fading in), width 2.5, plus a copy at width 10, 35% opacity, blur σ4 |
| Gap bracket       | x 1200, from y 364 to 448: a rect 10 wide at 18% lime plus a dashed line `3 4`                                                                                                          |
| Markers           | a lime dot at (1200,364) r5 with a halo r14; a cream dot at (1200,448) r5                                                                                                               |
| Labels            | mono 12, letter-spacing 2, x 1222: "TOKEN / SHARE" at y 352 (lime), "GAP · LIVE" at y 412 (15px 600 lime), "CASH MID" at y 468 (cream at 70%)                                           |
| Veils             | left gradient plus a bottom fade (HTML, outside the SVG)                                                                                                                                |

## 9. Motion summary

| ID  | Where      | Name                        | Period                 | Meaning                                   |
| --- | ---------- | --------------------------- | ---------------------- | ----------------------------------------- |
| A1  | Hero       | Line draw-in                | 2.4s once              | Feeds come online                         |
| A2  | Hero       | Token breathe + bracket     | 6s                     | The gap widens and narrows                |
| A3  | Hero       | Travelling tick             | 4s                     | Live ticks on the token feed              |
| A4  | Hero       | Cash flow dashes            | 2.2s                   | Live cash feed                            |
| A5  | Hero       | Gap pulse                   | 1.6s / 3s              | The live value                            |
| A6  | Hero       | Copy rise                   | 1s once                | –                                         |
| B1  | Ticker     | Marquee                     | 48s                    | Names being watched                       |
| B2  | Ticker     | Threshold flash             | 4.2s                   | A gap crossed cost                        |
| C1  | Measure    | Ruler                       | 4s                     | Measuring the gap                         |
| C2  | Haircut    | Peel                        | 5s                     | Costs removed from the gross              |
| C3  | Emit       | Gates + mini card           | 5.4s                   | All four gates pass, then a card          |
| D1  | Card       | Countdown ring              | 75s (JS)               | Card lifetime                             |
| D2  | Card       | Re-quote shimmer            | 1.1s once              | Fresh prices on confirm                   |
| D3  | Card       | Cap fill + lock             | 6s                     | 3 a day                                   |
| D4  | Card       | Top scan                    | 5s                     | Live panel                                |
| E1  | Reasons    | Age bar                     | 4.4s                   | STALE                                     |
| E2  | Reasons    | Session marker              | 6.6s                   | CLOSED                                    |
| E3  | Reasons    | Depth drain                 | 3.6s                   | THIN                                      |
| E4  | Reasons    | Dissolve                    | 3.2s                   | DUST                                      |
| F1  | Paper      | Stamp                       | 4.8s                   | Paper fill at mid                         |
| F2  | Live       | Packet + tap                | 5.2s                   | One order, only after your tap            |
| G1  | Won't      | ✕ draw                      | 6s                     | The refusals                              |
| G2  | Won't      | "not" flicker               | 5.6s                   | The thesis line                           |
| H1  | FAQ        | Answer rise                 | .6s once               | –                                         |
| H2  | FAQ        | Scan line                   | 3.4s                   | The open row                              |
| I1  | Closing    | Lines split/rejoin          | 6.4s                   | Gap opens, then closes                    |
| I2  | Closing    | Headline snap               | 6.4s                   | "No gap" at the meeting point             |
| Z   | Global     | Edge glows / ping           | 38–46s / 2.4s          | Atmosphere / live                         |
| J1  | App        | Live dot                    | 2.4s                   | Feed or mode is live                      |
| J2  | App        | Active card scan            | 4.6s                   | A card is open                            |
| J3  | Home       | CARD row pulse              | 3s                     | The name that carded                      |
| J4  | Home       | Pending cap pip             | 2s                     | Card pending against the cap              |
| J5  | Home, Card | Countdown ring              | 75s (JS)               | Card lifetime; holds during confirm       |
| J6  | Card       | Confirm sequence            | 0/.7/1.4/2.1s          | Tap → re-quote → gates → fill             |
| J7  | Home, Card | Re-quote shimmer            | 1.1s once              | Fresh prices                              |
| J8  | Card       | Waterfall grow              | .5–.6s staggered       | Costs peel off gross                      |
| J9  | Watchlist  | Detail chart draw           | 1.2s                   | New name selected                         |
| J10 | History    | Drawer rise                 | .35s                   | Card detail                               |
| J11 | Token      | Mark orbit / breathe / dash | 40 / 26 / 5 / 3s       | Pre-launch, no data yet                   |
| J12 | App        | Micro-transitions           | .15–1s                 | Tooltip, switch, hover, arc               |
| K1  | Docs       | Live dot                    | 2.4s                   | The live-strip copy in Quickstart         |
| K2  | Docs       | Diagram flow                | 1.6s / 1.4s            | Direction of the lifecycle and gate order |
| K3  | Docs home  | Architecture connectors     | 1.2s                   | Data direction between services           |
| K4  | Docs       | Waterfall grow              | .5–.6s staggered, once | Costs peel off gross                      |
| K5  | Reasons    | DUST dissolve               | 3.2s                   | A gap that rounds to nothing              |
| K6  | Docs       | Copy feedback               | 1.6s                   | Label "Copied ✓"                          |
| K7  | Docs       | Hover transitions           | .3s                    | Tiles and links                           |

## 10. Copy

- Voice: short, declarative, rule-like. No em-dashes, no emoji.
- Key lines: "Two prices. One gap." · "No gap, no card." · "The token is not the share." · "You tap. It doesn't." · "The model does not place."
- Section H2s:
  - "Measure. Haircut. Emit."
  - "75 seconds. One tap."
  - "No card? You get a reason."
  - "Paper first. Live when you say."
  - "The token is not the share."
  - "FAQ"
  - "NO GAP. NO CARD."
- Disclaimer: "GAUGE is not affiliated with Robinhood. Signals, not advice. Paper by default. The token is not the share."
- Every price is sample data and labelled ILLUSTRATIVE.

## 11. Open placeholders

Docs: `[APP_URL]` · `[AUTH_METHOD]` · `[API_BASE]` · `[TOKEN]` (API bearer) · `[DATE]` · `[DOCS_VERSION]`. All developer code (Rust signatures, the SSE endpoint, card and reason event fields) is DRAFT. Nine sidebar pages are not drawn and link to `#`. The landing page's Docs links still point to `[DOCS_URL]`; the target is `DocsHome.dc.html`.

App: `[AV]` (avatar initials) · `[ORDER_SIZE]` (live order size) · `[LIST_TBD]` (real watchlist) · `$[TICKER]`, `[TOKEN_NAME]`, `[CHAIN]`, `[PRICE]`, `[CHANGE_24H]`, `[MCAP]`, `[HOLDERS]`, `[CONTRACT_ADDRESS]`, `[SUPPLY]`, `[DECIMALS]`, `[LAUNCH_DATE]`, `[EXPLORER_URL]`, `[AMOUNT]`, `[USD_VALUE]`, `[UTILITY_1–3]`. The Paper/Live state is per artboard in the mock; in production it is one global setting.

Landing: `[APP_URL]` · `[DOCS_URL]` · `[DOMAIN]` (OG and Twitter cards) · `[CONTACT_EMAIL]` · `[TOKEN_DETAILS]` (name, utility, where it appears on the site) · the Satoshi font files · the master wordmark SVG · a higher-resolution 3D G (the source is 382px) · the real watched-ticker list (the current list is a stand-in).

## 12. Accessibility

- Contrast on `--bg`: `--ink` 18.4:1, `--muted` 8.4:1, `--dim` 5.2:1. Accent ink on lime is 11.6:1. `--dim` is used only for text 10px mono and larger, and for captions.
- Use real `<a href>` and `<button>`. FAQ rows carry `aria-expanded`, and the focus ring is 2px lime.
- Every animated diagram has `role="img"` and an `aria-label` describing the rule it shows. Decorative layers are `aria-hidden`.
- The countdown's `aria-label` reads "Card expires in N seconds".
- Targets are at least 44px (buttons 48–52).
- `@media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}}`. Every element reads correctly at rest: bars full, gates dim, stamp hidden. See animations.md §9 for the rest-state fixes.
- **App:**
  - Rail links carry `aria-label`, and the current page has `aria-current="page"`.
  - Selectable rows are `<button>` with `aria-pressed`.
  - The mode toggle and filters use `aria-pressed`. Switches use `role="switch"` with `aria-checked`.
  - Every input has a `<label for>`, and the stepper buttons have an `aria-label`.
  - Charts have `role="img"` with a label that states the current value.
  - The focus ring is a 2px lime outline everywhere.
  - State is never shown by colour alone: pills carry the word (CARD, THIN, STALE, DUST, TAKEN…).
- **Docs:**
  - Landmarks for the docs nav, sidebar, article and TOC.
  - `aria-current="page"` on the active sidebar item.
  - H2 anchors carry `scroll-margin-top:100px` so headings clear the sticky nav.
  - Every diagram and figure has `role="img"` with a sentence-long label.
  - Copy buttons are real `<button>` elements.
  - The code-comment grey is `#80848A` (5.2:1).
