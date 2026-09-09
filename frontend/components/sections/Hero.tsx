"use client";

import Container from "@/components/layout/Container";
import Card from "@/components/parity/Card";
import LiveClock from "@/components/parity/LiveClock";
import { useInView } from "@/hooks/useInView";
import { FEATURED } from "@/lib/parity/universe";

export default function Hero() {
  const { ref, inView } = useInView<HTMLDivElement>({
    once: true,
    threshold: 0.2,
  });

  const card = {
    symbol: FEATURED.symbol,
    cashPrice: FEATURED.shareMid,
    tokenPrice: FEATURED.tokenPerShare,
    gapBps: FEATURED.basisBps,
  };

  return (
    <section className="relative overflow-hidden">
      <Container className="grid min-h-184 content-center gap-12 py-28 pt-32 sm:min-h-208 sm:py-32 lg:min-h-210 lg:grid-cols-[0.90fr_1.10fr] lg:items-center lg:gap-16 lg:py-40">
        <div ref={ref}>
          <p className="tnum flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] tracking-[0.15em] text-text-mute">
            <span className="inline-flex items-center gap-1.5 text-green">
              <span className="size-1 animate-pulse rounded-full bg-green" />
              TAPE
            </span>
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
            tokens. PARITY measures the gap, haircuts fees and slippage, and
            shows a card. It does not place.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#waitlist"
              className="inline-flex h-11 items-center justify-center rounded-md bg-green px-5 text-sm font-medium text-green-ink transition-colors hover:bg-[#12e888]"
            >
              Join the waitlist
            </a>
            <a
              href="#tape"
              className="inline-flex h-11 items-center justify-center rounded-md border border-line-strong px-5 text-sm text-text-dim transition-colors hover:border-text-mute hover:text-text"
            >
              See the tape
            </a>
          </div>
        </div>

        <div className="w-full lg:justify-self-end">
          <Card
            data={card}
            loop
            active={inView}
            className="mx-auto max-w-[650px]"
          />
        </div>
      </Container>
    </section>
  );
}
