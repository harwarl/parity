"use client";

import { fmtPrice } from "@/lib/parity/format";
import { useLiveTape } from "@/hooks/useLiveTape";
import GapMeter from "./GapMeter";

/** The featured name's basis, live — the meter drifts as cash and token move. */
export default function FeaturedGap({ symbol }: { symbol: string }) {
  const { rows } = useLiveTape(1800);
  const row = rows.find((r) => r.symbol === symbol) ?? rows[0];

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-[0.95rem] font-medium tracking-tight text-text">
          {row.symbol}
        </span>
        <span className="tnum text-[0.8rem] text-text-mute">
          cash{" "}
          <span key={row.shareMid.toFixed(2)} className="tick-flash">
            {fmtPrice(row.shareMid)}
          </span>{" "}
          · token{" "}
          <span key={row.tokenPerShare.toFixed(2)} className="tick-flash">
            {fmtPrice(row.tokenPerShare)}
          </span>
        </span>
      </div>
      <div className="mt-4">
        <GapMeter bps={row.basisBps} scale={50} />
      </div>
      <div className="tnum mt-3 flex justify-between text-[0.7rem] uppercase tracking-widest text-text-mute">
        <span>token cheap</span>
        <span>parity</span>
        <span>token rich</span>
      </div>
    </>
  );
}
