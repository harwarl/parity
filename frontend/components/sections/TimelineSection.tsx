"use client";

import { useEffect, useState } from "react";
import Section from "@/components/layout/Section";
import Reveal from "@/components/shared/Reveal";

const lineage = [
  {
    era: "1980s",
    h: "Cash and carry",
    p: "Desks held the asset, sold the future, collected the spread to expiry.",
  },
  {
    era: "1990s",
    h: "ADR vs ordinary",
    p: "One company, two country listings. Arbitrageurs kept the lines honest.",
  },
  {
    era: "2000s",
    h: "ETF vs NAV",
    p: "Authorized participants closed the gap between a fund and its basket.",
  },
  {
    era: "Now",
    h: "Retail can see the basis",
    p: "Cash share vs stock token. One tape, net of cost. Same idea. New rails.",
    live: true,
  },
];

export default function TimelineSection() {
  const [lit, setLit] = useState(lineage.length - 1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let n = 0;
    const id = window.setInterval(() => {
      n = (n + 1) % (lineage.length + 2);
      setLit(n < lineage.length ? n : lineage.length - 1);
    }, 1100);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Section
      eyebrow="Lineage"
      heading="The basis is not new. Seeing it is."
      lede="Every version of this trade has been a professional's tool. The names changed. The shape did not."
    >
      <div className="relative pt-7 lg:pt-9">
        {/* desktop rail — hairline that resolves to green at "Now" */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-[3px] hidden h-px bg-gradient-to-r from-line-strong via-line-strong to-green lg:block"
        />

        <ol className="grid gap-4 lg:grid-cols-4">
          {lineage.map((item, i) => {
            const active = lit === i || item.live;
            return (
              <li key={item.h} className="relative pl-7 lg:pl-0">
                {/* mobile rail segment — not on the last node */}
                {i < lineage.length - 1 ? (
                  <span
                    aria-hidden
                    className="absolute -bottom-4 left-[3px] top-3 w-px bg-line lg:hidden"
                  />
                ) : null}
                {/* node */}
                <span
                  aria-hidden
                  className="absolute left-0 top-2 grid size-1.5 place-items-center lg:left-1/2 lg:top-[3px] lg:-translate-x-1/2 lg:-translate-y-1/2"
                >
                  {active ? (
                    <span className="absolute inline-flex size-3.5 animate-ping rounded-full bg-green/40" />
                  ) : null}
                  <span
                    className={`relative size-1.5 rounded-full ring-4 ring-ground transition-colors duration-300 ${
                      active ? "bg-green" : "bg-text-mute"
                    }`}
                  />
                </span>

                <Reveal delay={i * 70}>
                  <article
                    className={`relative h-full overflow-hidden rounded-2xl border p-5 lg:mt-6 ${
                      item.live
                        ? "border-green/30 bg-surface-2"
                        : "border-line bg-surface"
                    }`}
                  >
                    {item.live ? (
                      <span
                        aria-hidden
                        className="grid-texture pointer-events-none absolute inset-0 opacity-[0.3]"
                      />
                    ) : null}
                    <p
                      className={`tnum relative text-[13px] tracking-[0.18em] ${
                        item.live ? "text-green" : "text-text-mute"
                      }`}
                    >
                      {item.era}
                    </p>
                    <h3 className="relative mt-2 text-[0.95rem] font-medium tracking-tight text-text">
                      {item.h}
                    </h3>
                    <p className="relative mt-2 text-[0.83rem] leading-relaxed text-text-dim">
                      {item.p}
                    </p>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
