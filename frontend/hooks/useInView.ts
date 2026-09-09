"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  /** Stop observing once it has entered. Default true. */
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
}

/** Observe when an element enters the viewport. */
export function useInView<T extends Element = HTMLDivElement>({
  once = true,
  rootMargin = "0px 0px -12% 0px",
  threshold = 0.15,
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, inView };
}
