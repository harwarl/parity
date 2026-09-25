/**
 * GAUGE app data model (design.md §5B.3). Every screen computes from these
 * constants so numbers agree everywhere. All values are illustrative.
 */

export const RULES = {
  fees: 3.5, // bps, read-only
  buffer: 2.0, // bps
  floor: 2.0, // min net bps
  maxAge: 2.0, // s
  minDepth: 100, // $k
  cap: 3, // cards per day
  cardLife: 75, // s
  notional: 100_000, // $ per paper card
} as const;

export type Rules = {
  fees: number;
  buffer: number;
  floor: number;
  maxAge: number;
  minDepth: number;
  cap: number;
};

export type GateState = "CARD" | "THIN" | "STALE" | "DUST" | "CLOSED";

export type WatchRaw = {
  sym: string;
  name: string;
  cash: number;
  token: number; // token × mult, per share
  slip: number; // bps
  depth: number; // $k top of book
  age: number; // s, oldest leg
};

export type WatchRow = WatchRaw & {
  /** Signed gap in bps, token rich is positive. */
  gap: number;
  absGap: number;
  costs: number;
  net: number;
  state: GateState;
};

export const WATCHLIST: WatchRaw[] = [
  { sym: "NVDA", name: "NVIDIA", cash: 182.4, token: 182.71, slip: 2.1, depth: 420, age: 0.3 },
  { sym: "HOOD", name: "Robinhood", cash: 118.4, token: 118.93, slip: 3.0, depth: 45, age: 0.4 },
  { sym: "PLTR", name: "Palantir", cash: 178.2, token: 178.49, slip: 2.9, depth: 60, age: 0.4 },
  { sym: "COIN", name: "Coinbase", cash: 318.2, token: 317.84, slip: 2.4, depth: 260, age: 3.8 },
  { sym: "META", name: "Meta", cash: 742.1, token: 742.75, slip: 2.1, depth: 510, age: 0.3 },
  { sym: "AMD", name: "AMD", cash: 162.4, token: 162.52, slip: 2.2, depth: 380, age: 0.5 },
  { sym: "TSLA", name: "Tesla", cash: 428.9, token: 428.63, slip: 2.3, depth: 640, age: 0.2 },
  { sym: "GOOGL", name: "Alphabet", cash: 246.12, token: 246.19, slip: 1.9, depth: 450, age: 0.3 },
  { sym: "AAPL", name: "Apple", cash: 231.55, token: 231.64, slip: 1.8, depth: 720, age: 0.2 },
  { sym: "MSFT", name: "Microsoft", cash: 512.3, token: 512.41, slip: 1.8, depth: 560, age: 0.3 },
  { sym: "AMZN", name: "Amazon", cash: 224.8, token: 224.76, slip: 1.9, depth: 480, age: 0.3 },
];

/**
 * gap = |token×mult − cash| / cash × 1e4 ; costs = fees + slip + buffer ;
 * net = gap − costs. Gates in order: feed (age) → depth → net.
 */
export function evaluate(raw: WatchRaw, rules: Rules = RULES): WatchRow {
  const gap = ((raw.token - raw.cash) / raw.cash) * 1e4;
  const absGap = Math.abs(gap);
  const costs = rules.fees + raw.slip + rules.buffer;
  const net = absGap - costs;
  const state: GateState =
    raw.age > rules.maxAge
      ? "STALE"
      : raw.depth < rules.minDepth
        ? "THIN"
        : net < rules.floor
          ? "DUST"
          : "CARD";
  return { ...raw, gap, absGap, costs, net, state };
}

export const ROWS: WatchRow[] = WATCHLIST.map((r) => evaluate(r));

export function rowBySym(sym: string): WatchRow {
  return ROWS.find((r) => r.sym === sym) ?? ROWS[0];
}

export function stateCounts(rows: WatchRow[] = ROWS) {
  const counts = { CARD: 0, THIN: 0, STALE: 0, DUST: 0, CLOSED: 0 } as Record<GateState, number>;
  for (const r of rows) counts[r.state]++;
  return counts;
}

/* ── "Now" and the active card ─────────────────────────── */

export const NOW = {
  day: "Fri 26 Sep",
  time: "14:02:41",
  rthLeft: "1h 57m",
} as const;

export const ACTIVE = {
  id: "card_7f3a91",
  sym: "NVDA",
  emitted: "14:02:18.412",
  expires: "14:03:33.412",
  startT: 52,
  requote: { cash: 182.41, token: 182.71, net: 8.9 },
} as const;

/* ── Ledger (13 closed + 1 active) ─────────────────────── */

export type Outcome = "TAKEN" | "SKIPPED" | "EXPIRED" | "RE-QUOTE FAIL" | "ACTIVE";

export type LedgerEntry = {
  session: string; // "Mon 22"
  time: string; // "10:22"
  sym: string;
  atCard: number;
  atConfirm: number | null;
  outcome: Outcome;
  captured: number | null;
};

export const LEDGER: LedgerEntry[] = [
  { session: "Mon 22", time: "10:22", sym: "NVDA", atCard: 9.6, atConfirm: 9.0, outcome: "TAKEN", captured: 8.3 },
  { session: "Mon 22", time: "11:58", sym: "META", atCard: 6.1, atConfirm: null, outcome: "SKIPPED", captured: null },
  { session: "Mon 22", time: "15:30", sym: "AMZN", atCard: 3.2, atConfirm: 2.4, outcome: "TAKEN", captured: -1.2 },
  { session: "Tue 23", time: "09:47", sym: "PLTR", atCard: 11.2, atConfirm: 10.1, outcome: "TAKEN", captured: 9.4 },
  { session: "Tue 23", time: "12:30", sym: "TSLA", atCard: 3.9, atConfirm: null, outcome: "EXPIRED", captured: null },
  { session: "Tue 23", time: "14:55", sym: "AAPL", atCard: 4.4, atConfirm: 3.6, outcome: "TAKEN", captured: 2.7 },
  { session: "Wed 24", time: "10:05", sym: "AMD", atCard: 7.2, atConfirm: 6.9, outcome: "TAKEN", captured: 6.2 },
  { session: "Wed 24", time: "13:44", sym: "COIN", atCard: 9.8, atConfirm: null, outcome: "SKIPPED", captured: null },
  { session: "Wed 24", time: "15:48", sym: "NVDA", atCard: 5.5, atConfirm: 4.8, outcome: "TAKEN", captured: -1.9 },
  { session: "Thu 25", time: "09:52", sym: "NVDA", atCard: 8.1, atConfirm: 7.4, outcome: "TAKEN", captured: 6.8 },
  { session: "Thu 25", time: "11:37", sym: "HOOD", atCard: 12.4, atConfirm: null, outcome: "EXPIRED", captured: null },
  { session: "Thu 25", time: "15:21", sym: "META", atCard: 4.6, atConfirm: 1.4, outcome: "RE-QUOTE FAIL", captured: null },
  { session: "Fri 26", time: "10:14", sym: "TSLA", atCard: 6.8, atConfirm: 5.9, outcome: "TAKEN", captured: 5.1 },
  { session: "Fri 26", time: "14:02", sym: "NVDA", atCard: 9.4, atConfirm: null, outcome: "ACTIVE", captured: null },
];

export const SESSIONS = ["Mon 22", "Tue 23", "Wed 24", "Thu 25", "Fri 26"] as const;

/** paper P&L = captured_bps × NOTIONAL / 1e4 */
export const pnl = (bps: number) => (bps * RULES.notional) / 1e4;

const taken = LEDGER.filter((e) => e.outcome === "TAKEN");
const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

export const DERIVED = {
  taken: taken.length,
  skipped: LEDGER.filter((e) => e.outcome === "SKIPPED").length,
  expired: LEDGER.filter((e) => e.outcome === "EXPIRED").length,
  failed: LEDGER.filter((e) => e.outcome === "RE-QUOTE FAIL").length,
  closed: LEDGER.filter((e) => e.outcome !== "ACTIVE").length,
  total: LEDGER.length,
  pnl: pnl(taken.reduce((a, e) => a + (e.captured ?? 0), 0)),
  pnlToday: pnl(taken.filter((e) => e.session === "Fri 26").reduce((a, e) => a + (e.captured ?? 0), 0)),
  positive: taken.filter((e) => (e.captured ?? 0) > 0).length,
  avgCard: avg(taken.map((e) => e.atCard)),
  avgConfirm: avg(taken.map((e) => e.atConfirm ?? 0)),
};

export function sessionPnl(session: string) {
  return pnl(
    taken.filter((e) => e.session === session).reduce((a, e) => a + (e.captured ?? 0), 0),
  );
}

/** Drawer id rule (design.md §5B.12 E): index in the list with the active card first. */
export function cardId(entry: LedgerEntry, indexActiveFirst: number) {
  return entry.outcome === "ACTIVE"
    ? ACTIVE.id
    : "card_" + (0x3b10 + indexActiveFirst * 37).toString(16);
}

/* ── Illustrative-only values ──────────────────────────── */

export const WHY_NO_CARD = [
  { state: "DUST" as const, pct: 71 },
  { state: "THIN" as const, pct: 12 },
  { state: "STALE" as const, pct: 9 },
  { state: "CLOSED" as const, pct: 8 },
];

export const EVALUATIONS = 14_382;
