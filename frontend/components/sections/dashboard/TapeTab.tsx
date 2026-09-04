"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Sparkline } from "@/components/ui/Sparkline";
import { formatBps, formatPrice } from "@/lib/format";
import { heroTape, defaultOpenTicker } from "@/lib/tape-data";
import type { Session, TapeRow } from "@/types/tape";

const sessionLabel: Record<Session, string> = {
  rth: "RTH",
  ext: "EXT",
  overnight: "OVERNIGHT",
  weekend: "WEEKEND",
};

const sessionSentence: Record<Session, string> = {
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

function cardSentence(row: TapeRow): string {
  const pct = (Math.abs(row.bps) / 100).toFixed(1);
  const direction = row.bps < 0 ? "cheap" : "rich";
  return `${row.ticker} token is ${pct}% ${direction} vs ${row.ticker}. ${sessionSentence[row.session]} $${row.clip} clip after haircut.`;
}

export function TapeTab() {
  const [openTicker, setOpenTicker] = useState<string | null>(
    defaultOpenTicker,
  );

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-170 grid-cols-[72px_1fr_1fr_76px_96px_84px_92px_28px] gap-3 border-b border-line px-5 py-2.5 font-mono text-[11px] uppercase tracking-wide text-mute">
        <span>Ticker</span>
        <span className="text-right">Cash</span>
        <span className="text-right">Token</span>
        <span className="text-right">Δ bps</span>
        <span className="text-right">Session</span>
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
              className="grid min-w-170 w-full grid-cols-[72px_1fr_1fr_76px_96px_84px_92px_28px] items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-paper/3"
            >
              <span className="font-mono text-sm font-medium text-paper">
                {row.ticker}
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
                  <Chip tone="halt">{row.halt}</Chip>
                ) : (
                  <Chip tone="neutral">{sessionLabel[row.session]}</Chip>
                )}
              </span>
              <span className="flex justify-end">
                <Chip tone={row.live ? "gap" : "halt"} dot>
                  {row.live ? "LIVE" : "DELAYED"}
                </Chip>
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
              <div className="min-w-170 border-t border-line bg-void/40 px-5 py-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="max-w-md text-sm text-paper">
                      {tradeable
                        ? cardSentence(row)
                        : `No active card. ${sessionSentence[row.session]}`}
                    </p>
                    {tradeable && (
                      <>
                        <div className="mt-4 flex items-center gap-3">
                          <Button variant="accent">{`Do it · $${row.tap}`}</Button>
                          <Button variant="ghost">Skip</Button>
                        </div>
                        <p className="mt-4 font-mono text-xs text-mute">
                          TTL 75s · confirm re-quotes · card_id {row.cardId}
                        </p>
                      </>
                    )}
                  </div>
                  {row.sparkline && (
                    <div className="shrink-0">
                      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wide text-mute">
                        Basis · last 2h
                      </p>
                      <Sparkline data={row.sparkline} tone={sparkTone(row)} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
