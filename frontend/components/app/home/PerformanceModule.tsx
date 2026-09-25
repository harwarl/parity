"use client";

import { useState } from "react";
import { DERIVED, SESSIONS } from "@/lib/gauge/model";
import { pnlSeries } from "@/lib/gauge/series";
import { formatSignedBps, formatSignedUsd } from "@/lib/format";
import { Panel } from "@/components/ui/Panel";
import { PanelHead } from "@/components/app/ui/PanelHead";

const series = pnlSeries();
const ranges = ["5D", "1M", "All"] as const;

/** Home · Performance · last 5 sessions: KPIs + cumulative paper P&L (800 × 206). */
export function PerformanceModule() {
  const [range, setRange] = useState<(typeof ranges)[number]>("5D");
  const [hover, setHover] = useState<number | null>(null);

  const kpis = [
    { label: "Paper P&L", value: formatSignedUsd(DERIVED.pnl), sub: `${DERIVED.taken} taken cards`, lime: true },
    { label: "Hit rate", value: `${Math.round((DERIVED.positive / DERIVED.taken) * 100)}%`, sub: `${DERIVED.positive} of ${DERIVED.taken} positive` },
    { label: "Avg net at confirm", value: DERIVED.avgConfirm.toFixed(1), sub: "bps · taken cards" },
    { label: "Cards emitted", value: String(DERIVED.total), sub: `${DERIVED.closed} closed · 1 active` },
  ];

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * 800;
    let best = 0;
    series.labels.forEach((l, i) => {
      if (Math.abs(l.x - x) < Math.abs(series.labels[best].x - x)) best = i;
    });
    setHover(best);
  };
  const h = hover === null ? null : series.labels[hover];

  return (
    <Panel className="flex flex-col">
      <PanelHead
        label={`Performance · last ${SESSIONS.length} sessions`}
        meta={
          <div role="group" aria-label="Range" className="flex rounded-full border border-ink/10 bg-bg p-0.5">
            {ranges.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={range === r}
                onClick={() => setRange(r)}
                className={`h-7 cursor-pointer rounded-full px-3 font-mono text-[11px] ${
                  range === r ? "bg-ink text-accent-ink" : "text-muted hover:text-ink"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />
      <div className="grid grid-cols-2 border-b border-line-row md:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="border-r border-line-row px-[22px] py-[18px] last:border-r-0">
            <p className="app-cell-label">{k.label}</p>
            <p className={`mt-2 font-display text-[26px] leading-none font-bold tracking-[-0.04em] ${k.lime ? "text-accent" : "text-ink"}`}>
              {k.value}
            </p>
            <p className="mt-2 font-mono text-[11px] text-dim">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="px-[22px] pt-4 pb-5">
        <div className="mb-2 flex flex-wrap justify-between gap-2">
          <p className="text-[14px] font-semibold text-ink-2">Cumulative paper P&L · per taken card</p>
          <p className="app-meta">
            {range === "5D" ? "notional $100,000 per card · illustrative" : "ledger starts Mon 22 Sep · same 5 sessions"}
          </p>
        </div>
        <div className="relative">
          <svg
            viewBox="0 0 800 206"
            className="w-full overflow-visible"
            role="img"
            aria-label={`Cumulative paper P&L over ${DERIVED.taken} taken cards, ending at ${formatSignedUsd(DERIVED.pnl)}.`}
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
          >
            <defs>
              <linearGradient id="pnlArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#B2D450" stopOpacity=".28" />
                <stop offset="1" stopColor="#B2D450" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="70" x2="790" y1="20" y2="20" stroke="#F9F7F4" strokeOpacity=".06" />
            <line x1="70" x2="790" y1="110" y2="110" stroke="#F9F7F4" strokeOpacity=".06" />
            <line x1="70" x2="790" y1="200" y2="200" stroke="#F9F7F4" strokeOpacity=".14" />
            <text x="58" y="24" textAnchor="end" fill="#80848A" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
              ${series.maxV}
            </text>
            <text x="58" y="204" textAnchor="end" fill="#80848A" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
              $0
            </text>
            <path d={series.area} fill="url(#pnlArea)" />
            <path
              d={series.line}
              fill="none"
              stroke="#B2D450"
              strokeWidth="2"
              strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 0 6px rgba(178,212,80,.55))" }}
            />
            {h && <line x1={h.x} x2={h.x} y1="14" y2="200" stroke="#F9F7F4" strokeOpacity=".2" />}
            <path d={series.upDots} fill="#B2D450" stroke="#111316" strokeWidth="2" />
            <path d={series.downDots} fill="#FF6B5E" stroke="#111316" strokeWidth="2" />
            <rect x="60" y="0" width="740" height="206" fill="transparent" />
          </svg>
          {h && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg border border-ink/14 bg-panel-2 px-3 py-2 font-mono text-[11px] whitespace-nowrap shadow-xl"
              style={{ left: `${h.left}%`, top: `${(h.y / 206) * 100 - 30}%` }}
            >
              <p className="text-ink-2">{h.text}</p>
              <p className={h.captured >= 0 ? "text-accent" : "text-neg"}>{formatSignedBps(h.captured)} bps</p>
              <p className="text-ink">cum {formatSignedUsd(h.value)}</p>
            </div>
          )}
        </div>
        <div className="relative mt-2 h-4">
          {series.labels.map((l, i) => (
            <span
              key={i}
              className={`absolute -translate-x-1/2 font-mono text-[10px] whitespace-nowrap max-md:hidden ${hover === i ? "text-ink" : "text-dim"}`}
              style={{ left: `${l.left}%` }}
            >
              {l.text}
            </span>
          ))}
        </div>
      </div>
    </Panel>
  );
}
