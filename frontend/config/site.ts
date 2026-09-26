import type { FaqItem, NavLink, TickerItem, WontDoItem } from "@/types/content";

/** Open placeholders (design.md §11). Swap before launch. */
export const urls = {
  /** In-app route; swap for [APP_URL] if the app ships on its own domain. */
  app: "/dashboard",
  docs: "/docs",
  contactEmail: "[CONTACT_EMAIL]",
} as const;

export const site = {
  name: "GAUGE",
  title: "GAUGE · Two prices. One gap.",
  description:
    "GAUGE watches the Robinhood stock and the Robinhood Chain stock token for the same name, and emits a 75-second card only when the net gap clears. You tap. The model does not place.",
  disclaimer:
    "GAUGE is not affiliated with Robinhood. Signals, not advice. Paper by default. The token is not the share.",
} as const;

export const navLinks: NavLink[] = [
  { label: "How it works", href: "#how" },
  { label: "The card", href: "#card" },
  { label: "FAQ", href: "#faq" },
  // { label: "Docs", href: urls.docs },
];

export const footerProduct: NavLink[] = [
  { label: "How it works", href: "#how" },
  { label: "The card", href: "#card" },
  { label: "Reason codes", href: "#reasons" },
  { label: "Paper vs live", href: "#paper" },
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
    title: "Hold your funds",
    body: "Your money stays in your account. GAUGE never takes custody.",
  },
  {
    title: "Go past 3 a day",
    body: "The cap is a gate, not a suggestion. The fourth card never exists.",
  },
  {
    title: "Hedge both legs",
    body: "Live is one cash-equity order. No paired trade on chain.",
  },
  {
    title: "Place without Do it",
    body: "No tap, no order. The model proposes. You decide.",
  },
];

export const faq: FaqItem[] = [
  {
    question: "Does GAUGE place trades on its own?",
    answer:
      "No. GAUGE proposes a card. Nothing is placed until you tap Do it, and confirm re-quotes both prices first. The model does not place.",
  },
  {
    question: "What happens when there is no gap?",
    answer:
      "Nothing. If the net gap does not clear fees, slippage and the buffer, there is no card. You get a reason code instead.",
  },
  {
    question: "Does GAUGE hold my funds?",
    answer: "No. Your money stays in your account. GAUGE never takes custody.",
  },
  {
    question: "Is the token the same as the share?",
    answer:
      "No. The token is not the share. GAUGE reads the chain token only as a price, and the multiplier only touches the chain feed.",
  },
  {
    question: "Why only 3 cards a day?",
    answer:
      "Fewer, better prompts beat a feed that trains you to tap. After the third card the cap locks until tomorrow.",
  },
  {
    question: "What is the difference between paper and live?",
    answer:
      "Paper fills at the confirm mid with no broker and no money moving. Live places one cash-equity order through the Robinhood Trading MCP on your Agentic Account, only after you tap.",
  },
];
