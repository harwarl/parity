"use client";

import { Pill } from "@/components/ui/Pill";
import { useMode } from "@/components/app/shell/ModeProvider";

/** PAPER or LIVE, following the global mode. */
export function ModePill() {
  const { mode } = useMode();
  return (
    <Pill size="sm" tone="lime" dot="live">
      {mode === "live" ? "Live" : "Paper"}
    </Pill>
  );
}
