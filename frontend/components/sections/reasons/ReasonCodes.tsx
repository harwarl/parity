/*
 * Reason codes · design dials: VARIANCE 6 / MOTION 7 / DENSITY 5.
 * Header grid + 4 panels (E1–E4). One Doto code per failed gate.
 */
import type { ReactNode } from "react";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DepthBars } from "./DepthBars";
import { DustDots } from "./DustDots";
import { SessionTrack } from "./SessionTrack";
import { StaleAge } from "./StaleAge";

type Reason = { gate: string; code: string; visual: ReactNode; body: string; featured?: boolean };

const reasons: Reason[] = [
  {
    gate: "Feed",
    code: "STALE",
    visual: <StaleAge />,
    body: "One of the two prices is too old to trust. No card on a stale quote.",
  },
  {
    gate: "Session",
    code: "CLOSED",
    visual: <SessionTrack />,
    body: "The cash market is outside the session GAUGE trades. The token may still tick. GAUGE waits.",
  },
  {
    gate: "Depth",
    code: "THIN",
    visual: <DepthBars />,
    body: "Not enough depth to fill without eating the gap. The book is too thin.",
  },
  {
    gate: "Net gap",
    code: "DUST",
    visual: <DustDots />,
    body: "A gap exists, but after fees, slippage and buffer it rounds to nothing.",
    featured: true,
  },
];

export function ReasonCodes() {
  return (
    <section id="reasons" data-motion className="g-wrap relative pt-[150px]">
      <SectionHeader
        eyebrow="03 · Reason codes"
        title={
          <>
            No card?
            <br />
            You get a
            <br />
            <span className="g-dot">reason.</span>
          </>
        }
        lede="Silence is never a mystery. When a gate fails, GAUGE tells you which one, in one word."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((r) => (
          <Panel
            key={r.code}
            featured={r.featured}
            className="box-content flex sm:min-h-[340px] flex-col gap-5 p-8"
          >
            <p className="g-label">{r.gate}</p>
            {r.visual}
            <p className="mt-2 font-dot text-[46px] leading-none font-black text-ink">{r.code}</p>
            <p className="g-p mt-auto">{r.body}</p>
          </Panel>
        ))}
      </div>
    </section>
  );
}
