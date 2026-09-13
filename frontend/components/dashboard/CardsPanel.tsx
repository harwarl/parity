"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CashTokenChart from "@/components/dashboard/CashTokenChart";
import SignalCard from "@/components/dashboard/SignalCard";
import Icon from "@/components/ui/Icon";
import { fmtNet, SESSION_LABEL } from "@/lib/parity/format";
import { ROW_HAIRCUT } from "@/lib/parity/universe";
import { useLiveTape } from "@/hooks/useLiveTape";

const TAB_SYMBOLS = ["GOOGL", "HOOD", "AAPL", "TSLA", "NVDA"];

const REJECT_CODES = [
  {
    code: "STALE",
    when: "The cash/chain join blew its 8–15s budget. No trusted basis to quote.",
  },
  {
    code: "CLOSED",
    when: "Cash is not in RTH. The equity leg cannot trade, so no live card.",
  },
  {
    code: "THIN",
    when: "Book depth cannot fill the clip without moving price past the buffer.",
  },
  {
    code: "DUST",
    when: "Net is real but too small to matter after the haircut. Not worth the tap.",
  },
] as const;

const RECENT = [
  {
    time: "10:14",
    symbol: "AAPL",
    net: "+42 bps",
    status: "Ready",
    tone: "green" as const,
  },
  {
    time: "09:47",
    symbol: "TSLA",
    net: "+36 bps",
    status: "Executed (Paper)",
    tone: "dim" as const,
  },
  {
    time: "08:12",
    symbol: "NVDA",
    net: "—",
    status: "HALT",
    tone: "halt" as const,
  },
  {
    time: "Jun 24",
    symbol: "AMZN",
    net: "—",
    status: "THIN",
    tone: "halt" as const,
  },
  {
    time: "Jun 24",
    symbol: "META",
    net: "+18 bps",
    status: "DUST",
    tone: "halt" as const,
  },
  {
    time: "Jun 23",
    symbol: "MSFT",
    net: "+27 bps",
    status: "Executed (Paper)",
    tone: "dim" as const,
  },
];

function PanelTitle({
  children,
  info = false,
}: {
  children: string;
  info?: boolean;
}) {
  return (
    <p className="flex items-center gap-1.5 text-[0.95rem] font-medium text-text">
      {children}
      {info ? <Icon name="info" size={13} className="text-text-mute" /> : null}
    </p>
  );
}

export default function CardsPanel() {
  const { rows } = useLiveTape(1800);
  const [selected, setSelected] = useState(TAB_SYMBOLS[0]);
  const [query, setQuery] = useState("");

  const row = rows.find((r) => r.symbol === selected) ?? rows[0];
  const dead = row.state === "halt" || row.state === "stale";
  const tradable = row.state === "rth" && row.netBps > 0;

  const suggestions = useMemo(() => {
    const q = query.trim().toUpperCase();
    if (!q) return [];
    return rows
      .filter((r) => r.symbol.includes(q) && r.symbol !== selected)
      .slice(0, 5);
  }, [query, rows, selected]);

  return (
    <div className="space-y-6">
      {/* card + chart */}
      <div className="grid gap-6 lg:grid-cols-10 lg:items-stretch">
        <div className="lg:col-span-4">
          <SignalCard key={row.symbol} row={row} />
        </div>

        <div className="flex h-full min-w-0 flex-col rounded-2xl border border-line bg-surface p-5 sm:p-6 lg:col-span-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-1">
              {TAB_SYMBOLS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSelected(s);
                    setQuery("");
                  }}
                  aria-pressed={selected === s}
                  className={`rounded-md border px-3 py-1.5 text-[0.82rem] transition-colors ${
                    selected === s
                      ? "border-line-strong bg-surface-2 text-text"
                      : "border-transparent text-text-dim hover:border-line hover:text-text"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="relative ml-auto">
              <Icon
                name="search"
                size={13}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-mute"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a symbol…"
                className="h-9 w-44 rounded-md border border-line-strong bg-surface pl-8 pr-3 text-[0.82rem] text-text placeholder:text-text-mute focus:border-text-mute focus:outline-none"
              />
              {suggestions.length > 0 ? (
                <div className="absolute right-0 top-full z-10 mt-1.5 w-44 overflow-hidden rounded-md border border-line-strong bg-surface-2">
                  {suggestions.map((r) => (
                    <button
                      key={r.symbol}
                      type="button"
                      onClick={() => {
                        setSelected(r.symbol);
                        setQuery("");
                      }}
                      className="block w-full px-3 py-2 text-left text-[0.8rem] text-text-dim transition-colors hover:bg-surface hover:text-text"
                    >
                      {r.symbol}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-5">
            <CashTokenChart row={row} />
          </div>
        </div>
      </div>

      {/* explainers — three columns of equal height; the middle column's two
          stacked panels grow to fill the same height as the other two */}
      <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
        <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <PanelTitle info>Why a signal did or didn&apos;t trigger</PanelTitle>
          <ul className="mt-5 space-y-3.5">
            <ChecklistItem
              pass={!dead}
              label="Cash market session"
              value={dead ? row.state.toUpperCase() : SESSION_LABEL[row.state]}
            />
            <ChecklistItem
              pass={tradable}
              label="Net edge after costs"
              value={
                dead ? "—" : `${fmtNet(row.netBps)} ${tradable ? "≥ 0" : "< 0"}`
              }
            />
            <ChecklistItem pass label="Sufficient depth" value="1.2M shares" />
            <ChecklistItem pass label="Daily cap" value="1 / 3 used" />
          </ul>

          <div className="mt-5 space-y-3 border-t border-line pt-5">
            {REJECT_CODES.map((c) => {
              const live =
                (c.code === "STALE" && row.state === "stale") ||
                (c.code === "CLOSED" &&
                  row.state !== "rth" &&
                  row.state !== "stale" &&
                  row.state !== "halt") ||
                (c.code === "DUST" && !tradable && !dead);
              return (
                <div key={c.code} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full ${
                      live
                        ? "bg-halt/25 text-halt"
                        : "bg-surface-2 text-text-mute"
                    }`}
                  >
                    <svg viewBox="0 0 16 16" className="size-2.5" aria-hidden>
                      <path
                        d="M4 4l8 8M12 4l-8 8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <p className="text-[0.82rem] leading-snug text-text-dim">
                    <span className="font-medium text-text-mute">{c.code}</span>{" "}
                    {c.when}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex h-full flex-col gap-6">
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <PanelTitle info>Cost assumptions (per trade)</PanelTitle>
            <dl className="mt-5 space-y-3">
              <CostRow k="Trading fee" v="3 bps" />
              <CostRow k="Slippage (est.)" v="6 bps" />
              <CostRow k="Safety buffer" v="5 bps" />
            </dl>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3.5">
              <span className="text-[0.85rem] font-medium text-text">
                Total haircut
              </span>
              <span className="tnum text-[0.9rem] font-semibold text-text">
                {ROW_HAIRCUT} bps
              </span>
            </div>
            <p className="mt-4 text-[0.76rem] leading-relaxed text-text-mute">
              Net edge = |basis| − fee − slip − buffer. Only net counts.
            </p>
          </div>

          <div className="flex flex-1 flex-col rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <PanelTitle info>How you profit</PanelTitle>
            <p className="mt-4 text-[0.82rem] leading-relaxed text-text-dim">
              You place a single-leg trade on the cash stock, betting the price
              converges toward where the 24/7 token market already has it
              priced.
            </p>
            <p className="mt-3 text-[0.82rem] leading-relaxed text-text-dim">
              This isn&apos;t arbitrage — it&apos;s a directional bet.
              <br />
              Use paper mode to prove the thesis first.
            </p>
          </div>
        </div>

        <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <PanelTitle>Recent signals</PanelTitle>
            <Link
              href="/dashboard/log"
              className="text-[0.78rem] text-green transition-colors hover:text-[#12e888]"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-[3.5rem_1fr_auto] gap-3 pb-2 text-[10px] uppercase tracking-widest text-text-mute">
            <span>Time</span>
            <span>Symbol</span>
            <span className="text-right">Status</span>
          </div>
          <div className="divide-y divide-line">
            {RECENT.map((r) => (
              <div
                key={`${r.time}-${r.symbol}`}
                className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 py-3 transition-colors hover:bg-surface-2/60"
              >
                <span className="tnum text-[0.78rem] text-text-mute">
                  {r.time}
                </span>
                <span className="min-w-0">
                  <span className="text-[0.85rem] font-medium text-text">
                    {r.symbol}
                  </span>
                  <span
                    className={`tnum ml-2 text-[0.8rem] ${r.tone === "green" ? "text-green" : "text-text-mute"}`}
                  >
                    {r.net}
                  </span>
                </span>
                <span
                  className={`tnum justify-self-end rounded-md border px-2 py-0.5 text-[9px] tracking-widest ${
                    r.tone === "green"
                      ? "border-green/40 text-green"
                      : r.tone === "halt"
                        ? "border-halt/40 text-halt"
                        : "border-line-strong text-text-dim"
                  }`}
                >
                  {r.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-auto border-t border-line pt-4 text-[0.72rem] leading-relaxed text-text-mute">
            Max 3 signals per day. Signals are informational and require your
            confirmation. GAUGE does not custody funds or place trades
            without you.
          </p>
        </div>
      </div>
    </div>
  );
}

function ChecklistItem({
  pass,
  label,
  value,
}: {
  pass: boolean;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2.5 text-[0.82rem] text-text-dim">
        <span
          className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full ${
            pass ? "bg-green text-green-ink" : "bg-halt/25 text-halt"
          }`}
        >
          <svg viewBox="0 0 16 16" className="size-2.5" aria-hidden>
            {pass ? (
              <path
                d="M3 8.5 6.5 12 13 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M4 4l8 8M12 4l-8 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            )}
          </svg>
        </span>
        {label}
      </span>
      <span className="tnum shrink-0 text-[0.8rem] text-text-dim">{value}</span>
    </li>
  );
}

function CostRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-[0.82rem] text-text-mute">{k}</dt>
      <dd className="tnum text-[0.85rem] text-text-dim">{v}</dd>
    </div>
  );
}
