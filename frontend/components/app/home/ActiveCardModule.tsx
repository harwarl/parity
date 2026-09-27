"use client";

import Link from "next/link";
import { formatSignedBps } from "@/lib/format";
import { Panel } from "@/components/ui/Panel";
import { useGauge } from "@/components/app/shell/GaugeProvider";
import { useMode } from "@/components/app/shell/ModeProvider";
import { ConfirmResultNote } from "@/components/app/card/ConfirmResultNote";
import { CountdownRing } from "@/components/app/ui/CountdownRing";
import { ModePill } from "@/components/app/ui/ModePill";
import { ScanLine } from "@/components/app/ui/ScanLine";
import { TokenBadge } from "@/components/app/ui/TokenBadge";
import { useConfirmFlow } from "@/hooks/useConfirmFlow";
import { useRules } from "@/hooks/useRules";

/**
 * Home · Active card (design.md §5B.4, §5B.12 B). The viewer's open card
 * from gauge-api (sample NVDA offline): Do it confirms (re-quote + gates
 * server-side), Skip skips. With no open card, says so.
 */
export function ActiveCardModule() {
  const { mode } = useMode();
  const { stats, history } = useGauge();
  const rules = useRules();
  const flow = useConfirmFlow();
  const { card, t, phase, result } = flow;
  // Which of today's cards this is (the next one may already have opened).
  const today = stats ? history.filter((r) => Math.floor(r.opened_at_ms / 86_400_000) === stats.day) : [];
  const cardNo =
    flow.source === "api"
      ? today.filter((r) => card && r.opened_at_ms <= card.openedAt).length || (stats?.cap.used ?? 1)
      : 2;
  const capLine = flow.source === "api" && stats ? `cap now ${stats.cap.used}/${stats.cap.limit}` : "cap now 2/3";

  if (!card) {
    return (
      <Panel className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <p className="g-eyebrow">Active card</p>
          <ModePill />
        </div>
        <div className="my-auto py-8">
          <p className="font-display text-[26px] font-bold tracking-[-0.04em] text-ink">No card.</p>
          <p className="mt-2 max-w-[340px] text-[15px] leading-relaxed text-muted">
            Gates are watching every name. A card appears here the moment one clears net ≥{" "}
            {rules.floor.toFixed(1)} bps after costs.
          </p>
          {stats && (
            <p className="mt-4 font-mono text-[12px] text-dim">
              cap {stats.cap.used}/{stats.cap.limit} today
            </p>
          )}
        </div>
      </Panel>
    );
  }

  const re = card.requote;
  return (
    <Panel featured className="relative flex flex-col gap-5 overflow-hidden p-6">
      <ScanLine />
      {flow.shimmer && (
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
        <p className="g-eyebrow">Active card · #{cardNo} today</p>
        <ModePill />
      </div>

      <div className="flex items-center gap-6">
        <CountdownRing t={t} size={132} label={phase > 0 && !result ? "HELD" : "EXPIRES"} />
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <TokenBadge sym={card.sym} />
            <div>
              <p className="text-[15px] font-bold text-ink">{card.sym}</p>
              <p className="text-[12px] text-dim">{card.name}</p>
            </div>
          </div>
          <p className="mt-3 flex items-baseline gap-2">
            <span
              className="font-display text-[44px] leading-none font-extrabold tracking-[-0.04em] text-accent"
              style={{ textShadow: "0 0 24px rgba(178,212,80,.4)" }}
            >
              {formatSignedBps(card.net)}
            </span>
            <span className="font-mono text-[12px] text-dim">net bps</span>
          </p>
          <p className="mt-2 font-mono text-[11px] leading-relaxed text-dim">
            |gap| {card.gap.toFixed(1)} − fees {card.fees.toFixed(1)} − slip {card.slip.toFixed(1)} − buffer{" "}
            {card.buffer.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="app-cell">
          <p className="app-cell-label">Cash mid</p>
          <p className="app-cell-value">${card.cash.toFixed(2)}</p>
        </div>
        <div className="app-cell">
          <p className="app-cell-label">Token / share</p>
          <p className="app-cell-value">${card.token.toFixed(2)}</p>
        </div>
        <div className="app-cell">
          <p className="app-cell-label">Leg</p>
          <p className="app-cell-value">Cash only</p>
        </div>
      </div>

      {re && phase >= 2 && !result && (
        <p className="font-mono text-[12px] leading-relaxed text-accent">
          Re-quoted · cash {re.cash.toFixed(2)} · net {re.net.toFixed(1)} bps · checking gates…
        </p>
      )}
      {result && <ConfirmResultNote result={result} live={mode === "live"} capLine={capLine} />}

      <div className="mt-auto flex flex-wrap gap-2.5">
        {result ? (
          <button type="button" className="g-btn g-btn-secondary flex-1" onClick={flow.dismiss}>
            Done
          </button>
        ) : (
          <>
            <button
              type="button"
              className="g-btn g-btn-primary flex-1 disabled:cursor-default disabled:opacity-80"
              onClick={flow.doIt}
              disabled={phase > 0}
            >
              {phase > 0 ? "Confirming…" : "Do it"}
            </button>
            <button type="button" className="g-btn g-btn-secondary" onClick={flow.skip} disabled={phase > 0}>
              Skip
            </button>
          </>
        )}
        <Link href="/dashboard/card" className="g-btn g-btn-secondary">
          Open card →
        </Link>
      </div>
    </Panel>
  );
}
