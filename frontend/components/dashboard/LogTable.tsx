"use client";

import { Fragment, useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";

interface LogRow {
  group: "Today" | "Yesterday";
  time: string;
  symbol: string;
  side: "buy" | null;
  clip: string | null;
  mode: "paper" | "live";
  fill: string | null;
  net: string | null;
  ref: string;
}

const ROWS: LogRow[] = [
  { group: "Today", time: "14:22", symbol: "NVDA", side: "buy", clip: "$25", mode: "paper", fill: "183.71", net: "+26", ref: "—" },
  { group: "Today", time: "11:03", symbol: "TSLA", side: null, clip: null, mode: "paper", fill: null, net: null, ref: "skip · DUST" },
  { group: "Today", time: "09:41", symbol: "AAPL", side: "buy", clip: "$25", mode: "paper", fill: "227.91", net: "+19", ref: "—" },
  { group: "Yesterday", time: "15:58", symbol: "HOOD", side: "buy", clip: "$25", mode: "paper", fill: "74.20", net: "+22", ref: "—" },
  { group: "Yesterday", time: "10:12", symbol: "MSTR", side: null, clip: null, mode: "paper", fill: null, net: null, ref: "skip · HALT" },
  { group: "Yesterday", time: "09:47", symbol: "NVDA", side: "buy", clip: "$25", mode: "paper", fill: "180.30", net: "+31", ref: "—" },
];

const FILTERS = ["All", "Paper", "Live", "Skipped"] as const;
type Filter = (typeof FILTERS)[number];

function toCsv(rows: LogRow[]): string {
  const header = ["time", "symbol", "side", "clip", "mode", "fill", "net", "ref"];
  const lines = rows.map((r) =>
    [r.time, r.symbol, r.side ?? "-", r.clip ?? "-", r.mode, r.fill ?? "-", r.net ?? "-", r.ref].join(","),
  );
  return [header.join(","), ...lines].join("\n");
}

function downloadCsv(rows: LogRow[]) {
  const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tape-log-sample.csv";
  a.click();
  URL.revokeObjectURL(url);
}

/** Filterable log table + CSV export. Sample paper fills only — not a brokerage statement. */
export default function LogTable() {
  const [filter, setFilter] = useState<Filter>("All");

  const rows = useMemo(() => {
    if (filter === "All") return ROWS;
    if (filter === "Skipped") return ROWS.filter((r) => r.ref !== "—");
    return ROWS.filter((r) => r.mode === filter.toLowerCase());
  }, [filter]);

  const groups = useMemo(() => {
    const order: LogRow["group"][] = ["Today", "Yesterday"];
    return order
      .map((g) => ({ g, items: rows.filter((r) => r.group === g) }))
      .filter((x) => x.items.length > 0);
  }, [rows]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`rounded-md border px-3 py-1.5 text-[0.78rem] transition-colors ${
                filter === f
                  ? "border-green/50 text-green"
                  : "border-line-strong text-text-dim hover:border-text-mute hover:text-text"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => downloadCsv(rows)}
          className="inline-flex items-center gap-2 rounded-md border border-line-strong px-3 py-1.5 text-[0.78rem] text-text-dim transition-colors hover:border-text-mute hover:text-text"
        >
          <Icon name="download" size={13} />
          Export CSV
        </button>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-160 border-collapse text-[0.82rem]">
          <thead>
            <tr className="border-b border-line text-left text-[10px] uppercase tracking-widest text-text-mute">
              <th className="px-4 py-2.5 font-normal">Time</th>
              <th className="px-4 py-2.5 font-normal">Symbol</th>
              <th className="px-4 py-2.5 font-normal">Side</th>
              <th className="px-4 py-2.5 font-normal">Clip</th>
              <th className="px-4 py-2.5 font-normal">Mode</th>
              <th className="px-4 py-2.5 text-right font-normal">Fill</th>
              <th className="px-4 py-2.5 text-right font-normal">Net</th>
              <th className="px-4 py-2.5 text-right font-normal">Ref</th>
            </tr>
          </thead>
          <tbody>
            {groups.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-text-mute">
                  {filter === "Live"
                    ? "No live fills yet. Paper runs for at least 7 days first."
                    : "Nothing in this filter."}
                </td>
              </tr>
            ) : (
              groups.map(({ g, items }) => (
                <Fragment key={g}>
                  <tr className="border-b border-line bg-surface">
                    <td
                      colSpan={8}
                      className="px-4 py-1.5 text-[10px] uppercase tracking-widest text-text-mute"
                    >
                      {g}
                    </td>
                  </tr>
                  {items.map((r) => {
                    const skipped = r.ref !== "—";
                    return (
                      <tr
                        key={`${g}-${r.time}-${r.symbol}`}
                        className={`tnum border-b border-line last:border-b-0 ${skipped ? "text-text-mute" : "text-text-dim"}`}
                      >
                        <td className="px-4 py-3">{r.time}</td>
                        <td className={`px-4 py-3 font-medium ${skipped ? "" : "text-text"}`}>
                          {r.symbol}
                        </td>
                        <td className="px-4 py-3">{r.side ?? "—"}</td>
                        <td className="px-4 py-3">{r.clip ?? "—"}</td>
                        <td className="px-4 py-3">{r.mode}</td>
                        <td className="px-4 py-3 text-right">{r.fill ?? "—"}</td>
                        <td
                          className={`px-4 py-3 text-right ${skipped ? "" : "text-green"}`}
                        >
                          {r.net ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-right">{r.ref}</td>
                      </tr>
                    );
                  })}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
