"use client";

import { useEffect, useRef, useState } from "react";
import { ACTIVE, RULES, rowBySym } from "@/lib/gauge/model";
import { formatSignedBps } from "@/lib/format";
import { Panel } from "@/components/ui/Panel";
import { useMode } from "@/components/app/shell/ModeProvider";
import { useCountdown } from "@/hooks/useCountdown";
import { CountdownRing } from "@/components/app/ui/CountdownRing";
import { ModePill } from "@/components/app/ui/ModePill";
import { PanelHead } from "@/components/app/ui/PanelHead";
import { ScanLine } from "@/components/app/ui/ScanLine";
import { TokenBadge } from "@/components/app/ui/TokenBadge";
import { BothLegsChart } from "./BothLegsChart";
import { HaircutWaterfall } from "./HaircutWaterfall";

type Phase = 0 | 1 | 2 | 3 | 4;

/** Active card (design.md §5B.6, J5–J8). */
export function CardView() {
  const row = rowBySym(ACTIVE.sym);
  const { mode } = useMode();
  const live = mode === "live";
  const [phase, setPhase] = useState<Phase>(0);
  const [shimmer, setShimmer] = useState(false);
  const { t, reset } = useCountdown(phase > 0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // J6 · tap → re-quote (shimmer) → gate re-check → fill.
  const run = () => {
    if (phase > 0) return;
    setPhase(1);
    setShimmer(false);
    timers.current = [
      setTimeout(() => {
        setPhase(2);
        setShimmer(true);
      }, 700),
      setTimeout(() => setPhase(3), 1400),
      setTimeout(() => setPhase(4), 2100),
    ];
  };
  const skip = () => {
    timers.current.forEach(clearTimeout);
    setPhase(0);
    setShimmer(false);
    reset();
  };

  const requoted = phase >= 2;
  const net = requoted ? ACTIVE.requote.net : row.net;
  const cash = requoted ? ACTIVE.requote.cash : row.cash;

  const steps = [
    { name: "You tap Do it", meta: "14:02:41.090" },
    { name: "Re-quote both legs", meta: `cash ${ACTIVE.requote.cash.toFixed(2)} · token ${ACTIVE.requote.token.toFixed(2)}` },
    { name: "Re-check 4 gates", meta: `net ${ACTIVE.requote.net} ≥ 2.0 · RTH · $${row.depth}k · 1/3` },
    live
      ? { name: "Send order · Trading MCP", meta: "one cash-equity order" }
      : { name: "Paper fill at confirm mid", meta: `$${ACTIVE.requote.cash.toFixed(2)} · no money moves` },
  ];
  const stepStatus = (k: number) => (phase === 4 || phase > k ? "done" : phase === k ? "now" : "wait");

  const audit = [
    { time: "14:02:18.180", kind: "FEED", color: "#80848A", msg: "cash mid 182.40 · Robinhood quotes", value: "age 0.3 s" },
    { time: "14:02:18.201", kind: "FEED", color: "#80848A", msg: "token/share 182.71 · Chainlink", value: "hb 1.1 s" },
    { time: "14:02:18.244", kind: "GAP", color: "#C9CBCF", msg: "|gap| 17.0 bps · token rich", value: "" },
    { time: "14:02:18.245", kind: "HAIRCUT", color: "#FF6B5E", msg: "fees 3.5 · slip 2.1 · buffer 2.0", value: "−7.6" },
    { time: "14:02:18.246", kind: "GATES", color: "#B2D450", msg: "net 9.4 ≥ 2.0 · RTH · $420k ≥ $100k · 1/3", value: "4/4" },
    { time: "14:02:18.412", kind: "CARD", color: "#B2D450", msg: `emitted ${ACTIVE.id} · expires ${ACTIVE.expires}`, value: "75 s" },
    { time: "14:02:18.460", kind: "SSE", color: "#80848A", msg: "pushed to 1 client", value: "48 ms" },
    {
      time: "14:02:41.000",
      kind: "NOW",
      color: "#F9F7F4",
      msg: phase > 0 ? "confirm in progress" : "awaiting your tap",
      value: `${t} s left`,
    },
  ];

  const onDoIt = [
    { head: "Hold the clock", body: "The countdown freezes while GAUGE confirms. No double taps." },
    { head: "Re-quote", body: "Fresh cash mid and token/share. The card numbers are never reused." },
    { head: "Re-check gates", body: "All four gates again, on the new prices. One fail and nothing happens." },
    live
      ? { head: "One order", body: "One cash-equity order via the official Robinhood Trading MCP, Agentic Account only." }
      : { head: "Paper fill", body: "Recorded at the confirm mid. No broker, no money." },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 xl:grid-cols-[5fr_7fr]">
        <Panel featured className="relative flex min-w-0 flex-col gap-6 overflow-hidden p-7 max-sm:p-5">
          <ScanLine />
          {shimmer && (
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
            <div className="flex items-center gap-3">
              <TokenBadge sym={row.sym} size={40} />
              <div>
                <p className="text-[17px] font-bold text-ink">{row.sym}</p>
                <p className="text-[13px] text-dim">{row.name} · token rich</p>
              </div>
            </div>
            <ModePill />
          </div>

          <div className="flex flex-wrap items-center gap-7">
            <CountdownRing t={t} size={200} label={phase > 0 ? "HELD · CONFIRMING" : "UNTIL EXPIRY"} />
            <div>
              <p className="app-cell-label">Net after costs</p>
              <p className="mt-2 flex items-baseline gap-2">
                <span
                  className="font-display text-[64px] leading-none font-extrabold tracking-[-0.05em] text-accent"
                  style={{ textShadow: "0 0 30px rgba(178,212,80,.4)" }}
                >
                  {formatSignedBps(net)}
                </span>
                <span className="font-mono text-[13px] text-dim">bps</span>
              </p>
              <p className="mt-3 font-mono text-[12px] text-dim">
                floor 2.0 · headroom <span className="text-accent">{formatSignedBps(net - RULES.floor)} bps</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {[
              ["Cash mid", `$${cash.toFixed(2)}`],
              ["Token / share", `$${row.token.toFixed(2)}`],
              ["Leg", "Cash only"],
            ].map(([k, v]) => (
              <div key={k} className="app-cell !px-4 !py-3.5">
                <p className="app-cell-label">{k}</p>
                <p className="app-cell-value !text-[17px]">{v}</p>
              </div>
            ))}
          </div>

          <ol aria-label="Confirm flow" className="flex flex-col gap-3">
            {steps.map((s, i) => {
              const k = i + 1;
              const st = stepStatus(k);
              return (
                <li key={s.name} className="flex items-center gap-3">
                  <span
                    className={`grid size-[22px] flex-none place-items-center rounded-full font-mono text-[11px] ${
                      st === "done"
                        ? "border border-accent/60 bg-accent/15 text-accent"
                        : st === "now"
                          ? "border-[1.5px] border-accent text-accent shadow-[0_0_12px_rgba(178,212,80,.7)]"
                          : "border border-ink/18 text-dim"
                    }`}
                  >
                    {st === "done" ? "✓" : st === "now" ? "•" : k}
                  </span>
                  <span className={`flex-1 text-[14px] ${st === "wait" ? "text-muted" : "text-ink"}`}>{s.name}</span>
                  <span className="text-right font-mono text-[11px] text-dim">{phase >= k ? s.meta : "—"}</span>
                </li>
              );
            })}
          </ol>

          {phase === 4 && (
            <p role="status" className="rounded-inset border border-accent/35 bg-accent/8 px-4 py-3 text-[14px] text-ink">
              {live
                ? "Order sent to your Agentic Account through the Robinhood Trading MCP · cap now 2/3."
                : `Paper fill recorded at $${ACTIVE.requote.cash.toFixed(2)} · cap now 2/3 · see History.`}
            </p>
          )}

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={run}
              disabled={phase > 0}
              aria-disabled={phase > 0}
              className="g-btn g-btn-primary flex-1 disabled:cursor-default disabled:opacity-80"
            >
              {phase === 0 ? "Do it" : phase === 4 ? "Done" : "Confirming…"}
            </button>
            <button type="button" onClick={skip} className="g-btn g-btn-secondary">
              Skip
            </button>
          </div>
          <p className="text-[13px] leading-relaxed text-dim">
            The model does not place. Do it re-quotes both legs and re-checks every gate. If net falls under 2.0 bps,
            nothing happens.
          </p>
        </Panel>

        <div className="flex min-w-0 flex-col gap-5">
          <BothLegsChart />
          <HaircutWaterfall />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[7fr_5fr]">
        <Panel className="min-w-0">
          <PanelHead label={`Audit trail · ${ACTIVE.id}`} meta={<span className="app-meta">immutable · exported with History</span>} />
          <div className="overflow-x-auto">
            <ol className="min-w-[640px] px-[22px] pb-2">
              {audit.map((a, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[110px_92px_1fr_auto] gap-3 border-b border-ink/5 py-[11px] font-mono text-[12px] last:border-b-0"
                >
                  <span className="text-dim">{a.time}</span>
                  <span style={{ color: a.color }}>{a.kind}</span>
                  <span className="text-ink-2">{a.msg}</span>
                  <span className="text-right text-ink">{a.value}</span>
                </li>
              ))}
            </ol>
          </div>
        </Panel>

        <Panel className="flex min-w-0 flex-col">
          <PanelHead label={`On Do it · ${live ? "Live" : "Paper"}`} />
          <ol className="flex flex-col gap-4 px-[22px] pt-5">
            {onDoIt.map((s, i) => (
              <li key={s.head} className="grid grid-cols-[32px_1fr] gap-2">
                <span className="font-mono text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block text-[15px] font-semibold text-ink">{s.head}</span>
                  <span className="block text-[14px] leading-relaxed text-muted">{s.body}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-auto px-[22px] pt-5 pb-4">
            <div className="g-row !border-b-0 border-t border-line-row">
              <span>Size</span>
              <span className={live ? "!text-thin" : ""}>{live ? "[ORDER_SIZE]" : "$100,000 notional · paper"}</span>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
