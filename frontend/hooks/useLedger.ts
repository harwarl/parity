"use client";

import { useMemo } from "react";
import { LEDGER_ROWS, ledgerFromHistory, sessionsOf, type LedgerRow } from "@/lib/gauge/ledger";
import { useGauge } from "@/components/app/shell/GaugeProvider";

export type Ledger = {
  source: "api" | "sample";
  rows: LedgerRow[];
  sessions: string[];
  /** False from the API: captured bps (so P&L) aren't marked yet. */
  pnlKnown: boolean;
};

/** Every card the viewer has had: gauge-api's /history, or design.md's ledger offline. */
export function useLedger(): Ledger {
  const { status, history } = useGauge();
  return useMemo(() => {
    if (status !== "online") return { source: "sample", rows: LEDGER_ROWS, sessions: sessionsOf(LEDGER_ROWS), pnlKnown: true };
    const rows = ledgerFromHistory(history);
    return { source: "api", rows, sessions: sessionsOf(rows), pnlKnown: false };
  }, [status, history]);
}
