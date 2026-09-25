/**
 * Sample-data generators, exact (design.md §5B.12 H). All charts share one
 * seeded LCG so curves are identical on every render (and on the server).
 */
import { LEDGER, RULES, pnl, type WatchRow } from "./model";

const lcg = (seed: number) => (seed * 9301 + 49297) % 233280;
const symSeed = (sym: string) => sym.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0);
const path = (pts: [number, number][]) =>
  pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");

/** Home sparkline: 112 × 28, 24 points, ends on the live net. */
export function sparkline(row: WatchRow) {
  let seed = symSeed(row.sym);
  const v: number[] = [];
  for (let i = 0; i < 24; i++) {
    seed = lcg(seed);
    v.push(row.net + (seed / 233280 - 0.5) * 8 * (1 - i / 30));
  }
  v[23] = row.net;
  const lo = Math.min(...v, RULES.floor) - 1;
  const hi = Math.max(...v, RULES.floor) + 1;
  const y = (x: number) => 26 - ((x - lo) / (hi - lo)) * 24;
  const pts = v.map((val, i) => [(i * 110) / 23, y(val)] as [number, number]);
  return { d: path(pts), floorY: y(RULES.floor), end: pts[23] };
}

/** Watchlist detail: 700 × 220, 60 points, one per minute 13:03 → 14:02. */
export function detailSeries(row: WatchRow) {
  let seed = symSeed(row.sym) * 7;
  const gap = row.absGap;
  const g: number[] = [];
  for (let i = 0; i < 60; i++) {
    seed = lcg(seed);
    g.push(Math.max(0.2, gap + (seed / 233280 - 0.5) * 12 * (1 - i / 70) + Math.sin(i / 6) * 2));
  }
  g[59] = gap;
  const nv = g.map((x) => x - row.costs);
  const lo = Math.min(...nv, 0) - 2;
  const hi = Math.max(...g) + 2;
  const Y = (v: number) => 190 - ((v - lo) / (hi - lo)) * 180;
  const X = (i: number) => (i * 696) / 59;
  const grossPts = g.map((v, i) => [X(i), Y(v)] as [number, number]);
  const netPts = nv.map((v, i) => [X(i), Y(v)] as [number, number]);
  const band = `${path(grossPts)} ${netPts
    .slice()
    .reverse()
    .map(([x, y]) => `L${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ")} Z`;
  return {
    gross: path(grossPts),
    net: path(netPts),
    band,
    floorY: Y(RULES.floor),
    zeroY: Y(0),
    end: netPts[59],
    X,
    g,
    nv,
  };
}

/** Card price window: 760 × 230, 99 samples, 1/s from 14:01:03 to 14:02:41. */
export function cardWindow() {
  let seed = 777;
  const cash: number[] = [];
  const tok: number[] = [];
  for (let i = 0; i < 99; i++) {
    seed = lcg(seed);
    const r = seed / 233280 - 0.5;
    const base = 182.4 + Math.sin(i / 9) * 0.06 + r * 0.04;
    cash.push(i === 98 ? 182.4 : base);
    tok.push(i === 98 ? 182.71 : base + 0.28 + Math.sin(i / 5) * 0.04 + r * 0.03);
  }
  const X = (i: number) => 50 + (i * 706) / 98;
  const Y = (v: number) => 200 - ((v - 182.3) / 0.6) * 180;
  const cashPts = cash.map((v, i) => [X(i), Y(v)] as [number, number]);
  const tokPts = tok.map((v, i) => [X(i), Y(v)] as [number, number]);
  const band = `${path(tokPts)} ${cashPts
    .slice()
    .reverse()
    .map(([x, y]) => `L${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ")} Z`;
  return { cash: path(cashPts), token: path(tokPts), band, X, Y, cashV: cash, tokV: tok };
}

/** Home P&L chart: 800 × 206, cumulative paper P&L per taken card. */
export function pnlSeries() {
  const taken = LEDGER.filter((e) => e.outcome === "TAKEN");
  let run = 0;
  const cum = taken.map((e) => (run += pnl(e.captured ?? 0)));
  const maxV = Math.ceil(Math.max(...cum) / 100) * 100;
  const n = cum.length;
  const X = (i: number) => 70 + (i * 720) / (n - 1);
  const Y = (v: number) => 200 - (v / maxV) * 180;
  const pts = cum.map((v, i) => [X(i), Y(v)] as [number, number]);
  const line = path(pts);
  const area = `${line} L${X(n - 1)} 200 L${X(0)} 200 Z`;
  const dot = ([x, y]: [number, number]) =>
    `M${x - 4} ${y} a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0`;
  const upDots = pts.filter((_, i) => (taken[i].captured ?? 0) >= 0).map(dot).join(" ");
  const downDots = pts.filter((_, i) => (taken[i].captured ?? 0) < 0).map(dot).join(" ");
  const labels = taken.map((e, i) => ({
    left: X(i) / 8,
    text: `${e.session.slice(0, 3)} ${e.sym}`,
    value: cum[i],
    captured: e.captured ?? 0,
    x: X(i),
    y: Y(cum[i]),
  }));
  return { line, area, upDots, downDots, labels, maxV };
}
