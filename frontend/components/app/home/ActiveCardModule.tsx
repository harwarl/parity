"use client";

import Link from "next/link";
import { useState } from "react";
import { ACTIVE, rowBySym } from "@/lib/gauge/model";
import { formatSignedBps } from "@/lib/format";
import { Panel } from "@/components/ui/Panel";
import { useMode } from "@/components/app/shell/ModeProvider";
import { useCardClock } from "@/components/app/shell/CountdownProvider";
import { CountdownRing } from "@/components/app/ui/CountdownRing";
import { ModePill } from "@/components/app/ui/ModePill";
import { ScanLine } from "@/components/app/ui/ScanLine";
import { TokenBadge } from "@/components/app/ui/TokenBadge";

/** Home · Active card (design.md §5B.4, §5B.12 B). Do it shows the re-quote; Skip resets to 75. */
export function ActiveCardModule() {
  const row = rowBySym(ACTIVE.sym);
  const { mode } = useMode();
  const { t, reset } = useCardClock();
  const [requoted, setRequoted] = useState(false);

  return (
    <Panel featured className="relative flex flex-col gap-5 overflow-hidden p-6">
      <ScanLine />
      {requoted && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[45%]"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(178,212,80,.25), transparent)",
            animation: "g-shimmer 1.1s ease-out both",
          }}
        />
      )}

      <div className="flex items-center justify-between">
        <p className="g-eyebrow">Active card · #2 today</p>
        <ModePill />
      </div>

      <div className="flex items-center gap-6">
        <CountdownRing t={t} size={132} label="EXPIRES" />
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <TokenBadge sym={row.sym} />
            <div>
              <p className="text-[15px] font-bold text-ink">{row.sym}</p>
              <p className="text-[12px] text-dim">{row.name}</p>
            </div>
          </div>
          <p className="mt-3 flex items-baseline gap-2">
            <span
              className="font-display text-[44px] leading-none font-extrabold tracking-[-0.04em] text-accent"
              style={{ textShadow: "0 0 24px rgba(178,212,80,.4)" }}
            >
              {formatSignedBps(row.net)}
            </span>
            <span className="font-mono text-[12px] text-dim">net bps</span>
          </p>
          <p className="mt-2 font-mono text-[11px] leading-relaxed text-dim">
            |gap| {row.absGap.toFixed(1)} − fees 3.5 − slip {row.slip.toFixed(1)} − buffer 2.0
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="app-cell">
          <p className="app-cell-label">Cash mid</p>
          <p className="app-cell-value">${row.cash.toFixed(2)}</p>
        </div>
        <div className="app-cell">
          <p className="app-cell-label">Token / share</p>
          <p className="app-cell-value">${row.token.toFixed(2)}</p>
        </div>
        <div className="app-cell">
          <p className="app-cell-label">Leg</p>
          <p className="app-cell-value">Cash only</p>
        </div>
      </div>

      {requoted && (
        <p role="status" className="font-mono text-[12px] leading-relaxed text-accent">
          Re-quoted · cash {ACTIVE.requote.cash.toFixed(2)} · net {ACTIVE.requote.net} bps · still clears ·{" "}
          {mode === "live" ? "order sent via Trading MCP" : `paper fill at $${ACTIVE.requote.cash.toFixed(2)}`}
        </p>
      )}

      <div className="mt-auto flex flex-wrap gap-2.5">
        <button type="button" className="g-btn g-btn-primary flex-1" onClick={() => setRequoted(true)}>
          Do it
        </button>
        <button
          type="button"
          className="g-btn g-btn-secondary"
          onClick={() => {
            reset();
            setRequoted(false);
          }}
        >
          Skip
        </button>
        <Link href="/dashboard/card" className="g-btn g-btn-secondary">
          Open card →
        </Link>
      </div>
    </Panel>
  );
}
