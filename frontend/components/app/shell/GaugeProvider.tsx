"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ApiError, api } from "@/lib/api/client";
import type { ApiCard, ApiUser, BasisTick, CardEvent, ConfirmResponse, Health, HistoryRow, TodayStats } from "@/lib/api/types";
import { defaultUser } from "@/lib/gauge/adapt";

/**
 * - connecting: first contact not done yet (render sample data)
 * - online:     gauge-api answered and the viewer's account is loaded
 * - offline:    gauge-api unreachable; screens fall back to sample data
 */
export type GaugeStatus = "connecting" | "online" | "offline";

type GaugeValue = {
  status: GaugeStatus;
  user: ApiUser | null;
  tape: BasisTick[];
  /** When the tape was last fetched (for tick ageing between polls). */
  tapeAt: number;
  cards: ApiCard[];
  history: HistoryRow[];
  stats: TodayStats | null;
  health: Health | null;
  /** Card lifecycle events from the SSE stream, newest last. */
  cardEvents: (CardEvent & { at: number })[];
  saveUser: (user: ApiUser) => Promise<ApiUser>;
  confirm: (cardId: string) => Promise<ConfirmResponse>;
  skip: (cardId: string) => Promise<void>;
};

const GaugeContext = createContext<GaugeValue | null>(null);

const TAPE_MS = 1_000;
const SLOW_MS = 5_000;
const RETRY_MS = 10_000;

/**
 * The dashboard's one connection to gauge-api (through the Next proxy).
 * Bootstraps the viewer's account (first visit: creates it with defaults),
 * polls the tape every second and stats/health/cards every 5 s, and listens
 * to the SSE stream so card changes land immediately. Polling pauses while
 * the tab is hidden; if the API is unreachable it retries every 10 s and
 * the screens show sample data meanwhile.
 */
export function GaugeProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<GaugeStatus>("connecting");
  const [user, setUser] = useState<ApiUser | null>(null);
  const [tape, setTape] = useState<BasisTick[]>([]);
  const [tapeAt, setTapeAt] = useState(0);
  const [cards, setCards] = useState<ApiCard[]>([]);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [stats, setStats] = useState<TodayStats | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [cardEvents, setCardEvents] = useState<(CardEvent & { at: number })[]>([]);
  const online = status === "online";

  const refreshCards = useCallback(async () => {
    const [c, h, s] = await Promise.all([api.cards(), api.history(), api.stats()]);
    setCards(c);
    setHistory(h);
    setStats(s);
  }, []);

  // Bootstrap, and retry while offline.
  useEffect(() => {
    if (status === "online") return;
    let cancelled = false;
    let retry: ReturnType<typeof setTimeout> | undefined;
    const connect = async () => {
      try {
        let u: ApiUser;
        try {
          u = await api.settings();
        } catch (e) {
          if (!(e instanceof ApiError && e.status === 404)) throw e;
          u = await api.saveSettings(defaultUser());
        }
        if (cancelled) return;
        setUser(u);
        setStatus("online");
      } catch {
        if (cancelled) return;
        setStatus("offline");
        retry = setTimeout(connect, RETRY_MS);
      }
    };
    connect();
    return () => {
      cancelled = true;
      clearTimeout(retry);
    };
  }, [status]);

  // Polling while online and visible.
  useEffect(() => {
    if (!online) return;
    let timers: ReturnType<typeof setInterval>[] = [];
    const fail = () => setStatus("offline");
    const pollTape = () =>
      api
        .tape()
        .then((t) => {
          setTape(t);
          setTapeAt(Date.now());
        })
        .catch(fail);
    const pollSlow = () => {
      refreshCards().catch(fail);
      api.health().then(setHealth).catch(() => setHealth(null));
    };
    const start = () => {
      if (timers.length) return;
      pollTape();
      pollSlow();
      timers = [setInterval(pollTape, TAPE_MS), setInterval(pollSlow, SLOW_MS)];
    };
    const stop = () => {
      timers.forEach(clearInterval);
      timers = [];
    };
    const onVis = () => (document.hidden ? stop() : start());
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [online, refreshCards]);

  // SSE: a card event refreshes cards/history/stats right away.
  useEffect(() => {
    if (!online) return;
    const source = new EventSource(api.streamUrl());
    source.addEventListener("card", (e) => {
      try {
        const event = JSON.parse((e as MessageEvent<string>).data) as CardEvent;
        setCardEvents((prev) => [...prev.slice(-19), { ...event, at: Date.now() }]);
      } catch {
        // malformed event: the next poll catches up
      }
      refreshCards().catch(() => undefined);
    });
    return () => source.close();
  }, [online, refreshCards]);

  const saveUser = useCallback(async (next: ApiUser) => {
    const saved = await api.saveSettings(next);
    setUser(saved);
    return saved;
  }, []);

  const inFlight = useRef(new Set<string>());
  const confirm = useCallback(
    async (cardId: string) => {
      if (inFlight.current.has(cardId)) return { status: "already_resolved_or_missing" } as const;
      inFlight.current.add(cardId);
      try {
        const res = await api.confirm(cardId);
        await refreshCards().catch(() => undefined);
        return res;
      } finally {
        inFlight.current.delete(cardId);
      }
    },
    [refreshCards],
  );
  const skip = useCallback(
    async (cardId: string) => {
      await api.skip(cardId).catch(() => undefined); // 409: already resolved
      await refreshCards().catch(() => undefined);
    },
    [refreshCards],
  );

  return (
    <GaugeContext.Provider
      value={{ status, user, tape, tapeAt, cards, history, stats, health, cardEvents, saveUser, confirm, skip }}
    >
      {children}
    </GaugeContext.Provider>
  );
}

export function useGauge() {
  const ctx = useContext(GaugeContext);
  if (!ctx) throw new Error("useGauge must be used inside <GaugeProvider>");
  return ctx;
}

/** True when screens should render gauge-api data rather than samples. */
export function useApiData() {
  return useGauge().status === "online";
}
