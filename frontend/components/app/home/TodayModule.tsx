import { DERIVED, EVALUATIONS, ROWS } from "@/lib/gauge/model";
import { formatSignedUsd } from "@/lib/format";
import { DataRow } from "@/components/ui/DataRow";
import { Panel } from "@/components/ui/Panel";
import { CapPips } from "@/components/app/ui/CapPips";
import { PanelHead } from "@/components/app/ui/PanelHead";

/** Home · Today: cap 1/3 with the pending NVDA pip, and the day's counters. */
export function TodayModule() {
  const best = [...ROWS].sort((a, b) => b.absGap - a.absGap)[0];
  return (
    <Panel className="flex flex-col">
      <PanelHead label="Today" meta={<span className="app-meta">since 09:30</span>} />
      <div className="px-[22px] pt-5">
        <p className="app-cell-label">Daily cap</p>
        <p className="mt-2 font-display text-[44px] leading-none font-bold tracking-[-0.04em] text-ink">
          1<span className="text-dim">/3</span>
        </p>
        <div
          className="mt-4"
          role="img"
          aria-label="Daily cap: 1 used, 1 pending for NVDA, 1 free."
        >
          <CapPips pips={["taken", "pending", "empty"]} blink />
        </div>
        <p className="mt-2.5 font-mono text-[11px] text-dim">used 1 · pending 1 (NVDA)</p>
      </div>
      <div className="mt-auto px-[22px] pt-4 pb-3">
        <DataRow label="Evaluations" value={EVALUATIONS.toLocaleString("en-US")} />
        <DataRow label="Cards emitted" value="2" />
        <DataRow label="Paper P&L today" value={formatSignedUsd(DERIVED.pnlToday)} tone="lime" />
        <DataRow
          label="Best raw gap"
          value={
            <>
              {best.sym} {best.absGap.toFixed(1)} · <span className="text-thin">{best.state}</span>
            </>
          }
          className="!border-b-0"
        />
      </div>
    </Panel>
  );
}
