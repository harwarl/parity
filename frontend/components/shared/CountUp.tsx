"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts from 0 to `value` once, when it scrolls into view. Renders the final
 * value immediately under reduced motion or if the observer never fires.
 */
export default function CountUp({
  value,
  duration = 900,
  decimals = 0,
  className,
}: {
  value: number;
  duration?: number;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [n, setN] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !el) return;

    let raf = 0;
    let start = 0;
    const run = () => {
      const step = (t: number) => {
        if (!start) start = t;
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(value * eased);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    setN(0);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    const failsafe = window.setTimeout(() => {
      io.disconnect();
      setN(value);
    }, 1600);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(failsafe);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {n.toFixed(decimals)}
    </span>
  );
}
