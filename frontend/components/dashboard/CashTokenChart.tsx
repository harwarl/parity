"use client";

import { useMemo, useRef, useState } from "react";
import { fmtBps, fmtPrice } from "@/lib/parity/format";
import type { TapeRow } from "@/types/parity";

// deterministic per-symbol wobble, so SSR and client agree — same technique
// as TapeBoard's basis trail, extended to two correlated series
function wobble(symbol: string, seedOffset: number, points = 60): number[] {
  let s = 0;
  for (let i = 0; i < symbol.length; i++) {
    s = (s * 31 + symbol.charCodeAt(i) + seedOffset) >>> 0;
  }
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const out: number[] = [];
  let v = 0;
  for (let i = 0; i < points; i++) {
    v += (rnd() - 0.5) * 0.4 - v * 0.08;
    out.push(v);
  }
  return out;
}

const W = 560;
const H = 260;
const PAD_TOP = 10;
const PAD_BOTTOM = 6;

// chart-only data-ink color for the cash series — not a site accent, scoped
// to this two-series chart so cash and token read as distinct at a glance
const CASH_BLUE = "#3b82f6";

/** Round an axis range to clean steps (0.25 / 0.5 / 1 / 2 / 5 × 10^n) instead
 * of splitting the raw data range into arbitrary fractions — gridlines and
 * labels land on numbers a reader would actually round to. */
function niceTicks(dataLo: number, dataHi: number, targetCount = 6) {
  const range = dataHi - dataLo || 1;
  const rawStep = range / (targetCount - 1);
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  const step = (norm < 1.5 ? 1 : norm < 3.5 ? 2.5 : norm < 7.5 ? 5 : 10) * mag;
  const lo = Math.floor(dataLo / step) * step;
  const hi = Math.ceil(dataHi / step) * step;
  const values: number[] = [];
  for (let v = hi; v >= lo - step * 0.001; v -= step) values.push(Math.round(v * 100) / 100);
  return { lo, hi, values };
}

const fmtAxis = (v: number) => v.toFixed(1);

const TIMEFRAMES = ["1D", "1W", "1M", "3M", "1Y"] as const;
const X_LABELS = ["9:30", "11:00", "12:30", "14:00", "16:00"];

function StatBlock({
  label,
  value,
  tone = "dim",
}: {
  label: string;
  value: string;
  tone?: "dim" | "green" | "mute";
}) {
  return (
    <div>
      <p
        className={`tnum text-[1.6rem] font-bold leading-none sm:text-[1.85rem] ${
          tone === "green" ? "text-green" : tone === "mute" ? "text-text-mute" : "text-text"
        }`}
      >
        {value}
      </p>
      <p className="mt-1.5 text-[0.78rem] text-text-mute">{label}</p>
    </div>
  );
}

/** Cash vs. token, one session. Cash gets its own chart-only blue so the two
 * series separate at a glance; token keeps the site's green identity. Today
 * only — the 1W/1M/3M/1Y tabs are present but inert: a real range would need
 * fabricated history the product doesn't model. Ships a hover crosshair +
 * tooltip, per the site's chart rules. */
export default function CashTokenChart({ row }: { row: TapeRow }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const { cash, token } = useMemo(() => {
    const base = wobble(row.symbol, 1);
    const noise = wobble(row.symbol, 2);
    const cashSeries = base.map((b) => row.shareMid * (1 + b * 0.002));
    const tokenSeries = base.map(
      (b, i) => row.tokenPerShare * (1 + b * 0.002 + noise[i] * 0.0012),
    );
    return { cash: cashSeries, token: tokenSeries };
  }, [row.symbol, row.shareMid, row.tokenPerShare]);

  const dead = row.state === "halt" || row.state === "stale";
  const tradable = row.state === "rth" && row.netBps > 0;

  const plotH = H - PAD_TOP - PAD_BOTTOM;
  const all = [...cash, ...token];
  const dataMin = Math.min(...all);
  const dataMax = Math.max(...all);
  const pad = (dataMax - dataMin) * 0.15 || dataMax * 0.01;
  const { lo, hi, values: ticks } = niceTicks(dataMin - pad, dataMax + pad, 6);
  const y = (v: number) => PAD_TOP + plotH - ((v - lo) / (hi - lo)) * plotH;
  const step = W / (cash.length - 1);
  const path = (arr: number[]) =>
    arr
      .map((v, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)} ${y(v).toFixed(1)}`)
      .join(" ");

  const lastCash = cash[cash.length - 1];
  const lastToken = token[token.length - 1];

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.max(0, Math.min(cash.length - 1, Math.round(px / step)));
    setHoverIdx(idx);
  };

  return (
    <div>
      <p className="text-[0.95rem] text-text">
        {row.symbol} — Cash vs. Token Price
      </p>

      <div className="mt-3 flex flex-wrap items-end gap-x-10 gap-y-3">
        <StatBlock label="Cash (RTH)" value={fmtPrice(row.shareMid)} />
        <StatBlock label="Token (24/7)" value={fmtPrice(row.tokenPerShare)} tone="green" />
        <StatBlock
          label="Net Edge"
          value={dead ? "—" : fmtBps(row.netBps)}
          tone={tradable ? "green" : "mute"}
        />
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            type="button"
            disabled={tf !== "1D"}
            title={tf === "1D" ? undefined : "Needs history the product doesn't model yet"}
            className={`rounded-md border px-3 py-1.5 text-[0.78rem] transition-colors disabled:cursor-not-allowed ${
              tf === "1D"
                ? "border-green/50 text-green"
                : "border-transparent text-text-mute/60"
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {dead ? (
        <div className="mt-4 flex h-55 items-center justify-center rounded-lg border border-line bg-ground/40">
          <p className="text-xs text-halt">
            {row.state === "halt"
              ? "Halted. No trusted price to chart."
              : "Stale. No trusted price to chart."}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 flex gap-3">
            <div className="tnum flex w-14 shrink-0 flex-col justify-between py-1 text-right text-[10px] text-text-mute">
              {ticks.map((t, i) => (
                <span key={i}>{fmtPrice(t)}</span>
              ))}
            </div>

            <div className="relative min-w-0 flex-1">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${W} ${H}`}
                className="h-55 w-full cursor-crosshair overflow-visible"
                preserveAspectRatio="none"
                onPointerMove={onMove}
                onPointerLeave={() => setHoverIdx(null)}
              >
                {ticks.map((t, i) => (
                  <line
                    key={i}
                    x1="0"
                    x2={W}
                    y1={y(t)}
                    y2={y(t)}
                    stroke="var(--line)"
                    strokeWidth="1"
                  />
                ))}

                <path
                  d={path(cash)}
                  fill="none"
                  stroke={CASH_BLUE}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={path(token)}
                  fill="none"
                  stroke="var(--green)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {hoverIdx !== null ? (
                  <>
                    <line
                      x1={hoverIdx * step}
                      x2={hoverIdx * step}
                      y1={PAD_TOP}
                      y2={PAD_TOP + plotH}
                      stroke="var(--line-strong)"
                      strokeWidth="1"
                    />
                    <circle cx={hoverIdx * step} cy={y(cash[hoverIdx])} r="4" fill={CASH_BLUE} stroke="var(--surface)" strokeWidth="2" />
                    <circle cx={hoverIdx * step} cy={y(token[hoverIdx])} r="4" fill="var(--green)" stroke="var(--surface)" strokeWidth="2" />
                  </>
                ) : (
                  <>
                    <circle cx={W} cy={y(lastCash)} r="4" fill={CASH_BLUE} stroke="var(--surface)" strokeWidth="2" />
                    <circle cx={W} cy={y(lastToken)} r="4" fill="var(--green)" stroke="var(--surface)" strokeWidth="2" />
                  </>
                )}
              </svg>

              {/* floating end-value badges — positioned as a % of chart height so they track the responsive svg */}
              <span
                className="tnum pointer-events-none absolute right-0 -translate-y-1/2 rounded-full px-2.5 py-1 text-[12px] font-semibold text-white"
                style={{ top: `${(y(lastCash) / H) * 100}%`, background: CASH_BLUE }}
              >
                {fmtPrice(lastCash)}
              </span>
              <span
                className="tnum pointer-events-none absolute right-0 -translate-y-1/2 rounded-full bg-green px-2.5 py-1 text-[12px] font-semibold text-green-ink"
                style={{ top: `${(y(lastToken) / H) * 100}%` }}
              >
                {fmtPrice(lastToken)}
              </span>

              {hoverIdx !== null ? (
                <div
                  className="tnum pointer-events-none absolute top-0 rounded-md border border-line-strong bg-surface-2 px-3 py-2 text-[11px] shadow-lg"
                  style={{
                    left: `${Math.min(85, Math.max(0, (hoverIdx / (cash.length - 1)) * 100))}%`,
                  }}
                >
                  <p className="flex items-center gap-1.5" style={{ color: CASH_BLUE }}>
                    <span className="h-0.5 w-3 rounded-full" style={{ background: CASH_BLUE }} />
                    {fmtPrice(cash[hoverIdx])}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-green">
                    <span className="h-0.5 w-3 rounded-full bg-green" />
                    {fmtPrice(token[hoverIdx])}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="ml-17 mt-1.5 flex justify-between text-[10px] text-text-mute">
            {X_LABELS.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[0.78rem] text-text-mute">
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-4 rounded-full" style={{ background: CASH_BLUE }} />
          Cash (RTH)
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-4 rounded-full bg-green" />
          Token (Implied, 24/7)
        </span>
      </div>
    </div>
  );
}
