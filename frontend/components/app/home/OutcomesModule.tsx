"use client";

import Link from "next/link";
import { WHY_NO_CARD } from "@/lib/gauge/model";
import { useGauge } from "@/components/app/shell/GaugeProvider";
import { useLedger } from "@/hooks/useLedger";
import { Panel } from "@/components/ui/Panel";
import { PanelHead } from "@/components/app/ui/PanelHead";
import { stateHex } from "@/components/app/ui/StatePill";

/** Home · Outcomes of closed cards, plus why-no-card over today's evaluations (ledger + /stats). */
export function OutcomesModule() {
  const { rows, source } = useLedger();
  const { stats } = useGauge();
  const closed = rows.filter((r) => r.outcome !== "ACTIVE");
  const n = closed.length;
  const count = (o: string) => closed.filter((r) => r.outcome === o).length;
  const outcomes = [
    { label: "Taken", count: count("TAKEN"), color: "#B2D450" },
    { label: "Skipped", count: count("SKIPPED"), color: "#C9CBCF" },
    { label: "Expired", count: count("EXPIRED"), color: "#5A5D62" },
    { label: "Re-quote fail", count: count("RE-QUOTE FAIL"), color: "#FF6B5E" },
  ];

  // Why no card: today's market-wide skips, as shares of all skips.
  let why = WHY_NO_CARD;
  if (source === "api") {
    const o = stats?.outcomes ?? {};
    const codes = ["DUST", "THIN", "STALE", "CLOSED"] as const;
    const total = codes.reduce((a, c) => a + (o[c.toLowerCase()] ?? 0), 0);
    why = codes.map((state) => ({
      state,
      pct: total ? Math.round(((o[state.toLowerCase()] ?? 0) / total) * 100) : 0,
    }));
  }

  return (
    <Panel className="flex flex-col">
      <PanelHead
        label={`Outcomes · ${n} cards`}
        meta={
          <Link href="/dashboard/history" className="text-[13px] font-semibold text-accent hover:text-accent-hover">
            History →
          </Link>
        }
      />
      <div className="px-[22px] pt-5">
        <div
          role="img"
          aria-label={outcomes.map((o) => `${o.label} ${o.count}`).join(", ")}
          className="flex h-3 gap-0.5 overflow-hidden rounded-full"
        >
          {outcomes.map((o) => (
            <span key={o.label} style={{ flexGrow: o.count, background: o.color }} />
          ))}
        </div>
        <ul className="mt-4">
          {outcomes.map((o) => (
            <li key={o.label} className="flex items-center justify-between border-b border-line-row py-2.5 last:border-b-0">
              <span className="flex items-center gap-2.5 text-[14px] text-ink-2">
                <span aria-hidden className="size-2 rounded-full" style={{ background: o.color }} />
                {o.label}
              </span>
              <span className="font-mono text-[13px] text-ink">
                {o.count} <span className="text-dim">· {n ? Math.round((o.count / n) * 100) : 0}%</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto border-t border-line-row px-[22px] pt-4 pb-5">
        <p className="app-cell-label mb-3">Why no card · today&apos;s evaluations</p>
        <ul className="flex flex-col gap-2.5">
          {why.map((w) => (
            <li key={w.state} className="grid grid-cols-[64px_1fr_42px] items-center gap-3 font-mono text-[11px]">
              <span style={{ color: stateHex(w.state) }}>{w.state}</span>
              <span className="h-1.5 overflow-hidden rounded-full bg-track">
                <span className="block h-full rounded-full" style={{ width: `${w.pct}%`, background: stateHex(w.state) }} />
              </span>
              <span className="text-right text-ink-2">{w.pct}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
