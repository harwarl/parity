"use client";

import Link from "next/link";
import { etClock, shortCardId } from "@/lib/gauge/adapt";
import { formatSignedBps } from "@/lib/format";
import { Panel } from "@/components/ui/Panel";
import { useMode } from "@/components/app/shell/ModeProvider";
import { useGauge } from "@/components/app/shell/GaugeProvider";
import { useConfirmFlow } from "@/hooks/useConfirmFlow";
import { useRules } from "@/hooks/useRules";
import { ConfirmResultNote } from "./ConfirmResultNote";
import { CountdownRing } from "@/components/app/ui/CountdownRing";
import { ModePill } from "@/components/app/ui/ModePill";
import { PanelHead } from "@/components/app/ui/PanelHead";
import { ScanLine } from "@/components/app/ui/ScanLine";
import { TokenBadge } from "@/components/app/ui/TokenBadge";
import { BothLegsChart } from "./BothLegsChart";
import { HaircutWaterfall } from "./HaircutWaterfall";

/** Active card (design.md §5B.6, J5–J8), from gauge-api (sample offline). */
export function CardView() {
  const { mode } = useMode();
  const { stats, user } = useGauge();
  const rules = useRules();
  const notional = user?.rules.paper_notional_usd ?? 100_000;
  const live = mode === "live";
  const flow = useConfirmFlow();
  const { card, t, phase, result, shimmer } = flow;
  const apiMode = flow.source === "api";

  if (!card) {
    return (
      <Panel className="flex flex-col items-start gap-3 p-10">
        <p className="g-eyebrow">No open card</p>
        <p className="font-display text-[32px] font-bold tracking-[-0.04em] text-ink">Nothing to confirm right now.</p>
        <p className="max-w-[520px] text-[15px] leading-relaxed text-muted">
          A card opens when a name clears all four gates under your rules (net ≥ {rules.floor.toFixed(1)} bps,
          depth ≥ ${rules.minDepth}k, quotes ≤ {rules.maxAge.toFixed(1)} s, regular hours). It lives for 75 seconds.
        </p>
        <Link href="/dashboard/history" className="g-btn g-btn-secondary g-btn-xs mt-2">
          See History →
        </Link>
      </Panel>
    );
  }

  const re = card.requote;
  const failed = result !== null && result.kind !== "filled" && result.kind !== "sent";
  const shownNet = phase >= 2 && re ? re.net : card.net;
  const shownCash = phase >= 2 && re ? re.cash : card.cash;
  const capLine = apiMode && stats ? `cap now ${stats.cap.used}/${stats.cap.limit}` : "cap now 2/3";
  const et = (ms: number) => `${etClock(ms)}.${String(ms % 1000).padStart(3, "0")}`;

  const steps = [
    { name: "You tap Do it", meta: re ? et(re.at) : "now" },
    { name: "Re-quote both legs", meta: re ? `cash ${re.cash.toFixed(2)} · token ${re.token.toFixed(2)}` : "re-quoting…" },
    {
      name: "Re-check 4 gates",
      meta: re ? `net ${re.net.toFixed(1)} ${re.net >= rules.floor ? "≥" : "<"} ${rules.floor.toFixed(1)}` : "…",
    },
    live
      ? { name: "Send order · Trading MCP", meta: "one cash-equity order" }
      : { name: "Paper fill at confirm mid", meta: re ? `$${re.cash.toFixed(2)} · no money moves` : "—" },
  ];
  // The step a failed confirm stopped at is drawn with a ✕.
  const failAt = failed ? Math.max(phase, 1) : null;
  const stepStatus = (k: number) =>
    failAt !== null
      ? k < failAt
        ? "done"
        : k === failAt
          ? "fail"
          : "wait"
      : phase === 4 || phase > k
        ? "done"
        : phase === k
          ? "now"
          : "wait";

  const audit = [
    { time: et(card.openedAt), kind: "FEED", color: "#80848A", msg: `cash mid ${card.cash.toFixed(2)} · token/share ${card.token.toFixed(2)}`, value: `age ${card.ageS.toFixed(1)} s` },
    { time: et(card.openedAt), kind: "GAP", color: "#C9CBCF", msg: `|gap| ${card.gap.toFixed(1)} bps`, value: "" },
    {
      time: et(card.openedAt),
      kind: "HAIRCUT",
      color: "#FF6B5E",
      msg: `fees ${card.fees.toFixed(1)} · slip ${card.slip.toFixed(1)} · buffer ${card.buffer.toFixed(1)}`,
      value: `−${(card.fees + card.slip + card.buffer).toFixed(1)}`,
    },
    { time: et(card.openedAt), kind: "GATES", color: "#B2D450", msg: `net ${card.net.toFixed(1)} ≥ ${rules.floor.toFixed(1)} · RTH · $${card.depthK}k ≥ $${rules.minDepth}k`, value: "4/4" },
    { time: et(card.openedAt), kind: "CARD", color: "#B2D450", msg: `emitted ${shortCardId(card.id)} · expires ${etClock(card.expiresAt)}`, value: "75 s" },
    ...(re
      ? [{ time: et(re.at), kind: "RE-QUOTE", color: re.net >= rules.floor ? "#B2D450" : "#FF6B5E", msg: `cash ${re.cash.toFixed(2)} · token ${re.token.toFixed(2)} · net ${re.net.toFixed(1)}`, value: result ? (failed ? "fail" : "clears") : "…" }]
      : []),
    {
      time: "now",
      kind: "NOW",
      color: "#F9F7F4",
      msg: result ? (failed ? "closed · nothing placed" : "done") : phase > 0 ? "confirm in progress" : "awaiting your tap",
      value: result ? "" : `${t} s left`,
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
    <div className="app-rows flex flex-col gap-5">
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
              <TokenBadge sym={card.sym} size={40} />
              <div>
                <p className="text-[17px] font-bold text-ink">{card.sym}</p>
                <p className="text-[13px] text-dim">{card.name}</p>
              </div>
            </div>
            <ModePill />
          </div>

          <div className="flex flex-wrap items-center gap-7">
            <CountdownRing t={t} size={200} label={phase > 0 && !result ? "HELD · CONFIRMING" : "UNTIL EXPIRY"} />
            <div>
              <p className="app-cell-label">Net after costs</p>
              <p className="mt-2 flex items-baseline gap-2">
                <span
                  className="font-display text-[64px] leading-none font-extrabold tracking-[-0.05em] text-accent"
                  style={{ textShadow: "0 0 30px rgba(178,212,80,.4)" }}
                >
                  {formatSignedBps(shownNet)}
                </span>
                <span className="font-mono text-[13px] text-dim">bps</span>
              </p>
              <p className="mt-3 font-mono text-[12px] text-dim">
                floor {rules.floor.toFixed(1)} · headroom{" "}
                <span className={shownNet >= rules.floor ? "text-accent" : "text-neg"}>{formatSignedBps(shownNet - rules.floor)} bps</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {[
              ["Cash mid", `$${shownCash.toFixed(2)}`],
              ["Token / share", `$${(phase >= 2 && re ? re.token : card.token).toFixed(2)}`],
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
                        : st === "fail"
                          ? "border border-neg/60 bg-neg/15 text-neg"
                        : st === "now"
                          ? "border-[1.5px] border-accent text-accent shadow-[0_0_12px_rgba(178,212,80,.7)]"
                          : "border border-ink/18 text-dim"
                    }`}
                  >
                    {st === "done" ? "✓" : st === "fail" ? "✕" : st === "now" ? "•" : k}
                  </span>
                  <span className={`flex-1 text-[14px] ${st === "wait" ? "text-muted" : "text-ink"}`}>{s.name}</span>
                  <span className="text-right font-mono text-[11px] text-dim">{phase >= k || st === "fail" ? s.meta : "—"}</span>
                </li>
              );
            })}
          </ol>

          {result && <ConfirmResultNote result={result} live={live} capLine={capLine} />}

          <div className="flex gap-2.5">
            {result ? (
              <button type="button" onClick={flow.dismiss} className="g-btn g-btn-secondary flex-1">
                Done
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={flow.doIt}
                  disabled={phase > 0}
                  aria-disabled={phase > 0}
                  className="g-btn g-btn-primary flex-1 disabled:cursor-default disabled:opacity-80"
                >
                  {phase === 0 ? "Do it" : "Confirming…"}
                </button>
                <button type="button" onClick={flow.skip} disabled={phase > 0} className="g-btn g-btn-secondary">
                  Skip
                </button>
              </>
            )}
          </div>
          <p className="text-[13px] leading-relaxed text-dim">
            The model does not place. Do it re-quotes both legs and re-checks every gate. If net falls under{" "}
            {rules.floor.toFixed(1)} bps, nothing happens.
          </p>
        </Panel>

        <div className="flex min-w-0 flex-col gap-5">
          {!apiMode && <BothLegsChart />}
          <HaircutWaterfall gap={card.gap} fees={card.fees} slip={card.slip} buffer={card.buffer} floor={rules.floor} />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[7fr_5fr]">
        <Panel className="min-w-0">
          <PanelHead label={`Audit trail · ${shortCardId(card.id)}`} meta={<span className="app-meta">immutable · exported with History</span>} />
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
              <span className={live ? "!text-thin" : ""}>{live ? "[ORDER_SIZE]" : `$${(apiMode ? notional : 100_000).toLocaleString("en-US")} notional · paper`}</span>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
