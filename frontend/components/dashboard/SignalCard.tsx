"use client";

import { useEffect, useState } from "react";
import BrandMark from "@/components/shared/BrandMark";
import Icon from "@/components/ui/Icon";
import { fmtBps, fmtPrice } from "@/lib/parity/format";
import { ROW_HAIRCUT } from "@/lib/parity/universe";
import type { TapeRow } from "@/types/parity";

const TTL_SECONDS = 75;

function fmtTtlClock(seconds: number): string {
  const s = Math.max(0, Math.ceil(seconds));
  const mm = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <p className="text-[0.72rem] text-text-mute">{label}</p>
      <p className="tnum mt-1.5 text-[1.15rem] font-semibold text-text sm:text-[1.3rem]">
        {value}
      </p>
      {sub ? <p className="mt-0.5 text-[0.72rem] text-text-mute">{sub}</p> : null}
    </div>
  );
}

/** The dashboard's signal card — a bespoke layout for this screen (not the
 * shared marketing/app Card), matching a supplied reference design exactly. */
export default function SignalCard({ row }: { row: TapeRow }) {
  const [remaining, setRemaining] = useState(TTL_SECONDS);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const dead = row.state === "halt" || row.state === "stale";
  const tradable = !dead && row.state === "rth" && row.netBps > 0;
  const rich = row.basisBps >= 0;
  const moveAbs = row.tokenPerShare - row.shareMid;
  const movePct = (moveAbs / row.shareMid) * 100;

  const tone = dead ? "halt" : tradable ? "green" : "mute";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-6 sm:p-7 ${
        tone === "green"
          ? "border-green/25"
          : tone === "halt"
            ? "border-halt/30"
            : "border-line-strong"
      }`}
      style={
        tone === "green"
          ? {
              background:
                "radial-gradient(140% 100% at 0% 0%, color-mix(in oklab, var(--green) 11%, var(--surface)), var(--surface) 65%)",
            }
          : { background: "var(--surface)" }
      }
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-2 text-[0.8rem] font-medium tracking-[0.14em] ${
            tone === "green" ? "text-green" : tone === "halt" ? "text-halt" : "text-text-mute"
          }`}
        >
          <span
            className={`size-2 rounded-full ${
              tone === "green" ? "animate-pulse bg-green" : tone === "halt" ? "bg-halt" : "bg-text-mute"
            }`}
          />
          {dead ? row.state.toUpperCase() : tradable ? "SIGNAL" : "NO SIGNAL"}
        </span>
        {!dead ? (
          <span className="tnum inline-flex items-center gap-1.5 text-[0.8rem] text-text-dim">
            <Icon name="clock" size={14} />
            Expires in <span className="text-text">{fmtTtlClock(remaining)}</span>
          </span>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <BrandMark symbol={row.symbol} className="size-14 rounded-xl text-text-dim" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[1.4rem] font-semibold tracking-tight text-text sm:text-[1.5rem]">
              {row.symbol}
            </span>
            {!dead ? (
              <span
                className={`rounded-md border px-2 py-0.5 text-[10px] tracking-widest ${
                  tone === "green" ? "border-green/40 text-green" : "border-line-strong text-text-mute"
                }`}
              >
                NET EDGE
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-[0.85rem] text-text-mute">{row.name}</p>
        </div>
        <div className="ml-auto text-right">
          <p
            className={`tnum text-[2.2rem] font-bold leading-none sm:text-[2.6rem] ${
              tone === "green" ? "text-green" : tone === "halt" ? "text-halt" : "text-text-mute"
            }`}
          >
            {dead ? "—" : fmtBps(row.netBps)}
          </p>
          <p className="mt-1.5 text-[0.78rem] text-text-mute">Net after costs</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-line pt-5 sm:grid-cols-4">
        <Stat label="Cash Price (Mid)" value={fmtPrice(row.shareMid)} sub="(RTH only)" />
        <Stat label="Token Price (Implied)" value={fmtPrice(row.tokenPerShare)} sub="(24/7)" />
        <Stat label="Raw Basis" value={dead ? "—" : fmtBps(row.basisBps)} />
        <Stat label="Est. Costs" value={`${ROW_HAIRCUT} bps`} />
      </div>

      {tradable ? (
        <>
          <div className="mt-6 grid grid-cols-1 gap-5 rounded-xl border border-line-strong/60 bg-ground/25 p-5 sm:grid-cols-2">
            <div>
              <p className="text-[0.75rem] text-text-mute">Direction</p>
              <div className="mt-2 flex items-center gap-2">
                <Icon
                  name="arrow"
                  size={18}
                  className={rich ? "-rotate-45 text-green" : "rotate-45 text-green"}
                />
                <span className="text-[1.2rem] font-bold tracking-tight text-green">
                  {rich ? "BUY" : "SELL"} {row.symbol}
                </span>
              </div>
              <p className="mt-1.5 text-[0.8rem] leading-relaxed text-text-dim">
                {rich
                  ? "Token trades higher. Bet on convergence."
                  : "Token trades lower. Bet on convergence."}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-[0.75rem] text-text-mute">Est. Move to Token</p>
              <p className="tnum mt-2 text-[1.2rem] font-bold text-green">
                {moveAbs >= 0 ? "+" : "−"}
                {Math.abs(moveAbs).toFixed(2)}
              </p>
              <p className="tnum mt-0.5 text-[0.78rem] text-text-mute">
                ({movePct >= 0 ? "+" : "−"}
                {Math.abs(movePct).toFixed(2)}%)
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1.5fr]">
            <button
              type="button"
              className="h-12 rounded-xl border border-line-strong bg-surface-2 text-[0.9rem] font-medium text-text transition-colors hover:border-text-mute"
            >
              View Details
            </button>
            <button
              type="button"
              className="h-12 rounded-xl bg-green text-[0.9rem] font-bold text-green-ink transition-colors hover:bg-[#12e888]"
            >
              Confirm &amp; Do It
            </button>
          </div>
          <p className="mt-4 text-center text-[0.76rem] text-text-mute">
            Re-quotes at confirm. Valid for 75 seconds.
          </p>
        </>
      ) : (
        <div className="mt-6 rounded-xl border border-line-strong/60 bg-ground/25 p-5">
          <p className="text-[0.85rem] leading-relaxed text-text-dim">
            {dead
              ? row.state === "halt"
                ? "Multiplier jump or oracle pause. This name is frozen until a clean resume."
                : "The cash and chain join blew its freshness budget. No card until it recovers."
              : "Net edge is real but below the bar after costs. Not worth the tap."}
          </p>
          <p className="mt-3 text-[0.76rem] text-text-mute">No card beats a wrong card.</p>
        </div>
      )}
    </div>
  );
}
