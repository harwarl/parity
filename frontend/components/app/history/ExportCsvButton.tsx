"use client";

import { ledgerCsv } from "@/lib/gauge/ledger";

/** Downloads the ledger (all 14 cards) as CSV. */
export function ExportCsvButton() {
  const download = () => {
    const url = URL.createObjectURL(new Blob([ledgerCsv()], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "gauge-ledger-2026-09-22_26.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button type="button" onClick={download} className="g-btn g-btn-secondary g-btn-xs">
      Export CSV
    </button>
  );
}
