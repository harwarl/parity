/*
 * The card · design dials: VARIANCE 7 / MOTION 7 / DENSITY 5.
 * Header grid + 7fr/5fr: featured card panel (D1, D2, D4) + cap panel (D3).
 */
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CardMock } from "./CardMock";
import { DailyCap } from "./DailyCap";

const anatomy = [
  { label: "Countdown", body: "75 seconds, then it's gone. No stale cards waiting in a queue." },
  { label: "Re-quote", body: "Confirm pulls fresh prices for both legs before anything moves." },
  { label: "Do it", body: "The only path to an order is your tap. The model never places." },
];

export function TheCard() {
  return (
    <section id="card" data-motion className="g-wrap relative pt-[150px]">
      <SectionHeader
        eyebrow="02 · The card"
        title={
          <>
            75 seconds.
            <br />
            One <span className="g-dot">tap.</span>
          </>
        }
        lede="A card is a proposal, not an order. It lives for 75 seconds. When you tap Do it, GAUGE re-quotes both prices first. If the net gap no longer clears, nothing happens."
      />
      <div className="grid gap-5 lg:grid-cols-[7fr_5fr]">
        <Panel
          featured
          className="flex flex-col gap-11 overflow-hidden p-11 max-sm:p-5 md:flex-row"
        >
          {/* D4 · 1px scan along the top edge */}
          <span aria-hidden className="absolute inset-x-0 top-0 h-px overflow-hidden">
            <span
              className="block h-full w-1/2"
              style={{
                background: "linear-gradient(90deg, transparent, #B2D450, transparent)",
                animation: "g-scan 5s linear infinite",
              }}
            />
          </span>
          <CardMock />
          <dl className="flex flex-col gap-[22px]">
            {anatomy.map((item) => (
              <div key={item.label}>
                <dt className="g-eyebrow">{item.label}</dt>
                <dd className="g-p mt-1.5">{item.body}</dd>
              </div>
            ))}
          </dl>
        </Panel>
        <DailyCap />
      </div>
    </section>
  );
}
