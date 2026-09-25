/*
 * Closing CTA · design dials: VARIANCE 5 / MOTION 6 / DENSITY 3.
 * Lime block. Two identical brand lines split and rejoin (I1); the headline
 * snaps when they meet (I2), on one 6.4s clock.
 */
import { urls } from "@/config/site";
import { Button } from "@/components/ui/Button";

const LINE_D =
  "M0 372 C160 366,300 384,460 378 S760 352,960 360 S1260 386,1440 368";

export function ClosingCta() {
  return (
    <section data-motion className="px-6 pt-[150px] max-sm:px-3">
      <div className="relative mx-auto flex max-w-[1392px] flex-col items-center gap-9 overflow-hidden rounded-block bg-accent px-10 pt-[120px] pb-[110px] text-center max-sm:px-5 max-sm:pt-20 max-sm:pb-16">
        <svg
          aria-hidden
          viewBox="0 0 1440 740"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full opacity-20"
        >
          <path
            d={LINE_D}
            fill="none"
            stroke="#0B0D07"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            style={{ animation: "g-conA 6.4s ease-in-out infinite" }}
          />
          <path
            d={LINE_D}
            fill="none"
            stroke="#0B0D07"
            strokeWidth="2.5"
            strokeDasharray="6 8"
            vectorEffect="non-scaling-stroke"
            style={{ animation: "g-conB 6.4s ease-in-out infinite" }}
          />
        </svg>

        <p className="relative font-mono text-[12px] tracking-[0.22em] text-accent-ink/70 uppercase">
          GAUGE · Cash vs token · Confirm-gated
        </p>
        <h2
          className="relative font-display text-[clamp(52px,9.44vw,136px)] leading-[0.92] font-extrabold tracking-[-0.055em] text-accent-ink"
          style={{ animation: "g-snap 6.4s ease-out infinite" }}
        >
          NO GAP.
          <br />
          NO CARD.
        </h2>
        <p className="relative max-w-[600px] text-[19px] leading-[1.6] text-accent-ink/78">
          Start in paper. Watch the gates work. Go live on your Agentic Account when the record
          says so.
        </p>
        <div className="relative flex flex-wrap justify-center gap-3">
          <Button href={urls.app} variant="ink" external>
            Open GAUGE
          </Button>
          <Button href={urls.docs} variant="outline-ink">
            Read the docs
          </Button>
        </div>
      </div>
    </section>
  );
}
