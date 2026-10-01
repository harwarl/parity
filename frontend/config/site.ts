import type { FaqItem, NavLink, TickerItem, WontDoItem } from "@/types/content";

/** Open placeholders (design.md §11). Swap before launch. */
export const urls = {
  /** In-app route; swap for [APP_URL] if the app ships on its own domain. */
  app: "/dashboard",
  docs: "/docs",
} as const;

export const site = {
  name: "GAUGE",
  title: "GAUGE · Two prices. One gap.",
  description:
    "Some stocks now trade in two places, at two prices. GAUGE watches both and pings you only when the difference is still worth it after every cost. You decide. Nothing happens unless you tap.",
  disclaimer:
    "GAUGE is not affiliated with Robinhood. Signals, not advice. Paper by default. The token is not the share.",
} as const;

export const navLinks: NavLink[] = [
  { label: "Overview", href: "#overview" },
  { label: "How it works", href: "#how" },
  { label: "The card", href: "#card" },
  { label: "FAQ", href: "#faq" },
  // { label: "Docs", href: urls.docs },
];

export const footerProduct: NavLink[] = [
  { label: "Overview", href: "#overview" },
  { label: "How it works", href: "#how" },
  { label: "The prompt", href: "#card" },
  { label: "Practice or real", href: "#paper" },
];

export const footerResources: NavLink[] = [
  { label: "Docs", href: urls.docs },
  { label: "FAQ", href: "#faq" },
  { label: "Open GAUGE", href: urls.app },
];

/**
 * Sample data (design.md §5.2). Every screen uses these numbers.
 * (182.71 − 182.40) / 182.40 = 16.996 bps → 17.0. Costs 3.5 + 2.1 + 2.0 = 7.6. Net 9.4.
 */
export const sample = {
  symbol: "NVDA",
  cashMid: "182.40",
  tokenPerShare: "182.71",
  gapBps: 17.0,
  feesBps: 3.5,
  slipBps: 2.1,
  bufferBps: 2.0,
  costBps: 7.6,
  netBps: 9.4,
} as const;

/** Stand-in watched list (design.md §5.3). Illustrative. */
export const ticker: TickerItem[] = [
  { symbol: "AAPL", name: "Apple", gapBps: 4.1 },
  { symbol: "NVDA", name: "Nvidia", gapBps: 17.0 },
  { symbol: "TSLA", name: "Tesla", gapBps: -6.3 },
  { symbol: "MSFT", name: "Microsoft", gapBps: 2.2 },
  { symbol: "AMZN", name: "Amazon", gapBps: -1.8 },
  { symbol: "META", name: "Meta", gapBps: 8.7 },
  { symbol: "GOOGL", name: "Alphabet", gapBps: 3.0 },
  { symbol: "COIN", name: "Coinbase", gapBps: -11.4 },
];

export const wontDo: WontDoItem[] = [
  {
    title: "Hold your money",
    body: "Your money stays in your own Robinhood account. GAUGE never takes custody.",
  },
  {
    title: "Go past 3 a day",
    body: "The daily limit is a rule, not a suggestion. A fourth prompt never exists.",
  },
  {
    title: "Trade both sides",
    body: "Live is one order for the stock. GAUGE never also trades the token.",
  },
  {
    title: "Trade without your tap",
    body: "No tap, no order. GAUGE suggests. You decide.",
  },
];

/** design.md §5.11 (rev 2): eight plain-language questions. */
export const faq: FaqItem[] = [
  {
    question: "What is GAUGE, in one sentence?",
    answer:
      "GAUGE watches a stock on Robinhood and its token on Robinhood Chain, and tells you when their prices drift far enough apart to be worth acting on after costs.",
  },
  {
    question: "Does GAUGE trade on its own?",
    answer:
      "No. GAUGE only suggests. An order is placed only after you tap Do it, and only if the prices still hold up when it checks again.",
  },
  {
    question: "Why am I not getting any prompts?",
    answer:
      "Usually because nothing is worth it after costs. GAUGE shows you one word saying why: STALE (price too old), CLOSED (market closed), THIN (not enough shares on offer) or DUST (too small after costs).",
  },
  {
    question: "Does GAUGE hold my money?",
    answer:
      "No. Your money stays in your own Robinhood account. GAUGE never takes custody and never trades the token.",
  },
  {
    question: "What is a basis point (bps)?",
    answer:
      "One hundredth of one percent. A 17 bps difference is 0.17%. GAUGE uses bps because the differences it looks for are small.",
  },
  {
    question: "Is the token the same as the stock?",
    answer:
      "No. The token tracks the stock, but it is not the share. GAUGE uses the token only as a price to compare against.",
  },
  {
    question: "Why only 3 prompts a day?",
    answer:
      "Fewer, better prompts. The limit is built in so GAUGE never turns into a feed you tap out of habit.",
  },
  {
    question: "Paper or live: which should I start with?",
    answer:
      "Paper. It is practice with pretend money and is on by default. Switch to live when your record says so, on a Robinhood Agentic Account.",
  },
];
