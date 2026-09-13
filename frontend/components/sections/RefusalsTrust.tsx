"use client";

import { useLayoutEffect, useRef } from "react";
import Container from "@/components/layout/Container";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";

const codes = [
  { code: "STALE", when: "The cash/chain join blew its 8–15s budget. No trusted basis to quote." },
  { code: "CLOSED", when: "Cash is not in RTH. The equity leg cannot trade, so no live card." },
  { code: "THIN", when: "Book depth cannot fill the clip without moving price past the buffer." },
  { code: "DUST", when: "Net is real but too small to matter after the haircut. Not worth the tap." },
];

/** Refusals — the trust section classic carried as RejectSection. Most ticks don't clear the bar; this is why. */
export default function RefusalsTrust() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-rt-head]", {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
      gsap.from("[data-rt-tile]", {
        opacity: 0,
        scale: 1.15,
        rotate: -5,
        duration: 0.4,
        stagger: 0.08,
        ease: "back.out(2.2)",
        scrollTrigger: { trigger: "[data-rt-grid]", start: "top 85%" },
      });
      gsap.from("[data-rt-halt]", {
        opacity: 0,
        y: 14,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: "[data-rt-halt]", start: "top 88%" },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={ref} id="refusals" className="scroll-mt-24 border-t border-line py-16 sm:py-20">
      <Container>
        <div data-rt-head className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight text-text sm:text-[2rem]">
            No card beats a wrong card.
          </h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-text-dim">
            Most ticks do not become a card. Each refusal has a short,
            stamped reason. This is the point of the product, not a
            limitation of it.
          </p>
        </div>

        <div data-rt-grid className="mt-10 grid gap-4 sm:grid-cols-2">
          {codes.map((c) => (
            <div
              key={c.code}
              className="group flex items-start gap-4 rounded-xl border border-line bg-surface p-5 transition-colors duration-300 hover:border-line-strong"
            >
              <span
                data-rt-tile
                className="inline-flex h-fit shrink-0 -rotate-2 items-center rounded-sm border border-halt/50 bg-halt/5 px-2 py-1 text-[11px] font-medium tracking-[0.18em] text-halt transition-transform duration-300 group-hover:rotate-0"
              >
                {c.code}
              </span>
              <p className="text-[0.85rem] leading-relaxed text-text-dim">{c.when}</p>
            </div>
          ))}
        </div>

        <div
          data-rt-halt
          className="mt-6 flex flex-col gap-3 rounded-xl border border-halt/30 bg-surface p-5 sm:flex-row sm:items-start sm:gap-5"
        >
          <span className="inline-flex h-fit w-fit shrink-0 items-center gap-2 rounded-sm border border-halt/50 bg-halt/5 px-2 py-1 text-[11px] font-medium tracking-[0.18em] text-halt">
            <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-halt" />
            HALT
          </span>
          <p className="max-w-2xl text-[0.85rem] leading-relaxed text-text-dim">
            A multiplier jump from a dividend or split, or an oracle pause,
            freezes the name. HALT is &ldquo;no data,&rdquo; not &ldquo;bad
            price.&rdquo; It clears on a manual resume or a run of clean
            ticks. Never on a guess.
          </p>
        </div>
      </Container>
    </section>
  );
}
