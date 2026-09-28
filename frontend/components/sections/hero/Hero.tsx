/*
 * Hero · design dials: VARIANCE 7 / MOTION 8 / DENSITY 4.
 * Copy left, live-gap widget bottom-right, full-bleed SVG stage (A1–A6).
 * Below lg: copy, then a cropped art band (bracket + labels) with the
 * widget overlapping its bottom edge; the light HeroArt variant keeps
 * phones smooth.
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
      <HeroArt className="max-lg:hidden" />

      {/* Veils: left read-gradient + 120px fade into the page ground */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 max-lg:hidden"
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

      <div className="g-wrap relative flex h-full lg:static flex-col justify-center pt-[112px] pb-16 sm:pt-[140px] lg:pt-10 lg:pb-0">
        <div
          className="relative flex max-w-[760px] flex-col gap-6 sm:gap-[30px]"
          style={{ animation: "g-rise 1s var(--ease-enter) .2s both" }}
        >
          <p className="g-eyebrow !text-muted">For Robinhood traders · the stock vs its onchain token</p>

          <h1 className="font-display text-[clamp(52px,7.22vw,104px)] leading-[0.98] font-extrabold tracking-[-0.045em] text-ink">
            Two prices.
            <br />
            <span className="g-dot text-[calc(1em*118/104)]">One gap.</span>
          </h1>

          <p className="g-lede max-w-[580px]">
            <b>Some stocks now trade in two places, at two prices.</b> GAUGE watches both and pings
            you only when the difference is still worth it after every cost. You decide. Nothing
            happens unless you tap.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button href={urls.app} external>
              Open GAUGE
            </Button>
            <Button href="#overview" variant="secondary">
              What is GAUGE?
            </Button>
          </div>

          <ul className="flex flex-wrap gap-2.5" aria-label="Rules">
            <li>
              <Pill tone="lime">Only when it&apos;s worth it</Pill>
            </li>
            <li>
              <Pill>3 prompts a day, max</Pill>
            </li>
            <li>
              <Pill>75 s to decide</Pill>
            </li>
            <li>
              <Pill>You tap. It doesn&apos;t.</Pill>
            </li>
          </ul>
        </div>

        {/* Mobile / tablet art band: the gap region, full bleed */}
        <div className="relative -mx-4 mt-8 h-[320px] overflow-hidden sm:h-[380px] lg:hidden">
          <HeroArt compact />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, var(--color-hero) 0%, transparent 22%, transparent 70%, var(--color-hero) 100%), linear-gradient(90deg, var(--color-hero) 0%, transparent 30%)",
            }}
          />
        </div>

        <LiveGapWidget className="relative -mt-20 max-lg:mx-auto sm:-mt-24 lg:absolute lg:right-[max(32px,calc(50%-600px))] lg:bottom-[130px] lg:mt-0" />
      </div>
    </section>
  );
}
