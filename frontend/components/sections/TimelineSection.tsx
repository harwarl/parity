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
      <div className="relative">
        {/* desktop rail — one hairline across, greenward at the last leg */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-[3px] hidden h-px bg-line-strong lg:block"
        />
        <span
          aria-hidden
          className="absolute top-[3px] right-0 hidden h-px w-1/4 bg-linear-to-r from-line-strong to-green lg:block"
        />

        <ol className="grid gap-x-6 gap-y-9 lg:grid-cols-4">
          {lineage.map((item, i) => {
            const active = lit === i || item.live;
            return (
              <li key={item.h} className="relative pl-7 lg:pl-0 lg:pt-8">
                {/* mobile rail segment — not on the last node */}
                {i < lineage.length - 1 ? (
                  <span
                    aria-hidden
                    className="absolute left-[3px] top-2 bottom-[-2.25rem] w-px bg-line lg:hidden"
                  />
                ) : null}
                {/* node — on the rail */}
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 grid size-1.5 place-items-center lg:top-[3px] lg:-translate-y-1/2"
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
                  <p
                    className={`tnum text-[13px] tracking-[0.18em] ${
                      item.live ? "text-green" : "text-text-mute"
                    }`}
                  >
                    {item.era}
                  </p>
                  <h3 className="mt-2 text-[0.95rem] font-medium tracking-tight text-text">
                    {item.h}
                  </h3>
                  <p className="mt-2 max-w-xs text-[0.83rem] leading-relaxed text-text-dim">
                    {item.p}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
