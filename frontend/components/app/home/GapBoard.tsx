"use client";

import Link from "next/link";
import { RULES, stateCounts } from "@/lib/gauge/model";
import { formatCost, formatSignedBps } from "@/lib/format";
import { Panel } from "@/components/ui/Panel";
import { Pill } from "@/components/ui/Pill";
import { useLive } from "@/components/app/shell/LiveMarketProvider";
import { LiveNum } from "@/components/app/ui/LiveNum";
import { PanelHead } from "@/components/app/ui/PanelHead";
import { netColor, Sparkline } from "@/components/app/ui/Sparkline";
import { StatePill } from "@/components/app/ui/StatePill";
import { TokenBadge } from "@/components/app/ui/TokenBadge";

const cols = "grid-cols-[1.9fr_1fr_1fr_.8fr_.8fr_.8fr_.8fr_.6fr_132px_110px]";
const heads = ["Name", "Cash mid", "Token/share", "Gap", "Costs", "Net", "Depth", "Age", "60 min", "State"];

/** Home · Live gap board (design.md §5B.10). CSS grid with table roles. */
export function GapBoard() {
  const { rows, hist, latency } = useLive();
  const counts = stateCounts(rows);
  return (
    <Panel>
      <PanelHead
        label="Live gap board"
        meta={
          <>
            <Pill size="sm" tone="lime" dot="live">
              SSE · {latency.sse} ms
            </Pill>
            <span className="app-meta tracking-[0.16em]">ILLUSTRATIVE</span>
            <StatePill state="CARD">Card {counts.CARD}</StatePill>
            <StatePill state="THIN">Thin {counts.THIN}</StatePill>
            <StatePill state="STALE">Stale {counts.STALE}</StatePill>
            <StatePill state="DUST">Dust {counts.DUST}</StatePill>
            <Link href="/dashboard/watchlist" className="ml-1 text-[13px] font-semibold text-accent hover:text-accent-hover">
              Open watchlist →
            </Link>
          </>
        }
      />
      <div className="overflow-x-auto">
        <div role="table" aria-label="Live gap board, illustrative" className="min-w-[1120px] px-[22px]">
          <div role="row" className={`grid ${cols} h-[42px] items-center gap-3 border-b border-ink/5`}>
            {heads.map((h, i) => (
              <span
                key={h}
                role="columnheader"
                className={`font-mono text-[10.5px] tracking-[0.14em] text-dim uppercase ${i > 0 ? "text-right" : ""}`}
              >
                {h}
              </span>
            ))}
          </div>
          {rows.map((r) => (
            <div
              key={r.sym}
              role="row"
              className={`grid ${cols} -mx-[22px] h-14 items-center gap-3 border-b border-ink/5 px-[22px] font-mono text-[13px] last:border-b-0`}
              style={r.state === "CARD" ? { animation: "j-glowrow 3s ease-in-out infinite" } : undefined}
            >
              <span role="cell" className="flex items-center gap-3">
                <TokenBadge sym={r.sym} />
                <span>
                  <span className="block font-body text-[14px] font-bold text-ink">{r.sym}</span>
                  <span className="block font-body text-[12px] text-dim">{r.name}</span>
                </span>
              </span>
              <span role="cell" className="text-right text-ink">
                <LiveNum value={+r.cash.toFixed(2)} text={r.cash.toFixed(2)} />
              </span>
              <span role="cell" className="text-right text-ink-2">
                <LiveNum value={+r.token.toFixed(2)} text={r.token.toFixed(2)} />
              </span>
              <span role="cell" className="text-right text-ink">
                <LiveNum value={+r.absGap.toFixed(1)} text={formatSignedBps(r.gap)} />
              </span>
              <span role="cell" className="text-right text-neg">{formatCost(r.costs)}</span>
              <span role="cell" className="text-right" style={{ color: netColor(r) }}>
                <LiveNum value={+r.net.toFixed(1)} text={formatSignedBps(r.net)} />
              </span>
              <span role="cell" className={`text-right ${r.depth < RULES.minDepth ? "text-thin" : "text-ink"}`}>
                ${r.depth}k
              </span>
              <span role="cell" className={`text-right ${r.age > RULES.maxAge ? "text-neg" : "text-ink"}`}>
                {r.age.toFixed(1)}s
              </span>
              <span role="cell" className="flex justify-end">
                <Sparkline row={r} values={hist[r.sym]} />
              </span>
              <span role="cell" className="flex justify-end">
                <StatePill state={r.state} />
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-3 border-t border-line-row px-[22px] py-3.5 font-mono text-[11px] text-dim">
        <span>
          costs = fees 3.5 + slippage + buffer 2.0 · floor: net ≥ 2.0 bps · depth ≥ $100k · age ≤ 2.0 s
        </span>
        <span>evaluated every tick · gates in order: feed → session → depth → net</span>
      </div>
    </Panel>
  );
}
