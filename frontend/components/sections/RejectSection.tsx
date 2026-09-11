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

      {/* reject codes — hairline-separated, the stamp badge stamps in */}
      <div className="mt-10 grid border-t border-line sm:grid-cols-2">
        {codes.map((c, i) => (
          <div
            key={c.code}
            className="flex gap-4 border-b border-line py-5 sm:odd:border-r sm:odd:pr-8 sm:even:pl-8"
          >
            <Reveal scaleFrom={1.16} delay={i * 80} className="h-fit shrink-0">
              <span className="inline-flex -rotate-2 items-center rounded-sm border border-halt/50 bg-halt/5 px-2 py-1 text-[11px] font-medium tracking-[0.18em] text-halt">
                {c.code}
              </span>
            </Reveal>
            <p className="text-[0.85rem] leading-relaxed text-text-dim">{c.when}</p>
          </div>
        ))}
      </div>

      {/* HALT — a different class of refusal */}
      <Reveal
        delay={120}
        className="mt-8 flex flex-col gap-4 border-t border-halt/40 pt-6 sm:flex-row sm:items-start sm:gap-6"
      >
        <span className="inline-flex h-fit w-fit shrink-0 items-center gap-2 rounded-sm border border-halt/50 bg-halt/5 px-2 py-1 text-[11px] font-medium tracking-[0.18em] text-halt">
          <span aria-hidden className="size-1.5 rounded-full bg-halt" />
          HALT
        </span>
        <p className="max-w-2xl text-[0.85rem] leading-relaxed text-text-dim">
          A multiplier jump from a dividend or split, or an oracle pause, freezes
          the name. HALT is &ldquo;no data,&rdquo; not &ldquo;bad price.&rdquo; It
          clears on a manual resume or a run of clean ticks. Never on a guess.
        </p>
      </Reveal>
    </Section>
  );
}
