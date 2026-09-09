import Container from "@/components/layout/Container";
import Reveal from "@/components/shared/Reveal";
import Icon from "@/components/ui/Icon";

const rails = [
  { icon: "layers" as const, k: "Paper default", v: "7+ days on paper before live is even offered." },
  { icon: "lock" as const, k: "No custody", v: "No deposits, no balance held, no wallet to connect." },
  { icon: "route" as const, k: "Official MCP only", v: "Live equity routes through the official Trading MCP." },
  { icon: "shield" as const, k: "Confirm-gated", v: "Every live place is a review, then your explicit confirm." },
  { icon: "freeze" as const, k: "One-name freeze", v: "Halt a single symbol in seconds, with an audit row." },
  { icon: "activity" as const, k: "Self-directed", v: "Signals only. You place every trade yourself, on the official rails." },
];

export default function RailsBand() {
  return (
    <section id="rails" className="relative border-t border-line py-20 sm:py-28">
      <span aria-hidden className="absolute -top-px left-0 h-px w-16 bg-green/70" />
      <Container>
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Rails</p>
          <h2 className="mt-4 text-2xl font-medium leading-[1.12] tracking-[-0.02em] text-text sm:text-[2.15rem]">
            The guardrails are the product too.
          </h2>
        </Reveal>

        <dl className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {rails.map((r, i) => (
            <Reveal
              key={r.k}
              delay={(i % 3) * 70}
              className="group border-t border-line pt-4"
            >
              <dt className="flex items-center gap-2.5 text-[0.9rem] font-medium tracking-tight text-text">
                <span className="text-green transition-transform duration-300 group-hover:-translate-y-0.5">
                  <Icon name={r.icon} size={15} />
                </span>
                {r.k}
              </dt>
              <dd className="mt-2 text-[0.82rem] leading-relaxed text-text-dim">
                {r.v}
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
