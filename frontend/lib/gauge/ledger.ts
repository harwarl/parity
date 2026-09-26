import { LEDGER, RULES, cardId, pnl, type LedgerEntry } from "./model";

export type LedgerRow = LedgerEntry & { id: string };

/** Ledger list with the active card pinned first; ids follow design.md §5B.12 E. */
export const LEDGER_ROWS: LedgerRow[] = [LEDGER[LEDGER.length - 1], ...LEDGER.slice(0, -1)].map((e, i) => ({
  ...e,
  id: cardId(e, i),
}));

export type TimelineItem = { text: string; time: string; color: string };

const LIME = "#B2D450";

/** Drawer timeline rules (design.md §5B.12 E). */
export function timeline(e: LedgerEntry): TimelineItem[] {
  const first = { text: `Card emitted · net ${e.atCard.toFixed(1)}`, time: `${e.time}:18`, color: LIME };
  switch (e.outcome) {
    case "ACTIVE":
      return [first, { text: "Awaiting your tap", time: "now", color: "#F9F7F4" }];
    case "TAKEN": {
      const c = e.captured ?? 0;
      return [
        first,
        { text: `Do it · re-quote ${e.atConfirm?.toFixed(1)} clears`, time: `${e.time}:41`, color: LIME },
        { text: "Paper fill at confirm mid", time: `${e.time}:41`, color: LIME },
        {
          text: `Captured ${c >= 0 ? "+" : "−"}${Math.abs(c).toFixed(1)} bps at session close`,
          time: "16:00",
          color: c >= 0 ? LIME : "#FF6B5E",
        },
      ];
    }
    case "RE-QUOTE FAIL":
      return [
        first,
        { text: `Do it · re-quote ${e.atConfirm?.toFixed(1)} < floor ${RULES.floor.toFixed(1)}`, time: `${e.time}:52`, color: "#FF6B5E" },
        { text: "No order · card closed", time: `${e.time}:52`, color: "#80848A" },
      ];
    case "SKIPPED":
      return [first, { text: "You skipped", time: `${e.time}:30`, color: "#C9CBCF" }];
    case "EXPIRED":
      return [first, { text: "Expired after 75 s · no tap", time: `${e.time}:33`, color: "#5A5D62" }];
  }
}

export function ledgerCsv(): string {
  const head = ["card_id", "session", "time_et", "symbol", "net_at_card_bps", "net_at_confirm_bps", "outcome", "captured_bps", "paper_pnl_usd"];
  const lines = LEDGER_ROWS.map((r) =>
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

