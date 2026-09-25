/*
 * Hero · design dials: VARIANCE 7 / MOTION 8 / DENSITY 4.
 * Copy left, live-gap widget bottom-right, full-bleed SVG stage (A1–A6).
 */
import { urls } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { HeroArt } from "./HeroArt";
import { LiveGapWidget } from "./LiveGapWidget";

export function Hero() {
  return (
    <section
      id="top"
      data-motion
      className="relative overflow-hidden bg-hero lg:h-[min(100vh,980px)] lg:min-h-[820px]"
      style={{
        backgroundImage:
          "radial-gradient(90% 70% at 70% 110%, rgba(178,212,80,.14), transparent 60%)",
      }}
    >
      <HeroArt />

      {/* Veils: left read-gradient + 120px fade into the page ground */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(7,8,10,.92) 0%, rgba(7,8,10,.55) 38%, rgba(7,8,10,0) 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[120px]"
        style={{ background: "linear-gradient(180deg, transparent, var(--color-bg))" }}
      />

      <div className="g-wrap relative flex h-full lg:static flex-col justify-center pt-[140px] pb-16 lg:pt-10 lg:pb-0">
        <div
          className="relative flex max-w-[760px] flex-col gap-[30px]"
          style={{ animation: "g-rise 1s var(--ease-enter) .2s both" }}
        >
          <p className="g-eyebrow !text-muted">Robinhood stock · Robinhood Chain stock token</p>

          <h1 className="font-display text-[clamp(52px,7.22vw,104px)] leading-[0.98] font-extrabold tracking-[-0.045em] text-ink">
            Two prices.
            <br />
            <span className="g-dot text-[calc(1em*118/104)]">One gap.</span>
          </h1>

          <p className="g-lede max-w-[560px]">
            <b>GAUGE watches both prices for the same name.</b> When the gap still clears fees,
            slippage and the session, you get a card. You tap. Confirm re-quotes. The model does
            not place.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button href={urls.app} external>
              Open GAUGE
            </Button>
            <Button href="#how" variant="secondary">
              How it works
            </Button>
          </div>

          <ul className="flex flex-wrap gap-2.5" aria-label="Rules">
            <li>
              <Pill tone="lime">Net gap or nothing</Pill>
            </li>
            <li>
              <Pill>3 cards a day</Pill>
            </li>
            <li>
              <Pill>75s per card</Pill>
            </li>
            <li>
              <Pill>You tap. It doesn&apos;t.</Pill>
            </li>
          </ul>
        </div>

        <LiveGapWidget className="mt-12 lg:absolute lg:right-[max(32px,calc(50%-600px))] lg:bottom-[130px] lg:mt-0" />
      </div>
    </section>
  );
}
