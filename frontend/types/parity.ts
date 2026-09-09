/**
 * PARITY domain types. Vocabulary is fixed by the PRD and CLAUDE.md — do not
 * invent alternates. A "card" is never an "order", "trade", or "position".
 */

/** Exchange-calendar session, not last-print. */
export type Session = "rth" | "ext" | "overnight" | "weekend";

/** A row is either live in a session, or it has no tradable price. */
export type RowState = Session | "halt" | "stale";

export type CardState =
  | "open"
  | "confirmed"
  | "rejected"
  | "expired"
  | "stale_on_confirm";

/** Short stamped reasons a card is not emitted / not fillable. */
export type SkipCode = "STALE" | "CLOSED" | "THIN" | "DUST";

/** Raw inputs for one name. Chain feed is already multiplier-adjusted at source. */
export interface NameFeed {
  symbol: string;
  name: string;
  /** Cash mid from the exchange (RHJ). The multiplier never touches this. */
  shareMid: number;
  /** Chainlink USD price for the token. */
  chainlinkUsd: number;
  /** uiMultiplier, raw 1e18-scaled integer as a number for display math. */
  uiMultiplier: number;
  state: RowState;
}

/** Derived, display-ready tape row. All money/bps are net where noted. */
export interface TapeRow {
  symbol: string;
  name: string;
  shareMid: number;
  tokenPerShare: number;
  basisBps: number;
  netBps: number;
  state: RowState;
}

export interface HaircutBreakdown {
  gap: number;
  fee: number;
  slip: number;
  buffer: number;
  net: number;
}

export interface CardModel {
  symbol: string;
  cashPrice: number;
  tokenPrice: number;
  cashLabel: string;
  tokenLabel: string;
  haircut: HaircutBreakdown;
  /** seconds */
  ttl: number;
}
