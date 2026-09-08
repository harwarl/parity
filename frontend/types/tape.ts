export type SessionState = "rth" | "ext" | "overnight" | "weekend";

export type SkipCode = "STALE" | "CLOSED" | "THIN" | "DUST";

export interface TapeRow {
  symbol: string;
  name: string;
  cashPrice: number;
  tokenPrice: number;
  bps: number;
  session: SessionState;
  synced: boolean;
}

export interface SkipReason {
  code: SkipCode;
  label: string;
  description: string;
}

export interface HistoryStep {
  year: string;
  label: string;
  title: string;
  description: string;
  active?: boolean;
}
