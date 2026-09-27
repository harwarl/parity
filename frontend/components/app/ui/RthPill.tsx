"use client";

import { Pill } from "@/components/ui/Pill";
import { useLive } from "@/components/app/shell/LiveMarketProvider";

/** "RTH · 1h 57m left" in regular hours, else "Outside RTH" (New York clock). */
export function RthPill() {
  const { rthLeft } = useLive();
  return rthLeft ? (
    <Pill size="sm" tone="lime" dot="live">
      RTH · {rthLeft} left
    </Pill>
  ) : (
    <Pill size="sm" dot="static">
      Outside RTH
    </Pill>
  );
}
