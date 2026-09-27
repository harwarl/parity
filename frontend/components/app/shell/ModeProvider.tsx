"use client";

import { createContext, useCallback, useContext, useState, useSyncExternalStore, type ReactNode } from "react";
import { useGauge } from "./GaugeProvider";

export type Mode = "paper" | "live";

type ModeContextValue = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  /** Agentic Account link state. Live implies linked (design.md §5B.12 G). */
  linked: boolean;
  setLinked: (linked: boolean) => void;
};

const ModeContext = createContext<ModeContextValue | null>(null);
const KEY = "gauge.mode";

/* A tiny external store: localStorage when available, memory otherwise. */
let memory: Mode = "paper";
const listeners = new Set<() => void>();
function read(): Mode {
  try {
    return localStorage.getItem(KEY) === "live" ? "live" : memory;
  } catch {
    return memory;
  }
}
function write(next: Mode) {
  memory = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // storage unavailable: memory only
  }
  listeners.forEach((l) => l());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Paper/Live is one global setting (design.md §11). Online, it's the
 * viewer's `mode` in gauge-api — what the carder and confirm actually read;
 * offline it's remembered per browser. The Agentic Account link has no
 * backend yet (blocked on the real Trading MCP), so it stays local.
 */
export function ModeProvider({ children }: { children: ReactNode }) {
  const gauge = useGauge();
  const localMode = useSyncExternalStore(subscribe, read, () => "paper" as Mode);
  const [linkedFlag, setLinkedFlag] = useState(false);
  const online = gauge.status === "online" && gauge.user !== null;
  const mode: Mode = online ? (gauge.user!.mode === "Live" ? "live" : "paper") : localMode;

  const { user, saveUser } = gauge;
  const setMode = useCallback(
    (next: Mode) => {
      write(next);
      if (online && user) {
        saveUser({ ...user, mode: next === "live" ? "Live" : "Paper" }).catch(() => undefined);
      }
    },
    [online, user, saveUser],
  );
  const setLinked = useCallback(
    (next: boolean) => {
      setLinkedFlag(next);
      if (!next && mode === "live") setMode("paper");
    },
    [mode, setMode],
  );

  return (
    <ModeContext.Provider value={{ mode, setMode, linked: linkedFlag || mode === "live", setLinked }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used inside <ModeProvider>");
  return ctx;
}
