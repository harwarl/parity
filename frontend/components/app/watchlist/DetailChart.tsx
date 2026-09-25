"use client";

import { useState } from "react";
import type { WatchRow } from "@/lib/gauge/model";
import { detailSeries } from "@/lib/gauge/series";
import { formatBps } from "@/lib/format";

const mono = { fontFamily: "var(--font-mono)", fontSize: 10 } as const;
const minute = (i: number) => {
  const m = 3 + i; // 13:03 + i
  return `${13 + Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
};

/**
 * 60-minute gross vs net (700 × 220). Cost band red 14% between them, floor
 * dashed, zero cream 20%. J9: both lines draw in on select (keyed by symbol).
 */
export function DetailChart({ row }: { row: WatchRow }) {
  const s = detailSeries(row);
  const [hover, setHover] = useState<number | null>(null);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * 700;
    setHover(Math.max(0, Math.min(59, Math.round((x / 696) * 59))));
  };

  return (
    <div>
      <div className="relative">
        <svg
          viewBox="0 0 700 220"
          className="w-full overflow-visible"
          role="img"
          aria-label={`${row.sym} last 60 minutes: gross gap now ${row.absGap.toFixed(1)} bps, net ${formatBps(row.net)} bps against a floor of 2.0.`}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          <line x1="0" x2="700" y1={s.zeroY} y2={s.zeroY} stroke="#F9F7F4" strokeOpacity=".2" />
          <line x1="0" x2="700" y1={s.floorY} y2={s.floorY} stroke="#80848A" strokeDasharray="4 4" />
          <path d={s.band} fill="#FF6B5E" fillOpacity=".14" />
          <path
            d={s.gross}
            fill="none"
            stroke="#C9CBCF"
            strokeWidth="1.5"
            pathLength={100}
            strokeDasharray="100"
            style={{ animation: "g-draw 1.2s ease-out both" }}
          />
          <path
            d={s.net}
            fill="none"
            stroke="#B2D450"
            strokeWidth="2.5"
            strokeLinejoin="round"
            pathLength={100}
            strokeDasharray="100"
            style={{ animation: "g-draw 1.2s ease-out .15s both" }}
          />
          <circle cx={s.end[0]} cy={s.end[1]} r="4" fill="#B2D450" style={{ filter: "drop-shadow(0 0 6px #B2D450)" }} />
          <text x="700" y={s.floorY - 6} textAnchor="end" fill="#80848A" style={mono}>
            floor 2.0
          </text>
          {hover !== null && (
            <line x1={s.X(hover)} x2={s.X(hover)} y1="0" y2="200" stroke="#F9F7F4" strokeOpacity=".25" />
          )}
          <rect width="700" height="220" fill="transparent" />
        </svg>
        {hover !== null && (
          <div
            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg border border-ink/14 bg-panel-2 px-3 py-2 font-mono text-[11px] whitespace-nowrap shadow-xl"
            style={{ left: `${(s.X(hover) / 700) * 100}%` }}
          >
            <p className="text-dim">{minute(hover)} ET</p>
            <p className="text-ink-2">|gap| {s.g[hover].toFixed(1)}</p>
            <p className="text-accent">net {formatBps(s.nv[hover])}</p>
          </div>
        )}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-dim">
        <span>13:03</span>
        <span>13:33</span>
        <span>14:02</span>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] text-dim">
        <li className="flex items-center gap-2"><span className="h-0.5 w-4 bg-ink-2" />|gap| gross</li>
        <li className="flex items-center gap-2"><span className="h-[3px] w-4 bg-accent" />net</li>
        <li className="flex items-center gap-2"><span className="h-2.5 w-4 bg-neg/20" />costs</li>
        <li className="flex items-center gap-2"><span className="w-4 border-t border-dashed border-dim" />floor 2.0</li>
      </ul>
    </div>
  );
}
