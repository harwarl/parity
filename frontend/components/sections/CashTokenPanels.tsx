import Container from "@/components/layout/Container";
import Reveal from "@/components/shared/Reveal";
import Icon from "@/components/ui/Icon";

const panels = [
  {
    tag: "CASH",
    icon: "clock" as const,
    status: "prints in RTH",
    title: "The exchange price.",
    body: "Prints during regular trading hours and stops at the bell. This is the RHJ feed. The uiMultiplier never touches it.",
    rows: [
      ["Feed", "exchange / RHJ"],
      ["Hours", "RTH only"],
      ["Multiplier", "never applied"],
      ["Live leg", "equity, in RTH"],
    ],
  },
  {
    tag: "TOKEN",
    icon: "infinity" as const,
    status: "moves 24/7",
    title: "The chain price.",
    body: "Chainlink oracle, already scaled by uiMultiplier / 1e18. Trades around the clock and moves while the cash market sleeps.",
    rows: [
      ["Feed", "Chainlink oracle"],
      ["Hours", "24 / 7"],
      ["Multiplier", "applied at source"],
      ["Live leg", "US: watch only in v1"],
    ],
  },
];

export default function CashTokenPanels() {
  return (
    <section className="relative border-t border-line py-20 sm:py-28">
      <span aria-hidden className="absolute -top-px left-0 h-px w-16 bg-green/70" />
      <Container>
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          {panels.map((p, i) => (
            <Reveal
              key={p.tag}
              delay={i * 90}
              className={i === 1 ? "md:border-l md:border-line md:pl-16" : ""}
            >
              <div className="flex items-center justify-between">
                <p className="tnum flex items-center gap-2 text-[0.7rem] tracking-[0.24em] text-green">
                  <Icon name={p.icon} size={13} />
                  {p.tag}
                </p>
                <span className="tnum flex items-center gap-1.5 text-[0.68rem] uppercase tracking-widest text-text-mute">
                  <span
                    className={`size-1.5 rounded-full ${
                      p.tag === "TOKEN" ? "animate-pulse bg-green" : "bg-text-mute"
                    }`}
                  />
                  {p.status}
                </span>
              </div>
              <h3 className="mt-3 text-xl font-medium tracking-tight text-text">
                {p.title}
              </h3>
              <p className="mt-4 max-w-sm text-[0.85rem] leading-relaxed text-text-dim">
                {p.body}
              </p>
              <dl className="mt-6 border-t border-line">
                {p.rows.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between border-b border-line py-2.5"
                  >
                    <dt className="text-[0.8rem] text-text-mute">{k}</dt>
                    <dd className="tnum text-[0.8rem] text-text-dim">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
