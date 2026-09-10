"use client";

import { useEffect, useRef } from "react";

/**
 * Site background — the PARE family cue, made PARITY's own. Two fixed canvases:
 *
 *  - #bgfx : a faint dot field (radial falloff, upper-right) with a sparse layer
 *            of PARITY's own vocabulary in monospace mixed in. Dims for lower
 *            sections but never disappears.
 *  - #bgmark : the mark — a pixel *tape* of price bars, a few lit green and
 *            slowly ticking. Recedes as the page scrolls so copy never sits on
 *            the green cells.
 *
 * Plus a soft green glow that anchors the hero and fades out after it.
 */

const GREEN = "0,220,122";
const PAPER = "244,244,243";
const MONO = "11px ui-monospace, SFMono-Regular, Menlo, monospace";

const SYMBOLS = ["HOOD", "NVDA", "AAPL", "TSLA", "GOOGL", "MSFT", "AMZN", "META"];
const SESSIONS = ["RTH", "EXT", "OVERNIGHT", "WEEKEND"];

function token(rnd: () => number): { text: string; green: boolean } {
  const r = rnd();
  if (r < 0.26) {
    const n = Math.round(rnd() * 60 - 20);
    return { text: `${n >= 0 ? "+" : "−"}${Math.abs(n)} bps`, green: n > 8 && rnd() < 0.5 };
  }
  if (r < 0.44) return { text: `$${(80 + rnd() * 700).toFixed(2)}`, green: false };
  if (r < 0.6) return { text: SYMBOLS[Math.floor(rnd() * SYMBOLS.length)], green: false };
  if (r < 0.72) return { text: SESSIONS[Math.floor(rnd() * 4)], green: false };
  if (r < 0.84) return { text: `${(1 + rnd() * 0.02).toFixed(3)}×`, green: false };
  if (r < 0.92) return { text: `${Math.ceil(rnd() * 75)}s`, green: false };
  return { text: `net ${Math.ceil(rnd() * 40)}`, green: rnd() < 0.6 };
}

const BAR_COUNT = 14;
const LIT = new Set([3, 7, 11]);
const BASE_H = (() => {
  let s = 424242;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  return Array.from({ length: BAR_COUNT }, () => 0.3 + rnd() * 0.7);
})();

interface Dot {
  x: number;
  y: number;
  a: number;
  green: boolean;
}
interface Cell {
  x: number;
  y: number;
  text: string;
  green: boolean;
  ticks: boolean;
}

export default function SiteBackground() {
  const fxRef = useRef<HTMLCanvasElement>(null);
  const markRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fx = fxRef.current;
    const mark = markRef.current;
    if (!fx || !mark) return;
    const ctx = fx.getContext("2d");
    const mtx = mark.getContext("2d");
    if (!ctx || !mtx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dots: Dot[] = [];
    let cells: Cell[] = [];
    const heights = [...BASE_H];

    const size = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      for (const cv of [fx, mark]) {
        cv.width = Math.floor(W * dpr);
        cv.height = Math.floor(H * dpr);
        cv.style.width = `${W}px`;
        cv.style.height = `${H}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = MONO;
      ctx.textBaseline = "middle";
    };

    const build = () => {
      const narrow = W < 760;
      let s = 99173;
      const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);

      // dot field — radial falloff toward the upper-right
      dots = [];
      const cx = W - (narrow ? 60 : 340);
      const cy = narrow ? 200 : 250;
      for (let y = 20; y < H; y += 16) {
        for (let x = 20; x < W; x += 16) {
          const dx = (x - cx) / 600;
          const dy = (y - cy) / 320;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > 1.2 || rnd() > 0.62) continue;
          dots.push({
            x,
            y,
            a: Math.max(0, 1 - d) * (narrow ? 0.12 : 0.17),
            green: rnd() < 0.13,
          });
        }
      }

      // numeral layer — faint, banded
      cells = [];
      for (let y = 44; y < H - 10; y += 30) {
        if (rnd() < 0.42) continue;
        const n = 1 + Math.floor(rnd() * 3);
        for (let i = 0; i < n; i++) {
          const t = token(rnd);
          cells.push({
            x: rnd() * (W - 90),
            y: y + (rnd() - 0.5) * 10,
            text: t.text,
            green: t.green,
            ticks: t.text.includes("bps") && rnd() < 0.5,
          });
        }
      }
    };

    const paintFx = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of dots) {
        ctx.fillStyle = `rgba(${p.green ? GREEN : PAPER},${(p.green ? p.a * 1.3 : p.a).toFixed(3)})`;
        ctx.fillRect(p.x, p.y, 2, 2);
      }
      for (const c of cells) {
        const heroBoost = 1 - Math.min(0.45, c.y / (H * 1.5));
        const a = (c.green ? 0.2 : 0.1) * (0.65 + heroBoost);
        ctx.fillStyle = `rgba(${c.green ? GREEN : PAPER},${a.toFixed(3)})`;
        ctx.fillText(c.text, c.x, c.y);
      }
    };

    const paintMark = () => {
      const narrow = W < 760;
      mtx.clearRect(0, 0, W, H);
      const cell = narrow ? 9 : 15;
      const gap = narrow ? 4 : 7;
      const rows = narrow ? 12 : 16;
      const ox = W - (narrow ? 140 : 440) - BAR_COUNT * (cell + gap);
      const baseY = (narrow ? 110 : 84) + rows * (cell + gap);
      for (let b = 0; b < BAR_COUNT; b++) {
        const x = ox + b * (cell + gap);
        const filled = Math.max(1, Math.round(heights[b] * rows));
        const lit = LIT.has(b);
        for (let r = 0; r < filled; r++) {
          const y = baseY - (r + 1) * (cell + gap);
          if (lit) {
            const top = r >= filled - 2;
            mtx.fillStyle = `rgba(${GREEN},${top ? 0.36 : 0.16})`;
            if (top) {
              mtx.shadowColor = `rgba(${GREEN},0.55)`;
              mtx.shadowBlur = 15;
            }
            mtx.fillRect(x, y, cell, cell);
            mtx.shadowBlur = 0;
          } else {
            mtx.fillStyle = `rgba(${PAPER},${narrow ? 0.06 : 0.085})`;
            mtx.fillRect(x, y, cell, cell);
          }
        }
      }
    };

    const redraw = () => {
      size();
      build();
      paintFx();
      paintMark();
    };

    const fade = () => {
      const y = window.scrollY;
      fx.style.opacity = String(Math.max(0.4, 1 - y / 900));
      mark.style.opacity = String(Math.max(0.08, 1 - y / 520));
      if (glowRef.current) {
        glowRef.current.style.opacity = String(Math.max(0, 0.55 * (1 - y / 460)));
      }
    };

    redraw();
    fade();

    let tickId = 0;
    if (!reduced) {
      tickId = window.setInterval(() => {
        for (const b of LIT) {
          heights[b] = Math.min(
            1,
            Math.max(0.28, heights[b] + (Math.random() - 0.5) * 0.16),
          );
        }
        let cellChanged = false;
        for (const c of cells) {
          if (c.ticks && Math.random() < 0.4) {
            const n = Math.round(Math.random() * 50 - 15);
            c.text = `${n >= 0 ? "+" : "−"}${Math.abs(n)} bps`;
            c.green = n > 8;
            cellChanged = true;
          }
        }
        paintMark();
        if (cellChanged) paintFx();
      }, 2500);
    }

    let resizeId = 0;
    const onResize = () => {
      window.clearTimeout(resizeId);
      resizeId = window.setTimeout(redraw, 160);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", fade, { passive: true });
    return () => {
      window.clearInterval(tickId);
      window.clearTimeout(resizeId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", fade);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-ground">
      <div
        ref={glowRef}
        className="absolute right-[-160px] -top-24 h-[560px] w-[900px]"
        style={{
          background:
            "radial-gradient(ellipse at 62% 40%, rgba(0,220,122,.16), rgba(0,220,122,.04) 44%, transparent 70%)",
        }}
      />
      <canvas ref={fxRef} className="absolute inset-0 h-full w-full transition-opacity duration-300" />
      <canvas
        ref={markRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-200"
      />
    </div>
  );
}
