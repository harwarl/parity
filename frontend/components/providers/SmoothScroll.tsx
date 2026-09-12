"use client";

import Lenis from "lenis";
import { type ReactNode, useEffect } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Lenis smooth scroll. Disabled entirely under prefers-reduced-motion — native
 * scroll only.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.12,
    });

    // Keep GSAP's ScrollTrigger measurements in sync with Lenis's smoothed
    // scroll position — otherwise scroll-linked animations lag/jitter.
    lenis.on("scroll", ScrollTrigger.update);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
