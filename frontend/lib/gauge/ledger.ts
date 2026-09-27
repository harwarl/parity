import type { HistoryRow, Outcome as ApiOutcome } from "@/lib/api/types";
import { LEDGER, RULES, SESSIONS, cardId, pnl, type LedgerEntry, type Outcome } from "./model";

export type LedgerRow = LedgerEntry & {
  id: string;
  /** Real timestamps (API rows); sample rows use design.md's clock. */
  openedAt?: number;
  requotedAt?: number;
  expiresAt?: number;
  fillPrice?: number | null;
  mode?: "Paper" | "Live" | "Watcher" | null;
};

/** Ledger list with the active card pinned first; ids follow design.md §5B.12 E. */
export const LEDGER_ROWS: LedgerRow[] = [LEDGER[LEDGER.length - 1], ...LEDGER.slice(0, -1)].map((e, i) => ({
  ...e,
  id: cardId(e, i),
}));

export type TimelineItem = { text: string; time: string; color: string };

const LIME = "#B2D450";

const clock = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});
const ET = (ms: number) => clock.format(ms).replace(/^24/, "00");

/** Drawer timeline rules (design.md §5B.12 E); real times when the row has them. */
export function timeline(e: LedgerRow, floor: number = RULES.floor): TimelineItem[] {
  const at = (sampleSuffix: string, ms?: number) => (ms ? ET(ms) : `${e.time}:${sampleSuffix}`);
  const first = { text: `Card emitted · net ${e.atCard.toFixed(1)}`, time: at("18", e.openedAt), color: LIME };
  switch (e.outcome) {
    case "ACTIVE":
      return [first, { text: "Awaiting your tap", time: "now", color: "#F9F7F4" }];
    case "TAKEN": {
      const c = e.captured;
      return [
        first,
        { text: `Do it · re-quote ${e.atConfirm?.toFixed(1)} clears`, time: at("41", e.requotedAt), color: LIME },
        {
          text: e.fillPrice != null ? `Paper fill at confirm mid · $${e.fillPrice.toFixed(2)}` : "Filled at confirm",
          time: at("41", e.requotedAt),
          color: LIME,
        },
        c == null
          ? { text: "Captured at session close · not marked yet", time: "16:00", color: "#80848A" }
          : {
              text: `Captured ${c >= 0 ? "+" : "−"}${Math.abs(c).toFixed(1)} bps at session close`,
              time: "16:00",
              color: c >= 0 ? LIME : "#FF6B5E",
            },
      ];
    }
    case "RE-QUOTE FAIL":
      return [
        first,
        {
          text:
            e.atConfirm != null
              ? `Do it · re-quote ${e.atConfirm.toFixed(1)}${e.atConfirm < floor ? ` < floor ${floor.toFixed(1)}` : " failed a gate"}`
              : "Do it · no fresh quote to re-check",
          time: at("52", e.requotedAt),
          color: "#FF6B5E",
        },
        { text: "No order · card closed", time: at("52", e.requotedAt), color: "#80848A" },
      ];
    case "SKIPPED":
      return [first, { text: "You skipped", time: at("30"), color: "#C9CBCF" }];
    case "EXPIRED":
      return [first, { text: "Expired after 75 s · no tap", time: at("33", e.expiresAt), color: "#5A5D62" }];
  }
}

const OUTCOME: Record<ApiOutcome, Outcome> = {
  active: "ACTIVE",
  taken: "TAKEN",
  skipped: "SKIPPED",
  expired: "EXPIRED",
  stale_on_confirm: "EXPIRED",
  requote_fail: "RE-QUOTE FAIL",
};

const sessionFmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", day: "numeric" });
/** "Fri 26" in New York, matching the sample sessions. */
export const sessionOf = (ms: number) => {
  const p = Object.fromEntries(sessionFmt.formatToParts(ms).map((x) => [x.type, x.value]));
  return `${p.weekday} ${p.day}`;
};

/** gauge-api's /history (active first, then newest) as ledger rows. */
export function ledgerFromHistory(rows: HistoryRow[]): LedgerRow[] {
  return rows.map((r) => ({
    id: r.card_id,
    session: sessionOf(r.opened_at_ms),
    time: ET(r.opened_at_ms).slice(0, 5),
    sym: r.symbol,
    atCard: r.net_at_card_bps,
    atConfirm: r.net_at_confirm_bps,
    outcome: OUTCOME[r.outcome],
    // Needs a close mark the backend doesn't make yet.
    captured: null,
    openedAt: r.opened_at_ms,
    requotedAt: r.requote?.at_ms,
    expiresAt: r.expires_at_ms,
    fillPrice: r.fill_price,
    mode: r.mode,
  }));
}

/** Sessions present in the rows, oldest first (sample: design.md's five). */
export function sessionsOf(rows: LedgerRow[]): string[] {
  if (!rows.some((r) => r.openedAt)) return [...SESSIONS];
  const seen = new Map<string, number>();
  for (const r of rows) seen.set(r.session, Math.min(seen.get(r.session) ?? Infinity, r.openedAt ?? 0));
  return [...seen.entries()].sort((a, b) => a[1] - b[1]).map(([s]) => s).slice(-5);
}

export function ledgerCsv(rows: LedgerRow[] = LEDGER_ROWS): string {
  const head = ["card_id", "session", "time_et", "symbol", "net_at_card_bps", "net_at_confirm_bps", "outcome", "captured_bps", "paper_pnl_usd"];
  const lines = rows.map((r) =>
    [
      r.id,
      r.session,
      r.time,
      r.sym,
      r.atCard.toFixed(1),
      r.atConfirm?.toFixed(1) ?? "",
      r.outcome,
      r.captured?.toFixed(1) ?? "",
      r.captured == null ? "" : pnl(r.captured).toFixed(2),
    ].join(","),
  );
  return [head.join(","), ...lines].join("\n") + "\n";
}

