"use client";

import { useLive } from "@/components/app/shell/LiveMarketProvider";
import { LiveNum } from "@/components/app/ui/LiveNum";

/** Evaluations counter, climbing with every tick (11 names × 4 SSE ticks/s). */
export function LiveEvaluations() {
  const { evaluations } = useLive();
  return <LiveNum value={evaluations} text={evaluations.toLocaleString("en-US")} />;
}
