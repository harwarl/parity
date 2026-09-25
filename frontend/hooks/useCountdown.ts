"use client";

import { useCallback, useEffect, useState } from "react";
import { ACTIVE, RULES } from "@/lib/gauge/model";

/**
 * J5 · 1s tick from t = 52 (now = 14:02:41). At 0 it wraps to 75.
 * `held` suspends the tick (the clock holds during confirm). The tick keeps
 * running under reduced motion; the countdown is content, not decoration.
 * In production, derive t from the card's expires_at.
 */
export function useCountdown(held = false) {
  const [t, setT] = useState<number>(ACTIVE.startT);

  useEffect(() => {
    if (held) return;
    const id = setInterval(() => setT((s) => (s <= 0 ? RULES.cardLife : s - 1)), 1000);
    return () => clearInterval(id);
  }, [held]);

  const reset = useCallback(() => setT(RULES.cardLife), []);
  return { t, reset };
}
