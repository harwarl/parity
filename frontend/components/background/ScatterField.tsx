"use client";

/**
 * Pixel clusters scattered in a few places across the page — loose blobs of
 * small squares, mostly green, snapped to a small grid for a pixel-art read.
 * Not a full field: most of the background stays void. Deterministic layout
 * (fixed seed), SSR-safe, pure CSS. Twinkle freezes under reduced motion.
 */

interface Px {
  x: number;
  y: number;
  size: number;
  green: boolean;
  opacity: number;
  delay: number;
  dur: number;
}

// cluster centres in viewport %, with a spread and a rough pixel count
const CLUSTERS: { cx: number; cy: number; spread: number; n: number; hot: number }[] = [
  { cx: 82, cy: 16, spread: 13, n: 34, hot: 0.6 }, // behind / above the hero card
  { cx: 70, cy: 44, spread: 9, n: 20, hot: 0.5 },
  { cx: 12, cy: 62, spread: 10, n: 18, hot: 0.4 },
  { cx: 92, cy: 74, spread: 8, n: 16, hot: 0.35 },
  { cx: 40, cy: 88, spread: 11, n: 20, hot: 0.4 },
  { cx: 6, cy: 24, spread: 7, n: 12, hot: 0.45 },
];

const GRID = 1.35; // snap step in % — the "pixel" size on the page

const PIXELS: Px[] = (() => {
  let s = 20260909;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const gauss = () => (rnd() + rnd() + rnd() - 1.5) / 1.5;
  const snap = (v: number) => Math.round(v / GRID) * GRID;

  const out: Px[] = [];
  for (const c of CLUSTERS) {
    for (let i = 0; i < c.n; i++) {
      const x = snap(c.cx + gauss() * c.spread);
      const y = snap(c.cy + gauss() * c.spread * 0.8);
      if (x < -2 || x > 102 || y < -2 || y > 102) continue;
      const green = rnd() < 0.55 + c.hot * 0.3;
      out.push({
        x,
        y,
        size: rnd() < 0.18 ? 6 : rnd() < 0.55 ? 4 : 3,
        green,
        opacity: (green ? 0.2 : 0.14) + rnd() * (0.15 + c.hot * 0.4),
        delay: rnd() * -9,
        dur: 3.5 + rnd() * 6,
      });
    }
  }
  return out;
})();

export default function ScatterField() {
  return (
    <div className="absolute inset-0">
      {PIXELS.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-[1px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.green ? "var(--green)" : "var(--text-mute)",
            opacity: p.opacity,
            animation: p.green
              ? `pixel-twinkle ${p.dur}s ease-in-out ${p.delay}s infinite`
              : undefined,
          }}
        />
      ))}
    </div>
  );
}
