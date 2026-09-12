"use client";

import { useLayoutEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";

const steps = [
  {
    n: "1",
    h: "See the gap",
    p: "We compare the cash mid (Robinhood, RTH only) to the token's implied per-share price (chain, 24/7).",
  },
  {
    n: "2",
    h: "Haircut it",
    p: "We subtract fees, slippage, and a safety buffer. Only net edge counts.",
  },
  {
    n: "3",
    h: "Get a card",
    p: "If net edge, session, depth, and your daily cap (3/day) all pass, you get a confirm-gated opportunity card (75s TTL).",
  },
  {
    n: "4",
    h: "You tap",
    p: "Paper fills at confirm mid by default. Live places one cash-equity order through the official Robinhood Trading MCP, in your Agentic Account, after you personally confirm.",
  },
];

/** "How it works" — the 4-step flow, with connecting arrows on desktop. */
export default function HowItWorksSteps() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-hiw-head]", {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
      gsap.from("[data-hiw-step]", {
        opacity: 0,
        y: 22,
        duration: 0.55,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: { trigger: "[data-hiw-grid]", start: "top 85%" },
      });
      gsap.from("[data-hiw-arrow]", {
        opacity: 0,
        x: -6,
        duration: 0.4,
        stagger: 0.12,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: { trigger: "[data-hiw-grid]", start: "top 85%" },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={ref} id="how" className="scroll-mt-24 border-t border-line py-16 sm:py-20">
      <div className="mx-auto w-full max-w-360 px-6 sm:px-12 lg:px-16">
        <div data-hiw-head className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight text-text sm:text-[2rem]">
            How it works
          </h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-text-dim">
            Simple flow. Real signals. You stay in control.
          </p>
        </div>

        <div data-hiw-grid className="relative mt-12 grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div data-hiw-step>
                <span className="flex size-9 items-center justify-center rounded-full bg-green-soft text-[0.95rem] font-bold text-green">
                  {s.n}
                </span>
                <h3 className="mt-4 text-[1.05rem] font-semibold text-text">{s.h}</h3>
                <p className="mt-2 text-[0.85rem] leading-relaxed text-text-dim">{s.p}</p>
              </div>
              {i < steps.length - 1 ? (
                <span
                  data-hiw-arrow
                  aria-hidden
                  className="absolute top-3.5 -right-2 hidden text-text-mute lg:block"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
                  </svg>
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
