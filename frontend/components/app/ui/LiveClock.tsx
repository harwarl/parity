"use client";

import { useLive } from "@/components/app/shell/LiveMarketProvider";

/** "14:02:41": ET from the API, or the sample clock offline. */
export function LiveClock() {
  const { clock } = useLive();
  return <span suppressHydrationWarning>{clock}</span>;
}

/** "1h 57m", or "closed" outside regular hours. */
export function RthLeft() {
  const { rthLeft } = useLive();
  return <>{rthLeft ?? "closed"}</>;
}

const dayFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  weekday: "short",
  day: "numeric",
  month: "short",
});

/** "Fri 26 Sep": today in New York from the API, the sample day offline. */
export function LiveDay() {
  const { source, now } = useLive();
  if (source !== "api") return <>Fri 26 Sep</>;
  const p = Object.fromEntries(dayFmt.formatToParts(now).map((x) => [x.type, x.value]));
  return <span suppressHydrationWarning>{`${p.weekday} ${p.day} ${p.month}`}</span>;
}

/** How many names are on the board. */
export function NameCount() {
  const { rows } = useLive();
  return <>{rows.length} names</>;
}
