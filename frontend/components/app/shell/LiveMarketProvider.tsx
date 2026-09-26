"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { initLive, stepLive, type LiveState } from "@/lib/gauge/live";

const TICK_MS = 1000;
const LiveContext = createContext<LiveState | null>(null);

/**
 * One live feed for every dashboard screen. Server render and first paint
 * use the sample values (no hydration mismatch); ticks start after mount and
 * pause while the tab is hidden.
 */
export function LiveMarketProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LiveState>(initLive);

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      if (id === undefined) id = setInterval(() => setState((s) => stepLive(s, TICK_MS / 1000)), TICK_MS);
    };
    const stop = () => {
      clearInterval(id);
      id = undefined;
    };
    const onVis = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <LiveContext.Provider value={state}>{children}</LiveContext.Provider>;
}

export function useLive() {
  const ctx = useContext(LiveContext);
  if (!ctx) throw new Error("useLive must be used inside <LiveMarketProvider>");
  return ctx;
}
