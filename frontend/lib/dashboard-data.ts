import type {
  AccountInfo,
  CardIntent,
  LogEntry,
  PolicySettings,
} from "@/types/tape";

// Illustrative dashboard data for the marketing hero — not live data.

export const cardIntents: CardIntent[] = [
  {
    cardId: "hood-9f21",
    ticker: "HOOD",
    bps: -130,
    clip: 40,
    tap: 15,
    status: "open",
    capUsed: 1,
    capLimit: 3,
    age: "12s ago",
  },
  {
    cardId: "nvda-2c40",
    ticker: "NVDA",
    bps: 215,
    clip: 60,
    tap: 22,
    status: "confirmed",
    capUsed: 2,
    capLimit: 3,
    age: "4m ago",
  },
  {
    cardId: "coin-771a",
    ticker: "COIN",
    bps: -95,
    clip: 25,
    tap: 9,
    status: "expired",
    capUsed: 1,
    capLimit: 3,
    age: "18m ago",
  },
  {
    cardId: "tsla-5b0e",
    ticker: "TSLA",
    bps: 140,
    clip: 50,
    tap: 18,
    status: "stale_on_confirm",
    capUsed: 3,
    capLimit: 3,
    age: "41m ago",
  },
  {
    cardId: "mstr-8e12",
    ticker: "MSTR",
    bps: -110,
    clip: 40,
    tap: 14,
    status: "skipped",
    capUsed: 0,
    capLimit: 3,
    age: "1h ago",
  },
];

export const logEntries: LogEntry[] = [
  {
    ticker: "NVDA",
    kind: "paper",
    mid: 191.65,
    status: "filled",
    timestamp: "10:41:02",
  },
  {
    ticker: "HOOD",
    kind: "live",
    mid: 28.03,
    status: "filled",
    brokerOrderId: "RH-88213-QX",
    timestamp: "10:22:47",
  },
  {
    ticker: "COIN",
    kind: "paper",
    mid: 311.93,
    status: "skipped",
    skipCode: "TTL_EXPIRED",
    timestamp: "09:58:15",
  },
  {
    ticker: "TSLA",
    kind: "paper",
    mid: 441.4,
    status: "skipped",
    skipCode: "PRICE_MOVED",
    timestamp: "09:31:40",
  },
  {
    ticker: "MSTR",
    kind: "live",
    mid: 402.5,
    status: "skipped",
    skipCode: "USER_SKIPPED",
    brokerOrderId: "RH-88190-LK",
    timestamp: "09:04:12",
  },
  {
    ticker: "AAPL",
    kind: "paper",
    mid: 271.02,
    status: "skipped",
    skipCode: "CAP_HIT",
    timestamp: "08:47:29",
  },
];

export const universeTickers = [
  "HOOD",
  "NVDA",
  "COIN",
  "TSLA",
  "GOOGL",
  "MSTR",
  "AAPL",
  "AMZN",
  "META",
  "MSFT",
];

export const defaultPolicy: PolicySettings = {
  universe: ["HOOD", "NVDA", "COIN", "TSLA", "GOOGL", "MSTR", "AAPL"],
  clipSize: 50,
  namePct: 20,
  muteUntil: "",
  quietHoursStart: "20:00",
  quietHoursEnd: "06:00",
  mode: "paper",
};

export const accountInfo: AccountInfo = {
  mcpConnected: false,
  geo: "US · NY",
  paperWeek: 2,
  paperWeeksTotal: 4,
  killSwitchOn: false,
};
