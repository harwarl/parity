"use client";

import { useState } from "react";
import { cardWindow } from "@/lib/gauge/series";
import { Panel } from "@/components/ui/Panel";
import { PanelHead } from "@/components/app/ui/PanelHead";

const w = cardWindow();
const mono = { fontFamily: "var(--font-mono)", fontSize: 10 } as const;
const stamp = (i: number) => {
  const s = 3 + i; // 14:01:03 + i
  return `14:${String(1 + Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

/** Both legs · card window (760 × 230, 99 samples over 98 s). */
export function BothLegsChart() {
  const [hover, setHover] = useState<number | null>(null);
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * 760;
    setHover(Math.max(0, Math.min(98, Math.round(((x - 50) / 706) * 98))));
  };
  const gapBps = (i: number) => ((w.tokV[i] - w.cashV[i]) / w.cashV[i]) * 1e4;

  return (
    <Panel>
      <PanelHead
        label="Both legs · card window"
        meta={<span className="app-meta">last 98 s · card at 14:02:18 · ILLUSTRATIVE</span>}
      />
      <div className="px-[22px] pt-4 pb-5">
        <ul className="mb-3 flex gap-5 font-mono text-[11px] text-dim">
          <li className="flex items-center gap-2"><span className="h-0.5 w-4 bg-accent" />token × mult</li>
          <li className="flex items-center gap-2"><span className="h-0.5 w-4 bg-ink" />cash mid</li>
          <li className="flex items-center gap-2"><span className="h-2.5 w-4 bg-accent/20" />gap</li>
        </ul>
        <div className="relative">
          <svg
            viewBox="0 0 760 230"
            className="w-full overflow-visible"
            role="img"
            aria-label="Token per share and cash mid over the last 98 seconds. The token stays about 0.3 dollars above cash; now 182.71 against 182.40."
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
          >
            {[182.9, 182.7, 182.5, 182.3].map((v) => (
              <g key={v}>
                <line x1="50" x2="756" y1={w.Y(v)} y2={w.Y(v)} stroke="#F9F7F4" strokeOpacity=".06" />
                <text x="42" y={w.Y(v) + 3} textAnchor="end" fill="#80848A" style={mono}>
                  {v.toFixed(2)}
                </text>
              </g>
            ))}
            <path d={w.band} fill="#B2D450" fillOpacity=".14" />
            <path d={w.cash} fill="none" stroke="#F9F7F4" strokeOpacity=".85" strokeWidth="1.5" />
            <path d={w.token} fill="none" stroke="#B2D450" strokeWidth="2" />
            <line x1={w.X(75)} x2={w.X(75)} y1="14" y2="200" stroke="#B2D450" strokeDasharray="4 4" />
            <line x1={w.X(98)} x2={w.X(98)} y1="14" y2="200" stroke="#F9F7F4" strokeOpacity=".5" />
            {hover !== null && (
              <line x1={w.X(hover)} x2={w.X(hover)} y1="14" y2="200" stroke="#F9F7F4" strokeOpacity=".25" />
            )}
            <text x="50" y="222" fill="#80848A" style={mono}>14:01:03</text>
            <text x={w.X(75)} y="222" textAnchor="middle" fill="#B2D450" style={mono}>14:02:18 · card</text>
            <text x="756" y="222" textAnchor="end" fill="#80848A" style={mono}>14:02:41</text>
            <rect x="50" width="710" height="230" fill="transparent" />
          </svg>
          {hover !== null && (
            <div
              className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg border border-ink/14 bg-panel-2 px-3 py-2 font-mono text-[11px] whitespace-nowrap shadow-xl"
              style={{ left: `${(w.X(hover) / 760) * 100}%` }}
            >
              <p className="text-dim">{stamp(hover)} ET</p>
              <p className="text-accent">token {w.tokV[hover].toFixed(3)}</p>
              <p className="text-ink">cash {w.cashV[hover].toFixed(3)}</p>
              <p className="text-ink-2">gap {gapBps(hover).toFixed(1)} bps</p>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
