"use client";

import { useEffect, useState } from "react";
import { sample } from "@/config/site";
import { formatClock, formatSignedBps } from "@/lib/format";
import { DataRow } from "@/components/ui/DataRow";
import { Pill } from "@/components/ui/Pill";

const LIFETIME = 75;
const CIRC = 339.29; // 2π · 54

type CardState = { t: number; requoted: boolean };

/**
 * The card (design.md §5.5). D1 countdown ring on a 1s JS clock; D2 shimmer
 * mounts whenever `requoted` flips true. In production, drive `t` from the
 * card's expires_at instead of a local counter.
 */
export function CardMock() {
  const [{ t, requoted }, setState] = useState<CardState>({ t: 52, requoted: false });

  useEffect(() => {
    const timer = setInterval(() => {
      setState((s) => ({
        t: s.t <= 0 ? LIFETIME : s.t - 1,
        // auto-demo re-quote at 31s
        requoted: s.t <= 0 ? false : s.requoted || s.t === 31,
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const ringOffset = CIRC * (1 - t / LIFETIME);

  return (
    <div
      className="relative flex w-full max-w-[408px] flex-none flex-col gap-[18px] overflow-hidden rounded-card border border-ink/12 bg-inset p-6"
      style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,.8)" }}
    >
      {requoted && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[45%]"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(178,212,80,.28), transparent)",
            animation: "g-shimmer 1.1s ease-out both",
          }}
        />
      )}

      <div className="flex items-center justify-between">
        <span className="g-label">CARD · {sample.symbol}</span>
        <Pill size="sm" tone="lime" dot="live">
          Paper
        </Pill>
      </div>

      <div className="flex items-center gap-6">
        <div
          role="img"
          aria-label={`Card expires in ${t} seconds`}
          className="relative grid size-[124px] flex-none place-items-center"
        >
          <svg viewBox="0 0 124 124" className="absolute inset-0 size-full" aria-hidden>
            <circle cx="62" cy="62" r="54" fill="none" stroke="#1C1F23" strokeWidth="7" />
            <circle
              cx="62"
              cy="62"
              r="54"
              fill="none"
              stroke="#B2D450"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={ringOffset}
              transform="rotate(-90 62 62)"
              style={{
                transition: "stroke-dashoffset 1s linear",
                filter: "drop-shadow(0 0 6px rgba(178,212,80,.6))",
              }}
            />
          </svg>
          <span className="font-display text-[24px] font-bold tracking-[-0.04em] text-ink">
            {formatClock(t)}
          </span>
        </div>
        <div>
          <p className="g-label !text-[10px]">NET</p>
          <p className="mt-1 font-display text-[34px] leading-none font-bold tracking-[-0.04em] text-accent">
            {formatSignedBps(sample.netBps)}
          </p>
          <p className="mt-2.5 font-mono text-[12px] text-dim">bps after costs</p>
        </div>
      </div>

      <div>
        <DataRow label="Cash mid" value={`$${sample.cashMid}`} />
        <DataRow label="Token / share" value={`$${sample.tokenPerShare}`} />
        <DataRow label="Leg" value="Cash equity only" className="!border-b-0" />
      </div>

      {requoted && (
        <p className="font-mono text-[12px] text-accent" role="status">
          Re-quoted · still clears · paper fill at ${sample.cashMid}
        </p>
      )}

      <div className="flex gap-2.5">
        <button
          type="button"
          className="g-btn g-btn-primary flex-1"
          onClick={() => setState((s) => ({ ...s, requoted: true }))}
        >
          Do it
        </button>
        <button
          type="button"
          className="g-btn g-btn-secondary !px-6"
          onClick={() => setState({ t: LIFETIME, requoted: false })}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
