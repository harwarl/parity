"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import BrickField from "./BrickField";

/**
 * One background for the whole site: a single WebGL basis field, fixed behind
 * every section. It is loud behind the hero and eases to a faint texture once
 * you scroll past — driven by one scroll-linked uniform, so nothing seams.
 * Reduced motion, small screens, and low-core machines get a still gradient.
 */
export default function SiteBackground() {
  const reduced = usePrefersReducedMotion();
  const [gl, setGl] = useState(false);
  const intensity = useRef(1);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 767px)").matches;
    const veryWeak =
      navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2;
    const id = requestAnimationFrame(() =>
      setGl(!reduced && !small && !veryWeak),
    );
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const vh = window.innerHeight || 800;
      const t = Math.min(1, Math.max(0, (window.scrollY - vh * 0.3) / vh));
      const value = 1 - t * (1 - 0.12);
      intensity.current = value;
      if (glowRef.current) glowRef.current.style.opacity = String(0.6 * value);
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
      {/* the green "gap" glow — anchors the hero, dims on scroll */}
      <div
        ref={glowRef}
        className="absolute -top-56 right-0 h-[56rem] w-[56rem] rounded-full opacity-60 blur-[90px] lg:right-[8%]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, #00dc7a 22%, transparent) 0%, transparent 62%)",
        }}
      />

      {gl ? (
        <Canvas
          className="absolute! inset-0"
          dpr={[1, 1.6]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, 0, 8.5], fov: 46 }}
          onCreated={({ gl: renderer }) => {
            renderer.domElement.addEventListener(
              "webglcontextlost",
              () => setGl(false),
              { once: true },
            );
          }}
        >
          <BrickField intensityRef={intensity} />
        </Canvas>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, color-mix(in oklab, #ffffff 5%, transparent) 0 1px, transparent 1px 34px), repeating-linear-gradient(90deg, color-mix(in oklab, #ffffff 5%, transparent) 0 1px, transparent 1px 92px)",
            maskImage:
              "radial-gradient(130% 80% at 74% 2%, #000 0%, transparent 66%)",
            WebkitMaskImage:
              "radial-gradient(130% 80% at 74% 2%, #000 0%, transparent 66%)",
          }}
        />
      )}

      {/* grain, barely there */}
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
