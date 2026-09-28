/*
 * 02 · Who it's for · design dials: VARIANCE 5 / MOTION 5 / DENSITY 4.
 * Header grid, three personas that take turns being featured (L4), and a
 * trust strip (L5). design.md §5.4, rev 2.
 */
import { SectionHeader } from "@/components/ui/SectionHeader";
import { reveal, revealInRow } from "@/lib/reveal";
import { TrustStrip } from "./TrustStrip";

const personas = [
  {
    letter: "A",
    title: "You trade on Robinhood",
    body: "You already buy and sell stocks yourself, and want to know when the onchain price drifts from the one you see.",
  },
  {
    letter: "B",
    title: "You hold stock tokens",
    body: "You own Robinhood Chain stock tokens and want a heads-up when they trade away from the real share.",
  },
  {
    letter: "C",
    title: "You're curious, not reckless",
    body: "You want to learn how onchain stocks behave in practice mode, before a single real dollar moves.",
  },
];

export function WhoItsFor() {
  return (
    <section id="who" data-motion className="g-wrap relative pt-[150px]">
      <SectionHeader
        eyebrow="02 · Who it's for"
        title={
          <>
            Who it&apos;s
            <br />
            <span className="g-dot">for.</span>
          </>
        }
        lede="Self-directed traders who want a second pair of eyes on onchain prices, without handing over control."
      />
      <ul className="grid gap-5 lg:grid-cols-3">
        {personas.map((p, i) => (
          <li key={p.letter} className="g-reveal grid" style={revealInRow(i, personas.length)}>
            <div
              className="g-panel g-persona flex flex-col gap-3 p-8"
              style={{ animationDelay: `${i * 3}s` }}
            >
              <span
                aria-hidden
                className="g-plet grid size-[26px] place-items-center rounded-full border border-accent/50 font-mono text-[12px] text-accent"
                style={{ animationDelay: `${i * 3}s` }}
              >
                {p.letter}
              </span>
              <h3 className="g-h3 !text-[20px]">{p.title}</h3>
              <p className="g-p">{p.body}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="g-reveal" style={reveal({ y: 24 })}>
        <TrustStrip />
      </div>
    </section>
  );
}
