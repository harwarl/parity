"use client";

import { useLayoutEffect, useRef } from "react";
import Tilt from "@/components/shared/Tilt";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";

const panels = [
  {
    tag: "CASH",
    featured: false,
    status: "prints in RTH",
    title: "The exchange price.",
    body: "Prints during regular trading hours and stops at the bell. This is the RHJ feed. The multiplier never touches it.",
    rows: [
      ["Feed", "exchange / RHJ"],
      ["Hours", "RTH only"],
      ["Multiplier", "never applied"],
      ["Live leg", "equity, in RTH"],
    ],
    from: -28,
  },
  {
    tag: "TOKEN",
    featured: true,
    status: "moves 24/7",
    title: "The chain price.",
    body: "Chainlink oracle, already scaled by uiMultiplier / 1e18. Trades around the clock and moves while the cash market sleeps.",
    rows: [
      ["Feed", "Chainlink oracle"],
      ["Hours", "24 / 7"],
      ["Multiplier", "applied at source"],
      ["Live leg", "US: watch only in v1"],
    ],
    from: 28,
  },
];

/** "Two feeds for one name" — CASH vs TOKEN, the explainer classic carried as CashTokenPanels. */
export default function CashTokenExplainer() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-cte-head]", {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
      panels.forEach((p, i) => {
        gsap.from(`[data-cte-panel="${i}"]`, {
          opacity: 0,
          x: p.from,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: `[data-cte-panel="${i}"]`, start: "top 85%" },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={ref} className="border-t border-line py-16 sm:py-20">
      <div className="mx-auto w-full max-w-360 px-6 sm:px-12 lg:px-16">
        <div data-cte-head className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight text-text sm:text-[2rem]">
            Two feeds for one name.
          </h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-text-dim">
            Same company. Different books, different hours, different
            marginal buyer. Each leg on its own terms.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {panels.map((p, i) => (
            <div key={p.tag} data-cte-panel={i}>
              <Tilt max={2.5}>
                <div className="rounded-xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-line-strong sm:p-7">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[0.7rem] font-semibold tracking-[0.2em] ${
                        p.featured ? "text-green" : "text-text-dim"
                      }`}
                    >
                      {p.tag}
                    </span>
                    <span className="flex items-center gap-1.5 text-[0.7rem] uppercase tracking-widest text-text-mute">
                      <span
                        className={`size-1.5 rounded-full ${
                          p.featured ? "animate-pulse bg-green" : "bg-text-mute"
                        }`}
                      />
                      {p.status}
                    </span>
                  </div>

                  <h3 className="mt-5 text-[1.35rem] font-semibold leading-tight tracking-tight text-text">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[0.88rem] leading-relaxed text-text-dim">{p.body}</p>

                  <dl className="mt-6 border-t border-line">
                    {p.rows.map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between border-b border-line py-2.5">
                        <dt className="text-[0.8rem] text-text-mute">{k}</dt>
                        <dd className="tnum text-[0.82rem] text-text-dim">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
