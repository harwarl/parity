"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Container from "@/components/layout/Container";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";

const lineage = [
  { era: "1980s", h: "Cash and carry", p: "Desks held the asset, sold the future, collected the spread to expiry." },
  { era: "1990s", h: "ADR vs ordinary", p: "One company, two country listings. Arbitrageurs kept the lines honest." },
  { era: "2000s", h: "ETF vs NAV", p: "Authorized participants closed the gap between a fund and its basket." },
  { era: "Now", h: "Retail can see the basis", p: "Cash share vs stock token. One tape, net of cost. Same idea. New rails.", live: true },
];

/** Basis lineage — the history classic carried as TimelineSection, scroll-lit here. */
export default function Lineage() {
  const ref = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const [lit, setLit] = useState(lineage.length - 1);

  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-lin-head]", {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
      gsap.from("[data-lin-node]", {
        opacity: 0,
        y: 18,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: "[data-lin-list]", start: "top 82%" },
      });
      if (railRef.current) {
        gsap.fromTo(
          railRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            ease: "none",
            scrollTrigger: {
              trigger: "[data-lin-list]",
              start: "top 72%",
              end: "bottom 60%",
              scrub: 0.5,
              onUpdate: (self) => {
                setLit(Math.min(lineage.length - 1, Math.floor(self.progress * lineage.length)));
              },
            },
          },
        );
      }
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={ref} className="border-t border-line py-16 sm:py-20">
      <Container>
        <div data-lin-head className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight text-text sm:text-[2rem]">
            The basis is not new. Seeing it is.
          </h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-text-dim">
            Every version of this trade has been a professional&apos;s tool.
            The names changed. The shape did not.
          </p>
        </div>

        <div className="relative mt-12">
          <span aria-hidden className="absolute inset-x-0 top-[3px] hidden h-px bg-line-strong lg:block" />
          <span
            ref={railRef}
            aria-hidden
            className="absolute inset-x-0 top-[3px] hidden h-px origin-left scale-x-100 bg-linear-to-r from-transparent via-green/70 to-green lg:block"
          />

          <ol data-lin-list className="grid gap-x-6 gap-y-9 lg:grid-cols-4">
            {lineage.map((item, i) => {
              const active = lit === i || item.live;
              return (
                <li key={item.h} data-lin-node className="relative pl-7 lg:pl-0 lg:pt-8">
                  {i < lineage.length - 1 ? (
                    <span aria-hidden className="absolute left-[3px] top-2 bottom-[-2.25rem] w-px bg-line lg:hidden" />
                  ) : null}
                  <span aria-hidden className="absolute left-0 top-1.5 grid size-1.5 place-items-center lg:top-[3px] lg:-translate-y-1/2">
                    {active ? <span className="absolute inline-flex size-3.5 animate-ping rounded-full bg-green/40" /> : null}
                    <span
                      className={`relative size-1.5 rounded-full ring-4 ring-ground transition-colors duration-300 ${
                        active ? "bg-green" : "bg-text-mute"
                      }`}
                    />
                  </span>

                  <p className={`tnum text-[13px] tracking-[0.18em] ${item.live ? "text-green" : "text-text-mute"}`}>
                    {item.era}
                  </p>
                  <h3 className="mt-2 text-[0.95rem] font-semibold tracking-tight text-text">{item.h}</h3>
                  <p className="mt-2 max-w-xs text-[0.83rem] leading-relaxed text-text-dim">{item.p}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
