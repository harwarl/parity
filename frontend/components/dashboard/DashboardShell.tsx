"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import Icon from "@/components/ui/Icon";
import type { TapeRow } from "@/types/parity";
import CardsPanel, { type RecentSignal } from "./CardsPanel";

const CAP_TOTAL = 3;

const INITIAL_RECENT: RecentSignal[] = [
  { time: "10:14", symbol: "AAPL", net: "+42 bps", status: "Ready", tone: "green" },
  { time: "09:47", symbol: "TSLA", net: "+36 bps", status: "Executed (Paper)", tone: "dim" },
  { time: "08:12", symbol: "NVDA", net: "—", status: "HALT", tone: "halt" },
  { time: "Jun 24", symbol: "AMZN", net: "—", status: "THIN", tone: "halt" },
  { time: "Jun 24", symbol: "META", net: "+18 bps", status: "DUST", tone: "halt" },
  { time: "Jun 23", symbol: "MSFT", net: "+27 bps", status: "Executed (Paper)", tone: "dim" },
];

/**
 * Owns the state a confirmed paper fill actually affects — the daily signal
 * cap and the recent-signals log — so CardsPanel's "Confirm & Do It" can
 * update both instead of being purely decorative.
 */
export default function DashboardShell() {
  const [capUsed, setCapUsed] = useState(1);
  const [recent, setRecent] = useState(INITIAL_RECENT);

  const handleConfirm = (row: TapeRow, clip: number) => {
    setCapUsed((n) => Math.min(CAP_TOTAL, n + 1));
    setRecent((prev) => [
      {
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        symbol: row.symbol,
        net: `+${Math.round(row.netBps)} bps`,
        status: `Executed (Paper) · $${clip}`,
        tone: "dim",
      },
      ...prev,
    ]);
  };

  return (
    <Container className="py-8 sm:py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[1.9rem] font-bold tracking-tight text-text sm:text-[2.25rem]">
            Two prices. One opportunity.
          </h1>
          <p className="mt-2 max-w-xl text-[0.9rem] leading-relaxed text-text-dim">
            GAUGE compares Robinhood cash equities (RTH) and chain stock
            tokens (24/7) to find real, net edges after costs.
          </p>
        </div>

        <div className="flex shrink-0 items-stretch divide-x divide-line rounded-xl border border-line-strong bg-surface">
          <div className="px-5 py-3.5">
            <p className="flex items-center gap-1.5 text-[0.78rem] text-text-mute">
              Daily Signal Cap
              <Icon name="info" size={12} />
            </p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: CAP_TOTAL }).map((_, i) => (
                  <span
                    key={i}
                    className={`size-2.5 rounded-full transition-colors ${
                      i < capUsed ? "bg-green" : "border border-line-strong"
                    }`}
                  />
                ))}
              </div>
              <span className="tnum text-[0.8rem] text-text-dim">
                {capUsed} / {CAP_TOTAL} used
              </span>
            </div>
          </div>
          <div className="px-5 py-3.5">
            <p className="text-[0.78rem] text-text-mute">Mode</p>
            <p className="mt-2 flex items-center gap-1.5 text-[0.95rem] font-medium text-text">
              Paper
              <Icon name="chevronDown" size={13} className="text-text-mute" />
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <CardsPanel
          capUsed={capUsed}
          capTotal={CAP_TOTAL}
          recent={recent}
          onConfirm={handleConfirm}
        />
      </div>
    </Container>
  );
}
