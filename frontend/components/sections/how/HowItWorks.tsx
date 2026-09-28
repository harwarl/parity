/*
 * How it works · design dials: VARIANCE 6 / MOTION 7 / DENSITY 5.
 * Header grid + 3 panels, third featured (C1–C3). Rev 2: plain words, and
 * each "how" panel links to its docs section instead of showing a formula.
 */
import type { ReactNode } from "react";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmitGates } from "./EmitGates";
import { HaircutBar } from "./HaircutBar";
import { MeasureRuler } from "./MeasureRuler";
import { revealInRow } from "@/lib/reveal";
import Link from "next/link";
import { DOCS } from "@/config/docs";

type Step = {
  eyebrow: string;
  title: string;
  body: string;
  visual: ReactNode;
  /** Rev 2: formulas live in the docs; the panel links there. */
  docs?: { label: string; href: string };
  featured?: boolean;
};

const steps: Step[] = [
  {
    eyebrow: "01 / Watch",
    title: "Two prices, one stock",
    body: "GAUGE reads the stock's price on Robinhood and the token's price on Robinhood Chain, converted to one share so they compare like for like.",
    visual: <MeasureRuler />,
    docs: { label: "How the difference is measured", href: `${DOCS.card}#gap` },
  },
  {
    eyebrow: "02 / Subtract",
    title: "Every cost comes off first",
    body: "Trading fees, the cost of filling the order and a safety margin come off the difference. What's left is the only number GAUGE trusts.",
    visual: <HaircutBar />,
    docs: { label: "Every cost, itemised", href: `${DOCS.card}#haircut` },
  },
  {
    eyebrow: "03 / Prompt",
    title: "Four checks, then a prompt",
    body: "Worth it after costs, market open, enough shares on offer, and under your limit of 3 a day. Miss one, and GAUGE tells you which.",
    visual: <EmitGates />,
    featured: true,
  },
];

export function HowItWorks() {
  return (
    <section id="how" data-motion className="g-wrap relative pt-[150px]">
      <SectionHeader
        eyebrow="03 · How it works"
        title={
          <>
            Watch.
            <br />
            Subtract.
            <br />
            <span className="g-dot">Prompt.</span>
          </>
        }
        lede="Three steps, all session long. A price difference that disappears once you pay to trade isn't worth your time, so GAUGE never shows it to you."
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {steps.map((step, i) => (
          <Panel
            key={step.eyebrow}
            featured={step.featured}
            className="g-reveal g-rk box-content flex lg:min-h-[460px] flex-col gap-[18px] p-9 max-sm:p-6"
            style={revealInRow(i, steps.length)}
          >
            <p className="g-eyebrow">{step.eyebrow}</p>
            <h3 className="g-h3">{step.title}</h3>
            <p className="g-p">{step.body}</p>
            {step.visual}
            {step.docs && (
              <Link
                href={step.docs.href}
                className="mt-auto flex items-center justify-between gap-3 rounded-inset border border-ink/8 bg-bg px-[18px] py-3.5 text-[14px] text-ink-2 transition-colors hover:border-accent/40 hover:text-ink"
              >
                {step.docs.label}
                <span className="flex-none font-semibold text-accent">Docs →</span>
              </Link>
            )}
          </Panel>
        ))}
      </div>
    </section>
  );
}
