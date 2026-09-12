"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";

const faqs = [
  {
    q: "Is this arbitrage?",
    a: "No. It's a directional bet that a wide basis converges. GAUGE never holds both legs at once and never guarantees convergence.",
  },
  {
    q: "What is the daily limit?",
    a: "Three opportunity cards per day. It's a hard cap, not a suggestion — once used, GAUGE stops surfacing new cards until the next session.",
  },
  {
    q: "How do I actually make money?",
    a: "You place a single-leg trade on the cash stock, betting the price converges toward where the 24/7 token market already has it priced.",
  },
  {
    q: "What markets and assets are supported?",
    a: "US equities with a live Robinhood Chain stock token, starting with a small, liquid launch list. Paper mode is open to everyone on the waitlist.",
  },
];

/** FAQ, 2x2 grid of collapsible items. */
export default function FaqAccordion() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-faq-head]", {
        opacity: 0,
        y: 14,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
      gsap.from("[data-faq-item]", {
        opacity: 0,
        y: 16,
        duration: 0.45,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: "[data-faq-grid]", start: "top 85%" },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={ref} className="border-t border-line py-16 sm:py-20">
      <div className="mx-auto w-full max-w-360 px-6 sm:px-12 lg:px-16">
        <div data-faq-head className="flex items-center justify-between gap-4">
          <h2 className="text-[1.4rem] font-bold tracking-tight text-text sm:text-2xl">
            Frequentty Asked Questions
          </h2>
          <a href="#" className="flex items-center gap-1 text-[0.85rem] text-green transition-colors hover:text-[#12e888]">
            View all
            <ArrowIcon />
          </a>
        </div>

        <div data-faq-grid className="mt-8 grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                data-faq-item
                className="rounded-lg border border-line bg-surface transition-colors duration-200 hover:border-line-strong"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-[0.92rem] font-medium text-text">{f.q}</span>
                  <span
                    className={`shrink-0 text-text-mute transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <PlusIcon />
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-[0.85rem] leading-relaxed text-text-dim">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <path d="M8 2.5v11M2.5 8h11" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}
