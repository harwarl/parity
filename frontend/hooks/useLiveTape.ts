"use client";

import { useEffect, useRef, useState } from "react";
import { basisBps } from "@/lib/parity/math";
import { ROW_HAIRCUT, TAPE } from "@/lib/parity/universe";
import type { TapeRow } from "@/types/parity";

/**
 * The shared tape, breathing. Every tick it nudges cash and token on a bounded
 * random walk and recomputes the basis, so the surface reads as a live feed.
 * HALT / STALE names stay frozen. Returns the static tape under reduced motion.
 */
export function useLiveTape(intervalMs = 1600) {
  const [rows, setRows] = useState<TapeRow[]>(TAPE);
  const [pulseKey, setPulseKey] = useState(0);
  const base = useRef(TAPE.map((r) => ({ cash: r.shareMid, token: r.tokenPerShare })));

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = window.setInterval(() => {
      setRows((prev) =>
        prev.map((row, i) => {
          if (row.state === "halt" || row.state === "stale") return row;
          const anchor = base.current[i];
          const drift = (v: number, ref: number) => {
            const step = ref * (Math.random() - 0.5) * 0.0006;
            const next = v + step;
            // tether to the anchor so it wanders but never runs away
            return next + (ref - next) * 0.04;
          };
          const shareMid = drift(row.shareMid, anchor.cash);
          const tokenPerShare = drift(row.tokenPerShare, anchor.token);
          const b = basisBps(tokenPerShare, shareMid);
          return {
            ...row,
            shareMid,
            tokenPerShare,
            basisBps: b,
            netBps: Math.abs(b) - ROW_HAIRCUT,
          };
        }),
      );
      setPulseKey((k) => k + 1);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [intervalMs]);

  return { rows, pulseKey };
}
