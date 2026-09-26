/**
 * Live market simulation for the dashboard. Pure state → state; the client
 * provider calls stepLive() on a timer. Prices take a small mean-reverting
 * walk around the design.md §5B.3 sample values, so every name keeps its
 * state (NVDA stays CARD, HOOD/PLTR THIN, COIN STALE, the rest DUST) while
 * the numbers visibly breathe. Swap for the SSE stream in production.
 */
import { EVALUATIONS, RULES, WATCHLIST, evaluate, type WatchRaw, type WatchRow } from "./model";
import { seedSparkValues } from "./series";

export type ActivityEvent = { id: number; time: string; kind: string; color: string; msg: string };

export type Latency = { quotes: number; chainlink: number; rpc: number; redis: number; sse: number; mcp: number };

export type LiveState = {
  /** Seconds since "now" (14:02:41 ET). */
  elapsed: number;
  rows: WatchRow[];
  hist: Record<string, number[]>;
  evaluations: number;
  events: ActivityEvent[];
  latency: Latency;
  noise: Record<string, { lvl: number; off: number }>;
  nextId: number;
};

const BASE_STATE = Object.fromEntries(WATCHLIST.map((r) => [r.sym, evaluate(r).state]));

const START = 14 * 3600 + 2 * 60 + 41; // 14:02:41
const pad = (n: number) => String(n).padStart(2, "0");

export function clockAt(elapsed: number) {
  const t = START + Math.floor(elapsed);
  return `${pad(Math.floor(t / 3600))}:${pad(Math.floor((t % 3600) / 60))}:${pad(t % 60)}`;
}

/** Time left in RTH (closes 16:00 ET), e.g. "1h 57m". */
export function rthLeftAt(elapsed: number) {
  const left = Math.max(0, 16 * 3600 - (START + Math.floor(elapsed)));
  return `${Math.floor(left / 3600)}h ${pad(Math.floor((left % 3600) / 60))}m`;
}

const LIME = "#B2D450";
export const SEED_EVENTS: ActivityEvent[] = [
  { id: 1, time: "09:30:00", kind: "SESSION", color: "#8FA6DA", msg: "RTH open · 11 names armed" },
  { id: 2, time: "10:14:07", kind: "CARD", color: LIME, msg: "TSLA · net 6.8 bps · cap 1/3" },
  { id: 3, time: "10:14:31", kind: "DO IT", color: LIME, msg: "TSLA re-quote 5.9 bps · clears" },
  { id: 4, time: "10:14:31", kind: "FILL", color: LIME, msg: "TSLA paper fill at confirm mid" },
  { id: 5, time: "11:02:44", kind: "STALE", color: "#FF6B5E", msg: "COIN chain feed 3.8 s old" },
  { id: 6, time: "12:40:10", kind: "THIN", color: "#E8B04A", msg: "HOOD depth $45k < $100k" },
  { id: 7, time: "13:15:02", kind: "DUST", color: "#80848A", msg: "META net 1.2 < floor 2.0" },
  { id: 8, time: "14:02:18", kind: "CARD", color: LIME, msg: "NVDA · net 9.4 bps · #2 today" },
];

export function initLive(): LiveState {
  const rows = WATCHLIST.map((r) => evaluate(r));
  return {
    elapsed: 0,
    rows,
    hist: Object.fromEntries(rows.map((r) => [r.sym, seedSparkValues(r)])),
    evaluations: EVALUATIONS,
    events: SEED_EVENTS,
    latency: { quotes: 38, chainlink: 1.1, rpc: 212, redis: 3, sse: 250, mcp: 164 },
    noise: Object.fromEntries(WATCHLIST.map((r) => [r.sym, { lvl: 0, off: 0 }])),
    nextId: SEED_EVENTS.length + 1,
  };
}

const jitter = (base: number, amp: number, rnd: () => number) => base + (rnd() - 0.5) * 2 * amp;

export function stepLive(s: LiveState, dt: number, rnd: () => number = Math.random): LiveState {
  const noise = { ...s.noise };
  const rows: WatchRow[] = WATCHLIST.map((b) => {
    const n = noise[b.sym];
    // Level drift moves both legs together; the spread wobbles ~±1 bp.
    const lvl = n.lvl * 0.85 + (rnd() - 0.5) * b.cash * 0.0003;
    let off = n.off * 0.7 + (rnd() - 0.5) * b.cash * 0.00012;
    const stale = b.age > RULES.maxAge;
    const at = (o: number): WatchRaw => ({
      ...b,
      cash: b.cash + lvl,
      token: b.token + lvl + o,
      depth: Math.round(b.depth * (1 + (rnd() - 0.5) * 0.08)),
      age: stale ? b.age + ((s.elapsed + dt) % 4) * 0.1 : 0.15 + rnd() * 0.4,
    });
    let row = evaluate(at(off));
    // Never let noise flip a gate: a DUST name must not start carding.
    const shownNet = Math.round(row.net * 10) / 10;
    const looksWrong = BASE_STATE[b.sym] === "DUST" && shownNet >= RULES.floor;
    if (row.state !== BASE_STATE[b.sym] || looksWrong) {
      off = 0;
      row = evaluate(at(0));
    }
    noise[b.sym] = { lvl, off };
    return row;
  });

  const hist = { ...s.hist };
  for (const r of rows) hist[r.sym] = [...hist[r.sym].slice(1), r.net];

  const elapsed = s.elapsed + dt;
  let events = s.events;
  let nextId = s.nextId;
  if (rnd() < 0.3) {
    const ev = makeEvent(rows, rnd);
    events = [...events.slice(-7), { ...ev, id: nextId++, time: clockAt(elapsed) }];
  }

  return {
    elapsed,
    rows,
    hist,
    evaluations: s.evaluations + rows.length * Math.round(dt / 0.25), // SSE tick every 250 ms
    events,
    latency: {
      quotes: Math.round(jitter(38, 6, rnd)),
      chainlink: +jitter(1.1, 0.2, rnd).toFixed(1),
      rpc: Math.round(jitter(212, 28, rnd)),
      redis: Math.max(1, Math.round(jitter(3, 1.4, rnd))),
      sse: Math.round(jitter(250, 18, rnd)),
      mcp: Math.round(jitter(164, 20, rnd)),
    },
    noise,
    nextId,
  };
}

function makeEvent(rows: WatchRow[], rnd: () => number): Omit<ActivityEvent, "id" | "time"> {
  const pick = <T,>(xs: T[]) => xs[Math.floor(rnd() * xs.length)];
  const roll = rnd();
  if (roll < 0.5) {
    const r = pick(rows.filter((x) => x.state === "DUST"));
    const net = `${r.net < 0 ? "−" : ""}${Math.abs(r.net).toFixed(1)}`;
    return { kind: "DUST", color: "#80848A", msg: `${r.sym} net ${net} < floor 2.0` };
  }
  if (roll < 0.72) {
    const r = pick(rows.filter((x) => x.state === "THIN"));
    return { kind: "THIN", color: "#E8B04A", msg: `${r.sym} depth $${r.depth}k < $100k` };
  }
  if (roll < 0.86) {
    const r = rows.find((x) => x.state === "STALE") ?? rows[0];
    return { kind: "STALE", color: "#FF6B5E", msg: `${r.sym} chain feed ${r.age.toFixed(1)} s old` };
  }
  const card = rows.find((x) => x.state === "CARD");
  return {
    kind: "TICK",
    color: "#C9CBCF",
    msg: card ? `${card.sym} net ${card.net.toFixed(1)} · card open · 4/4` : "11 names evaluated",
  };
}
