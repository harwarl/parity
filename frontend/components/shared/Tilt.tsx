"use client";

import { type ReactNode, useEffect, useRef } from "react";

/**
 * Pointer-parallax tilt — the hover feel the WebGL hero slab had, on a plain
 * element. The card leans toward the cursor with damping, drifts slowly at
 * rest, and eases back on leave. A faint sheen tracks the pointer. Inert under
 * prefers-reduced-motion.
 */
export default function Tilt({
  children,
  className = "",
  max = 3,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const sheen = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = wrap.current;
    const el = inner.current;
    if (!w || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let hovering = false;
    let raf = 0;
    let t = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = w.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      target.x = -py * 2;
      target.y = px * 2;
      hovering = true;
      if (sheen.current) {
        sheen.current.style.opacity = "0.6";
        sheen.current.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
        sheen.current.style.setProperty("--my", `${(py + 0.5) * 100}%`);
      }
    };
    const onLeave = () => {
      hovering = false;
      target.x = 0;
      target.y = 0;
      if (sheen.current) sheen.current.style.opacity = "0";
    };

    const tick = () => {
      t += 0.016;
      const driftX = hovering ? 0 : Math.sin(t * 0.45) * 0.06;
      const driftY = hovering ? 0 : Math.cos(t * 0.38) * 0.04;
      cur.x += (target.x + driftX - cur.x) * 0.06;
      cur.y += (target.y + driftY - cur.y) * 0.06;
      el.style.transform = `rotateX(${(cur.x * max).toFixed(2)}deg) rotateY(${(cur.y * max).toFixed(2)}deg)`;
      raf = requestAnimationFrame(tick);
    };

    w.addEventListener("pointermove", onMove);
    w.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      w.removeEventListener("pointermove", onMove);
      w.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [max]);

  return (
    <div
      ref={wrap}
      className={className}
      style={{ perspective: "1100px" }}
    >
      <div
        ref={inner}
        className="relative transition-transform duration-500 ease-out [transform-style:preserve-3d] will-change-transform"
      >
        {children}
        <div
          ref={sheen}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(260px circle at var(--mx,50%) var(--my,50%), color-mix(in oklab, #00dc7a 6%, transparent), transparent 62%)",
          }}
        />
      </div>
    </div>
  );
}
