"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_RULES, etClock, rowFromTick, rthLeft } from "@/lib/gauge/adapt";
import { clockAt, initLive, rthLeftAt, stepLive, type ActivityEvent, type Latency } from "@/lib/gauge/live";
import { WATCHLIST, type GateState, type WatchRow } from "@/lib/gauge/model";
import { seedSparkValues } from "@/lib/gauge/series";
import type { CardEvent } from "@/lib/api/types";
import { useGauge } from "./GaugeProvider";

const TICK_MS = 1000;

/** What every market-data screen reads, whichever source is behind it. */
export type LiveView = {
  /** "api": gauge-api prices; "sample": the design.md simulation. */
  source: "api" | "sample";
  rows: WatchRow[];
  hist: Record<string, number[]>;
  evaluations: number;
  events: ActivityEvent[];
  /** Total events today (for the feed's header). */
  eventCount: number;
  /** Sample-mode latencies; `null` in api mode (see System health). */
  latency: Latency | null;
  /** "14:02:41" (ET in api mode). */
  clock: string;
  /** Time left in RTH, or null outside it. */
  rthLeft: string | null;
  /** Wall clock, updated every second (render-safe "now"). */
  now: number;
};

const LiveContext = createContext<LiveView | null>(null);

const ORDER = Object.fromEntries(WATCHLIST.map((w, i) => [w.sym, i]));
const LIME = "#B2D450";
const STATE_COLOR: Record<GateState, string> = {
  CARD: LIME,
  THIN: "#E8B04A",
  STALE: "#FF6B5E",
  DUST: "#80848A",
  CLOSED: "#8FA6DA",
};

function transitionEvent(r: WatchRow, floor: number, minDepthK: number): Omit<ActivityEvent, "id" | "time"> {
  const n = `${r.net < 0 ? "−" : ""}${Math.abs(r.net).toFixed(1)}`;
  const msg = {
    CARD: `${r.sym} · net ${n} bps · all gates pass`,
    THIN: `${r.sym} depth $${r.depth}k < $${minDepthK}k`,
    STALE: `${r.sym} quote ${r.age.toFixed(1)} s old`,
    DUST: `${r.sym} net ${n} < floor ${floor.toFixed(1)}`,
    CLOSED: `${r.sym} outside RTH`,
  }[r.state];
  return { kind: r.state, color: STATE_COLOR[r.state], msg };
}

function cardEventLine(e: CardEvent): Omit<ActivityEvent, "id" | "time"> {
  const sym = e.card_id.split("-")[0];
  switch (e.kind) {
    case "opened":
      return { kind: "CARD", color: LIME, msg: `${sym} · card emitted · 75 s` };
    case "confirmed":
      return { kind: "DO IT", color: LIME, msg: `${sym} re-quote clears · filled` };
    case "requote_fail":
      return { kind: "FAIL", color: "#FF6B5E", msg: `${sym} re-quote under the gates · no order` };
    case "rejected":
      return { kind: "SKIP", color: "#C9CBCF", msg: `${sym} skipped` };
    case "expired":
    case "stale_on_confirm":
      return { kind: "EXPIRED", color: "#5A5D62", msg: `${sym} expired after 75 s · no tap` };
  }
}

/**
 * One market feed for every dashboard screen. Online (GaugeProvider), rows
 * come from gauge-api's tape under the viewer's own gates, sparklines build
 * from each tick's net, and the activity feed is state changes plus SSE
 * card events. Offline or before first contact, the design.md simulation
 * runs as before. Ticks pause while the tab is hidden.
 */
export function LiveMarketProvider({ children }: { children: ReactNode }) {
  const gauge = useGauge();
  const apiMode = gauge.status === "online";
  const rules = gauge.user?.rules ?? DEFAULT_RULES;

  const [sim, setSim] = useState(initLive);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined;
    const tick = () => {
      setNow(Date.now());
      if (!apiMode) setSim((s) => stepLive(s, TICK_MS / 1000));
    };
    const start = () => {
      if (id === undefined) id = setInterval(tick, TICK_MS);
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
  }, [apiMode]);

  const apiRows = useMemo(
    () =>
      gauge.tape
        .map((t) => rowFromTick(t, rules, Math.max(gauge.tapeAt, now)))
        .sort((a, b) => (ORDER[a.sym] ?? 99) - (ORDER[b.sym] ?? 99) || a.sym.localeCompare(b.sym)),
    [gauge.tape, gauge.tapeAt, rules, now],
  );

  // Derived-from-props state (no effects): fold each new tape and each new
  // card event into sparkline history and the activity feed exactly once.
  const [feed, setFeed] = useState<{
    tapeAt: number;
    cardEventCount: number;
    hist: Record<string, number[]>;
    states: Record<string, GateState>;
    events: ActivityEvent[];
    nextId: number;
  }>({ tapeAt: 0, cardEventCount: 0, hist: {}, states: {}, events: [], nextId: 1 });

  if (apiMode && (gauge.tapeAt !== feed.tapeAt || gauge.cardEvents.length !== feed.cardEventCount)) {
    const hist = { ...feed.hist };
    const states = { ...feed.states };
    const events = [...feed.events];
    let nextId = feed.nextId;
    const stamp = etClock(gauge.tapeAt || now);
    if (gauge.tapeAt !== feed.tapeAt) {
      for (const r of apiRows) {
        hist[r.sym] = [...(hist[r.sym] ?? seedSparkValues(r)).slice(-23), r.net];
        if (states[r.sym] !== r.state) {
          events.push({ id: nextId++, time: stamp, ...transitionEvent(r, rules.floor_bps, rules.min_depth_usd / 1000) });
          states[r.sym] = r.state;
        }
      }
    }
    for (const e of gauge.cardEvents.slice(feed.cardEventCount)) {
      events.push({ id: nextId++, time: etClock(e.at), ...cardEventLine(e) });
    }
    setFeed({
      tapeAt: gauge.tapeAt,
      cardEventCount: gauge.cardEvents.length,
      hist,
      states,
      events: events.slice(-8),
      nextId,
    });
  }

  const view: LiveView = apiMode
    ? {
        source: "api",
        rows: apiRows,
        hist: feed.hist,
        evaluations: gauge.stats?.evaluations ?? 0,
        events: feed.events,
        eventCount: feed.nextId - 1,
        latency: null,
        clock: etClock(now),
        rthLeft: rthLeft(now),
        now,
      }
    : {
        source: "sample",
        rows: sim.rows,
        hist: sim.hist,
        evaluations: sim.evaluations,
        events: sim.events,
        eventCount: 8 + (sim.nextId - 9),
        latency: sim.latency,
        clock: clockAt(sim.elapsed),
        rthLeft: rthLeftAt(sim.elapsed),
        now,
      };

  return <LiveContext.Provider value={view}>{children}</LiveContext.Provider>;
}

export function useLive() {
  const ctx = useContext(LiveContext);
  if (!ctx) throw new Error("useLive must be used inside <LiveMarketProvider>");
  return ctx;
}

