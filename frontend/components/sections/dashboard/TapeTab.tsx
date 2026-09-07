"use client";

import { useState } from "react";
import { ArrowLeftRight, ChevronDown } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { BasisChart } from "@/components/ui/BasisChart";
import { formatBps, formatPrice } from "@/lib/format";
import { heroTape, defaultOpenTicker } from "@/lib/tape-data";
import type { HaltReason, TapeRow } from "@/types/tape";

const haltLabel: Record<HaltReason, string> = {
  STALE: "STALE",
  CLOSED: "CLOSED",
  THIN: "THIN",
  DUST: "DUST",
};

const sessionSentence: Record<TapeRow["session"], string> = {
  rth: "Cash market open.",
  ext: "Extended hours.",
  overnight: "Overnight — watch, not live.",
  weekend: "Weekend — watch, not live.",
};

const bpsToneClasses = {
  gap: "text-gap",
  rich: "text-rich",
  halt: "text-halt",
  neutral: "text-mute",
} as const;

function bpsTone(row: TapeRow): keyof typeof bpsToneClasses {
  if (row.halt) return "halt";
  if (row.clip) return "gap";
  if (row.bps >= 150) return "rich";
  return "neutral";
}

function sparkTone(row: TapeRow): "gap" | "rich" | "mute" {
  if (row.clip) return "gap";
  if (row.bps >= 150) return "rich";
  return "mute";
}

const gridCols =
  "grid-cols-[minmax(180px,1fr)_96px_96px_84px_92px_88px_28px]";

export function TapeTab() {
  const [openTicker, setOpenTicker] = useState<string | null>(
    defaultOpenTicker,
  );

  const openRow = heroTape.find((row) => row.ticker === openTicker);

  return (
    <div className="overflow-x-auto">
      <div
        className={`grid min-w-190 ${gridCols} gap-3 border-b border-line px-5 py-2.5 font-mono text-[11px] uppercase tracking-wide text-mute`}
      >
        <span>Token</span>
        <span className="text-right">Cash price</span>
        <span className="text-right">Token price</span>
        <span className="text-right">Basis (bps)</span>
        <span className="text-right">Status</span>
        <span className="text-right">Updated</span>
        <span />
      </div>

      {heroTape.map((row) => {
        const tradeable = Boolean(row.clip);
        const isOpen = openTicker === row.ticker;

        return (
          <div key={row.ticker} className="border-b border-line last:border-b-0">
            <button
              type="button"
              onClick={() =>
                setOpenTicker((current) =>
                  current === row.ticker ? null : row.ticker,
                )
              }
              className={`grid min-w-190 w-full ${gridCols} items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-paper/3`}
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-panel font-mono text-xs text-paper">
                  {row.ticker[0]}
                </span>
                <span className="flex flex-col">
                  <span className="font-mono text-sm font-medium text-paper">
                    {row.ticker}
                  </span>
                  <span className="text-xs text-mute">{row.name}</span>
                </span>
              </span>
              <span className="text-right font-mono text-sm tabular-nums text-mute">
                {formatPrice(row.cash)}
              </span>
              <span className="text-right font-mono text-sm tabular-nums text-mute">
                {formatPrice(row.token)}
              </span>
              <span
                className={`text-right font-mono text-sm tabular-nums ${bpsToneClasses[bpsTone(row)]}`}
              >
                {formatBps(row.bps)}
              </span>
              <span className="flex justify-end">
                {row.halt ? (
                  <Chip tone="halt">{haltLabel[row.halt]}</Chip>
                ) : (
                  <Chip tone={row.live ? "gap" : "halt"} dot>
                    {row.live ? "LIVE" : "DELAYED"}
                  </Chip>
                )}
              </span>
              <span className="text-right font-mono text-xs tabular-nums text-mute">
                {row.updatedAt}
              </span>
              <span className="flex justify-end">
                <ChevronDown
                  size={16}
                  className={`text-mute transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </span>
            </button>

            {isOpen && (
              <div className="min-w-190 border-t border-line bg-void/40 px-5 py-6 sm:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr_1fr]">
                  <div>
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-wide text-mute">
                      Basis over time (today)
                    </p>
                    {row.sparkline && (
                      <BasisChart
                        data={row.sparkline}
                        tone={sparkTone(row)}
                        height={96}
                        showAxis
                      />
                    )}
                  </div>

                  <dl className="flex flex-col gap-2.5 text-sm">
                    {[
                      ["Market", "US"],
                      ["Source", "Parity Index"],
                      ["Oracle", "Parity Oracle"],
                      ["Confidence", "98%"],
                      ["Last updated", row.updatedAt],
                    ].map(([label, value]) => (
                      <div key={label} className="grid grid-cols-[7rem_1fr] gap-4">
                        <dt className="text-mute">{label}</dt>
                        <dd className="font-mono tabular-nums text-paper">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  {tradeable ? (
                    <div className="flex flex-col gap-4 rounded-window border border-gap/25 bg-gap/[0.06] p-5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-gap">
                          Gap is live
                        </span>
                        <span className="font-mono text-sm text-gap">
                          {formatBps(row.bps)}
                        </span>
                      </div>
                      <Button variant="accent" className="w-full">
                        {`Do it · $${row.tap}`}
                      </Button>
                      <Button variant="ghost" className="w-full">
                        Skip
                      </Button>
                      <p className="font-mono text-[11px] text-mute">
                        TTL 75s · confirm re-quotes · card_id {row.cardId}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center rounded-window border border-line bg-panel p-5">
                      <p className="text-sm text-mute">
                        No active card. {sessionSentence[row.session]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {openRow?.legs && (
        <div className="relative grid grid-cols-1 divide-y divide-line border-t border-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 z-10 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-panel text-mute sm:flex"
          >
            <ArrowLeftRight size={14} />
          </span>

          <div className="p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-wide text-mute">
              Cash
            </p>
            <p className="mt-3 flex items-baseline gap-1.5">
              <span className="font-mono text-4xl font-semibold tabular-nums text-paper">
                {formatBps(openRow.legs.cashBps)}
              </span>
            </p>
            <p className="mt-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-gap">
              <span className="h-1.5 w-1.5 rounded-full bg-gap" />
              Gap is live
            </p>
            <div className="mt-4">
              <BasisChart data={openRow.legs.cashSpark} tone="gap" />
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-wide text-mute">
              Token
            </p>
            <p className="mt-3 flex items-baseline gap-1.5">
              <span className="font-mono text-4xl font-semibold tabular-nums text-paper">
                {formatBps(openRow.legs.tokenBps)}
              </span>
            </p>
            <p className="mt-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-mute">
              <span className="h-1.5 w-1.5 rounded-full bg-mute" />
              Gap is live
            </p>
            <div className="mt-4">
              <BasisChart data={openRow.legs.tokenSpark} tone="mute" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
