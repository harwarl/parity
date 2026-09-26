"use client";

import { clockAt, rthLeftAt } from "@/lib/gauge/live";
import { useLive } from "@/components/app/shell/LiveMarketProvider";

/** "14:02:41" advancing with the live feed. */
export function LiveClock() {
  const { elapsed } = useLive();
  return <span suppressHydrationWarning>{clockAt(elapsed)}</span>;
}

/** "1h 57m" left in RTH. */
export function RthLeft() {
  const { elapsed } = useLive();
  return <>{rthLeftAt(elapsed)}</>;
}
