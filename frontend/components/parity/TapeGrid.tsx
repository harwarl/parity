"use client";

import { useEffect, useState } from "react";
import Reveal from "@/components/shared/Reveal";
import { useLiveTape } from "@/hooks/useLiveTape";
import TapeRow from "./TapeRow";

/** The 10-name tape. Rows assemble on scroll, then breathe with the live feed. */
export default function TapeGrid() {
  const { rows } = useLiveTape();
  const [scan, setScan] = useState(-1);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(
      () => setScan((s) => (s + 1) % (rows.length + 3)),
      900,
    );
    return () => window.clearInterval(id);
  }, [rows.length]);

  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <div className="hidden grid-cols-[1.5fr_0.8fr_0.8fr_1.3fr_0.7fr_auto] gap-x-4 border-b border-line bg-surface px-4 py-2.5 text-[10px] uppercase tracking-widest text-text-mute sm:grid">
        <span>Name</span>
        <span>Cash mid</span>
        <span>Token / sh</span>
        <span>Gap</span>
        <span>Net bps</span>
        <span className="justify-self-end">Session</span>
      </div>
      <div className="divide-y divide-line">
        {rows.map((row, i) => (
          <Reveal
            key={row.symbol}
            delay={Math.min(i, 8) * 45}
            y={10}
            className="bg-ground"
          >
            <TapeRow row={row} scanning={scan === i} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
