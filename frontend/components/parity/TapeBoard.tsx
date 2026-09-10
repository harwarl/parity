"use client";

import { useEffect, useMemo, useState } from "react";
import BrandMark from "@/components/shared/BrandMark";
import Reveal from "@/components/shared/Reveal";
import SessionPill from "@/components/ui/SessionPill";
import { fmtNet, fmtPrice } from "@/lib/parity/format";
import { ROW_HAIRCUT, TAPE } from "@/lib/parity/universe";
import { useInView } from "@/hooks/useInView";
import { useLiveTape } from "@/hooks/useLiveTape";
import type { TapeRow } from "@/types/parity";
import GapMeter from "./GapMeter";

/**
 * The tape — ten names, one shared plane. Each row opens to the basis trail, the
 * feed provenance, and a confirm-gated card. It NEVER renders a fill: the actions
 * only move to the next name. Sample data, marked. The older flat grid still
 * lives in TapeGrid.tsx.
 */

const HAIRCUT = { fee: 3, slip: 6, buffer: 5 } as const;

// deterministic intraday basis trail per symbol, so SSR and client agree
function trail(symbol: string, points = 48): number[] {
  let s = 0;
  for (let i = 0; i < symbol.length; i++)
    s = (s * 31 + symbol.charCodeAt(i)) >>> 0;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const out: number[] = [];
  let v = (rnd() - 0.5) * 40;
  for (let i = 0; i < points; i++) {
    v += (rnd() - 0.5) * 16 - v * 0.05;
    out.push(Math.max(-95, Math.min(95, v)));
  }
  return out;
}

const COLS =
  "lg:grid-cols-[minmax(0,1.6fr)_0.8fr_0.8fr_1.15fr_0.55fr_auto_1.25rem]";

// first tradable row from the static universe — SSR-safe seed for the open row
const FIRST_TRADABLE = Math.max(
  0,
  TAPE.findIndex((r) => r.state === "rth" && r.netBps > 0),
);

export default function TapeBoard() {
  const { rows } = useLiveTape();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  const tradable = useMemo(
    () =>
      rows
        .map((r, i) => ({ r, i }))
        .filter(({ r }) => r.state === "rth" && r.netBps > 0)
        .map(({ i }) => i),
    [rows],
  );

  const [openIdx, setOpenIdx] = useState<number>(FIRST_TRADABLE);
  const [now, setNow] = useState("");

  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  // auto-walk the expanded row through the tradable names while on screen.
  // indexOf(-1 / a now-untradable row) is -1, so the walk self-heals to [0].
  useEffect(() => {
    if (!inView || tradable.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setOpenIdx((cur) => {
        const at = tradable.indexOf(cur);
        return tradable[(at + 1) % tradable.length];
      });
    }, 4600);
    return () => window.clearInterval(id);
  }, [inView, tradable]);

  const advance = () =>
    setOpenIdx((cur) => {
      if (tradable.length === 0) return -1;
      const at = tradable.indexOf(cur);
      return tradable[(at + 1) % tradable.length];
    });

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-2xl border border-line bg-surface-2"
    >
      {/* column heads — desktop only */}
      <div
        className={`hidden gap-x-4 border-b border-line px-5 py-2.5 text-[10px] uppercase tracking-[0.16em] text-text-mute lg:grid ${COLS}`}
      >
        <span>Name</span>
        <span className="text-right">Cash mid</span>
        <span className="text-right">Token / sh</span>
        <span>Gap</span>
        <span className="text-right">Net bps</span>
        <span className="justify-self-end">Session</span>
        <span />
      </div>

      <div className="divide-y divide-line">
        {rows.map((row, i) => (
          <Reveal key={row.symbol} delay={Math.min(i, 9) * 45} y={8}>
            <TapeLine
              row={row}
              updated={now}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
              onAdvance={advance}
            />
          </Reveal>
        ))}
      </div>

      <p className="tnum border-t border-line px-4 py-2.5 text-[10px] leading-relaxed text-text-mute sm:px-5">
        Sample data, not a live quote. Net is the basis after fee, slip, and
        buffer. HALT and STALE names quote nothing. You tap. TAPE does not place.
      </p>
    </div>
  );
}

function TapeLine({
  row,
  updated,
  open,
  onToggle,
  onAdvance,
}: {
  row: TapeRow;
  updated: string;
  open: boolean;
  onToggle: () => void;
  onAdvance: () => void;
}) {
  const dead = row.state === "halt" || row.state === "stale";
  const tradable = row.state === "rth" && row.netBps > 0;
  const netText = dead || row.netBps <= 0 ? "—" : fmtNet(row.netBps);

  return (
    <div
      className={
        open ? "bg-surface" : "transition-colors hover:bg-surface/50"
      }
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`grid w-full grid-cols-[1fr_auto] items-center gap-x-4 px-4 py-3.5 text-left sm:px-5 lg:grid ${COLS}`}
      >
        {/* name */}
        <span className="flex min-w-0 items-center gap-3">
          <BrandMark symbol={row.symbol} className="size-8" />
          <span className="min-w-0">
            <span className="block text-sm font-medium tracking-tight text-text">
              {row.symbol}
            </span>
            <span className="block truncate text-[0.72rem] text-text-mute">
              {row.name}
            </span>
          </span>
        </span>

        {/* prices — desktop */}
        <span className="tnum hidden text-right text-sm text-text-dim lg:block">
          {dead ? "—" : fmtPrice(row.shareMid)}
        </span>
        <span className="tnum hidden text-right text-sm text-text-dim lg:block">
          {dead ? "—" : fmtPrice(row.tokenPerShare)}
        </span>

        {/* gap bar — desktop */}
        <span className="hidden lg:block">
          {dead ? (
            <span className="tnum text-xs text-halt">no quote</span>
          ) : (
            <GapMeter bps={row.basisBps} showLabel={false} />
          )}
        </span>

        {/* net — desktop */}
        <span
          className={`tnum hidden text-right text-sm lg:block ${
            tradable ? "text-green" : "text-text-mute"
          }`}
        >
          {netText}
        </span>

        {/* session — desktop */}
        <span className="hidden justify-self-end lg:block">
          <SessionPill state={row.state} />
        </span>

        {/* compact right cluster — below lg */}
        <span className="flex items-center gap-3 lg:hidden">
          <SessionPill state={row.state} />
          <Chevron open={open} />
        </span>

        <span className="hidden lg:block">
          <Chevron open={open} />
        </span>
      </button>

      {open ? (
        <Detail
          row={row}
          updated={updated}
          dead={dead}
          tradable={tradable}
          onAdvance={onAdvance}
        />
      ) : null}
    </div>
  );
}

function Detail({
  row,
  updated,
  dead,
  tradable,
  onAdvance,
}: {
  row: TapeRow;
  updated: string;
  dead: boolean;
  tradable: boolean;
  onAdvance: () => void;
}) {
  const data = useMemo(() => trail(row.symbol), [row.symbol]);
  const gap = Math.abs(Math.round(row.basisBps));
  const net = Math.round(row.netBps);

  return (
    <div className="grid gap-3 px-4 pb-4 sm:px-5 lg:grid-cols-[1.2fr_1fr_0.9fr]">
      {/* basis trail */}
      <div className="rounded-xl border border-line bg-surface-2 p-4">
        <p className="eyebrow">Basis over time · today</p>
        {dead ? (
          <p className="tnum mt-6 text-xs text-halt">
            Trail held. No trusted basis to plot.
          </p>
        ) : (
          <BasisChart data={data} />
        )}
      </div>

      {/* provenance */}
      <dl className="rounded-xl border border-line bg-surface-2 p-4 text-[0.8rem]">
        {[
          ["Market", "US"],
          ["Feed", "RHJ · Chainlink"],
          ["Oracle", "Chainlink"],
          ["Confidence", dead ? "—" : "98%"],
          ["Updated", updated || "—"],
        ].map(([k, v]) => (
          <div
            key={k}
            className="flex items-center justify-between border-b border-line py-2 first:pt-0 last:border-0 last:pb-0"
          >
            <dt className="text-text-mute">{k}</dt>
            <dd className="tnum text-text-dim">{v}</dd>
          </div>
        ))}
      </dl>

      {/* confirm-gated card / refusal */}
      {tradable ? (
        <div className="flex flex-col rounded-xl border border-green/25 bg-surface-2 p-4">
          <div className="flex items-baseline justify-between">
            <span className="eyebrow text-green">Gap is live</span>
            <span className="tnum text-lg font-medium text-green">
              {fmtNet(row.netBps)}
            </span>
          </div>
          <p className="tnum mt-1.5 text-[10px] text-text-mute">
            gap {gap} − fee {HAIRCUT.fee} − slip {HAIRCUT.slip} − buffer{" "}
            {HAIRCUT.buffer} = net {Math.max(0, gap - ROW_HAIRCUT)}
          </p>
          <div className="mt-3 space-y-2">
            <button
              type="button"
              onClick={onAdvance}
              className="flex h-10 w-full items-center justify-between rounded-lg bg-green px-4 text-sm font-medium text-green-ink transition-colors hover:bg-[#12e888]"
            >
              <span>Do it</span>
              <span className="tnum text-green-ink/70">$15</span>
            </button>
            <button
              type="button"
              onClick={onAdvance}
              className="h-9 w-full rounded-lg border border-line text-sm text-text-dim transition-colors hover:border-line-strong hover:text-text"
            >
              Skip
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col rounded-xl border border-halt/40 bg-surface-2 p-4">
          <span className="tnum w-fit rounded-md border border-halt/50 bg-halt/5 px-2 py-0.5 text-[11px] tracking-[0.16em] text-halt">
            {dead ? row.state.toUpperCase() : "DUST"}
          </span>
          <p className="mt-3 text-[0.8rem] leading-relaxed text-text-dim">
            {dead
              ? row.state === "halt"
                ? "Multiplier jump or oracle pause. The name is frozen until a clean resume."
                : "The cash and chain join blew its freshness budget. No card until it recovers."
              : `Net ${net} after the haircut. Real, but below the bar. Not worth the tap.`}
          </p>
          <p className="mt-3 text-[10px] text-text-mute">No card beats a wrong card.</p>
        </div>
      )}
    </div>
  );
}

function BasisChart({ data }: { data: number[] }) {
  const W = 260;
  const H = 96;
  const max = 100;
  const step = W / (data.length - 1);
  const y = (v: number) => H / 2 - (v / max) * (H / 2 - 4);
  const d = data
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)} ${y(v).toFixed(1)}`)
    .join(" ");
  const last = data[data.length - 1];

  return (
    <div className="mt-2 flex gap-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-24 w-full overflow-visible"
        preserveAspectRatio="none"
      >
        {[100, 50, 0, -50, -100].map((g) => (
          <line
            key={g}
            x1="0"
            x2={W}
            y1={y(g)}
            y2={y(g)}
            stroke="var(--line)"
            strokeWidth="1"
            strokeDasharray={g === 0 ? "0" : "2 3"}
          />
        ))}
        <path
          d={d}
          fill="none"
          stroke="var(--green)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          className="motion-safe:animate-[draw_1.1s_ease-out_both]"
          style={{ strokeDasharray: 1, strokeDashoffset: 0 }}
        />
        <circle cx={W} cy={y(last)} r="2.5" fill="var(--green)" />
      </svg>
      <div className="tnum flex flex-col justify-between py-0.5 text-[9px] text-text-mute">
        <span>+100</span>
        <span>+50</span>
        <span>0</span>
        <span>−50</span>
        <span>−100</span>
      </div>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={`size-4 text-text-mute transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        d="M4 6l4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
