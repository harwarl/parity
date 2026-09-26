/*
 * How it works · design dials: VARIANCE 6 / MOTION 7 / DENSITY 5.
 * Header grid + 3 panels, third featured (C1–C3).
 */
import type { ReactNode } from "react";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmitGates } from "./EmitGates";
import { HaircutBar } from "./HaircutBar";
import { MeasureRuler } from "./MeasureRuler";
import { revealInRow } from "@/lib/reveal";

type Step = {
  eyebrow: string;
  title: string;
  body: string;
  visual: ReactNode;
  formula?: string;
  featured?: boolean;
};

const steps: Step[] = [
  {
    eyebrow: "01 / Measure",
    title: "Cash mid vs token-per-share",
    body: "The gap is the Robinhood cash mid against the chain token priced per share. The multiplier only touches the chain feed.",
    visual: <MeasureRuler />,
    formula: "gap = token × mult − cash_mid",
  },
  {
    eyebrow: "02 / Haircut",
    title: "Net basis points",
    body: "Take the absolute gap, then subtract fees, slippage and a buffer. What survives is the only number GAUGE trusts.",
    visual: <HaircutBar />,
    formula: "net = |gap| − fees − slip − buffer",
  },
  {
    eyebrow: "03 / Emit",
    title: "Four gates, then a card",
    body: "A card only when the net gap, the session, the depth and your cap of 3 a day all pass. Otherwise you get a reason.",
    visual: <EmitGates />,
    featured: true,
  },
];

export function HowItWorks() {
  return (
    <section id="how" data-motion className="g-wrap relative pt-[150px]">
      <SectionHeader
        eyebrow="01 · How it works"
        title={
          <>
            Measure.
            <br />
            Haircut.
            <br />
            <span className="g-dot">Emit.</span>
          </>
        }
        lede="Three steps, every tick. A gap that looks good before costs is not a gap. GAUGE only speaks when what's left after fees, slippage and a buffer is still worth your tap."
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
            {step.formula && (
              <code className="g-inset mt-auto block font-mono text-[14px] leading-[1.45] text-ink-2">
                {step.formula}
              </code>
            )}
          </Panel>
        ))}
      </div>
    </section>
  );
}
