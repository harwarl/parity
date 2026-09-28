/*
 * 01 · Overview · design dials: VARIANCE 5 / MOTION 5 / DENSITY 4.
 * What GAUGE is, before how it works (design.md §5.3, rev 2): a sticky
 * title beside the 30-second summary, three panels, and a glossary strip.
 */
import type { ReactNode } from "react";
import { Panel } from "@/components/ui/Panel";
import { reveal, revealInRow } from "@/lib/reveal";
import { Glossary } from "./Glossary";
import { FunnelIcon, LockIcon, ProblemIcon } from "./OverviewIcons";

const panels: { icon: ReactNode; eyebrow: string; title: string; body: string; featured?: boolean }[] = [
  {
    icon: <ProblemIcon />,
    eyebrow: "The problem",
    title: "Same stock, two prices",
    body: "The share and its token don't always agree. Spotting the difference by hand is slow, and most differences vanish once you pay to trade.",
  },
  {
    icon: <FunnelIcon />,
    eyebrow: "What GAUGE does",
    title: "Filters out the noise",
    body: "It watches both prices all session, takes every cost off, and only prompts you when something real is left. Never more than three times a day.",
    featured: true,
  },
  {
    icon: <LockIcon />,
    eyebrow: "What stays with you",
    title: "Your money, your call",
    body: "GAUGE never holds your funds and never trades on its own. Start in practice mode with pretend money, and go live only when you want to.",
  },
];

export function Overview() {
  return (
    <section id="overview" data-motion className="g-wrap relative pt-[140px]">
      <div className="grid items-start gap-10 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <div className="g-reveal lg:sticky lg:top-[120px]" style={reveal({ x: -40, y: 24 })}>
          <p className="g-eyebrow mb-7">01 · Overview</p>
          <h2 className="g-h2">
            What GAUGE
            <br />
            <span className="g-dot">does.</span>
          </h2>
          <p className="mt-6 font-mono text-[12px] tracking-[0.16em] text-dim">THE 30-SECOND VERSION</p>
        </div>
        <div className="flex flex-col gap-7">
          <p className="g-sum g-reveal" style={reveal({ y: 24 })}>
            Some stocks now trade in two places: on <b>Robinhood</b> as the normal share, and on{" "}
            <b>Robinhood Chain</b> as a token that tracks it. Most of the time the two prices match. Sometimes
            they drift apart.
          </p>
          <p className="g-sum g-reveal" style={reveal({ y: 24, delay: 150 })}>
            <b>GAUGE watches both.</b> When the difference is still worth acting on after every cost, it sends you
            a short-lived prompt. <b>You decide.</b> Nothing happens unless you tap.
          </p>
        </div>
      </div>

      <div className="mt-[72px] grid gap-5 lg:grid-cols-3">
        {panels.map((p, i) => (
          <Panel
            key={p.title}
            featured={p.featured}
            className="g-reveal g-rk box-content flex flex-col gap-4 p-9 max-sm:p-6 lg:min-h-[300px]"
            style={revealInRow(i, panels.length)}
          >
            {p.icon}
            <p className="g-eyebrow">{p.eyebrow}</p>
            <h3 className="g-h3">{p.title}</h3>
            <p className="g-p">{p.body}</p>
          </Panel>
        ))}
      </div>

      <div className="g-reveal" style={reveal({ y: 24 })}>
        <Glossary />
      </div>
    </section>
  );
}
