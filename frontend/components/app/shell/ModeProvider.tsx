"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Mode = "paper" | "live";

type ModeContextValue = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  /** Agentic Account link state. Selecting Live links it (design.md §5B.12 G). */
  linked: boolean;
  setLinked: (linked: boolean) => void;
};

const ModeContext = createContext<ModeContextValue | null>(null);
const KEY = "gauge.mode";

/**
 * Paper/Live is one global setting in production (design.md §11); the mock's
 * per-artboard state is not reproduced. Remembered per viewer.
 */
export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>("paper");
  const [linked, setLinked] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "live") {
        setModeState("live");
        setLinked(true);
      }
    } catch {
      // storage unavailable: stay in paper
    }
  }, []);

  const setMode = useCallback((next: Mode) => {
    setModeState(next);
    if (next === "live") setLinked(true);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // ignore
    }
  }, []);

  return (
    <ModeContext.Provider value={{ mode, setMode, linked, setLinked }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used inside <ModeProvider>");
  return ctx;
}
