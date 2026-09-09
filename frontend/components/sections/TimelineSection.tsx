"use client";

import { useEffect, useState } from "react";
import Section from "@/components/layout/Section";
import Reveal from "@/components/shared/Reveal";

const lineage = [
  {
    era: "1980s",
    h: "Cash and carry",
    p: "Desks held the asset, sold the future, and collected the spread to expiry.",
  },
  {
    era: "1990s",
    h: "ADR vs ordinary",
    p: "The same company listed in two countries. Arbitrageurs kept the two lines honest.",
  },
  {
    era: "2000s",
    h: "ETF vs NAV",
    p: "Authorized participants closed the gap between a fund's price and the basket it holds.",
  },
  {
    era: "Now",
    h: "Retail can see the basis",
    p: "Cash share vs stock token, on one tape, net of cost. Same idea. New rails.",
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
      <ol className="relative border-l border-line pl-7 sm:pl-8">
        {lineage.map((item, i) => {
          const active = lit === i || item.live;
          return (
            <li key={item.h} className="relative pb-8 last:pb-0">
              <span
                aria-hidden
                className="absolute -left-[calc(1.75rem+7.5px)] top-0.5 grid size-4 place-items-center sm:-left-[calc(2rem+7.5px)]"
              >
                {active ? (
                  <span className="absolute inline-flex size-4 animate-ping rounded-full bg-green/40" />
                ) : null}
                <span
                  className={`relative size-2 rounded-full ring-4 ring-ground transition-colors duration-300 ${
                    active ? "bg-green" : "bg-text-mute"
                  }`}
                />
              </span>
              <Reveal delay={i * 70}>
                <p className="tnum text-[11px] tracking-widest text-text-mute">
                  {item.era}
                </p>
                <h3
                  className={`mt-1 text-[0.95rem] font-medium tracking-tight transition-colors ${
                    item.live ? "text-green" : "text-text"
                  }`}
                >
                  {item.h}
                </h3>
                <p className="mt-1.5 max-w-lg text-[0.85rem] leading-relaxed text-text-dim">
                  {item.p}
                </p>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
