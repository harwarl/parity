import type { Metadata } from "next";
import Eyebrow from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "About",
  description:
    "What PARITY is, what it refuses to be, and the rules it runs under.",
};

const principles = [
  {
    h: "It measures. You decide.",
    p: "PARITY joins the cash mid and the multiplier-adjusted chain price, subtracts the cost of closing the gap, and shows a card. The card is a suggestion with a 75-second life. Every tap is yours.",
  },
  {
    h: "It never places.",
    p: "On live, a tap runs a review through the official Trading MCP, then you confirm the place yourself. There is no mode, no setting, and no upsell that lets PARITY trade on its own.",
  },
  {
    h: "It holds nothing.",
    p: "No deposits, no custody, no keys. Execution runs in your Agentic Account through the official rails. PARITY never depicts holding a balance because it never does.",
  },
  {
    h: "token is not share.",
    p: "The cash share and the stock token are different instruments on different venues. The uiMultiplier only ever scales the chain feed. A basis can persist. Overnight premium is not a live trade.",
  },
  {
    h: "A refusal is a feature.",
    p: "STALE, CLOSED, THIN, DUST, and HALT are the product working. No card beats a wrong card.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 sm:px-10 sm:py-32">
      <Eyebrow>About</Eyebrow>
      <h1 className="mt-4 text-balance text-3xl font-medium leading-[1.1] tracking-[-0.03em] text-text sm:text-[2.75rem]">
        Two prices for the same name. One gap. You tap.
      </h1>
      <p className="mt-5 max-w-xl text-pretty text-[0.98rem] leading-relaxed text-text-dim">
        PARITY is a basis tape for Robinhood cash equities and Robinhood Chain
        stock tokens. It is signalling software for a self-directed user. It is
        not a fund, a bot, or a broker.
      </p>

      <div className="mt-14 divide-y divide-line border-y border-line">
        {principles.map((pr) => (
          <section key={pr.h} className="grid gap-2 py-6 sm:grid-cols-[14rem_1fr] sm:gap-8">
            <h2 className="text-[0.95rem] font-medium tracking-tight text-text">
              {pr.h}
            </h2>
            <p className="text-[0.88rem] leading-relaxed text-text-dim">{pr.p}</p>
          </section>
        ))}
      </div>

      <p className="mt-10 text-[0.8rem] leading-relaxed text-text-mute">
        Signals, not advice. Paper is the default for at least seven days. Live
        equity is US-only, through the Agentic Account. Not available where
        Robinhood Stock Tokens are not offered.
      </p>
    </div>
  );
}
