# GAUGE: animations.md

|            |                                                                                                                                                                                         |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rev        | 4 · 2026-09-26                                                                                                                                                                          |
| Changelog  | r4: added app motion J1–J12 (§6B). r3: G1 back to 4 crosses (cap refusal added). r2: G1 drew 3 crosses (token refusal removed). r1: 28 animations across 10 sections (lively intensity) |
| Companions | `design.md` (IDs A1–I2 and J1–J12 match its §9), `assets/css/animations.css` (every keyframe, copy-paste)                                                                               |
| Source     | Design canvas "GAUGE": `Main.dc.html` + the 6 app artboards                                                                                                                             |

## 1. Rules

1. Every animation shows a GAUGE rule: gap, haircut, gates, card lifetime, cap, reason, fill, route, refusal. No decoration-only loops except the edge glows and the marquee.
2. **Lively intensity:** section loops run on 3–7s periods. Ambient layers run 38–48s.
3. **No two loops in a section share a period** (e.g. hero 6 / 4 / 2.2 / 1.6 / 3s), so nothing pulses in unison.
4. Sequences within one loop share one period and differ only by `animation-delay`. Because the periods match, they stay locked together forever.
5. Animate `transform`, `opacity` and `stroke-dashoffset`. Colour, `box-shadow` and `width` are allowed on small elements only (gates, cap bars, the age bar).
6. CSS keyframes wherever possible. SMIL `<animateMotion>` is used only for motion along a curve inside the SVG. JS runs only the card's 75s clock.
7. Every element must read correctly with animation off (§9).
8. Easing: `ease-in-out` for breathing and oscillation, `linear` for flow, marquee and scan, `cubic-bezier(.2,.7,.2,1)` for entrances, `cubic-bezier(.6,0,.3,1)` for the packet, and `cubic-bezier(.3,1.4,.5,1)` (overshoot) for the stamp.

## 2. Timing and colour reference

| Token          | Value                                                                                                                   |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Lime           | `#B2D450`; highlight `#E4F5A6`; glow `rgba(178,212,80,.35–.8)`                                                          |
| Cost red       | `#FF6B5E` (opacity .45 / .65 / .85 for buffer / slip / fees)                                                            |
| Dead grey      | `#5A5D62`                                                                                                               |
| Track          | `#1C1F23`                                                                                                               |
| Periods in use | 1.6 · 2.2 · 2.4 · 3 · 3.2 · 3.4 · 3.6 · 4 · 4.2 · 4.4 · 4.8 · 5 · 5.2 · 5.4 · 5.6 · 6 · 6.4 · 6.6 · 38 · 42 · 46 · 48 s |

## 3. Hero build guide (stage 1440 × 980)

Author everything in one `<svg viewBox="0 0 1440 980" preserveAspectRatio="xMidYMax slice">` that fills the hero (`position:absolute; inset:0; width:100%; height:100%`). The copy and the glass widget are HTML and sit outside the SVG.

Layers, back to front (geometry in design.md §8):

1. `<rect fill="url(#gGrid)">` with a 48px pattern.
2. Atmosphere circle (r 1260), breathing on `g-breathe` 9s.
3. Planet body (r 1200, `#07080A`). It covers the lower atmosphere, so only a thin halo shows above the rim.
4. Rim glow (r 1200, stroke 10, blur σ18), also on `g-breathe` 9s. Then the rim line (1.5px).
5. Light shafts.
6. Cash line and cash flow overlay (A4).
7. Gap bracket group (A2b).
8. Cash end marker (1200,448).
9. **Token group** (A2a): token line (A1), glow copy, travelling tick (A3), top marker with its pulsing halo (A5) and the "TOKEN / SHARE" label.
10. Static labels: "CASH MID", plus "GAP · LIVE" pulsing (A5).

**Why the bracket scales from the bottom:** the cash end (y 448) is fixed and the token end rides the token group. When the token group moves down 38px, the gap shrinks from 84px to 46px, and 46/84 = 0.55. So the bracket runs `scaleY(1 → .55)` with `transform-origin:1200px 448px`, on the same 6s ease-in-out clock as the group. The two stay glued together.

## 4. Hero choreography

| t      | Event                                                                                                                                   |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| 0.2s   | Copy column rises (A6, 1s)                                                                                                              |
| 0.3s   | Cash line draws in (A1, 2.4s)                                                                                                           |
| 0.5s   | Token line draws in (A1, 2.4s)                                                                                                          |
| 0s → ∞ | Token group breathes 0 → 38 → 0px (6s). Bracket scales 1 → .55 → 1 (6s, synced).                                                        |
| 0s → ∞ | Tick rides the token path (4s). Cash dashes flow (2.2s). Marker halo pulses (1.6s). Label pulses (3s). Atmosphere and rim breathe (9s). |

### A1 · Line draw-in

```css
@keyframes g-draw {
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 0;
  }
}
```

```html
<path
  d="…"
  pathLength="100"
  stroke-dasharray="100"
  style="animation:g-draw 2.4s cubic-bezier(.2,.7,.2,1) .5s both"
/>
```

`pathLength="100"` normalises any curve, so a 100 → 0 offset always draws the whole line.

### A2 · Token breathe + bracket

```css
@keyframes g-lime {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(38px);
  }
}
@keyframes g-brk {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.55);
  }
}
```

```html
<g
  style="transform-origin:1200px 448px;animation:g-brk 6s ease-in-out infinite"
>
  <rect
    x="1195"
    y="364"
    width="10"
    height="84"
    rx="5"
    fill="#B2D450"
    opacity=".18"
  />
  <line
    x1="1200"
    y1="366"
    x2="1200"
    y2="446"
    stroke="#B2D450"
    stroke-width="1.5"
    stroke-dasharray="3 4"
  />
</g>
<g style="animation:g-lime 6s ease-in-out infinite">
  …token line, tick, marker, label…
</g>
```

**Adapting:** for a travel of `d` px on a gap of `h` px, the bracket scale is `(h − d)/h`.

### A3 · Travelling tick

```html
<circle r="4" fill="#E4F5A6"
  ><animateMotion dur="4s" repeatCount="indefinite" path="<token path d>"
/></circle>
<circle r="12" fill="#B2D450" opacity=".25"
  ><animateMotion dur="4s" repeatCount="indefinite" path="<token path d>"
/></circle>
```

The tick sits inside the token group, so it inherits the breathe. Use the identical `d` string as the token line.

### A4 · Cash flow dashes

```css
@keyframes g-flow {
  to {
    stroke-dashoffset: -48;
  }
}
```

`stroke-dasharray="2 22"` has a period of 24, and the offset of −48 equals two periods, so the loop is seamless. Style: `animation:g-flow 2.2s linear infinite`, cream at 35%.

### A5 · Gap pulse

```css
@keyframes g-gap {
  0%,
  100% {
    opacity: 0.55;
  }
  50% {
    opacity: 1;
  }
}
```

Used on the marker halo (1.6s) and the "GAP · LIVE" label (3s).

### A6 · Copy rise

```css
@keyframes g-rise {
  from {
    opacity: 0;
    transform: translateY(14px);
    filter: blur(8px);
  }
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
}
```

Style: `animation:g-rise 1s cubic-bezier(.2,.7,.2,1) .2s both`.

### Atmosphere

```css
@keyframes g-breathe {
  0%,
  100% {
    opacity: 0.75;
  }
  50% {
    opacity: 1;
  }
} /* 9s on atmosphere + rim glow */
```

## 5. Hero complete code

The full SVG is in `Main.dc.html` under `<!-- HERO -->`. Key `<defs>`:

```html
<radialGradient
  id="gAtm"
  cx="980"
  cy="1640"
  r="1260"
  gradientUnits="userSpaceOnUse"
>
  <stop offset=".84" stop-color="#B2D450" stop-opacity="0" /><stop
    offset=".95"
    stop-color="#B2D450"
    stop-opacity=".22" /><stop offset="1" stop-color="#B2D450" stop-opacity="0"
/></radialGradient>
<linearGradient id="gRim" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#B2D450" stop-opacity="0" /><stop
    offset=".35"
    stop-color="#E4F5A6"
    stop-opacity=".9" /><stop offset=".62" stop-color="#B2D450" /><stop
    offset="1"
    stop-color="#B2D450"
    stop-opacity="0"
/></linearGradient>
<linearGradient id="gFade"> cream 0 → .9 at 25% → .9 </linearGradient>
<linearGradient id="gFadeL"> lime 0 → 1 at 25% → 1 </linearGradient>
<filter id="gBlur"><feGaussianBlur stdDeviation="18" /></filter>
<filter id="gSoft"><feGaussianBlur stdDeviation="4" /></filter>
<pattern id="gGrid" width="48" height="48" patternUnits="userSpaceOnUse"
  ><path d="M48 0H0V48" fill="none" stroke="#F9F7F4" stroke-opacity=".035"
/></pattern>
```

**Adapting to other data:** keep both paths on the same x-stations (640, 850, 1030, 1200, 1440). Put the measured station at x 1200 and set both end markers to that x. The bracket spans the two y values at that x.

## 6. Other sections

### B1 · Ticker marquee (48s)

```css
@keyframes g-marq {
  to {
    transform: translateX(-50%);
  }
}
.g-marq {
  display: flex;
  gap: 14px;
  width: max-content;
  animation: g-marq 48s linear infinite;
}
```

Render the list twice. The −50% shift equals exactly one copy, so the loop is seamless. Mask the edges on the wrapper: `mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)`.

### B2 · Threshold flash (4.2s)

```css
@keyframes g-flash {
  0%,
  60%,
  100% {
    border-color: rgba(249, 247, 244, 0.09);
    box-shadow: 0 0 0 rgba(178, 212, 80, 0);
  }
  68%,
  80% {
    border-color: rgba(178, 212, 80, 0.75);
    box-shadow: 0 0 26px -4px rgba(178, 212, 80, 0.65);
  }
}
```

Applied only to chips with `|gap| ≥ 7.6` (the total cost). Delay = `index × 0.9s`, so NVDA (i1) flashes at 0.9s, META (i5) at 4.5s and COIN (i7) at 6.3s.

### C1 · Measure ruler (4s)

```css
@keyframes g-meas {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(90px);
  }
}
@keyframes g-span {
  0%,
  100% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(3.25);
  }
}
```

- SVG 300×84. Baseline at y 56 from x 10 to 290, with ticks every 40 starting at 30. Cash dot at (60,56); token dot at (100,56).
- The span rect runs from x 60, is 40 wide, and uses `transform-origin:60px 56px`.
- **Sync maths:** the token travels 90px, so the span grows from 40 to 130, which is a scale of 130/40 = 3.25. Both run on 4s ease-in-out.

### C2 · Haircut peel (5s)

```css
@keyframes g-peel {
  0%,
  14% {
    transform: scaleX(1);
    opacity: 1;
  }
  24%,
  86% {
    transform: scaleX(0);
    opacity: 0;
  }
  96%,
  100% {
    transform: scaleX(1);
    opacity: 1;
  }
}
@keyframes g-netc {
  0%,
  50% {
    color: #80848a;
  }
  62%,
  86% {
    color: #b2d450;
    text-shadow: 0 0 18px rgba(178, 212, 80, 0.6);
  }
  96%,
  100% {
    color: #80848a;
  }
}
```

- The bar is 14px, radius 999, `overflow:hidden`.
- Segments, left to right: net 55.3% (lime), buffer 11.8%, slip 12.4%, fees 20.6%. These are 9.4, 2.0, 2.1 and 3.5 of 17.0.
- Clock (5s, `transform-origin:left`):

| Segment              | Delay | Gone at    |
| -------------------- | ----- | ---------- |
| Fees (rightmost)     | 0s    | 1.2s       |
| Slip                 | .6s   | 1.8s       |
| Buffer               | 1.2s  | 2.4s       |
| "net 9.4 bps" lights | –     | 3.1s (62%) |
| All restore          | –     | 4.8s       |

### C3 · Emit gates + mini card (5.4s)

```css
.g-gate {
  animation: g-gate 5.4s ease-in-out infinite;
}
@keyframes g-gate {
  0% {
    background: rgba(178, 212, 80, 0);
    color: #80848a;
    border-color: rgba(249, 247, 244, 0.14);
    box-shadow: none;
  }
  8%,
  64% {
    background: rgba(178, 212, 80, 0.14);
    color: #b2d450;
    border-color: rgba(178, 212, 80, 0.55);
    box-shadow: 0 0 18px -6px rgba(178, 212, 80, 0.8);
  }
  74%,
  100% {
    background: rgba(178, 212, 80, 0);
    color: #80848a;
    border-color: rgba(249, 247, 244, 0.14);
    box-shadow: none;
  }
}
@keyframes g-mini {
  0%,
  46% {
    opacity: 0;
    transform: translateY(18px) scale(0.96);
  }
  56%,
  84% {
    opacity: 1;
    transform: none;
  }
  94%,
  100% {
    opacity: 0;
    transform: translateY(-8px);
  }
}
```

| Element   | Delay | On window                         |
| --------- | ----- | --------------------------------- |
| Net gap ✓ | 0s    | .43 – 3.46s                       |
| Session ✓ | .5s   | .93 – 3.96s                       |
| Depth ✓   | 1s    | 1.43 – 4.46s                      |
| Cap ≤ 3 ✓ | 1.5s  | 1.93 – 4.96s                      |
| Mini card | 0s    | 3.02 – 4.54s (all four gates lit) |

### D1 · Countdown ring (JS, 75s)

```js
componentDidMount(){ this.timer=setInterval(()=>this.setState(s=>({
  t: s.t<=0 ? 75 : s.t-1,
  requoted: s.t<=0 ? false : (s.requoted || s.t===31)   // auto-demo re-quote
})),1000) }
// renderVals: ringOffset = 339.29*(1 - t/75); clock = Math.floor(t/60)+':'+String(t%60).padStart(2,'0')
```

```html
<circle
  r="54"
  stroke-dasharray="339.29"
  stroke-dashoffset="{{ringOffset}}"
  transform="rotate(-90 62 62)"
  style="transition:stroke-dashoffset 1s linear;filter:drop-shadow(0 0 6px rgba(178,212,80,.6))"
/>
```

The 1s linear transition between ticks makes the arc look continuous. In production, drive `t` from the card's `expires_at` rather than a local counter.

### D2 · Re-quote shimmer (1.1s, once)

```css
@keyframes g-shimmer {
  from {
    transform: translateX(-120%) skewX(-18deg);
  }
  to {
    transform: translateX(260%) skewX(-18deg);
  }
}
```

The overlay mounts only when `requoted` flips true. The mount restarts the animation, so it plays once per re-quote. It is a band 45% wide, `linear-gradient(90deg, transparent, rgba(178,212,80,.28), transparent)`, and the card mock needs `overflow:hidden`.

### D3 · Daily cap fill + lock (6s)

```css
@keyframes g-capfill {
  0% {
    background: #1c1f23;
    box-shadow: none;
  }
  6%,
  80% {
    background: #b2d450;
    box-shadow: 0 0 14px rgba(178, 212, 80, 0.6);
  }
  90%,
  100% {
    background: #1c1f23;
    box-shadow: none;
  }
}
@keyframes g-lock {
  0%,
  54% {
    opacity: 0;
    transform: translateY(6px);
  }
  62%,
  82% {
    opacity: 1;
    transform: none;
  }
  92%,
  100% {
    opacity: 0;
  }
}
```

| Element            | Delay | Lit                        |
| ------------------ | ----- | -------------------------- |
| Bar 1              | 0s    | .36 – 4.8s                 |
| Bar 2              | 1.4s  | 1.76 – 6.2s                |
| Bar 3              | 2.8s  | 3.16 – 7.6s                |
| "3/3 · CAP LOCKED" | 2.8s  | 6.52 – 7.72s (after bar 3) |

### D4 · Featured panel top scan (5s)

```css
@keyframes g-scan {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
```

The wrapper is a 1px strip, `overflow:hidden`, at `top:0` of the panel. The child is 50% wide with a lime gradient and `animation:g-scan 5s linear infinite`.

### E1 · STALE age (4.4s)

```css
@keyframes g-age {
  0% {
    width: 0;
    background: #b2d450;
  }
  62% {
    background: #b2d450;
  }
  80%,
  100% {
    width: 100%;
    background: #ff6b5e;
  }
}
@keyframes g-stalet {
  0%,
  58% {
    color: #f9f7f4;
    opacity: 1;
  }
  80%,
  100% {
    color: #5a5d62;
    opacity: 0.6;
  }
}
```

Both run on `ease-in`. The bar fills as the quote ages and turns red at the same moment the timestamp dies.

### E2 · CLOSED session (6.6s)

```css
@keyframes g-sess {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(206px);
  }
}
@keyframes g-sessin {
  0%,
  32% {
    opacity: 0.25;
  }
  36%,
  66% {
    opacity: 1;
  }
  70%,
  100% {
    opacity: 0.25;
  }
}
```

- The track is 28px tall and about 221px wide, with the RTH window at `left:35%; width:32%`. The marker is a 10px dot starting at left 2px.
- **Sync:** both run `linear` on 6.6s. The marker is inside the window from 35% to 67% of its travel, and `g-sessin` lights from 36% to 66%. When you change the track width, set `translateX` to track width − 15px.

### E3 · THIN drain (3.6s)

```css
@keyframes g-drain {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.12);
  }
}
```

Ten bars, `transform-origin:bottom`, each delayed by `i × 0.12s` so a wave runs across the book. Bids (first 5) are lime and asks (last 5) are red, both at 80% opacity.

### E4 · DUST dissolve (3.2s)

```css
@keyframes g-dustnum {
  0%,
  24% {
    opacity: 1;
    filter: blur(0);
  }
  64%,
  84% {
    opacity: 0.06;
    filter: blur(4px);
  }
  100% {
    opacity: 1;
    filter: blur(0);
  }
}
@keyframes g-dust {
  0%,
  30% {
    opacity: 0;
    transform: translate(0, 0);
  }
  42% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(var(--dx), -46px);
  }
}
```

Eight 5px dots, each with its own `--dx`:

| left,top | --dx | delay |
| -------- | ---- | ----- |
| 8,30     | −10  | 0     |
| 22,20    | 6    | .1    |
| 34,34    | −4   | .2    |
| 48,24    | 12   | .05   |
| 60,36    | −8   | .25   |
| 72,22    | 10   | .15   |
| 86,32    | 4    | .3    |
| 98,26    | 14   | .08   |

The dots appear at about 1s, exactly as the number starts to blur.

### F1 · Paper stamp (4.8s)

```css
@keyframes g-stamp {
  0%,
  18% {
    opacity: 0;
    transform: rotate(-9deg) scale(1.7);
  }
  28%,
  80% {
    opacity: 1;
    transform: rotate(-9deg) scale(1);
  }
  92%,
  100% {
    opacity: 0;
    transform: rotate(-9deg) scale(1);
  }
}
```

Easing is `cubic-bezier(.3,1.4,.5,1)`, whose overshoot gives the landing thud. The stamp has a 2px lime border, radius 8, and mono 600 13px text with `.14em` tracking.

### F2 · Live route (5.2s)

```css
@keyframes g-packet {
  0% {
    transform: translateX(0);
    opacity: 0;
  }
  6% {
    opacity: 1;
  }
  22%,
  52% {
    transform: translateX(140px);
  }
  72% {
    transform: translateX(280px);
  }
  90% {
    transform: translateX(420px);
    opacity: 1;
  }
  100% {
    transform: translateX(420px);
    opacity: 0;
  }
}
@keyframes g-tap {
  0%,
  22% {
    transform: scale(0.6);
    opacity: 0;
  }
  28% {
    transform: scale(1);
    opacity: 0.9;
  }
  52% {
    transform: scale(1.8);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
```

- Nodes sit at x 10, 150, 290 and 430 (140px apart). The packet starts at left 3, so its 14px body centres on x 10.
- The packet **holds at CONFIRM from 22% to 52% (1.14–2.70s)**. The tap ring (36px, centred on x 150) fires at 28% and expands out by 52%, then the packet leaves. The meaning: nothing moves until your tap.
- Packet easing: `cubic-bezier(.6,0,.3,1)`.

### G1 · ✕ draw (6s)

```css
@keyframes g-xdraw {
  0% {
    stroke-dashoffset: 30;
  }
  18%,
  84% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 30;
  }
}
```

On the cross path with `stroke-dasharray="30"`. Delays are 0, .35, .7 and 1.05s, so the four refusals draw left to right.

### G2 · "not" flicker (5.6s)

```css
@keyframes g-flicker {
  0%,
  100% {
    opacity: 1;
  }
  3% {
    opacity: 0.15;
  }
  5% {
    opacity: 1;
  }
  8% {
    opacity: 0.3;
  }
  11%,
  58% {
    opacity: 1;
  }
  60% {
    opacity: 0.35;
  }
  62% {
    opacity: 1;
  }
}
```

Linear, on the Doto span, which needs `display:inline-block`. There are two stutters per loop, like a failing dot-matrix sign.

### H1 · FAQ answer rise (.6s, once)

The answer uses `g-rise` (A6) with `.6s cubic-bezier(.2,.7,.2,1) both`. It replays every time a row opens, because `<sc-if>` remounts the answer.

### H2 · FAQ scan line (3.4s)

`g-scan` (D4) runs on a 1px strip at the bottom of the open row, with a child 40% wide on `linear infinite`.

### I1 · Closing lines split and rejoin (6.4s)

```css
@keyframes g-conA {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-80px);
  }
}
@keyframes g-conB {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(80px);
  }
}
```

The two paths have the **same** `d` (one solid, one dashed `6 8`), so at 0% and 100% they sit on top of each other: the gap is closed. The SVG uses `preserveAspectRatio="none"` at 20% opacity, ink on lime.

### I2 · Headline snap (6.4s)

```css
@keyframes g-snap {
  0%,
  3% {
    transform: scale(1.035);
  }
  12%,
  100% {
    transform: scale(1);
  }
}
```

Uses `ease-out` on the same 6.4s clock as I1. The snap lands at 0%, exactly when the lines meet: "NO GAP."

## 6B. App screens

**App rule:** app motion only signals _state or liveness_: a card is open, a feed is live, a value just changed, something is waiting on you. No decorative loops, except on the pre-launch Token screen. Periods stay distinct inside each screen.

### J1 · Live dot (2.4s)

The same `ping` keyframes as the landing page (`g-ping`), on every `.live`: pills, the rail health dot, and mode pills.

### J2 · Active card scan (4.6s)

```css
@keyframes scan {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}
```

A 1px strip at the top of the active card panel (Home and Card), with a child 50% wide on a lime gradient, `linear infinite`. It is 4.6s here rather than the landing page's 5s, so it reads as the app's own clock.

### J3 · CARD row pulse (3s)

```css
@keyframes glowrow {
  0%,
  100% {
    background: rgba(178, 212, 80, 0.04);
  }
  50% {
    background: rgba(178, 212, 80, 0.09);
  }
}
```

Only on the gap-board row whose state is CARD (`rowStyle` is set in JS). Every other row is static.

### J4 · Pending cap pip (2s)

```css
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}
```

On the striped pip `repeating-linear-gradient(135deg, rgba(178,212,80,.7) 0 4px, rgba(178,212,80,.2) 4px 8px)`, which stands for the card that is pending, not yet used. In History, the same pip is static.

### J5 · Countdown ring (JS, 1s tick)

The same maths as D1:

- `dashoffset = 339.29·(1 − t/75)`, with `transition: stroke-dashoffset 1s linear`.
- It starts at t = 52, which puts "now" at 14:02:41.
- On the Card screen the tick is suspended while `phase > 0`: the clock holds during confirm, and the sub-label reads "HELD · CONFIRMING".

```js
this.timer = setInterval(
  () =>
    this.setState((s) => (s.phase > 0 ? null : { t: s.t <= 0 ? 75 : s.t - 1 })),
  1000,
);
```

### J6 · Confirm sequence (Card, 2.1s total)

```js
run(){ if(this.state.phase>0) return;
  this.setState({phase:1,shimmer:false});
  setTimeout(()=>this.setState({phase:2,shimmer:true}),700);   // re-quote → shimmer (J7)
  setTimeout(()=>this.setState({phase:3}),1400);               // gate re-check
  setTimeout(()=>this.setState({phase:4}),2100); }             // fill / order, done message
```

| Phase | Step dots                     | Numbers              | Button      |
| ----- | ----------------------------- | -------------------- | ----------- |
| 0     | all waiting (number)          | net 9.4, cash 182.40 | Do it       |
| 1     | step 1 now (lime ring + glow) | –                    | Confirming… |
| 2     | 1 done, 2 now                 | net 8.9, cash 182.41 | Confirming… |
| 3     | 1–2 done, 3 now               | –                    | Confirming… |
| 4     | all done + message            | –                    | Done        |

Skip clears every timer and resets to phase 0, t = 75.

### J7 · Re-quote shimmer (1.1s, once)

The same as D2 (`shimmer` keyframes, a 45% band, lime at 25–28%). It mounts through `<sc-if>` when `shimmer` turns true, so it plays once per confirm. On Home it mounts with the re-quote line.

### J8 · Waterfall grow (Card, on load)

```css
@keyframes grow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
```

| Bar      | Origin | Duration | Delay |
| -------- | ------ | -------- | ----- |
| \|gap\|  | left   | .6s      | 0     |
| fees     | right  | .5s      | .2s   |
| slippage | right  | .5s      | .35s  |
| buffer   | right  | .5s      | .5s   |
| net      | left   | .6s      | .7s   |

The cost bars grow _from the right_, so the haircut reads as being taken off the end of the gross bar.

### J9 · Detail chart draw (Watchlist, on select)

`pathLength="100"` with `dasharray 100`, using `draw` (the same as A1). Gross runs 1.2s ease-out; net runs 1.2s with a .15s delay. The panel itself enters with `rise` (8px, .4s).

### J10 · Drawer rise (History, .35s)

```css
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
```

It plays on load. To replay it on every row change in production, key the drawer on the selected card id.

### J11 · Token mark (pre-launch, 40s / 26s / 5s / 3s)

```css
@keyframes orbit {
  to {
    transform: rotate(360deg);
  }
}
@keyframes breathe {
  0%,
  100% {
    opacity: 0.55;
  }
  50% {
    opacity: 1;
  }
}
@keyframes dash {
  to {
    stroke-dashoffset: -40;
  }
}
```

- Outer dotted ring (r136, `dasharray 2 8`) with a lime satellite dot: orbit 40s linear.
- Inner lime arc (r112, `dasharray 60 644`): orbit 26s linear reverse.
- Hexagon stroke: breathe 5s.
- Chart placeholder line (`dasharray 6 14`): dash 3s linear. The −40 offset equals two periods of the 20px dash pattern, so the loop is seamless.
- This is the only screen with ambient motion, because it has no data yet.

### J12 · Micro-transitions

| Element             | Transition                                       |
| ------------------- | ------------------------------------------------ |
| Rail tooltip        | opacity .15s                                     |
| Settings switch     | track background .2s, knob `left` .2s (3 → 21px) |
| Panel hover (Token) | border-color and box-shadow .4s                  |
| Countdown arc       | stroke-dashoffset 1s linear                      |

## 7. Page background and nav

- **Edge glows:**

  ```css
  @keyframes g-drift {
    0%,
    100% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(40px, -30px);
    }
  }
  ```

  | Glow | Size | Position             | Alpha | Blur | Timing    |
  | ---- | ---- | -------------------- | ----- | ---- | --------- |
  | 1    | 760  | left −380, top 1500  | .10   | 40   | 38s       |
  | 2    | 820  | right −420, top 2900 | .08   | 50   | 46s, −12s |
  | 3    | 800  | left −420, top 4500  | .08   | 50   | 42s, −20s |

- **Live dots:**
  ```css
  @keyframes g-ping {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.45;
      transform: scale(0.8);
    }
  }
  ```
  2.4s ease-in-out, on every `.g-live`.
- **Hover:** panels transition their border and glow over .4s. Buttons change glow and colour instantly.

## 8. Product motifs (reuse across GAUGE surfaces)

| Motif                  | Meaning                | Source |
| ---------------------- | ---------------------- | ------ |
| Two lines + bracket    | Cash vs token, the gap | A2, I1 |
| Peeling bar            | Gross → net haircut    | C2     |
| Sequential gates       | All must pass          | C3     |
| 75s ring               | Card lifetime          | D1     |
| Three pips             | Daily cap              | D3     |
| Packet held at confirm | You tap, it doesn't    | F2     |
| Dot-matrix dissolve    | Dust                   | E4     |

## 9. Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

The SMIL `<animateMotion>` ticks (A3) ignore CSS, so hide them: add `.g-tick{display:none}` inside the media query and give the two tick circles `class="g-tick"`.

Rest states, and the fixes needed to make each one read correctly:

| ID     | Rest state with animation off                   | Fix (add inside the media query)                                   |
| ------ | ----------------------------------------------- | ------------------------------------------------------------------ |
| A1     | Lines hidden (dashoffset 100)                   | `path[pathLength]{stroke-dashoffset:0 !important}`                 |
| C2     | Full bar (gross)                                | OK: labels still show net 9.4                                      |
| C3     | Gates dim                                       | `.g-gate{color:#B2D450;border-color:rgba(178,212,80,.55)}`         |
| D3     | Bars empty                                      | Add class `g-cap-1` to the first bar; the override lights it (1/3) |
| E1     | Bar width 0                                     | Add class `g-age` to the bar; the override shows it full and red   |
| G1     | ✕ fully drawn (no dashoffset in the base style) | OK                                                                 |
| Others | Final or neutral frame                          | OK                                                                 |

App: J8 bars and J9 lines have no hidden base state (no base `scaleX(0)` or `dashoffset`), so they read fully drawn with motion off. The J5 countdown is content, not decoration, so its 1s tick keeps running; only its transition is removed. The J6 phase changes still happen but land instantly.

These overrides are in `assets/css/animations.css`. They are not yet in the canvas artboard; apply them in production.

## 10. Performance and browser notes

- The heaviest layers are the blurred glows and `filter: blur()` on the hero rim. They are static filters with only opacity animated, which is cheap.
- `backdrop-filter` on the nav and widget: include the `-webkit-` prefix for Safari.
- SMIL `<animateMotion>` runs in Chromium, Firefox and Safari. If you move to CSS `offset-path`, use the same `d` and put the element's centre on the path.
- Keep the marquee under about 20 chips per copy.
- Pause offscreen loops in production with an `IntersectionObserver` toggling `animation-play-state` on each section.
- `mask-image` on the ticker needs the `-webkit-` prefix too.

## 11. Index

| ID  | Keyframes            | Period              | Easing                 | Section                           |
| --- | -------------------- | ------------------- | ---------------------- | --------------------------------- |
| A1  | g-draw               | 2.4s once           | .2,.7,.2,1             | Hero                              |
| A2  | g-lime, g-brk        | 6s                  | ease-in-out            | Hero                              |
| A3  | SMIL animateMotion   | 4s                  | linear                 | Hero                              |
| A4  | g-flow               | 2.2s                | linear                 | Hero                              |
| A5  | g-gap                | 1.6s / 3s           | ease-in-out            | Hero                              |
| A6  | g-rise               | 1s once             | .2,.7,.2,1             | Hero                              |
| –   | g-breathe            | 9s                  | ease-in-out            | Hero atmosphere                   |
| B1  | g-marq               | 48s                 | linear                 | Ticker                            |
| B2  | g-flash              | 4.2s                | ease-in-out            | Ticker                            |
| C1  | g-meas, g-span       | 4s                  | ease-in-out            | How / Measure                     |
| C2  | g-peel, g-netc       | 5s                  | ease-in-out            | How / Haircut                     |
| C3  | g-gate, g-mini       | 5.4s                | ease-in-out            | How / Emit                        |
| D1  | JS + transition      | 75s                 | linear                 | Card                              |
| D2  | g-shimmer            | 1.1s once           | ease-out               | Card                              |
| D3  | g-capfill, g-lock    | 6s                  | ease-in-out            | Card / cap                        |
| D4  | g-scan               | 5s                  | linear                 | Card panel                        |
| E1  | g-age, g-stalet      | 4.4s                | ease-in                | STALE                             |
| E2  | g-sess, g-sessin     | 6.6s                | linear                 | CLOSED                            |
| E3  | g-drain              | 3.6s                | ease-in-out            | THIN                              |
| E4  | g-dust, g-dustnum    | 3.2s                | ease-out / ease-in-out | DUST                              |
| F1  | g-stamp              | 4.8s                | .3,1.4,.5,1            | Paper                             |
| F2  | g-packet, g-tap      | 5.2s                | .6,0,.3,1 / ease-out   | Live                              |
| G1  | g-xdraw              | 6s                  | ease-in-out            | Won't do                          |
| G2  | g-flicker            | 5.6s                | linear                 | Won't do                          |
| H1  | g-rise               | .6s once            | .2,.7,.2,1             | FAQ                               |
| H2  | g-scan               | 3.4s                | linear                 | FAQ                               |
| I1  | g-conA, g-conB       | 6.4s                | ease-in-out            | Closing                           |
| I2  | g-snap               | 6.4s                | ease-out               | Closing                           |
| Z   | g-drift, g-ping      | 38–46s / 2.4s       | ease-in-out            | Global                            |
| J1  | ping                 | 2.4s                | ease-in-out            | App · live dots                   |
| J2  | scan                 | 4.6s                | linear                 | App · active card                 |
| J3  | glowrow              | 3s                  | ease-in-out            | Home · CARD row                   |
| J4  | blink                | 2s                  | ease-in-out            | Home · pending pip                |
| J5  | JS + transition      | 1s tick / 75s       | linear                 | Home, Card · ring                 |
| J6  | JS timeouts          | 0 / .7 / 1.4 / 2.1s | –                      | Card · confirm                    |
| J7  | shimmer              | 1.1s once           | ease-out               | Home, Card                        |
| J8  | grow                 | .5–.6s staggered    | ease-out               | Card · waterfall                  |
| J9  | draw, rise           | 1.2s / .4s          | ease-out               | Watchlist · detail                |
| J10 | rise                 | .35s                | ease-out               | History · drawer                  |
| J11 | orbit, breathe, dash | 40 / 26 / 5 / 3s    | linear / ease-in-out   | Token · mark                      |
| J12 | transitions          | .15–1s              | ease                   | App · tooltip, switch, hover, arc |
