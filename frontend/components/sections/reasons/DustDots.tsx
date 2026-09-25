import type { CSSProperties } from "react";

/** E4 · "0.3" blurs away while eight dots drift off (3.2s). */
const dots = [
  { left: 8, top: 30, dx: -10, delay: 0 },
  { left: 22, top: 20, dx: 6, delay: 0.1 },
  { left: 34, top: 34, dx: -4, delay: 0.2 },
  { left: 48, top: 24, dx: 12, delay: 0.05 },
  { left: 60, top: 36, dx: -8, delay: 0.25 },
  { left: 72, top: 22, dx: 10, delay: 0.15 },
  { left: 86, top: 32, dx: 4, delay: 0.3 },
  { left: 98, top: 26, dx: 14, delay: 0.08 },
];

export function DustDots() {
  return (
    <div
      role="img"
      aria-label="A net gap of 0.3 basis points dissolving into nothing."
      className="relative flex h-16 items-center justify-between"
    >
      <span
        className="g-dot text-[40px] leading-none"
        style={{ animation: "g-dustnum 3.2s ease-in-out infinite" }}
      >
        0.3
      </span>
      {dots.map((d) => (
        <span
          key={d.left}
          aria-hidden
          className="absolute size-[5px] rounded-[1px] bg-accent"
          style={
            {
              left: d.left,
              top: d.top,
              "--dx": `${d.dx}px`,
              animation: `g-dust 3.2s ease-out ${d.delay}s infinite both`,
            } as CSSProperties
          }
        />
      ))}
      <span className="self-end pb-2 font-mono text-[9px] tracking-[0.16em] text-dim">NET BPS</span>
    </div>
  );
}
