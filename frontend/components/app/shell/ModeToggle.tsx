"use client";

import { useMode, type Mode } from "./ModeProvider";

/** Segmented Paper · Live pill (design.md §5B.2). */
export function ModeToggle() {
  const { mode, setMode } = useMode();
  const options: { value: Mode; label: string }[] = [
    { value: "paper", label: "Paper" },
    { value: "live", label: "Live" },
  ];
  return (
    <div role="group" aria-label="Mode" className="flex rounded-full border border-ink/10 bg-bg p-1">
      {options.map((o) => {
        const on = mode === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => setMode(o.value)}
            className={`h-8 cursor-pointer rounded-full px-4 text-[13px] font-semibold transition-colors ${
              on
                ? o.value === "live"
                  ? "bg-accent text-accent-ink shadow-[0_0_18px_-2px_rgba(178,212,80,.7)]"
                  : "bg-ink text-accent-ink"
                : "text-muted hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
