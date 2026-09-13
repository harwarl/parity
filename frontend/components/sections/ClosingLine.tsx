"use client";

import { useLayoutEffect, useRef } from "react";
import Container from "@/components/layout/Container";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";

const LINE = "If you cannot point at two prices, GAUGE does not trade.";

/** Full-width closing line, PARE cadence — the beat classic ends on too. */
export default function ClosingLine() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-cl-word]",
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 75%", end: "top 25%", scrub: 0.4 },
        },
      );
      gsap.from("[data-cl-sub]", {
        opacity: 0,
        y: 10,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 40%" },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[50vh] items-center overflow-hidden border-t border-line py-20 sm:py-28"
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-linear-to-b from-transparent via-green/40 to-transparent sm:block"
      />
      <Container>
        <p className="max-w-4xl text-balance text-[1.8rem] font-bold leading-[1.12] tracking-[-0.02em] text-text sm:text-[2.6rem]">
          {LINE.split(" ").map((w, i) => (
            <span key={i} data-cl-word className={i >= 7 ? "text-text-mute" : undefined}>
              {w}{" "}
            </span>
          ))}
        </p>
        <p data-cl-sub className="mt-7 text-[0.78rem] uppercase tracking-[0.2em] text-text-mute">
          Signals, not advice · Token ≠ share · Paper is not live
        </p>
      </Container>
    </section>
  );
}
