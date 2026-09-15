import type { TapeRow } from "@/types/parity";

/**
 * Wire types for gauge-api's JSON responses. These mirror shared-types'
 * Rust structs verbatim, including their serde default (externally tagged,
 * PascalCase variant names) shape — no `rename_all` was added on the
 * backend enums, so `"Rth"` not `"rth"`, `{"Skip":"Stale"}` not a flat
 * string. The mapping functions below translate that into this app's
 * existing lowercase RowState union rather than changing either side.
 */

export type BackendSession = "Rth" | "Ext" | "Overnight" | "Weekend";
export type CheapSide = "Equity" | "Token" | "Neither";
export type SkipCode = "Stale" | "Closed" | "Thin" | "Dust";
export type HaltReason = "MultiplierJump" | "OraclePaused" | "FeedStale" | "ZeroDepth";
export type Decision = "CardEligible" | { Skip: SkipCode } | { Halt: HaltReason };

export interface BasisTick {
  symbol: string;
  share_mid: number;
  token_per_share: number;
  basis_bps: number;
  net_bps: number;
  cheap_side: CheapSide;
  session: BackendSession;
  clip_max: number;
  decision: Decision;
  ts_ms: number;
}

export type BackendCardState = "Open" | "Confirmed" | "Rejected" | "Expired" | "StaleOnConfirm";

export interface Card {
  card_id: string;
  user_id: string;
  symbol: string;
  clip_usd: number;
  cheap_side: CheapSide;
  basis_bps: number;
  net_bps: number;
  state: BackendCardState;
  opened_at_ms: number;
  ttl_ms: number;
}

export interface CardEvent {
  card_id: string;
  user_id: string;
  kind: "opened" | "confirmed" | "rejected" | "expired" | "stale_on_confirm";
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

export function fetchTape(): Promise<BasisTick[]> {
  return getJson("/api/gauge/tape");
}

export function fetchCards(): Promise<Card[]> {
  return getJson("/api/gauge/cards");
}

export async function confirmCard(cardId: string): Promise<unknown> {
  const res = await fetch(`/api/gauge/cards/${encodeURIComponent(cardId)}/confirm`, {
    method: "POST",
  });
  return res.json().catch(() => null);
}

export async function skipCard(cardId: string): Promise<void> {
  await fetch(`/api/gauge/cards/${encodeURIComponent(cardId)}/skip`, { method: "POST" });
}

/** halt / stale are their own frozen row states; anything else falls back
 * to the session it's actually in — matches CLAUDE.md's "HALT / STALE
 * names stay frozen," everything else (THIN/CLOSED/DUST) is a reject
 * reason shown alongside the row, not a distinct tape state. */
export function toRowState(tick: BasisTick): TapeRow["state"] {
  if (typeof tick.decision === "object" && "Halt" in tick.decision) return "halt";
  if (
    typeof tick.decision === "object" &&
    "Skip" in tick.decision &&
    tick.decision.Skip === "Stale"
  ) {
    return "stale";
  }
  return tick.session.toLowerCase() as TapeRow["state"];
}

export function tickToTapeRow(tick: BasisTick, name: string): TapeRow {
  return {
    symbol: tick.symbol,
    name,
    shareMid: tick.share_mid,
    tokenPerShare: tick.token_per_share,
    basisBps: tick.basis_bps,
    netBps: tick.net_bps,
    state: toRowState(tick),
  };
}
