/** "Words you'll see": four terms, highlighted one at a time in reading order (L3). */
const terms = [
  { term: "bps", def: "One hundredth of 1%. 17 bps = 0.17%." },
  { term: "Prompt · card", def: "A 75-second suggestion. Not an order." },
  { term: "Paper", def: "Practice mode with pretend money. On by default." },
  { term: "Agentic Account", def: "The Robinhood account type GAUGE places live orders on." },
];

export function Glossary() {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[180px_repeat(4,1fr)]">
      <div className="flex flex-col justify-center sm:col-span-2 lg:col-span-1">
        <p className="font-mono text-[12px] tracking-[0.18em] text-ink">WORDS YOU&apos;LL SEE</p>
        <p className="mt-1 text-[13px] text-dim">in plain English</p>
      </div>
      <dl className="contents">
        {terms.map((t, i) => (
          <div key={t.term} className="g-def">
            <span aria-hidden className="g-hl" style={{ animationDelay: `${i * 1.5}s` }} />
            <dt className="g-term relative font-mono text-[13px] text-accent" style={{ animationDelay: `${i * 1.5}s` }}>
              {t.term}
            </dt>
            <dd className="relative text-[14px] leading-[1.5] text-muted">{t.def}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
