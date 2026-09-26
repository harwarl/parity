"use client";

import { useEffect } from "react";

/**
 * Drives .g-reveal on the landing page. An element "comes together" when it
 * enters the viewport and "scatters" again when it drops back below the fold
 * (you scrolled up past it). Leaving through the top keeps it assembled.
 * Without JS, or with reduced motion, everything simply stays visible.
 */
export function RevealObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    root.classList.add("js-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) el.setAttribute("data-in", "");
          else if (entry.boundingClientRect.top > 0) el.removeAttribute("data-in");
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    document.querySelectorAll<HTMLElement>(".g-reveal").forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      root.classList.remove("js-reveal");
    };
  }, []);

  return null;
}
