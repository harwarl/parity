# GAUGE: design.md

| | |
|---|---|
| Status | Landing page approved for handoff |
| Rev | 1 · 2026-09-25 |
| Changelog | r1: landing page with 10 sections, per-section motion, asset pack |
| Companion files | `animations.md` (every animation, with code), `assets/` (brand, favicon, social, css, tokens, fonts) |
| System | rain-design-skill-2 (v2 language). GAUGE is the reference build. |
| Source | Design canvas "GAUGE", artboard `Main.dc.html` (1440 × 7400, expand fill, interactive) |

## 1. Product in one line

GAUGE watches the Robinhood stock and the Robinhood Chain stock token for the same name. It emits a 75-second card only when the net gap clears fees, slippage, buffer, session, depth and a cap of 3 a day. You tap. Confirm re-quotes. The model does not place.

## 2. Tokens

```css
:root{
  --bg:#0A0B0D;          /* page ground, cool near-black */
  --hero:#07080A;        /* hero base */
  --panel:#111316;       /* flat panel */
  --panel-2:#16181C;
  --panel-grad:linear-gradient(180deg,#131519 0%,#0F1113 100%);
  --inset:#0A0B0D;       /* blocks inside panels (formula, ticket, route) */
  --track:#1C1F23;       /* empty bars, ring track */
  --line:rgba(249,247,244,.08);
  --line-2:rgba(249,247,244,.14);
  --line-row:rgba(249,247,244,.06);   /* mono data rows */
  --ink:#F9F7F4;         /* brand cream, sampled from logo sheet */
  --ink-2:#C9CBCF;       /* nav links, formula text */
  --muted:#A6A9AE;
  --dim:#80848A;         /* captions >= 13px, mono labels */
  --accent:#B2D450;      /* sampled from logo G bar */
  --accent-hover:#C2E062;
  --accent-soft:#E4F5A6; /* arc rim highlight, travelling tick */
  --accent-ink:#0B0D07;  /* text on lime */
  --glow:rgba(178,212,80,.35);
  --neg:#FF6B5E;         /* costs, won't-do marks, stale end-state */
  --dead:#5A5D62;        /* stale timestamp end-state */
}
```

**Radii:** panel 20 · inset block 14 · card mock 22 · closing CTA block 28 · pills/buttons 999 · stamp 8.

| Colour | Means |
|---|---|
| `--accent` | Passes, net value, live state, token price, primary action, eyebrows |
| `--ink` | Cash price, headlines, neutral values |
| `--neg` | Costs peeled off the gap, things GAUGE won't do, a quote that has aged out |
| `--dim` / `--muted` | Gross (pre-cost) values, labels, gaps below threshold |

A colour always ships with a word (✓, STALE, net, FILLED).

## 3. Type

| Family | Weights | Use |
|---|---|---|
| **Unbounded** | 600, 700, 800 | Display H1/H2 (800), H3 (600), big numbers (700/800) |
| **Doto** | 900 | Dot-matrix accent words, one or two per headline, plus reason codes and the FAQ title |
| **Satoshi** (stand-in **Plus Jakarta Sans**) | 400, 500, 600, 700 | Body, UI, buttons |
| **IBM Plex Mono** | 400, 500, 600 | Eyebrows, labels, prices, codes, pills, formulas |

```html
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&family=Doto:wght@700;900&display=swap" rel="stylesheet">
```

To switch to Satoshi, put `Satoshi-{Regular,Medium,Bold}.woff2` in `assets/fonts/`, add `@font-face` rules to `fonts.css`, and set `--f-body:'Satoshi','Plus Jakarta Sans',system-ui`.

| Role | Spec |
|---|---|
| Hero H1 | Unbounded 800, 104px, lh .98, ls -0.045em |
| Hero accent line | Doto 900, 118px, ls -0.01em, lime + `text-shadow:0 0 28px rgba(178,212,80,.35)` |
| Section H2 | Unbounded 800, 72px (won't-do: 84px) |
| Section H2 accent word | Doto 900, 80px (won't-do: 96px; FAQ: 84px) |
| Closing H2 | Unbounded 800, 136px, lh .92, ls -0.055em, `--accent-ink` |
| H3 (panel title) | Unbounded 600, 22px, ls -0.03em (paper/live: 34px; won't-do: 19px) |
| Big number (cap "3") | Unbounded 800, 120px, ls -0.06em, lh .9 |
| Card net | Unbounded 700, 34px, ls -0.04em |
| Reason code | Doto 900, 46px |
| Lede | 19px / 1.6, `--muted`; optional bold `--ink` lead sentence |
| Body (`.g-p`) | 16px / 1.6, `--muted` |
| Eyebrow | Plex Mono 12px, uppercase, `0.22em`, `--accent` |
| Mono labels | Plex Mono 10–12px, `0.12–0.18em`, `--dim` |
| Data rows | Plex Mono 13px |
| Buttons | Jakarta 700, 16px (nav 15px) |
| Nav links | Jakarta 500, 15px, `--ink-2` |

`font-variant-numeric: tabular-nums` on `body`.

## 4. Atmosphere

- The ground is `--bg`; the hero is `--hero` plus a radial lime glow from below: `radial-gradient(90% 70% at 70% 110%, rgba(178,212,80,.14), transparent 60%)`.
- **Edge glows.** Three blurred radial blobs at 8–10% lime alpha: 760–820px, `blur(40–50px)`, positioned at y ≈ 1500 / 2900 / 4500, alternating left and right, half off-canvas. They drift on `g-drift` over 38s, 46s (−12s) and 42s (−20s).
- **Hero grid.** A 48px square pattern, 3.5% cream strokes.
- The root is `overflow: clip`, never `hidden`, so the sticky nav keeps working.

## 5. Page: landing

Container: 1200px centred. Sections are `padding-top:150px`. Panel grids use `gap:20px`.

| # | Section | id | Layout | Motion (see animations.md) |
|---|---|---|---|---|
| 0 | Announcement bar | – | 44px, centred | – |
| 1 | Floating nav | – | sticky pill glass | ping dots |
| 2 | Hero | `top` | full-bleed 100vh, copy left, widget bottom-right | A1–A6 |
| 3 | Ticker strip | – | full-width masked marquee | B1–B2 |
| 4 | How it works | `how` | header grid + 3 panels (3rd featured) | C1–C3 |
| 5 | The card | `card` | header grid + 7fr/5fr (featured card panel + cap panel) | D1–D4 |
| 6 | Reason codes | `reasons` | header grid + 4 panels | E1–E4 |
| 7 | Paper vs live | `paper` | header grid + 2 panels (live featured) | F1–F2 |
| 8 | What GAUGE won't do | `wont` | centred header + 4 panels | G1–G2 |
| 9 | FAQ | `faq` | 4fr/7fr: title left, divider rows right | H1–H2 |
| 10 | Closing CTA | – | lime block, inset 24px, radius 28 | I1–I2 |
| 11 | Footer | – | 5fr/2fr/2fr/3fr + bottom bar | ping dot |

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

| Panel | H3 | Visual | Formula |
|---|---|---|---|
| 01 / Measure | Cash mid vs token-per-share | 300×84 SVG ruler (C1) | `gap = token × mult − cash_mid` |
| 02 / Haircut | Net basis points | 14px segmented bar + labels + readout (C2) | `net = \|gap\| − fees − slip − buffer` |
| 03 / Emit (featured) | Four gates, then a card | 2×2 gate pills + mini card (C3) | – |

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

| Gate | Code | Visual | Copy |
|---|---|---|---|
| FEED | STALE | timestamp `14:31:07.112` + 4px age bar (E1) | One of the two prices is too old to trust. No card on a stale quote. |
| SESSION | CLOSED | 28px session track, RTH window at 35%/32% width, marker (E2) | The cash market is outside the session GAUGE trades. The token may still tick. GAUGE waits. |
| DEPTH | THIN | 10 depth bars; heights 22,34,48,60,56 lime / 56,60,48,34,22 red (E3) | Not enough depth to fill without eating the gap. The book is too thin. |
| NET GAP | DUST | Doto "0.3" + 8 dots, "NET BPS" (E4) | A gap exists, but after fees, slippage and buffer it rounds to nothing. |

### 5.7 Paper vs live
Two panels: padding 44, min-height 480. Each has H3 34px with a pill on the right, body text, a visual, and three mono rows at the bottom.
- **Paper** (pill "Default"): a 300px dashed ticket reading "PAPER TICKET · NVDA", "@ 182.40" (mono 22) and "confirm mid · no broker", with the "FILLED @ MID" stamp (F1). Rows: Fill price / Confirm mid · Broker / None · Risk / Zero.
- **Live** (featured, lime pill "Agentic Account only"): a 440×64 route with nodes YOU (x10), CONFIRM (x150, lime), MCP (x290) and ROBINHOOD (x430). The rail runs at y 21, is 2px, and has a gradient that is lime in the middle. The packet and tap ring are F2. Rows: Orders per card / 1 · Route / Robinhood Trading MCP · Trigger / Your tap (lime).
- "Robinhood" appears as a text label only. Never draw their logo.

### 5.8 What GAUGE won't do
- Centred header: eyebrow, H2 84px "The token is **not** / the share." (Doto "not", G2), and a lede of max-width 640.
- Four panels: padding 32, min-height 220. Each has a 28px ✕ icon (circle stroke `--neg` at 60%, cross 1.6px, G1), an H3 at 19px and body text at 15px.
- Items: Hold your funds · Ship a token · Hedge both legs · Place without Do it.

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

## 6. Components

| Component | Spec |
|---|---|
| Panel `.g-panel` | `--panel-grad`, 1px `--line`, radius 20. Transition on border/box-shadow .4s. Hover: border `rgba(178,212,80,.35)`, shadow `0 0 0 1px rgba(178,212,80,.12), 0 20px 60px -20px rgba(178,212,80,.18)` |
| Featured panel `.g-feat` | Border `rgba(178,212,80,.45)`, background `radial-gradient(120% 90% at 0 0, rgba(178,212,80,.10), transparent 55%)` over the panel gradient, shadow `0 0 0 1px rgba(178,212,80,.10), 0 30px 80px -30px rgba(178,212,80,.30)`. At most one per row. |
| Primary button | 52px, padding 0 26, radius 999, lime, `--accent-ink`, Jakarta 700 16. Shadow `0 0 0 1px rgba(178,212,80,.6), 0 10px 40px -6px rgba(178,212,80,.55)`. Hover `#C2E062` with the glow up to `0 12px 56px -4px .7`. |
| Secondary button | `rgba(249,247,244,.03)` fill, 1px border at 18% cream; hover border at 40% |
| Button on lime | Ink fill with lime text, or transparent with a 1.5px ink border at 50% |
| Pill `.g-pill` | 28px, padding 0 12, 1px border at 14%, mono 11 uppercase `.16em` `--muted`. Lime variant: lime text, border at 40%. Small variant: 24px, 10px text. |
| Live dot `.g-live` | 6px lime, `box-shadow:0 0 10px lime`, `g-ping` 2.4s |
| Data row `.g-row` | Flex space-between, padding 9/0, bottom border at 6%, mono 13. Label `--muted`, value `--ink` or lime. |
| Inset block | `--inset`, 1px `--line`, radius 14, padding 16/18 |
| Ticker chip | See 5.3 |
| Countdown ring | See 5.5. `dasharray 339.29` (2π·54), `dashoffset = 339.29·(1 − t/75)`, rotated −90° |
| Icons | Inline stroke SVG, 1.6px, `currentColor` or a token colour. No emoji. |

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

| Layer | Geometry |
|---|---|
| Grid | `<pattern>` 48×48, path `M48 0H0V48`, cream at 3.5% |
| Atmosphere | circle cx 980, cy 1640, r 1260, filled with a radial gradient (user space): stops .84 → 0, .95 → .22 lime, 1 → 0 |
| Planet body | same centre, r 1200, fill `--hero` |
| Rim glow | r 1200, stroke `gRim` (0 transparent → .35 `#E4F5A6` .9 → .62 lime → 1 transparent), width 10, `feGaussianBlur` σ18, opacity .9 |
| Rim line | r 1200, the same gradient, width 1.5 |
| Light shafts | 1px rects at x 1012 / 1184 / 842, cream at 5–20% |
| Cash line | `M640 452 C720 446,780 470,850 460 S960 430,1030 442 S1130 470,1200 448 S1330 430,1440 440`, stroke `gFade` (cream fading in from the left), width 2 |
| Cash flow overlay | the same path, cream at 35%, `dasharray 2 22` |
| Token line | `M640 470 C720 466,780 482,850 470 S960 400,1030 386 S1130 378,1200 364 S1330 350,1440 346`, stroke `gFadeL` (lime fading in), width 2.5, plus a copy at width 10, 35% opacity, blur σ4 |
| Gap bracket | x 1200, from y 364 to 448: a rect 10 wide at 18% lime plus a dashed line `3 4` |
| Markers | a lime dot at (1200,364) r5 with a halo r14; a cream dot at (1200,448) r5 |
| Labels | mono 12, letter-spacing 2, x 1222: "TOKEN / SHARE" at y 352 (lime), "GAP · LIVE" at y 412 (15px 600 lime), "CASH MID" at y 468 (cream at 70%) |
| Veils | left gradient plus a bottom fade (HTML, outside the SVG) |

## 9. Motion summary

| ID | Where | Name | Period | Meaning |
|---|---|---|---|---|
| A1 | Hero | Line draw-in | 2.4s once | Feeds come online |
| A2 | Hero | Token breathe + bracket | 6s | The gap widens and narrows |
| A3 | Hero | Travelling tick | 4s | Live ticks on the token feed |
| A4 | Hero | Cash flow dashes | 2.2s | Live cash feed |
| A5 | Hero | Gap pulse | 1.6s / 3s | The live value |
| A6 | Hero | Copy rise | 1s once | – |
| B1 | Ticker | Marquee | 48s | Names being watched |
| B2 | Ticker | Threshold flash | 4.2s | A gap crossed cost |
| C1 | Measure | Ruler | 4s | Measuring the gap |
| C2 | Haircut | Peel | 5s | Costs removed from the gross |
| C3 | Emit | Gates + mini card | 5.4s | All four gates pass, then a card |
| D1 | Card | Countdown ring | 75s (JS) | Card lifetime |
| D2 | Card | Re-quote shimmer | 1.1s once | Fresh prices on confirm |
| D3 | Card | Cap fill + lock | 6s | 3 a day |
| D4 | Card | Top scan | 5s | Live panel |
| E1 | Reasons | Age bar | 4.4s | STALE |
| E2 | Reasons | Session marker | 6.6s | CLOSED |
| E3 | Reasons | Depth drain | 3.6s | THIN |
| E4 | Reasons | Dissolve | 3.2s | DUST |
| F1 | Paper | Stamp | 4.8s | Paper fill at mid |
| F2 | Live | Packet + tap | 5.2s | One order, only after your tap |
| G1 | Won't | ✕ draw | 6s | The refusals |
| G2 | Won't | "not" flicker | 5.6s | The thesis line |
| H1 | FAQ | Answer rise | .6s once | – |
| H2 | FAQ | Scan line | 3.4s | The open row |
| I1 | Closing | Lines split/rejoin | 6.4s | Gap opens, then closes |
| I2 | Closing | Headline snap | 6.4s | "No gap" at the meeting point |
| Z | Global | Edge glows / ping | 38–46s / 2.4s | Atmosphere / live |

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

`[APP_URL]` · `[DOCS_URL]` · `[DOMAIN]` (OG and Twitter cards) · `[CONTACT_EMAIL]` · the Satoshi font files · the master wordmark SVG · a higher-resolution 3D G (the source is 382px) · the real watched-ticker list (the current list is a stand-in).

## 12. Accessibility

- Contrast on `--bg`: `--ink` 18.4:1, `--muted` 8.4:1, `--dim` 5.2:1. Accent ink on lime is 11.6:1. `--dim` is used only for text 10px mono and larger, and for captions.
- Use real `<a href>` and `<button>`. FAQ rows carry `aria-expanded`, and the focus ring is 2px lime.
- Every animated diagram has `role="img"` and an `aria-label` describing the rule it shows. Decorative layers are `aria-hidden`.
- The countdown's `aria-label` reads "Card expires in N seconds".
- Targets are at least 44px (buttons 48–52).
- `@media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}}`. Every element reads correctly at rest: bars full, gates dim, stamp hidden. See animations.md §9 for the rest-state fixes.