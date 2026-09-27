"use client";

import { ledgerCsv } from "@/lib/gauge/ledger";
import { useLedger } from "@/hooks/useLedger";

/** Downloads the ledger (every card shown in History) as CSV. */
export function ExportCsvButton() {
  const { rows, source } = useLedger();
  const download = () => {
    const url = URL.createObjectURL(new Blob([ledgerCsv(rows)], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = source === "api" ? `gauge-ledger-${new Date().toISOString().slice(0, 10)}.csv` : "gauge-ledger-2026-09-22_26.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button type="button" onClick={download} className="g-btn g-btn-secondary g-btn-xs">
      Export CSV
    </button>
  );
}
