"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

/**
 * Scroll-driven reveal. Content is visible by default. The hidden/animated state
 * only applies after mount, only when motion is allowed, and only for elements
 * still below the fold — and a hard timeout reveals everything regardless, so a
 * missed observer, a full-page capture, or reader mode never sees blank space.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 14,
  scaleFrom,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** e.g. 1.18 for a "stamp in" feel. Overrides the translate. */
  scaleFrom?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (reduce || !el) {
      setShown(true);
      return;
    }
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      setShown(true);
      return;
    }

    setArmed(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    io.observe(el);

    // Safety net: never leave content hidden.
    const failsafe = window.setTimeout(() => setShown(true), 1400);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  const hidden = armed && !shown;
  const hiddenTransform = scaleFrom ? `scale(${scaleFrom})` : `translateY(${y}px)`;
  const ease = scaleFrom
    ? "cubic-bezier(0.34,1.4,0.64,1)"
    : "cubic-bezier(0.16,1,0.3,1)";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? hiddenTransform : "none",
        transition: armed
          ? `opacity 0.5s ease ${delay}ms, transform 0.55s ${ease} ${delay}ms`
          : undefined,
        willChange: hidden ? "opacity, transform" : undefined,
      }}
    >
      {children}
    </div>
  );
}
