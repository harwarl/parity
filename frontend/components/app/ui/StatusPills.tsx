"use client";

import { Pill } from "@/components/ui/Pill";
import { useGauge } from "@/components/app/shell/GaugeProvider";

/** Cards used today against the daily cap (sample: 1/3). */
export function CapPill() {
  const { status, stats } = useGauge();
  const text = status === "online" && stats ? `Cap ${stats.cap.used}/${stats.cap.limit}` : "Cap 1/3";
  return <Pill size="sm">{text}</Pill>;
}

/** Backend checks passing (sample: all six feeds). */
export function FeedsPill() {
  const { status, health } = useGauge();
  if (status !== "online") return <Pill size="sm">Feeds 6/6 OK</Pill>;
  const checks = health
    ? [health.redis.ok, health.exec.ok, (health.tape.freshest_tick_age_ms ?? Infinity) < 5_000]
    : [];
  const ok = checks.filter(Boolean).length;
  return (
    <Pill size="sm" tone={checks.length && ok === checks.length ? "lime" : "default"}>
      Feeds {ok}/{checks.length} OK
    </Pill>
  );
}
