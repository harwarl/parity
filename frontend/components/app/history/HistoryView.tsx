"use client";

import Link from "next/link";
import { useState } from "react";
import { DERIVED, LEDGER, RULES, SESSIONS, pnl, sessionPnl, type Outcome } from "@/lib/gauge/model";
import { LEDGER_ROWS, timeline } from "@/lib/gauge/ledger";
import { formatSignedBps, formatSignedUsd } from "@/lib/format";
import { Panel } from "@/components/ui/Panel";
import { CapPips, type PipKind } from "@/components/app/ui/CapPips";
import { OutcomePill } from "@/components/app/ui/StatePill";
import { TokenBadge } from "@/components/app/ui/TokenBadge";

type Tab = "All" | "Taken" | "Skipped" | "Expired" | "Fail";
const tabOutcome: Record<Exclude<Tab, "All">, Outcome> = {
  Taken: "TAKEN",
  Skipped: "SKIPPED",
  Expired: "EXPIRED",
  Fail: "RE-QUOTE FAIL",
};
const pipOf: Record<Outcome, PipKind> = {
  TAKEN: "taken",
  SKIPPED: "skipped",
  EXPIRED: "expired",
  "RE-QUOTE FAIL": "fail",
  ACTIVE: "pending",
};
const cols = "grid-cols-[.9fr_.7fr_1fr_.8fr_.9fr_1.2fr_.8fr_.9fr]";

/** History (design.md §5B.7): KPIs, cap usage, ledger + drawer. */
export function HistoryView() {
  const [tab, setTab] = useState<Tab>("All");
  const [selectedId, setSelectedId] = useState(LEDGER_ROWS[0].id);

  const tabs: { key: Tab; count: number }[] = [
    { key: "All", count: DERIVED.total },
    { key: "Taken", count: DERIVED.taken },
    { key: "Skipped", count: DERIVED.skipped },
    { key: "Expired", count: DERIVED.expired },
    { key: "Fail", count: DERIVED.failed },
  ];
  const rows = tab === "All" ? LEDGER_ROWS : LEDGER_ROWS.filter((r) => r.outcome === tabOutcome[tab]);
  const sel = LEDGER_ROWS.find((r) => r.id === selectedId) ?? LEDGER_ROWS[0];

  const kpis = [
    { label: "Paper P&L", value: formatSignedUsd(DERIVED.pnl), sub: `${DERIVED.taken} taken cards`, lime: true },
    { label: "Hit rate", value: `${Math.round((DERIVED.positive / DERIVED.taken) * 100)}%`, sub: `${DERIVED.positive} of ${DERIVED.taken} positive` },
    { label: "Avg net @ card", value: DERIVED.avgCard.toFixed(1), sub: "bps · taken" },
    {
      label: "Avg net @ confirm",
      value: DERIVED.avgConfirm.toFixed(1),
      sub: `bps · re-quote drift ${(Math.round(DERIVED.avgConfirm * 10) / 10 - Math.round(DERIVED.avgCard * 10) / 10).toFixed(1)}`,
    },
    {
      label: "Cards",
      value: String(DERIVED.total),
      sub: `${DERIVED.taken} taken · ${DERIVED.skipped} skip · ${DERIVED.expired} exp · ${DERIVED.failed} fail`,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <Panel className="grid sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((k) => (
          <div key={k.label} className="border-b border-line-row px-[22px] py-5 lg:border-r lg:border-b-0 lg:last:border-r-0">
            <p className="app-cell-label">{k.label}</p>
            <p className={`mt-2 font-display text-[28px] leading-none font-bold tracking-[-0.04em] ${k.lime ? "text-accent" : "text-ink"}`}>
              {k.value}
            </p>
            <p className="mt-2 font-mono text-[11px] text-dim">{k.sub}</p>
          </div>
        ))}
      </Panel>

      <Panel className="grid items-center gap-x-6 gap-y-5 p-[22px] md:grid-cols-[180px_repeat(5,1fr)]">
        <div>
          <h2 className="app-ph-label">Cap usage</h2>
          <p className="mt-1 font-mono text-[11px] text-dim">cards per session · max 3</p>
        </div>
        {SESSIONS.map((s) => {
          const cards = LEDGER.filter((e) => e.session === s).map((e) => pipOf[e.outcome]);
          const pips = [...cards, ...Array<PipKind>(RULES.cap - cards.length).fill("empty")];
          const p = sessionPnl(s);
          return (
            <div key={s} role="img" aria-label={`${s}: ${cards.length} of 3 cards, ${formatSignedUsd(p)}`}>
              <div className="mb-2 flex justify-between font-mono text-[12px]">
                <span className="text-ink-2">{s}</span>
                <span className={p >= 0 ? "text-accent" : "text-neg"}>{formatSignedUsd(p)}</span>
              </div>
              <CapPips pips={pips} size={8} />
            </div>
          );
        })}
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[1fr_390px]">
        <Panel className="min-w-0">
          <div className="app-ph flex-wrap">
            <div role="group" aria-label="Filter ledger" className="flex flex-wrap rounded-full border border-ink/10 bg-bg p-1">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  aria-pressed={tab === t.key}
                  onClick={() => setTab(t.key)}
                  className={`h-8 cursor-pointer rounded-full px-3.5 text-[13px] font-semibold ${
                    tab === t.key ? "bg-ink text-accent-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {t.key} <span className="font-mono text-[11px] opacity-70">{t.count}</span>
                </button>
              ))}
            </div>
            <span className="app-meta">ILLUSTRATIVE · notional $100k</span>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <div aria-hidden className={`grid ${cols} h-[42px] items-center gap-2 border-b border-ink/5 px-[22px]`}>
                {["Session", "Time", "Name", "@card", "@confirm", "Outcome", "Captured", "P&L"].map((h, i) => (
                  <span key={h} className={`font-mono text-[10.5px] tracking-[0.14em] text-dim uppercase ${i >= 6 || i === 3 || i === 4 ? "text-right" : ""}`}>
                    {h}
                  </span>
                ))}
              </div>
              <ul>
                {rows.map((r) => {
                  const on = r.id === sel.id;
                  return (
                    <li key={r.id}>
                      <button
                        type="button"
                        aria-pressed={on}
                        aria-label={`${r.session} ${r.time} ${r.sym}, ${r.outcome}`}
                        onClick={() => setSelectedId(r.id)}
                        className={`grid w-full ${cols} h-14 cursor-pointer items-center gap-2 border-b border-ink/5 px-[22px] text-left font-mono text-[13px] transition-colors ${
                          on ? "bg-accent/7 shadow-[inset_3px_0_0_#B2D450]" : "hover:bg-ink/3"
                        }`}
                      >
                        <span className="text-ink-2">{r.session}</span>
                        <span className="text-dim">{r.time}</span>
                        <span className="flex items-center gap-2.5">
                          <TokenBadge sym={r.sym} size={28} />
                          <span className="font-body text-[14px] font-bold text-ink">{r.sym}</span>
                        </span>
                        <span className="text-right text-ink">{r.atCard.toFixed(1)}</span>
                        <span className={`text-right ${r.atConfirm != null && r.atConfirm < RULES.floor ? "text-neg" : "text-ink"}`}>
                          {r.atConfirm?.toFixed(1) ?? "—"}
                        </span>
                        <span><OutcomePill outcome={r.outcome} /></span>
                        <span className={`text-right ${r.captured == null ? "text-dim" : r.captured >= 0 ? "text-accent" : "text-neg"}`}>
                          {r.captured == null ? "—" : formatSignedBps(r.captured)}
                        </span>
                        <span className={`text-right ${r.captured == null ? "text-dim" : r.captured >= 0 ? "text-ink" : "text-neg"}`}>
                          {r.captured == null ? "—" : formatSignedUsd(pnl(r.captured))}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Panel>

        <aside aria-label="Card detail" className="self-start xl:sticky xl:top-6">
          <Panel key={sel.id} featured className="p-[22px]" style={{ animation: "j-rise .35s ease-out both" }}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] text-dim">{sel.id}</span>
              <OutcomePill outcome={sel.outcome} />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <TokenBadge sym={sel.sym} size={40} />
              <div>
                <p className="text-[18px] font-bold text-ink">{sel.sym}</p>
                <p className="font-mono text-[11px] text-dim">{sel.session} Sep · {sel.time} ET · paper</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {[
                ["@card", sel.atCard.toFixed(1)],
                ["@confirm", sel.atConfirm?.toFixed(1) ?? "—"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-inset border border-line bg-bg p-3.5">
                  <p className="app-cell-label">{k}</p>
                  <p className="mt-2 font-display text-[24px] leading-none font-bold tracking-[-0.04em] text-ink">{v}</p>
                </div>
              ))}
            </div>
            <ol className="mt-5 flex flex-col gap-3">
              {timeline(sel).map((item, i) => (
                <li key={i} className="grid grid-cols-[18px_1fr_auto] gap-2">
                  <span
                    aria-hidden
                    className="mt-[5px] size-[9px] rounded-full"
                    style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }}
                  />
                  <span className="text-[14px] text-ink-2">{item.text}</span>
                  <span className="font-mono text-[11px] text-dim">{item.time}</span>
                </li>
              ))}
            </ol>
            <div className="mt-5">
              <div className="g-row">
                <span>Captured</span>
                <span className={sel.captured == null ? "!text-dim" : sel.captured >= 0 ? "!text-accent" : "!text-neg"}>
                  {sel.captured == null ? "—" : `${formatSignedBps(sel.captured)} bps`}
                </span>
              </div>
              <div className="g-row !border-b-0">
                <span>P&L</span>
                <span>{sel.captured == null ? "—" : formatSignedUsd(pnl(sel.captured))}</span>
              </div>
            </div>
            <Link href="/dashboard/card" className="g-btn g-btn-secondary g-btn-xs mt-4 w-full">
              {sel.outcome === "ACTIVE" ? "Open active card →" : "Open audit trail →"}
            </Link>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
