"use client";

import { useEffect, useRef } from "react";

/**
 * P1–P10 · dot-matrix scroll field (animations.md §6D). One fixed canvas
 * under every landing section after the hero: a faint 26px dot grid in
 * which each section lights its own lime pattern. Scroll drives it (so it
 * plays back on scroll-up); only P3, P6 and P9 also use the clock.
 *
 * Stacking: the marketing root is `isolate` (the spec's `.g-page`), the
 * canvas sits at z-index −1, so it paints over the page ground and under
 * all content. No ancestor may have transform/filter/perspective.
 * Never re-renders: everything lives in refs and the rAF loop.
 */

/** Section order; index = pattern. "close" (the CTA) fades the field out. */
const IDS = ["overview", "who", "how", "card", "reasons", "paper", "wont", "faq", "close"];
const GAP = 26;
const TAU = Math.PI * 2;

const hash = (i: number, j: number) => {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const gauss = (dx: number, dy: number, r: number) => Math.exp(-(dx * dx + dy * dy) / (2 * r * r));

type Pattern = (x: number, y: number, W: number, H: number, lp: number, t: number, i: number, j: number) => number;

const PATTERNS: Pattern[] = [
  // P2 · 01 Overview: ripple rings travelling outward
  (x, y, W, H, lp, t) => {
    const d = Math.hypot(x - W * 0.8, y - H * 0.5);
    return Math.max(0, Math.cos(d / 34 - lp * 14 - t * 0.5)) ** 3 * Math.exp(-d / 460);
  },
  // P3 · 02 Who it's for: three clusters taking turns (the 9s L4 cycle)
  (x, y, W, H, _lp, t) => {
    const k = Math.floor(t / 3) % 3;
    return [0.2, 0.5, 0.8].reduce((m, u, n) => Math.max(m, gauss(x - W * u, y - H * 0.78, 110) * (n === k ? 1 : 0.3)), 0);
  },
  // P4 · 03 How it works: three columns switching on in order, a pulse falling through
  (x, y, W, H, lp) =>
    [0.2, 0.5, 0.8].reduce(
      (m, u, n) =>
        Math.max(
          m,
          Math.abs(x - W * u) < 40 && lp > n / 3 ? Math.exp(-Math.abs(y - H * (1 - ((lp * 3 - n) % 1))) / 160) : 0,
        ),
      0,
    ),
  // P5 · 04 The card: a ring draining like the 75s countdown
  (x, y, W, H, lp) => {
    const dx = x - W * 0.8;
    const dy = y - H * 0.52;
    const d = Math.hypot(dx, dy);
    const a = (Math.atan2(dx, -dy) / TAU + 1) % 1;
    return Math.abs(d - 210) < 16 ? (a < 1 - lp * 0.85 ? 1 : 0.22) : 0;
  },
  // P6 · 05 No prompt?: dust twinkle
  (_x, _y, _W, _H, _lp, t, i, j) => {
    const h = hash(i, j);
    return h > 0.965 ? 0.5 + 0.5 * Math.sin(t * 1.3 + h * 40) : 0;
  },
  // P7 · 06 Practice or real: a line moving from practice to live
  (x, _y, W, _H, lp) => {
    const sx = W * (0.15 + 0.7 * lp);
    return Math.abs(x - sx) < 14 ? 1 : x > sx ? 0.22 * Math.exp(-(x - sx) / 300) : 0;
  },
  // P8 · 07 Won't do: a ✕ drawing itself
  (x, y, W, H, lp) => {
    const s = 190;
    const u = (x - W * 0.8) / s;
    const v = (y - H * 0.5) / s;
    if (Math.abs(u) > 1 || Math.abs(v) > 1) return 0;
    const a = Math.abs(u - v) < 0.09 && (u + 1) / 2 < lp * 2;
    const b = Math.abs(u + v) < 0.09 && (u + 1) / 2 < lp * 2 - 1;
    return a || b ? 1 : 0;
  },
  // P9 · 08 FAQ: a glow settling along the bottom
  (_x, y, _W, H, _lp, t, i, j) => {
    const h = hash(i, j);
    return Math.max(0, (y / H - 0.55) * 1.6) * (h > 0.8 ? 0.5 + 0.5 * Math.sin(t * 0.9 + h * 30) : 0.25);
  },
  // P10 · closing CTA: nothing (the field fades out)
  () => 0,
];

export function DotField() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const D = { sec: -1, prev: -1, changed: 0, raf: 0, on: 0 };

    const draw = (now: number) => {
      D.raf = 0;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
        cv.width = Math.round(W * dpr);
        cv.height = Math.round(H * dpr);
      }

      // Active section: the last whose top is above mid-viewport.
      let sec = -1;
      let lp = 0;
      IDS.forEach((id, n) => {
        const el = document.getElementById(id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top < H * 0.5) {
          sec = n;
          lp = Math.min(1, Math.max(0, (H * 0.5 - r.top) / Math.max(1, r.height)));
        }
      });
      if (sec !== D.sec) {
        D.prev = D.sec;
        D.sec = sec;
        D.changed = now;
      }

      const t = rm ? 0 : now / 1000;
      const mix = rm ? 1 : Math.min(1, (now - D.changed) / 700);
      const target = sec >= 0 && sec < 8 ? 1 : 0;
      D.on += (target - D.on) * (rm ? 1 : 0.08);
      const band = 0.1 + 0.8 * lp;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (D.on > 0.01) {
        const ox = (W % GAP) / 2;
        const oy = (H % GAP) / 2;
        for (let j = 0, y = oy; y < H; j++, y += GAP) {
          for (let i = 0, x = ox; x < W; i++, x += GAP) {
            let v = sec >= 0 ? PATTERNS[sec](x, y, W, H, lp, t, i, j) * mix : 0;
            if (mix < 1 && D.prev >= 0) v += PATTERNS[D.prev](x, y, W, H, lp, t, i, j) * (1 - mix);
            v *= 0.5 + 0.5 * Math.exp(-((y / H - band) ** 2) / 0.06);
            ctx.globalAlpha = D.on * (0.085 + v * 0.62);
            ctx.fillStyle = v > 0.08 ? "#B2D450" : "#F9F7F4";
            ctx.beginPath();
            ctx.arc(x, y, v > 0.08 ? 1.3 + v * 0.9 : 1, 0, TAU);
            ctx.fill();
          }
        }
      }
      cv.style.opacity = "1";
      if (!rm && !document.hidden && (D.on > 0.01 || target)) D.raf = requestAnimationFrame(draw);
    };

    const kick = () => {
      if (!D.raf) D.raf = requestAnimationFrame(draw);
    };
    window.addEventListener("scroll", kick, { capture: true, passive: true });
    window.addEventListener("resize", kick);
    document.addEventListener("visibilitychange", kick);
    const first = setTimeout(kick, 60);
    return () => {
      clearTimeout(first);
      cancelAnimationFrame(D.raf);
      window.removeEventListener("scroll", kick, { capture: true });
      window.removeEventListener("resize", kick);
      document.removeEventListener("visibilitychange", kick);
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-1 h-screen w-screen opacity-0"
    />
  );
}
