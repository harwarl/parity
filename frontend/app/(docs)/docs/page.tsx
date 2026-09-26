import type { Metadata } from "next";
import Link from "next/link";
import { DOCS } from "@/config/docs";
import { Panel } from "@/components/ui/Panel";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { SearchTrigger } from "@/components/docs/SearchTrigger";
import { ArchDiagram } from "@/components/docs/figures/ArchDiagram";
import { ProductFlow } from "@/components/docs/figures/ProductFlow";

export const metadata: Metadata = {
  title: "Docs · GAUGE",
  description: "How GAUGE measures the gap, when it shows you a card, and what happens when you tap Do it.",
};

const tiles = [
  { n: "01 · 5 min", title: "Quickstart", body: "Link your Agentic Account, set your gates, and read your first card.", cta: "Start →", href: DOCS.quickstart },
  { n: "02 · concept", title: "How a card is made", body: "Measure, haircut, gate, emit. The math behind every card, with a worked NVDA example.", cta: "Read →", href: DOCS.card },
  { n: "03 · reference", title: "Reason codes", body: "STALE, CLOSED, THIN, DUST. What each one means and what to do about it.", cta: "Look up →", href: DOCS.reasons },
];
const guides = [
  { label: "Link your Agentic Account", meta: "setup", href: `${DOCS.quickstart}#link` },
  { label: "Paper vs live", meta: "modes", href: "/#paper" },
  { label: "The four gates", meta: "concept", href: `${DOCS.card}#gates` },
  { label: "Card lifecycle", meta: "concept", href: `${DOCS.card}#emit` },
  { label: "What GAUGE won't do", meta: "safety", href: "/#wont" },
];
const devLinks = [
  { label: "Architecture →", href: "#developers" },
  { label: "Gap math spec →", href: `${DOCS.card}#spec` },
  { label: "Event stream (SSE) →", href: `${DOCS.quickstart}#stream` },
  { label: "Card event →", href: `${DOCS.card}#spec` },
];
const questions = [
  { q: "Does GAUGE ever place a trade on its own?", a: "No", href: `${DOCS.card}#requote` },
  { q: "Why am I not seeing any cards?", a: "Reason codes", href: DOCS.reasons },
  { q: "What counts as a cost?", a: "The haircut", href: `${DOCS.card}#haircut` },
  { q: "Why only 3 cards a day?", a: "Daily cap", href: "/#card" },
  { q: "Is the token the same as the share?", a: "No", href: "/#wont" },
];

const row = "doc-plain flex items-center justify-between gap-4 border-b border-ink/7 py-4 last:border-b-0";

/** Docs home (design.md §5C.4). */
export default function DocsHome() {
  return (
    <>
      {/* The one lime glow in the docs */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-420px] left-1/2 -z-10 h-[760px] w-[1100px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(178,212,80,.10), transparent)", filter: "blur(30px)" }}
      />
      <div className="mx-auto grid w-[min(1300px,calc(100%-32px))] gap-14 pt-12 pb-16 lg:grid-cols-[248px_minmax(0,1fr)]">
        <DocsSidebar />
        <div className="min-w-0">
          <header className="flex flex-col gap-5 pt-6 pb-11">
            <p className="g-eyebrow">GAUGE docs</p>
            <h1 className="font-display text-[clamp(36px,4vw,52px)] leading-[1.02] font-extrabold tracking-[-0.05em] text-ink">
              Two prices. <span className="g-dot text-[calc(1em*58/52)]">One gap.</span>
              <br />
              Everything else, explained.
            </h1>
            <p className="max-w-[640px] text-[18px] leading-[1.65] text-muted">
              How GAUGE measures the gap between a Robinhood stock and its Robinhood Chain token, when it shows you a
              card, and what happens when you tap Do it.
            </p>
            <SearchTrigger size="large" />
          </header>

          <section aria-labelledby="start">
            <h2 id="start" className="app-ph-label mb-4">Start here</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {tiles.map((t, i) => (
                <Link
                  key={t.title}
                  href={t.href}
                  className={`g-panel doc-tile flex min-h-[210px] flex-col gap-3.5 p-[26px] ${i === 0 ? "g-feat" : ""}`}
                >
                  <span className="font-mono text-[12px] text-accent">{t.n}</span>
                  <span className="font-display text-[21px] font-semibold tracking-[-0.03em] text-ink">{t.title}</span>
                  <span className="text-[14.5px] leading-[1.6] text-muted">{t.body}</span>
                  <span className="mt-auto text-[14px] font-semibold text-accent">{t.cta}</span>
                </Link>
              ))}
            </div>
          </section>

          <Panel className="mt-4 px-[30px] py-7">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="app-ph-label">The whole product in one line</h2>
              <Link href={DOCS.card} className="text-[13px] font-semibold text-accent hover:text-accent-hover">
                Full walkthrough →
              </Link>
            </div>
            <div className="overflow-x-auto pb-1">
              <ProductFlow />
            </div>
          </Panel>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Panel className="px-[26px] py-6">
              <h2 className="app-ph-label mb-2">Guides</h2>
              <ul>
                {guides.map((g) => (
                  <li key={g.label}>
                    <Link href={g.href} className={`${row} text-[15px] text-ink hover:text-accent`}>
                      {g.label}
                      <span className="font-mono text-[12px] text-dim">{g.meta}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel id="developers" className="scroll-mt-[100px] px-[26px] py-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="app-ph-label">For developers</h2>
                <span className="doc-draft">DRAFT SCHEMAS</span>
              </div>
              <ArchDiagram />
              <ul className="mt-5 grid grid-cols-2 gap-x-6">
                {devLinks.map((d) => (
                  <li key={d.label}>
                    <Link href={d.href} className={`${row} !py-3 text-[14px] text-ink-2 hover:text-accent`}>
                      {d.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <Panel className="mt-4 px-[26px] py-6">
            <h2 className="app-ph-label mb-2">Popular questions</h2>
            <ul>
              {questions.map((q) => (
                <li key={q.q}>
                  <Link href={q.href} className={`${row} text-[15px] text-ink hover:text-accent-soft`}>
                    {q.q}
                    <span className="flex-none text-[14px] font-semibold text-accent">{q.a} →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          <footer className="mt-14 flex flex-wrap justify-between gap-3 border-t border-ink/8 pt-6 font-mono text-[12px] text-dim">
            <span>GAUGE is not affiliated with Robinhood. Signals, not advice.</span>
            <span>Docs · [DOCS_VERSION] · © 2026 GAUGE</span>
          </footer>
        </div>
      </div>
    </>
  );
}
