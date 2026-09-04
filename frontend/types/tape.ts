export type Session = "rth" | "ext" | "overnight" | "weekend";

export type HaltReason = "STALE" | "CLOSED" | "THIN" | "DUST";

export interface TapeRow {
  ticker: string;
  cash: number;
  token: number;
  bps: number;
  session: Session;
  halt?: HaltReason;
  /** Present only on rows with a real, tradeable card. */
  clip?: number;
  tap?: number;
  cardId?: string;
  /** Basis (bps) sampled over the last 2h, oldest first. */
  sparkline?: number[];
  /** Whether the token feed for this name is currently streaming. */
  live: boolean;
  /** Last time this row's prices were refreshed, e.g. "10:41:03". */
  updatedAt: string;
}

export type DashboardTab = "tape" | "cards" | "log" | "policy" | "account";

export type CardStatus =
  | "open"
  | "confirmed"
  | "expired"
  | "stale_on_confirm"
  | "skipped";

export interface CardIntent {
  cardId: string;
  ticker: string;
  bps: number;
  clip: number;
  tap: number;
  status: CardStatus;
  capUsed: number;
  capLimit: number;
  age: string;
}

export type LogKind = "paper" | "live";

export type SkipCode = "TTL_EXPIRED" | "PRICE_MOVED" | "USER_SKIPPED" | "CAP_HIT";

export interface LogEntry {
  ticker: string;
  kind: LogKind;
  mid: number;
  status: "filled" | "skipped";
  skipCode?: SkipCode;
  brokerOrderId?: string;
  timestamp: string;
}

export type PolicyMode = "watcher" | "paper" | "live";

export interface PolicySettings {
  universe: string[];
  clipSize: 25 | 50 | 100;
  namePct: number;
  muteUntil: string;
  quietHoursStart: string;
  quietHoursEnd: string;
  mode: PolicyMode;
}

export interface AccountInfo {
  mcpConnected: boolean;
  geo: string;
  paperWeek: number;
  paperWeeksTotal: number;
  killSwitchOn: boolean;
}
