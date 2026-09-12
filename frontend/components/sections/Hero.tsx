"use client";

import type { ReactNode } from "react";
import type { CardData } from "@/components/parity/Card";
import Container from "@/components/layout/Container";
import Card from "@/components/parity/Card";
import LiveClock from "@/components/parity/LiveClock";
import CountUp from "@/components/shared/CountUp";
import Tilt from "@/components/shared/Tilt";
import { useInView } from "@/hooks/useInView";
import { FEATURED, TAPE } from "@/lib/parity/universe";

// the stat triplet, inlined under the hero copy — number, one line, green rule
const STATS: { render: ReactNode; label: string }[] = [
  { render: <CountUp value={10} />, label: "Names on the shared tape" },
  { render: "1–2s", label: "Freshness in RTH" },
  { render: <CountUp value={0} />, label: "Funds held. No custody" },
];

// the hero card cycles through the tradable names, one per TTL — featured first
const ROTATION: CardData[] = [
  FEATURED,
  ...TAPE.filter((r) => r.state === "rth" && r.symbol !== FEATURED.symbol),
].map((r) => ({
  symbol: r.symbol,
  cashPrice: r.shareMid,
  tokenPrice: r.tokenPerShare,
  gapBps: r.basisBps,
}));

export default function Hero() {
  const { ref, inView } = useInView<HTMLDivElement>({
    once: true,
    threshold: 0.2,
  });

  return (
    <section className="relative overflow-hidden">
      <Container className="flex flex-col justify-center gap-12 py-24 pt-28 sm:py-28 sm:pt-32 lg:grid lg:min-h-210 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:py-40">
        <div ref={ref} className="min-w-0">
          <p className="tnum flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] tracking-[0.15em] text-text-mute">
            <span className="inline-flex items-center gap-1.5 text-green">
              <span className="size-1 animate-pulse rounded-full bg-green" />
              TAPE
            </span>
            <span aria-hidden>·</span>
            <span>10 NAMES</span>
            <span aria-hidden>·</span>
            <span>
              RTH <LiveClock />
            </span>
            <span aria-hidden>·</span>
            <span>SAMPLE</span>
          </p>

          <h1 className="mt-6 text-balance text-[1.95rem] font-medium leading-[1.06] tracking-[-0.03em] text-text sm:text-[3.1rem] lg:text-[4rem]">
            Two prices for the same name. One gap. You tap.
          </h1>

          <p className="mt-6 max-w-lg text-pretty text-[1rem] leading-relaxed text-text-dim">
            A basis tape for Robinhood cash equities and Robinhood Chain stock
            tokens. TAPE measures the gap, haircuts fees and slippage, and shows
            a card. It does not place.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#waitlist"
              className="inline-flex h-11 items-center justify-center rounded-md bg-green px-5 text-sm font-medium text-green-ink transition-colors hover:bg-[#12e888]"
            >
              Check the Tape
            </a>
            <a
              href="#tape"
              className="inline-flex h-11 items-center justify-center rounded-md border border-line-strong px-5 text-sm text-text-dim transition-colors hover:border-text-mute hover:text-text"
            >
              See the tape
            </a>
          </div>

          <dl className="relative mt-10 grid grid-cols-3 gap-x-6 border-t border-line pt-6 sm:gap-x-10">
            <span
              aria-hidden
              className="absolute -top-px left-0 h-px w-16 bg-green/70"
            />
            {STATS.map((s) => (
              <HeroStat key={s.label} label={s.label}>
                {s.render}
              </HeroStat>
            ))}
          </dl>
        </div>

        <div className="w-full min-w-0 lg:justify-self-end">
          <Tilt className="mx-auto w-full max-w-[560px]">
            <Card
              data={ROTATION[0]}
              rotation={ROTATION}
              loop
              active={inView}
              className="w-full"
            />
          </Tilt>
        </div>
      </Container>
    </section>
  );
}

function HeroStat({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div>
      <dd className="tnum text-2xl font-medium leading-none tracking-tight text-text sm:text-[2.05rem]">
        {children}
      </dd>
      <dt className="mt-2 text-[0.68rem] leading-snug text-text-mute sm:text-[0.72rem]">
        {label}
      </dt>
    </div>
  );
}
