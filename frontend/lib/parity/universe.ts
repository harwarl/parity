import type { NameFeed, TapeRow } from "@/types/parity";
import { basisBps, tokenPerShare } from "./math";

/**
 * Launch universe — 10 names. HOOD / NVDA / AAPL are PRD fixtures; the rest are
 * liquid, well-known names. Numbers are illustrative SAMPLE data, never a live
 * quote. One name is HALT (multiplier jump), one is STALE (join budget blown).
 */

interface Seed {
  symbol: string;
  name: string;
  shareMid: number;
  /** target token-per-share basis vs the cash mid, in bps */
  basis: number;
  /** uiMultiplier as a 1e18-scaled value; 1e18 === 1.000× */
  uiMultiplier: number;
  state: NameFeed["state"];
}

const SEEDS: Seed[] = [
  { symbol: "HOOD", name: "Robinhood Markets", shareMid: 183.4, basis: 23, uiMultiplier: 1e18, state: "rth" },
  { symbol: "GOOGL", name: "Alphabet", shareMid: 205.4, basis: 31, uiMultiplier: 1e18, state: "rth" },
  { symbol: "AAPL", name: "Apple", shareMid: 246.1, basis: 11, uiMultiplier: 1e18, state: "rth" },
  { symbol: "AMZN", name: "Amazon", shareMid: 231.85, basis: 14, uiMultiplier: 1e18, state: "rth" },
  { symbol: "MSFT", name: "Microsoft", shareMid: 518.6, basis: 6, uiMultiplier: 1e18, state: "rth" },
  { symbol: "META", name: "Meta Platforms", shareMid: 748.2, basis: 9, uiMultiplier: 1e18, state: "rth" },
  { symbol: "AMD", name: "Advanced Micro Devices", shareMid: 168.9, basis: 7, uiMultiplier: 1.008e18, state: "rth" },
  { symbol: "TSLA", name: "Tesla", shareMid: 402.75, basis: -18, uiMultiplier: 1e18, state: "rth" },
  { symbol: "NVDA", name: "NVIDIA", shareMid: 178.2, basis: 0, uiMultiplier: 10e18, state: "halt" },
  { symbol: "COIN", name: "Coinbase Global", shareMid: 312.55, basis: 44, uiMultiplier: 1e18, state: "stale" },
];

/** Haircut applied to every tape row for its displayed net: fee 3 + slip 6 + buffer 5. */
export const ROW_HAIRCUT = 14;

function build(seed: Seed): TapeRow {
  // Construct the chain feed so that, after the multiplier is divided back out,
  // token-per-share sits `basis` bps from the cash mid.
  const targetTokenPerShare = seed.shareMid * (1 + seed.basis / 10_000);
  const chainlinkUsd = targetTokenPerShare * (seed.uiMultiplier / 1e18);
  const tps = tokenPerShare(chainlinkUsd, seed.uiMultiplier);
  const basis = basisBps(tps, seed.shareMid);
  return {
    symbol: seed.symbol,
    name: seed.name,
    shareMid: seed.shareMid,
    tokenPerShare: tps,
    basisBps: basis,
    netBps: Math.abs(basis) - ROW_HAIRCUT,
    state: seed.state,
  };
}

export const TAPE: TapeRow[] = SEEDS.map(build);

/** The name featured in the looping hero card — widest live, tradable net. */
export const FEATURED: TapeRow = TAPE.find((r) => r.symbol === "GOOGL")!;

export const FEEDS: NameFeed[] = SEEDS.map((s) => ({
  symbol: s.symbol,
  name: s.name,
  shareMid: s.shareMid,
  chainlinkUsd: s.shareMid * (1 + s.basis / 10_000) * (s.uiMultiplier / 1e18),
  uiMultiplier: s.uiMultiplier,
  state: s.state,
}));
