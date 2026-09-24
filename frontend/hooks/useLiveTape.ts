"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { fetchTape, tickToTapeRow, type BasisTick } from "@/lib/api/gauge";
import { basisBps } from "@/lib/parity/math";
import { ROW_HAIRCUT, TAPE } from "@/lib/parity/universe";
import type { TapeRow } from "@/types/parity";

/**
 * The shared tape. Polls gauge-api's real GET /tape every 5s; while
 * gauge-api's mod market has no poll loop running yet (backend's most
 * significant remaining gap — see TODO.md), that endpoint comes back empty
 * and every row falls back to the illustrative local simulation below, so
 * the marketing site keeps working standalone. This *is* the "explicitly
 * wired to a live tape endpoint" case CLAUDE.md carves out — real rows
 * replace their seeded counterpart the moment mod market starts
 * publishing, with no code change needed here.
 *
 * A row backed by real data is never perturbed by the local random walk —
 * doing so would silently overwrite mod engine's actual net_bps with this
 * file's illustrative ROW_HAIRCUT approximation. Live ticks are read from a
 * ref inside the same interval loop that already drives the illustrative
 * animation (rather than a second effect that would call setState directly
 * off the query result — react-hooks flags that as an avoidable extra
 * render), so there's one update path, not two racing ones.
 *
 * Only ever updates rows already in the seeded TAPE (10 fixed symbols) — a
 * real tick for a symbol outside that list is silently ignored. gauge-api
 * has no decided live universe yet (ARCHITECTURE.md §7), so there's nothing
 * more specific to reconcile against today.
 */
export function useLiveTape(intervalMs = 1600) {
  const { data: liveTicks } = useQuery({
    queryKey: ["gauge-tape"],
    queryFn: fetchTape,
    refetchInterval: 5000,
    retry: false,
  });
  const liveTicksRef = useRef<BasisTick[] | undefined>(undefined);
  useEffect(() => {
    liveTicksRef.current = liveTicks;
  }, [liveTicks]);

  const [rows, setRows] = useState<TapeRow[]>(TAPE);
  const [pulseKey, setPulseKey] = useState(0);
  const base = useRef(TAPE.map((r) => ({ cash: r.shareMid, token: r.tokenPerShare })));

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Reduced motion means no interval at all, same as before this hook
    // gained live-tick support — a static page doesn't re-render on a
    // timer. It does mean a reduced-motion visitor won't see a live tick
    // land until their next navigation; an acceptable trade for "truly
    // static," which is what reduced motion asks for.
    if (reduce) return;

    const id = window.setInterval(() => {
      setRows((prev) =>
        prev.map((row, i) => {
          const liveTick = liveTicksRef.current?.find((t) => t.symbol === row.symbol);
          if (liveTick) return tickToTapeRow(liveTick, row.name);
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
