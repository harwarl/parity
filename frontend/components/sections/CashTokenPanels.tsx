import Section from "@/components/layout/Section";
import Reveal from "@/components/shared/Reveal";
import Icon from "@/components/ui/Icon";

const panels = [
  {
    tag: "CASH",
    icon: "clock" as const,
    featured: false,
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
    featured: true,
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
    <Section
      eyebrow="Cash and token"
      heading="Two feeds for one name."
      lede="Same company. Different books, different hours, different marginal buyer. Each leg on its own terms."
    >
      <div className="grid gap-5 md:grid-cols-2 md:gap-6">
        {panels.map((p, i) => (
          <Reveal key={p.tag} delay={i * 90}>
            <article
              className={`relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 sm:p-8 ${
                p.featured
                  ? "border-green/25 bg-surface-2"
                  : "border-line bg-surface-2"
              }`}
            >
              {p.featured ? (
                <span
                  aria-hidden
                  className="grid-texture pointer-events-none absolute inset-0 opacity-[0.35]"
                />
              ) : null}

              <div className="relative flex items-center justify-between">
                <span
                  className={`tnum flex items-center gap-2 text-[0.7rem] tracking-[0.24em] ${
                    p.featured ? "text-green" : "text-text-dim"
                  }`}
                >
                  <Icon name={p.icon} size={13} />
                  {p.tag}
                </span>
                <span className="tnum flex items-center gap-1.5 text-[0.66rem] uppercase tracking-widest text-text-mute">
                  <span
                    className={`size-1.5 rounded-full ${
                      p.featured ? "animate-pulse bg-green" : "bg-text-mute"
                    }`}
                  />
                  {p.status}
                </span>
              </div>

              <h3 className="relative mt-6 text-[1.6rem] font-medium leading-tight tracking-tight text-text">
                {p.title}
              </h3>
              <p className="relative mt-3 max-w-sm text-[0.9rem] leading-relaxed text-text-dim">
                {p.body}
              </p>

              <dl className="relative mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
                {p.rows.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <dt className="text-[0.8rem] text-text-mute">{k}</dt>
                    <dd className="tnum text-[0.82rem] text-text">{v}</dd>
                  </div>
                ))}
              </dl>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
