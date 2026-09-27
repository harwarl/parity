"use client";

import { useGauge } from "@/components/app/shell/GaugeProvider";

/**
 * Where the numbers come from: gauge-api, or design.md sample data while
 * the API is unreachable. Never let sample data pass for real.
 */
export function SourceBadge() {
  const { status } = useGauge();
  const online = status === "online";
  const label = online ? "Live API" : status === "connecting" ? "Connecting" : "Sample data · API offline";
  return (
    <span
      role="status"
      title={online ? "Numbers come from gauge-api" : "gauge-api is unreachable; showing design sample data"}
      className={`inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 font-mono text-[10px] tracking-[0.14em] uppercase ${
        online ? "border-accent/40 text-accent" : "border-thin/45 bg-thin/8 text-thin"
      }`}
    >
      <span aria-hidden className={`size-1.5 rounded-full ${online ? "g-live" : "bg-thin"}`} />
      {label}
    </span>
  );
}
