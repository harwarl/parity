"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useCountdown } from "@/hooks/useCountdown";

type CountdownValue = {
  t: number;
  reset: () => void;
  held: boolean;
  setHeld: (held: boolean) => void;
};

const CountdownContext = createContext<CountdownValue | null>(null);

/** One card clock per screen, shared by the ring, the activity feed and the audit trail. */
export function CountdownProvider({ children }: { children: ReactNode }) {
  const [held, setHeld] = useState(false);
  const { t, reset } = useCountdown(held);
  return (
    <CountdownContext.Provider value={{ t, reset, held, setHeld }}>{children}</CountdownContext.Provider>
  );
}

export function useCardClock() {
  const ctx = useContext(CountdownContext);
  if (!ctx) throw new Error("useCardClock must be used inside <CountdownProvider>");
  return ctx;
}
