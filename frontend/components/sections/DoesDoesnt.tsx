"use client";

import { useLayoutEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";

const does = [
  "Measures the price gap between cash and token",
  "Accounts for fees, slippage, and a safety buffer",
  "Surfaces only net opportunities after costs",
  "Enforces session, depth, and 3/day limits",
  "Provides paper trading to prove the thesis",
  "Executes one cash-equity order via Robinhood (with your confirmation)",
];

const doesnt = [
  "Hold funds or custody anything",
  "Deploy a smart contract",
  "Issue, ship, or trade a token",
  "Hedge both legs or run arbitrage",
  "Place a trade without your explicit tap",
  "Trade when we can't point at two prices",
];

/** "What GAUGE does" / "What GAUGE doesn't do", plus the pull-quote panel. */
export default function DoesDoesnt() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-dd-card]", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 82%" },
      });
      gsap.from("[data-dd-row]", {
        opacity: 0,
        x: -10,
        duration: 0.35,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 78%" },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={ref} className="border-t border-line py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-360 gap-6 px-6 sm:px-12 lg:grid-cols-[1fr_1fr_0.9fr] lg:px-16">
        <div data-dd-card className="rounded-xl border border-line bg-surface p-6 sm:p-7">
          <h3 className="text-[1.05rem] font-semibold text-text">What GAUGE does</h3>
          <ul className="mt-5 space-y-3.5">
            {does.map((d) => (
              <li key={d} data-dd-row className="flex items-start gap-2.5 text-[0.85rem] leading-relaxed text-text-dim">
                <CheckIcon />
                {d}
              </li>
            ))}
          </ul>
        </div>

        <div data-dd-card className="rounded-xl border border-line bg-surface p-6 sm:p-7">
          <h3 className="text-[1.05rem] font-semibold text-text">What GAUGE doesn&apos;t do</h3>
          <ul className="mt-5 space-y-3.5">
            {doesnt.map((d) => (
              <li key={d} data-dd-row className="flex items-start gap-2.5 text-[0.85rem] leading-relaxed text-text-dim">
                <CrossIcon />
                {d}
              </li>
            ))}
          </ul>
        </div>

        <div
          data-dd-card
          className="flex flex-col justify-between rounded-xl border border-green/25 p-6 sm:p-7"
          style={{
            background:
              "radial-gradient(140% 100% at 0% 0%, color-mix(in oklab, var(--green) 12%, var(--surface)), var(--surface) 70%)",
          }}
        >
          <span className="text-4xl leading-none text-green/60">&ldquo;</span>
          <p className="mt-4 text-[1.15rem] font-medium leading-snug text-text">
            A simple idea: two prices, one opportunity. You decide.
          </p>
          <p className="mt-6 text-[0.85rem] font-medium text-green">GAUGE</p>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <span className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-green text-green-ink">
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 8.5 6.5 12 13 4" />
      </svg>
    </span>
  );
}
function CrossIcon() {
  return (
    <span className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-halt/25 text-halt">
      <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <path d="M4 4l8 8M12 4l-8 8" />
      </svg>
    </span>
  );
}
