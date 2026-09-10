import type { Metadata } from "next";
import Link from "next/link";
import Eyebrow from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "App",
  description:
    "The TAPE app: the same card, live. Paper by default, confirm-gated always, execution on the official rails.",
};

const notes = [
  {
    h: "The card, live",
    p: "The widget on the home page is the app. In paper it loops on sample ticks. Live, it reads the cash mid and the multiplier-adjusted chain price and shows the same net-bps card with a 75-second life.",
  },
  {
    h: "Paper is the default",
    p: "At least seven days on paper before live is offered. Paper is not a demo. It runs the same join, the same haircut, and the same refusals.",
  },
  {
    h: "Live is gated",
    p: "US only, through the Agentic Account and the official Trading MCP. A tap runs a review, then you confirm the place yourself. Never the primary Robinhood account.",
  },
  {
    h: "It holds nothing",
    p: "No deposits, no custody, no keys. TAPE measures a published basis and shows a card. It does not place.",
  },
];

export default function AppPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 sm:px-10 sm:py-32">
      <Eyebrow>App</Eyebrow>
      <h1 className="mt-4 text-balance text-3xl font-medium leading-[1.1] tracking-[-0.03em] text-text sm:text-[2.75rem]">
        The same card. Live.
      </h1>
      <p className="mt-5 max-w-xl text-pretty text-[0.98rem] leading-relaxed text-text-dim">
        The TAPE app is the card widget, wired to the live basis. It is not live
        yet.
        Join the waitlist and you get the paper build first.
      </p>

      <div className="mt-14 divide-y divide-line border-y border-line">
        {notes.map((n) => (
          <section
            key={n.h}
            className="grid gap-2 py-6 sm:grid-cols-[14rem_1fr] sm:gap-8"
          >
            <h2 className="text-[0.95rem] font-medium tracking-tight text-text">
              {n.h}
            </h2>
            <p className="text-[0.88rem] leading-relaxed text-text-dim">{n.p}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link
          href="/#waitlist"
          className="inline-flex h-11 items-center justify-center rounded-md bg-green px-5 text-sm font-medium text-green-ink transition-colors hover:bg-[#12e888]"
        >
          Join the waitlist
        </Link>
        <Link
          href="/#tape"
          className="inline-flex h-11 items-center justify-center rounded-md border border-line-strong px-5 text-sm text-text-dim transition-colors hover:border-text-mute hover:text-text"
        >
          See the tape
        </Link>
      </div>

      <p className="mt-10 text-[0.8rem] leading-relaxed text-text-mute">
        Signals, not advice. Paper is the default for at least seven days. Live
        equity is US-only, through the Agentic Account. Not available where
        Robinhood Stock Tokens are not offered.
      </p>
    </div>
  );
}
