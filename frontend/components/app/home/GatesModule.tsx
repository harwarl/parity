"use client";

import { ACTIVE, rowBySym } from "@/lib/gauge/model";
import { RthLeft } from "@/components/app/ui/LiveClock";
import { Pill } from "@/components/ui/Pill";
import { Panel } from "@/components/ui/Panel";
import { useGauge } from "@/components/app/shell/GaugeProvider";
import { useLive } from "@/components/app/shell/LiveMarketProvider";
import { PanelHead } from "@/components/app/ui/PanelHead";
import { useApiActiveCard } from "@/hooks/useApiActiveCard";
import { useRules } from "@/hooks/useRules";

/**
 * Home · Gates: the four gates, live, for the open card's name, or with no
 * card open, the name closest to clearing. Under the viewer's own rules.
 */
export function GatesModule() {
  const RULES = useRules();
  const { stats } = useGauge();
  const { rows, source, rthLeft } = useLive();
  const api = useApiActiveCard();
  const sym = api?.card?.sym;
  const row =
    source === "api"
      ? (rows.find((r) => r.sym === sym) ?? [...rows].sort((a, b) => b.net - a.net)[0])
      : rowBySym(ACTIVE.sym);

  if (!row) {
    return (
      <Panel className="flex flex-col">
        <PanelHead label="Gates" />
        <p className="px-[22px] py-10 text-[14px] text-muted">No prices yet, so nothing to check.</p>
      </Panel>
    );
  }

  const gates = [
    { name: "Net gap", rule: `net ≥ ${RULES.floor.toFixed(1)} bps floor`, value: row.net.toFixed(1), pass: row.net >= RULES.floor && row.net > 0 },
    { name: "Session", rule: "RTH 09:30–16:00 ET", value: row.state === "CLOSED" ? "closed" : source === "api" ? (rthLeft ?? "open") : <RthLeft />, pass: row.state !== "CLOSED" },
    { name: "Depth", rule: `top of book ≥ $${RULES.minDepth}k`, value: `$${row.depth}k`, pass: row.depth >= RULES.minDepth },
    {
      name: "Cap",
      rule: `≤ ${RULES.cap} cards per day`,
      value: source === "api" && stats ? `${stats.cap.used}/${stats.cap.limit}` : "1/3",
      pass: source === "api" && stats ? stats.cap.used - stats.cap.pending < stats.cap.limit : true,
    },
  ];
  const passing = gates.filter((g) => g.pass).length;
  const netPct = Math.max(0, Math.min(100, (row.net / row.absGap) * 100));
  const floorPct = Math.max(0, Math.min(100, (RULES.floor / row.absGap) * 100));

  return (
    <Panel className="flex flex-col">
      <PanelHead
        label={`Gates · ${row.sym}`}
        meta={
          <Pill size="sm" tone={passing === 4 ? "lime" : "default"}>
            {passing}/4 pass
          </Pill>
        }
      />
      <ul className="px-[22px]">
        {gates.map((g) => (
          <li
            key={g.name}
            className="grid grid-cols-[28px_1fr_auto] items-center gap-3 border-b border-line-row py-3.5 last:border-b-0"
          >
            <span
              aria-hidden
              className={`grid size-6 place-items-center rounded-full border text-[12px] ${
                g.pass ? "border-accent/50 bg-accent/12 text-accent" : "border-neg/50 bg-neg/12 text-neg"
              }`}
            >
              {g.pass ? "✓" : "✕"}
            </span>
            <div>
              <p className="text-[15px] font-semibold text-ink">
                {g.name} <span className="sr-only">{g.pass ? "passes" : "fails"}</span>
              </p>
              <p className="font-mono text-[11.5px] text-dim">{g.rule}</p>
            </div>
            <p className={`font-mono text-[14px] ${g.pass ? "text-accent" : "text-neg"}`}>{g.value}</p>
          </li>
        ))}
      </ul>

      <div
        role="img"
        aria-label={`Net ${row.net.toFixed(1)} bps against a floor of ${RULES.floor.toFixed(1)} bps, on a gross gap of ${row.absGap.toFixed(1)} bps.`}
        className="mt-auto border-t border-line-row px-[22px] pt-4 pb-5"
      >
        <div className="mb-3 flex justify-between font-mono text-[10px] tracking-[0.14em] text-dim">
          <span>NET VS FLOOR</span>
          <span className="tracking-normal">
            floor {RULES.floor.toFixed(1)} · net <span className="text-accent">{row.net.toFixed(1)}</span>
          </span>
        </div>
        <div className="relative h-2 rounded-full bg-track">
          <span
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${netPct}%`,
              background: "linear-gradient(90deg, rgba(178,212,80,.4), #B2D450)",
              boxShadow: "0 0 12px rgba(178,212,80,.5)",
            }}
          />
          <span className="absolute -top-1 -bottom-1 w-0.5 bg-ink" style={{ left: `${floorPct}%` }} />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] text-dim">
          <span>0</span>
          <span>{row.absGap.toFixed(1)} bps gross</span>
        </div>
      </div>
    </Panel>
  );
}
