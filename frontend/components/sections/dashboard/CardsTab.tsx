"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { formatBps } from "@/lib/format";
import { cardIntents } from "@/lib/dashboard-data";
import type { CardIntent, CardStatus } from "@/types/tape";

const statusTone: Record<CardStatus, "gap" | "rich" | "halt" | "neutral"> = {
  open: "gap",
  confirmed: "gap",
  expired: "halt",
  stale_on_confirm: "rich",
  skipped: "neutral",
};

const statusLabel: Record<CardStatus, string> = {
  open: "OPEN",
  confirmed: "CONFIRMED",
  expired: "EXPIRED",
  stale_on_confirm: "STALE ON CONFIRM",
  skipped: "SKIPPED",
};

export function CardsTab() {
  const [intents, setIntents] = useState<CardIntent[]>(cardIntents);

  function requote(cardId: string) {
    setIntents((current) =>
      current.map((intent) =>
        intent.cardId === cardId && intent.status === "open"
          ? { ...intent, tap: intent.tap + (intent.bps < 0 ? -1 : 1), age: "just now" }
          : intent,
      ),
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[600px] grid-cols-[72px_88px_1fr_100px_140px] gap-4 border-b border-line px-5 py-2.5 font-mono text-[11px] uppercase tracking-wide text-mute">
        <span>Ticker</span>
        <span className="text-right">Δ bps</span>
        <span>Intent</span>
        <span className="text-right">Cap</span>
        <span className="text-right">Status</span>
      </div>

      {intents.map((intent) => (
        <button
          key={intent.cardId}
          type="button"
          disabled={intent.status !== "open"}
          onClick={() => requote(intent.cardId)}
          className="grid min-w-[600px] w-full grid-cols-[72px_88px_1fr_100px_140px] items-center gap-4 border-b border-line px-5 py-3.5 text-left transition-colors last:border-b-0 enabled:cursor-pointer enabled:hover:bg-paper/[0.03] disabled:cursor-default"
        >
          <span className="font-mono text-sm font-medium text-paper">
            {intent.ticker}
          </span>
          <span
            className={`text-right font-mono text-sm tabular-nums ${
              intent.bps < 0 ? "text-gap" : "text-rich"
            }`}
          >
            {formatBps(intent.bps)}
          </span>
          <span className="text-sm text-mute">
            {`$${intent.clip} clip · tap $${intent.tap} · ${intent.age}`}
          </span>
          <span className="text-right font-mono text-xs tabular-nums text-mute">
            {intent.capUsed}/{intent.capLimit} today
          </span>
          <span className="flex justify-end">
            <Chip tone={statusTone[intent.status]}>
              {statusLabel[intent.status]}
            </Chip>
          </span>
        </button>
      ))}

      <p className="px-5 py-4 font-mono text-xs text-mute">
        One row is one intent. Tapping an open card re-quotes it — confirm
        always re-checks the price first.
      </p>
    </div>
  );
}
