"use client";

import { useMode } from "./ModeProvider";

/** Live-mode notice under the top bar (Home only, design.md §5B.12 A). */
export function LiveStrip() {
  const { mode } = useMode();
  if (mode !== "live") return null;
  return (
    <p
      role="status"
      className="mb-6 flex flex-wrap items-center gap-3 rounded-inset border border-accent/35 bg-accent/8 px-5 py-3 text-[14px] text-ink-2"
    >
      <span className="font-mono text-[11px] tracking-[0.2em] text-accent">LIVE</span>
      Do it places one cash-equity order on your Agentic Account through the Robinhood Trading
      MCP. Nothing else moves.
    </p>
  );
}
