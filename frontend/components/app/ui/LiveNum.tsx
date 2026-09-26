"use client";

import { useState, type CSSProperties } from "react";

/**
 * A number that flashes when it changes: lime wash when it rises, red when
 * it falls (animations.md §6B: motion signals "a value just changed").
 * Remounting on each new value replays the flash.
 */
export function LiveNum({
  value,
  text,
  className = "",
  style,
  invert = false,
}: {
  value: number;
  text: string;
  className?: string;
  style?: CSSProperties;
  /** For costs, where a rise is bad news. */
  invert?: boolean;
}) {
  // Derived state: remember the last value and which way it moved.
  const [seen, setSeen] = useState<{ v: number; dir: "up" | "down" | null }>({ v: value, dir: null });
  if (value !== seen.v) setSeen({ v: value, dir: value > seen.v ? "up" : "down" });
  const dir = seen.dir;
  const good = invert ? dir === "down" : dir === "up";
  return (
    <span
      key={text}
      className={`-mx-1 rounded px-1 ${className}`}
      style={{
        ...style,
        animation: dir ? `${good ? "j-flash-up" : "j-flash-down"} 0.9s ease-out` : undefined,
      }}
    >
      {text}
    </span>
  );
}
