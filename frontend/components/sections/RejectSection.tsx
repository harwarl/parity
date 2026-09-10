import Section from "@/components/layout/Section";
import RefusalFeed from "@/components/parity/RefusalFeed";
import Reveal from "@/components/shared/Reveal";

const codes = [
  {
    code: "STALE",
    when: "The cash/chain join blew its 8–15s budget. No trusted basis to quote.",
  },
  {
    code: "CLOSED",
    when: "Cash is not in RTH. The equity leg cannot trade, so no live card.",
  },
  {
    code: "THIN",
    when: "Book depth cannot fill the clip without moving price past the buffer.",
  },
  {
    code: "DUST",
    when: "Net is real but too small to matter after the haircut. Not worth the tap.",
  },
];

export default function RejectSection() {
  return (
    <Section
      id="refusals"
      eyebrow="Refusals"
      heading="No card beats a wrong card."
      lede="Most ticks do not become a card. Each refusal has a short, stamped reason. This is the point of the product, not a limitation of it."
    >
      <RefusalFeed />

      {/* reject tiles — stamp in one by one */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {codes.map((c, i) => (
          <Reveal key={c.code} delay={i * 90} scaleFrom={1.14} className="h-full">
            <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-5">
              <span
                aria-hidden
                className="tnum pointer-events-none absolute -right-3 -top-2 select-none text-[3.25rem] font-semibold leading-none text-halt/10"
              >
                ✕
              </span>
              <span className="tnum relative inline-flex w-fit -rotate-2 items-center rounded-md border border-halt/50 bg-halt/5 px-2.5 py-1 text-[12px] font-medium tracking-[0.18em] text-halt">
                {c.code}
              </span>
              <p className="relative mt-4 text-[0.83rem] leading-relaxed text-text-dim">
                {c.when}
              </p>
            </article>
          </Reveal>
        ))}
      </div>

      {/* HALT — a different class of refusal, its own panel */}
      <Reveal delay={120}>
        <div className="mt-4 overflow-hidden rounded-2xl border border-halt/40 bg-surface p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="tnum inline-flex items-center gap-2 rounded-md border border-halt/60 bg-halt/5 px-2.5 py-1 text-[12px] font-medium tracking-[0.18em] text-halt">
              <span aria-hidden className="size-1.5 rounded-full bg-halt" />
              HALT
            </span>
            <span className="eyebrow">multiplier jump · oracle pause</span>
          </div>
          <p className="mt-3 max-w-2xl text-[0.85rem] leading-relaxed text-text-dim">
            A multiplier jump from a dividend or split, or an oracle pause, freezes
            the name. HALT is &ldquo;no data,&rdquo; not &ldquo;bad price.&rdquo; It
            clears on a manual resume or a run of clean ticks. Never on a guess.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
