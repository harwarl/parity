/**
 * Backend → view models. The dashboard components were built on the
 * design.md sample shapes (`WatchRow`, the NVDA card); these adapters feed
 * them from gauge-api instead, so the same components render both.
 */
import type { ApiCard, ApiUser, BasisTick, GateRules } from "@/lib/api/types";
import { ACTIVE, RULES, WATCHLIST, rowBySym, type GateState, type WatchRow } from "./model";

const NAMES: Record<string, string> = Object.fromEntries(WATCHLIST.map((w) => [w.sym, w.name]));
export const nameOf = (sym: string) => NAMES[sym] ?? sym;

export const DEFAULT_RULES: GateRules = {
  floor_bps: RULES.floor,
  buffer_bps: RULES.buffer,
  max_quote_age_ms: RULES.maxAge * 1000,
  min_depth_usd: RULES.minDepth * 1000,
  paper_notional_usd: RULES.notional,
};

/** A new viewer's account: paper, the sample watchlist, default gates. */
export function defaultUser(): ApiUser {
  return {
    user_id: "",
    mode: "Paper",
    nav_usd: 1_000,
    max_clip_usd: 100,
    name_pct: 0.5,
    daily_card_cap: RULES.cap,
    universe: WATCHLIST.map((w) => w.sym),
    mutes: [],
    kill_switch: false,
    rules: DEFAULT_RULES,
    notify: { push_on_card: true, sound_on_card: false, daily_summary_email: true, stale_feed_alert: true },
  };
}

/**
 * One tick under one user's rules: the same gates, in the same order, as
 * backend `carder::gates::check` (feed → session → depth → net), so the
 * board shows the verdict that user's cards actually follow.
 */
export function rowFromTick(tick: BasisTick, rules: GateRules, nowMs: number): WatchRow {
  const ageMs = tick.quote_age_ms + Math.max(0, nowMs - tick.ts_ms);
  const costs = tick.fee_bps + tick.slip_bps + rules.buffer_bps;
  const absGap = Math.abs(tick.basis_bps);
  const net = absGap - costs;
  const d = tick.decision;
  const skip = typeof d === "object" && "Skip" in d ? d.Skip : null;
  const state: GateState =
    typeof d === "object" && "Halt" in d
      ? "STALE"
      : skip === "Stale" || ageMs > rules.max_quote_age_ms
        ? "STALE"
        : tick.session !== "Rth"
          ? "CLOSED"
          : skip === "Thin" || tick.depth_usd < rules.min_depth_usd
            ? "THIN"
            : net <= 0 || net < rules.floor_bps
              ? "DUST"
              : "CARD";
  return {
    sym: tick.symbol,
    name: nameOf(tick.symbol),
    cash: tick.share_mid,
    token: tick.token_per_share,
    slip: tick.slip_bps,
    depth: Math.round(tick.depth_usd / 1000),
    age: ageMs / 1000,
    gap: tick.basis_bps,
    absGap,
    costs,
    net,
    state,
  };
}

/**
 * Short, stable display id for a card ("card_7f3a91" style). Backend ids
 * are `SYM-user-ts` and long; the full id stays in API calls and tooltips.
 * Ids already in the short form (the sample's) pass through.
 */
export function shortCardId(id: string): string {
  if (/^card_[0-9a-f]+$/.test(id)) return id;
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 0x01000193);
  return `card_${(h >>> 0).toString(16).padStart(8, "0").slice(0, 6)}`;
}

/** Everything the card screens draw, from either source. */
export type CardVM = {
  id: string;
  sym: string;
  name: string;
  /** Net under the user's rules when the card opened. */
  net: number;
  gap: number;
  fees: number;
  slip: number;
  buffer: number;
  cash: number;
  token: number;
  depthK: number;
  ageS: number;
  openedAt: number;
  expiresAt: number;
  /** The confirm re-quote, once there is one. */
  requote: { cash: number; token: number; net: number; at: number } | null;
};

export function cardFromApi(card: ApiCard): CardVM {
  const q = card.quote;
  const r = card.requote;
  return {
    id: card.card_id,
    sym: card.symbol,
    name: nameOf(card.symbol),
    net: card.net_bps,
    gap: Math.abs(card.basis_bps),
    fees: q?.fee_bps ?? RULES.fees,
    slip: q?.slip_bps ?? 0,
    buffer: q?.buffer_bps ?? RULES.buffer,
    cash: q?.share_mid ?? 0,
    token: q?.token_per_share ?? 0,
    depthK: Math.round((q?.depth_usd ?? 0) / 1000),
    ageS: (q?.quote_age_ms ?? 0) / 1000,
    openedAt: card.opened_at_ms,
    expiresAt: card.opened_at_ms + card.ttl_ms,
    requote: r ? { cash: r.share_mid, token: r.token_per_share, net: r.net_bps, at: r.at_ms } : null,
  };
}

/** design.md's "now": Fri 26 Sep 2026, 14:02:41 ET. Fixed, so server and client render the same sample. */
export const SAMPLE_NOW = Date.UTC(2026, 8, 26, 18, 2, 41);

/** design.md's NVDA card, for when the backend is offline (emitted 14:02:18.412 ET). */
export function sampleCard(): CardVM {
  const row = rowBySym(ACTIVE.sym);
  const openedAt = SAMPLE_NOW - 23_000 + 412;
  return {
    id: ACTIVE.id,
    sym: row.sym,
    name: row.name,
    net: row.net,
    gap: row.absGap,
    fees: RULES.fees,
    slip: row.slip,
    buffer: RULES.buffer,
    cash: row.cash,
    token: row.token,
    depthK: row.depth,
    ageS: row.age,
    openedAt,
    expiresAt: openedAt + RULES.cardLife * 1000,
    requote: null,
  };
}

const et = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** "14:02:41" in New York time. */
export const etClock = (ms: number) => et.format(ms).replace(/^24/, "00");

/** Time left in today's regular session, or null outside it. */
export function rthLeft(ms: number): string | null {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "short",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    })
      .formatToParts(ms)
      .map((p) => [p.type, p.value]),
  );
  if (parts.weekday === "Sat" || parts.weekday === "Sun") return null;
  const mins = (Number(parts.hour) % 24) * 60 + Number(parts.minute);
  if (mins < 9 * 60 + 30 || mins >= 16 * 60) return null;
  const left = 16 * 60 - mins;
  return `${Math.floor(left / 60)}h ${String(left % 60).padStart(2, "0")}m`;
}
