"use client";

import { useEffect } from "react";

/**
 * Pauses loops in offscreen sections (animations.md §10). Toggles
 * `data-offscreen` on every `[data-motion]` element; CSS pauses the CSS
 * animations and SMIL is paused through the SVG API.
 */
export function MotionGate() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-motion]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          const visible = entry.isIntersecting;
          el.toggleAttribute("data-offscreen", !visible);
          el.querySelectorAll("svg").forEach((svg) => {
            if (visible) svg.unpauseAnimations();
            else svg.pauseAnimations();
          });
        }
      },
      { rootMargin: "120px 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return null;
}
