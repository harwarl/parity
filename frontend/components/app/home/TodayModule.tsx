"use client";

import { DERIVED, ROWS } from "@/lib/gauge/model";
import type { Outcome } from "@/lib/api/types";
import { formatSignedUsd } from "@/lib/format";
import { DataRow } from "@/components/ui/DataRow";
import { Panel } from "@/components/ui/Panel";
import { useGauge } from "@/components/app/shell/GaugeProvider";
import { useLive } from "@/components/app/shell/LiveMarketProvider";
import { CapPips, type PipKind } from "@/components/app/ui/CapPips";
import { PanelHead } from "@/components/app/ui/PanelHead";
import { stateHex } from "@/components/app/ui/StatePill";
import { LiveEvaluations } from "./LiveEvaluations";

const PIP: Record<Outcome, PipKind> = {
  active: "pending",
  taken: "taken",
  skipped: "skipped",
  expired: "expired",
  stale_on_confirm: "expired",
  requote_fail: "fail",
};

/**
 * Home · Today: the daily cap as pips (one per card opened today, whatever
 * happened to it), plus the day's counters. From gauge-api's /stats and
 * /history; design.md's sample day offline.
 */
export function TodayModule() {
  const { status, stats, history } = useGauge();
  const { rows, source } = useLive();
  const online = status === "online" && stats !== null;

  const board = source === "api" ? rows : ROWS;
  const best = [...board].sort((a, b) => b.absGap - a.absGap)[0];

  let used = 1;
  let limit = 3;
  let pips: PipKind[] = ["taken", "pending", "empty"];
  let caption = "used 1 · pending 1 (NVDA)";
  if (online) {
    limit = stats.cap.limit;
    const today = history
      .filter((r) => Math.floor(r.opened_at_ms / 86_400_000) === stats.day)
      .sort((a, b) => a.opened_at_ms - b.opened_at_ms);
    used = stats.cap.used;
    pips = [...today.map((r) => PIP[r.outcome]), ...Array<PipKind>(limit).fill("empty")].slice(0, limit);
    const pending = today.find((r) => r.outcome === "active");
    caption =
      used === 0
        ? "no cards yet today"
        : `used ${used - stats.cap.pending}${pending ? ` · pending 1 (${pending.symbol})` : ""}`;
  }

  return (
    <Panel className="flex flex-col">
      <PanelHead label="Today" meta={<span className="app-meta">{online ? "UTC day" : "since 09:30"}</span>} />
      <div className="px-[22px] pt-5">
        <p className="app-cell-label">Daily cap</p>
        <p className="mt-2 font-display text-[44px] leading-none font-bold tracking-[-0.04em] text-ink">
          {used}
          <span className="text-dim">/{limit}</span>
        </p>
        <div className="mt-4" role="img" aria-label={`Daily cap: ${used} of ${limit} cards used. ${caption}.`}>
          <CapPips pips={pips} blink />
        </div>
        <p className="mt-2.5 font-mono text-[11px] text-dim">{caption}</p>
      </div>
      <div className="mt-auto px-[22px] pt-4 pb-3">
        <DataRow label="Evaluations" value={<LiveEvaluations />} />
        <DataRow label="Cards emitted" value={online ? String(stats.cap.used) : "2"} />
        {/* Captured bps (and so P&L) needs a close mark the backend doesn't make yet. */}
        <DataRow
          label="Paper P&L today"
          value={online ? "—" : formatSignedUsd(DERIVED.pnlToday)}
          tone={online ? "ink" : "lime"}
        />
        <DataRow
          label="Best raw gap"
          value={
            best ? (
              <>
                {best.sym} {best.absGap.toFixed(1)} ·{" "}
                <span style={{ color: stateHex(best.state) }}>{best.state}</span>
              </>
            ) : (
              "—"
            )
          }
          className="!border-b-0"
        />
      </div>
    </Panel>
  );
}
