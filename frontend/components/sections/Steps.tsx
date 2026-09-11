import Section from "@/components/layout/Section";
import Reveal from "@/components/shared/Reveal";
import Icon from "@/components/ui/Icon";

const steps = [
  {
    n: "01",
    h: "Measure the gap",
    p: "Join the cash mid and the multiplier-adjusted chain price on one clock. If the join is older than the budget, the name is STALE and nothing is measured.",
  },
  {
    n: "02",
    h: "Haircut it",
    p: "Subtract fee, slippage for your clip, and a buffer. What is left is net. A gap that does not survive the haircut never becomes a card.",
  },
  {
    n: "03",
    h: "You tap. Never TAPE.",
    p: "A card is a suggestion with a 75-second life. Do it, take it smaller, or Skip. On live, your tap runs a review, then you confirm the place yourself.",
    payoff: true,
  },
];

export default function Steps() {
  return (
    <Section eyebrow="How it works" heading="Three steps. The third one is yours.">
      <ol className="grid gap-x-10 gap-y-12 sm:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 90}>
            <li>
              <div className="flex items-center gap-3">
                <span className="tnum text-2xl font-medium text-green">{s.n}</span>
                <span
                  aria-hidden
                  className={`h-px flex-1 ${s.payoff ? "bg-green/50" : "bg-line"}`}
                />
                {i < steps.length - 1 ? (
                  <Icon
                    name="arrow"
                    size={13}
                    className="hidden text-text-mute sm:block"
                  />
                ) : null}
              </div>
              <h3
                className={`mt-5 text-lg font-medium tracking-tight ${
                  s.payoff ? "text-green" : "text-text"
                }`}
              >
                {s.h}
              </h3>
              <p className="mt-3 text-[0.88rem] leading-relaxed text-text-dim">
                {s.p}
              </p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
