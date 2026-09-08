import type { HistoryStep, SkipReason, TapeRow } from "@/types/tape";

export const tapeRows: TapeRow[] = [
  { symbol: "HOOD", name: "Robinhood", cashPrice: 28.41, tokenPrice: 28.37, bps: -14, session: "rth", synced: true },
  { symbol: "AAPL", name: "Apple", cashPrice: 231.12, tokenPrice: 231.4, bps: 12, session: "rth", synced: true },
  { symbol: "TSLA", name: "Tesla", cashPrice: 244.88, tokenPrice: 244.31, bps: -23, session: "rth", synced: true },
  { symbol: "NVDA", name: "Nvidia", cashPrice: 178.24, tokenPrice: 178.19, bps: -3, session: "rth", synced: true },
  { symbol: "MSFT", name: "Microsoft", cashPrice: 512.6, tokenPrice: 513.42, bps: 16, session: "ext", synced: true },
  { symbol: "AMZN", name: "Amazon", cashPrice: 224.07, tokenPrice: 223.9, bps: -8, session: "rth", synced: true },
  { symbol: "GOOGL", name: "Alphabet", cashPrice: 198.33, tokenPrice: 198.51, bps: 9, session: "rth", synced: true },
  { symbol: "META", name: "Meta", cashPrice: 612.4, tokenPrice: 611.85, bps: -9, session: "overnight", synced: false },
  { symbol: "SPY", name: "S&P 500 ETF", cashPrice: 671.05, tokenPrice: 671.02, bps: -0.4, session: "rth", synced: true },
  { symbol: "QQQ", name: "Nasdaq 100 ETF", cashPrice: 601.88, tokenPrice: 601.99, bps: 2, session: "rth", synced: true },
];

export const skipReasons: SkipReason[] = [
  {
    code: "STALE",
    label: "Stale quote",
    description: "One leg hasn't ticked recently enough to trust the gap.",
  },
  {
    code: "CLOSED",
    label: "Cash closed",
    description: "The equity session is shut. A token-only move isn't a tradeable gap.",
  },
  {
    code: "THIN",
    label: "Thin depth",
    description: "Not enough book behind either leg to fill the clip without slipping through the edge.",
  },
  {
    code: "DUST",
    label: "Dust size",
    description: "The gap survives fees but the resulting clip rounds to nothing worth a tap.",
  },
];

export const historySteps: HistoryStep[] = [
  {
    year: "1927",
    label: "Dual listings",
    title: "One share, two tapes",
    description:
      "ADRs and cross-listed shares have traded the same company on two venues for a century. The prices drift. Someone always closes it.",
  },
  {
    year: "1993",
    label: "ETF creation/redemption",
    title: "Arb built into the wrapper",
    description:
      "Authorized participants keep an ETF's price pinned to its basket by trading the gap. It's not a strategy, it's the maintenance crew.",
  },
  {
    year: "2000s",
    label: "Overnight desks",
    title: "Prop desks price the gap while you sleep",
    description:
      "Futures and ADRs move after the cash close. Overnight desks have always been paid to hold that basis, not to pretend it's free.",
  },
  {
    year: "Now",
    label: "PARITY",
    title: "Same trade, retail card",
    description:
      "Robinhood Chain prints a second, 24/7 price for stock you already hold in cash. PARITY watches the gap and hands you a card, not a strategy.",
    active: true,
  },
];
