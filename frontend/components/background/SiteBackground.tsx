"use client";

import { useEffect, useRef } from "react";

/**
 * Site background — a faint pixel dot field, a bright cluster toward the
 * upper-right and a subtle one in the lower-left, plus a green "gap" glow that
 * anchors the hero. Fixed to the viewport; the field dims for lower sections
 * but never disappears, the glow fades out after the hero. Static draw,
 * redrawn only on resize.
 */

const GREEN = "0,220,122";
const PAPER = "244,244,243";

interface Dot {
  x: number;
  y: number;
  a: number;
  green: boolean;
}

export default function SiteBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dots: Dot[] = [];
    let W = 0;
    let H = 0;

    const build = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const narrow = W < 760;
      let s = 99173;
      const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);

      dots = [];

      const cluster = (
        cx: number,
        cy: number,
        rx: number,
        ry: number,
        keep: number,
        maxA: number,
      ) => {
        for (let y = 20; y < H; y += 16) {
          for (let x = 20; x < W; x += 16) {
            const d = Math.hypot((x - cx) / rx, (y - cy) / ry);
            if (d > 1.2 || rnd() > keep) continue;
            dots.push({
              x,
              y,
              a: Math.max(0, 1 - d) * maxA,
              green: rnd() < 0.13,
            });
          }
        }
      };

      // primary: upper-right
      cluster(
        W - (narrow ? 60 : 340),
        narrow ? 200 : 250,
        620,
        320,
        0.62,
        narrow ? 0.13 : 0.18,
      );
      // counterweight: lower-left, a touch quieter than the primary
      cluster(
        narrow ? 40 : 200,
        H - (narrow ? 120 : 180),
        narrow ? 340 : 520,
        narrow ? 220 : 300,
        0.56,
        narrow ? 0.11 : 0.15,
      );
    };

    const paint = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of dots) {
        ctx.fillStyle = `rgba(${p.green ? GREEN : PAPER},${(p.green ? p.a * 1.3 : p.a).toFixed(3)})`;
        ctx.fillRect(p.x, p.y, 2, 2);
      }
    };

    const fade = () => {
      const y = window.scrollY;
      canvas.style.opacity = String(Math.max(0.4, 1 - y / 900));
      if (glowRef.current) {
        glowRef.current.style.opacity = String(Math.max(0, 0.5 * (1 - y / 460)));
      }
    };

    build();
    paint();
    fade();

    let resizeId = 0;
    const onResize = () => {
      window.clearTimeout(resizeId);
      resizeId = window.setTimeout(() => {
        build();
        paint();
        fade();
      }, 160);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", fade, { passive: true });
    return () => {
      window.clearTimeout(resizeId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", fade);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ground"
    >
      <div
        ref={glowRef}
        className="absolute -right-40 -top-24 h-140 w-225"
        style={{
          background:
            "radial-gradient(ellipse at 62% 40%, rgba(0,220,122,.16), rgba(0,220,122,.04) 44%, transparent 70%)",
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-300"
      />
    </div>
  );
}
