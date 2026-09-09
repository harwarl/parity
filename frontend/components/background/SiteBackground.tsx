"use client";

import { useEffect, useRef } from "react";
import ScatterField from "./ScatterField";

/**
 * One background for the whole site: pixels scattered behind every section,
 * loud with a green "gap" glow behind the hero and fading to a faint dusting as
 * you scroll past. A single fixed layer, so nothing seams.
 */
export default function SiteBackground() {
  const scatterRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const vh = window.innerHeight || 800;
      const t = Math.min(1, Math.max(0, (window.scrollY - vh * 0.3) / vh));
      const v = 1 - t * (1 - 0.35);
      if (scatterRef.current) scatterRef.current.style.opacity = String(v);
      if (glowRef.current) glowRef.current.style.opacity = String(0.6 * (1 - t));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-ground">
      <div
        ref={glowRef}
        className="absolute -top-56 right-0 h-[56rem] w-[56rem] rounded-full opacity-60 blur-[90px] lg:right-[8%]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, #00dc7a 20%, transparent) 0%, transparent 62%)",
        }}
      />

      <div ref={scatterRef} className="absolute inset-0 transition-opacity duration-300">
        <ScatterField />
      </div>

      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
