/**
 * Wire types for gauge-api (backend/shared-types + routes). Keep in step
 * with the Rust structs: serde's default externally-tagged enums and
 * PascalCase variants are reproduced as-is.
 */

export type SkipCode = "Stale" | "Closed" | "Thin" | "Dust";
export type HaltReason = "MultiplierJump" | "OraclePaused" | "FeedStale" | "ZeroDepth";
export type Decision = "CardEligible" | { Skip: SkipCode } | { Halt: HaltReason };
export type Session = "Rth" | "Ext" | "Overnight" | "Weekend";
export type CheapSide = "Equity" | "Token" | "Neither";
export type ApiMode = "Watcher" | "Paper" | "Live";

export type BasisTick = {
  symbol: string;
  share_mid: number;
  token_per_share: number;
  basis_bps: number;
  /** Net under the market-default buffer (the public tape's number). */
  net_bps: number;
  cheap_side: CheapSide;
  session: Session;
  clip_max: number;
  decision: Decision;
  ts_ms: number;
  fee_bps: number;
  slip_bps: number;
  buffer_bps: number;
  depth_usd: number;
  quote_age_ms: number;
};

export type GateRules = {
  floor_bps: number;
  buffer_bps: number;
  max_quote_age_ms: number;
  min_depth_usd: number;
  paper_notional_usd: number;
};

export type NotifyPrefs = {
  push_on_card: boolean;
  sound_on_card: boolean;
  daily_summary_email: boolean;
  stale_feed_alert: boolean;
};

export type ApiUser = {
  user_id: string;
  mode: ApiMode;
  nav_usd: number;
  max_clip_usd: number;
  name_pct: number;
  daily_card_cap: number;
  universe: string[];
  mutes: string[];
  kill_switch: boolean;
  rules: GateRules;
  notify: NotifyPrefs;
};

export type CardState = "Open" | "Confirmed" | "Rejected" | "Expired" | "StaleOnConfirm" | "RequoteFail";

export type QuoteSnapshot = {
  share_mid: number;
  token_per_share: number;
  basis_bps: number;
  fee_bps: number;
  slip_bps: number;
  buffer_bps: number;
  net_bps: number;
  quote_age_ms: number;
  depth_usd: number;
  session: Session;
  at_ms: number;
};

export type ApiCard = {
  card_id: string;
  user_id: string;
  symbol: string;
  clip_usd: number;
  cheap_side: CheapSide;
  basis_bps: number;
  net_bps: number;
  state: CardState;
  opened_at_ms: number;
  ttl_ms: number;
  mode: ApiMode | null;
  quote: QuoteSnapshot | null;
  requote: QuoteSnapshot | null;
};

export type ConfirmResponse =
  | { status: "confirmed"; filled_at_price: number | null }
  | { status: "stale_on_confirm" }
  | { status: "requote_fail"; code: SkipCode | null; net_bps: number | null }
  | { status: "live_handoff_failed"; reason: string }
  | { status: "live_action_unavailable"; reason: string }
  | { status: "already_resolved_or_missing" };

export type Outcome = "active" | "taken" | "skipped" | "expired" | "requote_fail" | "stale_on_confirm";

export type HistoryRow = {
  card_id: string;
  symbol: string;
  mode: ApiMode | null;
  outcome: Outcome;
  opened_at_ms: number;
  expires_at_ms: number;
  net_at_card_bps: number;
  net_at_confirm_bps: number | null;
  quote: QuoteSnapshot | null;
  requote: QuoteSnapshot | null;
  fill_price: number | null;
  notional_usd: number | null;
};

export type TodayStats = {
  day: number;
  evaluations: number;
  /** card · stale · closed · thin · dust · halt */
  outcomes: Record<string, number>;
  cap: { limit: number; used: number; pending: number };
};

export type Check = { ok: boolean; latency_ms: number | null };
export type Health = {
  status: "ok" | "degraded";
  redis: Check;
  exec: Check;
  tape: { symbols: number; freshest_tick_age_ms: number | null };
};

export type CardEventKind = "opened" | "confirmed" | "rejected" | "expired" | "stale_on_confirm" | "requote_fail";
export type CardEvent = { card_id: string; user_id: string; kind: CardEventKind };

export type ReasonEvent = {
  symbol: string;
  code: SkipCode;
  gate: "feed" | "session" | "depth" | "net";
  basis_bps: number;
  net_bps: number;
  depth_usd: number;
  quote_age_ms: number;
  at_ms: number;
};
