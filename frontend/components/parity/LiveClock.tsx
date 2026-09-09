"use client";

import { useEffect, useState } from "react";

const fmt = () =>
  new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

/** Ticking RTH-style clock for the hero console strip. */
export default function LiveClock() {
  const [now, setNow] = useState("09:41:07");

  useEffect(() => {
    const tick = () => setNow(fmt());
    const raf = requestAnimationFrame(tick);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = reduce ? undefined : window.setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(raf);
      if (id) window.clearInterval(id);
    };
  }, []);

  return <span suppressHydrationWarning>{now}</span>;
}
