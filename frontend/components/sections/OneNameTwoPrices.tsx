import Section from "@/components/layout/Section";
import FeaturedGap from "@/components/parity/FeaturedGap";
import Reveal from "@/components/shared/Reveal";
import Typewriter from "@/components/shared/Typewriter";
import { FEATURED } from "@/lib/parity/universe";

const MATH = `token_per_share = chainlink_usd / (uiMultiplier / 1e18)

basis_bps = (token_per_share − share_mid)
            / share_mid × 10_000

net_bps = |basis_bps| − fee − slip(clip) − buffer`;

const points = [
  {
    h: "Two venues, one name",
    p: "The cash share trades on the exchange. The token trades on Robinhood Chain. Different books, different hours, different marginal buyer. The prices drift.",
  },
  {
    h: "The multiplier only touches the chain feed",
    p: "Token-per-share is the Chainlink price divided by uiMultiplier / 1e18. That division applies to the chain feed and nothing else. Apply it to the cash mid and you invent a gap that is not there.",
  },
  {
    h: "The basis can persist",
    p: "There is no forced convergence intraday. A wide basis is a real price, not a countdown. Overnight the token keeps moving while cash is closed. That premium is not a live trade.",
  },
];

export default function OneNameTwoPrices() {
  return (
    <Section
      id="how"
      eyebrow="One name, two prices"
      heading="Why the same company quotes two numbers."
      lede="The gap is not a glitch and it is not new. Seeing it, net of what it costs to close, is."
    >
      {/* featured basis strip — live */}
      <Reveal className="mb-12 rounded-lg border border-line bg-surface p-6 sm:p-8">
        <FeaturedGap symbol={FEATURED.symbol} />
      </Reveal>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
        <ol className="divide-y divide-line border-y border-line">
          {points.map((pt, i) => (
            <li key={pt.h} className="flex gap-4 py-5">
              <span className="tnum shrink-0 text-xs text-green">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[0.95rem] font-medium tracking-tight text-text">
                  {pt.h}
                </h3>
                <p className="mt-2 text-[0.85rem] leading-relaxed text-text-dim">
                  {pt.p}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="flex min-w-0 flex-col lg:pt-1">
          <div className="flex min-w-0 grow flex-col overflow-hidden rounded-lg border border-line-strong bg-surface-2">
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <span className="tnum flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-text-mute">
                <span className="size-1.5 rounded-full bg-green" />
                from feed to net
              </span>
              <span className="tnum text-[0.68rem] uppercase tracking-[0.2em] text-text-mute">
                3 defs
              </span>
            </div>

            <div className="flex min-w-0 grow text-[0.8rem] leading-[2.2]">
              <div
                aria-hidden
                className="tnum shrink-0 select-none border-r border-line bg-surface px-3.5 py-7 text-right text-text-mute/60"
              >
                {MATH.split("\n").map((_, i) => (
                  <div key={i}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                ))}
              </div>
              <div className="tnum min-w-0 grow overflow-x-auto px-5 py-7 text-text-dim">
                <Typewriter text={MATH} pre trigger="inView" speed={16} />
              </div>
            </div>

            <div className="tnum flex items-center gap-2 border-t border-line px-5 py-3 text-[0.72rem] text-text-mute">
              <span className="text-green">›</span>
              net is the only number a card ever shows
            </div>
          </div>

          <p className="mt-4 text-[0.8rem] leading-relaxed text-text-mute">
            A multiplier jump above threshold, or an oracle pause, is a HALT. Not
            a 10× gap.
          </p>
        </div>
      </div>
    </Section>
  );
}
