"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { RULES, stateCounts, type GateState } from "@/lib/gauge/model";
import { formatBps, formatSignedBps } from "@/lib/format";
import { Panel } from "@/components/ui/Panel";
import { useLive } from "@/components/app/shell/LiveMarketProvider";
import { LiveNum } from "@/components/app/ui/LiveNum";
import { RailIcon } from "@/components/app/shell/RailIcon";
import { netColor } from "@/components/app/ui/Sparkline";
import { StatePill, stateHex } from "@/components/app/ui/StatePill";
import { TokenBadge } from "@/components/app/ui/TokenBadge";
import { DetailPanel } from "./DetailPanel";

type Filter = "ALL" | Exclude<GateState, "CLOSED">;
type Sort = "Net" | "Gap" | "Depth" | "A–Z";

const cols = "grid-cols-[1.5fr_.9fr_.9fr_.7fr_.55fr_.55fr_.6fr_.7fr_.7fr_.5fr_92px]";
const heads = ["Name", "Cash", "Token/sh", "Gap", "Fees", "Slip", "Buffer", "Net", "Depth", "Age", "State"];

/** Watchlist (design.md §5B.5): filter rail, search + sort, table, detail. */
export function WatchlistView() {
  const { rows: ROWS, latency } = useLive();
  const counts = stateCounts(ROWS);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [sort, setSort] = useState<Sort>("Net");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("NVDA");
  const searchRef = useRef<HTMLInputElement>(null);

  // Rail search and ⌘K land on #search.
  useEffect(() => {
    const focus = () => window.location.hash === "#search" && searchRef.current?.focus();
    focus();
    window.addEventListener("hashchange", focus);
    return () => window.removeEventListener("hashchange", focus);
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = ROWS.filter(
      (r) =>
        (filter === "ALL" || r.state === filter) &&
        (!q || r.sym.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)),
    );
    const by: Record<Sort, (a: (typeof ROWS)[number], b: (typeof ROWS)[number]) => number> = {
      Net: (a, b) => b.net - a.net,
      Gap: (a, b) => b.absGap - a.absGap,
      Depth: (a, b) => b.depth - a.depth,
      "A–Z": (a, b) => a.sym.localeCompare(b.sym),
    };
    return [...list].sort(by[sort]);
  }, [ROWS, filter, sort, query]);

  const filters: { key: Filter; label: string; count: number; color: string }[] = [
    { key: "ALL", label: "All names", count: ROWS.length, color: "#F9F7F4" },
    { key: "CARD", label: "Card", count: counts.CARD, color: stateHex("CARD") },
    { key: "THIN", label: "Thin", count: counts.THIN, color: stateHex("THIN") },
    { key: "STALE", label: "Stale", count: counts.STALE, color: stateHex("STALE") },
    { key: "DUST", label: "Dust", count: counts.DUST, color: stateHex("DUST") },
  ];
  const title = `${filter === "ALL" ? "All names" : filter} · ${rows.length}`;
  const current = ROWS.find((r) => r.sym === selected) ?? ROWS[0];

  return (
    <div className="app-rows grid gap-5 lg:grid-cols-[236px_1fr]">
      <aside className="self-start lg:sticky lg:top-6">
        <Panel className="flex flex-col gap-6 p-5">
          <section aria-labelledby="f-state">
            <h2 id="f-state" className="app-cell-label">State</h2>
            <p className="mt-1 mb-3 text-[12px] text-dim">which gate stopped it</p>
            <div role="group" aria-label="Filter by state" className="flex flex-col gap-1.5">
              {filters.map((f) => {
                const on = filter === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFilter(f.key)}
                    className={`flex h-10 cursor-pointer items-center gap-2.5 rounded-xl px-3 text-left text-[14px] text-ink-2 transition-colors ${
                      on ? "bg-accent/10 shadow-[inset_0_0_0_1px_rgba(178,212,80,.3)]" : "hover:bg-ink/5"
                    }`}
                  >
                    <span aria-hidden className="size-[7px] rounded-full" style={{ background: f.color }} />
                    <span className="flex-1">{f.label}</span>
                    <span className="font-mono text-[12px] text-dim">{f.count}</span>
                  </button>
                );
              })}
            </div>
          </section>
          <section aria-labelledby="f-rules">
            <div className="flex items-baseline justify-between">
              <h2 id="f-rules" className="app-cell-label">Rules</h2>
              <Link href="/dashboard/settings#gates" className="text-[12px] text-accent hover:text-accent-hover">
                edit in Settings
              </Link>
            </div>
            <dl className="mt-2 font-mono text-[12px]">
              {[
                ["Net floor", `${RULES.floor.toFixed(1)} bps`],
                ["Fees", `${RULES.fees.toFixed(1)} bps`],
                ["Buffer", `${RULES.buffer.toFixed(1)} bps`],
                ["Min depth", `$${RULES.minDepth}k`],
                ["Max age", `${RULES.maxAge.toFixed(1)} s`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-line-row py-2 last:border-b-0">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section aria-labelledby="f-feeds">
            <h2 id="f-feeds" className="app-cell-label">Feeds</h2>
            <dl className="mt-2 font-mono text-[12px]">
              {[
                ["Cash · Robinhood", `${latency.quotes} ms`],
                ["Token · Chainlink", `${latency.chainlink} s hb`],
                ["SSE", `${latency.sse} ms`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-line-row py-2 last:border-b-0">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-accent">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
          <Link href="/dashboard/settings#watchlist" className="g-btn g-btn-secondary g-btn-xs w-full">
            + Add name
          </Link>
        </Panel>
      </aside>

      <div className="flex min-w-0 flex-col gap-5">
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative flex h-[46px] min-w-[240px] flex-1 items-center rounded-full border border-ink/14 bg-panel px-4 text-dim focus-within:border-accent/60">
            <span className="sr-only">Search names</span>
            <RailIcon name="search" size={16} />
            <input
              id="search"
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${ROWS.length} names`}
              className="h-full flex-1 bg-transparent pl-3 text-[15px] text-ink outline-none placeholder:text-dim"
            />
          </label>
          <div role="group" aria-label="Sort" className="flex rounded-full border border-ink/10 bg-bg p-1">
            {(["Net", "Gap", "Depth", "A–Z"] as Sort[]).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={sort === s}
                onClick={() => setSort(s)}
                className={`h-8 cursor-pointer rounded-full px-3.5 text-[13px] font-semibold ${
                  sort === s ? "bg-ink text-accent-ink" : "text-muted hover:text-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Panel>
          <div className="app-ph">
            <h2 className="app-ph-label" aria-live="polite">{title}</h2>
            <span className="app-meta">click a row for detail · ILLUSTRATIVE</span>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[980px]">
              <div aria-hidden className={`grid ${cols} h-[42px] items-center gap-2 border-b border-ink/5 px-[22px]`}>
                {heads.map((h, i) => (
                  <span key={h} className={`font-mono text-[10.5px] tracking-[0.14em] text-dim uppercase ${i ? "text-right" : ""}`}>
                    {h}
                  </span>
                ))}
              </div>
              {rows.length === 0 && (
                <p className="px-[22px] py-10 text-center text-[14px] text-muted">
                  No names match &ldquo;{query}&rdquo;. Clear the search or pick another state.
                </p>
              )}
              <ul>
                {rows.map((r) => {
                  const on = r.sym === selected;
                  return (
                    <li key={r.sym}>
                      <button
                        type="button"
                        aria-pressed={on}
                        aria-label={`${r.sym}, ${r.name}, net ${formatBps(r.net)} bps, ${r.state}`}
                        onClick={() => setSelected(r.sym)}
                        className={`grid w-full ${cols} h-[58px] cursor-pointer items-center gap-2 border-b border-ink/5 px-[22px] text-left font-mono text-[13px] transition-colors ${
                          on ? "bg-accent/7 shadow-[inset_3px_0_0_#B2D450]" : "hover:bg-ink/3"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <TokenBadge sym={r.sym} />
                          <span>
                            <span className="block font-body text-[14px] font-bold text-ink">{r.sym}</span>
                            <span className="block font-body text-[12px] text-dim">{r.name}</span>
                          </span>
                        </span>
                        <span className="text-right text-ink"><LiveNum value={+r.cash.toFixed(2)} text={r.cash.toFixed(2)} /></span>
                        <span className="text-right text-ink-2"><LiveNum value={+r.token.toFixed(2)} text={r.token.toFixed(2)} /></span>
                        <span className="text-right text-ink"><LiveNum value={+r.absGap.toFixed(1)} text={formatSignedBps(r.gap)} /></span>
                        <span className="text-right text-neg">{formatBps(-RULES.fees)}</span>
                        <span className="text-right text-neg">{formatBps(-r.slip)}</span>
                        <span className="text-right text-neg">{formatBps(-RULES.buffer)}</span>
                        <span className="text-right" style={{ color: netColor(r) }}><LiveNum value={+r.net.toFixed(1)} text={formatSignedBps(r.net)} /></span>
                        <span className={`text-right ${r.depth < RULES.minDepth ? "text-thin" : "text-ink"}`}><LiveNum value={r.depth} text={`$${r.depth}k`} /></span>
                        <span className={`text-right ${r.age > RULES.maxAge ? "text-neg" : "text-ink"}`}>{r.age.toFixed(1)}s</span>
                        <span className="flex justify-end"><StatePill state={r.state} /></span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Panel>

        <DetailPanel key={current.sym} row={current} />
      </div>
    </div>
  );
}
