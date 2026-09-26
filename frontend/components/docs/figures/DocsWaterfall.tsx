"use client";

import { useEffect, useRef, useState } from "react";

/**
 * How a card is made · haircut waterfall (K4 = J8 timing, 20px bars).
 * Plays once when it scrolls into view. Server render is the finished state,
 * so without JS the figure still reads correctly.
 */
const rows = [
  { label: "|gap|", value: "17.0", from: 0, to: 100, color: "#C9CBCF", origin: "left", dur: 0.6, delay: 0 },
  { label: "− fees", value: "3.5", from: 79.4, to: 100, color: "rgba(255,107,94,.85)", origin: "right", dur: 0.5, delay: 0.2 },
  { label: "− slippage", value: "2.1", from: 67.1, to: 79.4, color: "rgba(255,107,94,.65)", origin: "right", dur: 0.5, delay: 0.35 },
  { label: "− buffer", value: "2.0", from: 55.3, to: 67.1, color: "rgba(255,107,94,.45)", origin: "right", dur: 0.5, delay: 0.5 },
  { label: "Net", value: "9.4", from: 0, to: 55.3, color: "#B2D450", origin: "left", dur: 0.6, delay: 0.7 },
];

export function DocsWaterfall() {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"static" | "armed" | "play">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setPhase("play");
          io.disconnect();
        } else setPhase((p) => (p === "static" ? "armed" : p));
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Waterfall: gross gap 17.0 bps, minus fees 3.5, slippage 2.1 and buffer 2.0, leaves net 9.4 bps, above the 2.0 floor."
      className="rounded-2xl border border-ink/10 bg-[#0C0D10] px-6 py-5"
    >
      <ul className="flex flex-col gap-3">
        {rows.map((r) => (
          <li key={r.label} className="grid grid-cols-[100px_1fr_44px] items-center gap-3">
            <span className={`font-mono text-[12px] ${r.label === "Net" ? "text-accent" : "text-muted"}`}>{r.label}</span>
            <span className="relative h-5 rounded-full bg-track">
              <span
                className="absolute inset-y-0 rounded-full"
                style={{
                  left: `${r.from}%`,
                  width: `${r.to - r.from}%`,
                  background: r.color,
                  transformOrigin: r.origin,
                  transform: phase === "armed" ? "scaleX(0)" : undefined,
                  animation: phase === "play" ? `j-grow ${r.dur}s ease-out ${r.delay}s both` : undefined,
                  boxShadow: r.label === "Net" ? "0 0 12px rgba(178,212,80,.45)" : undefined,
                }}
              />
              {r.label === "Net" && (
                <span className="absolute -top-1 -bottom-1 w-0.5 bg-ink" style={{ left: "11.8%" }}>
                  <span className="absolute top-full left-1/2 mt-1 -translate-x-1/2 font-mono text-[9px] tracking-[0.12em] whitespace-nowrap text-ink">
                    FLOOR 2.0
                  </span>
                </span>
              )}
            </span>
            <span className={`text-right font-mono text-[13px] ${r.label === "Net" ? "text-accent" : r.origin === "right" ? "text-neg" : "text-ink"}`}>
              {r.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
