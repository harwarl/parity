/** Docs navigation (design.md §5C.1). */

export type DocLink = { label: string; href?: string; draft?: boolean };
export type DocGroup = { label: string; draft?: boolean; items: DocLink[] };

/** Shown in the docs footer and article meta. Bump when the docs change. */
export const DOCS_META = {
  version: "v0.1",
  updated: "26 Sep 2026",
} as const;

export const DOCS = {
  home: "/docs",
  quickstart: "/docs/quickstart",
  card: "/docs/how-a-card-is-made",
  reasons: "/docs/reason-codes",
} as const;

/**
 * Pages drawn in design.md link to their route. Undrawn pages point at the
 * section that already covers them (landing or another docs page); pages with
 * no content anywhere yet have no href and render as "soon".
 */
export const sidebar: DocGroup[] = [
  {
    label: "Get started",
    items: [
      { label: "Overview", href: DOCS.home },
      { label: "Quickstart", href: DOCS.quickstart },
      { label: "Link your Agentic Account", href: `${DOCS.quickstart}#link` },
      { label: "Paper vs live", href: "/#paper" },
    ],
  },
  {
    label: "How GAUGE works",
    items: [
      { label: "How a card is made", href: DOCS.card },
      { label: "The four gates", href: `${DOCS.card}#gates` },
      { label: "Reason codes", href: DOCS.reasons },
      { label: "Card lifecycle", href: `${DOCS.card}#emit` },
      { label: "Daily cap", href: "/#card" },
    ],
  },
  {
    label: "Safety",
    items: [
      { label: "What GAUGE won't do", href: "/#wont" },
      { label: "The token is not the share", href: "/#wont" },
    ],
  },
  {
    label: "Developers",
    draft: true,
    items: [
      { label: "Architecture", href: `${DOCS.home}#developers` },
      { label: "Gap math spec", href: `${DOCS.card}#spec` },
      { label: "Event stream (SSE)", href: `${DOCS.quickstart}#stream` },
      { label: "Card event", href: `${DOCS.card}#spec` },
      { label: "Reason event", href: `${DOCS.reasons}#event` },
    ],
  },
  {
    label: "Reference",
    items: [{ label: "Glossary" }, { label: "FAQ", href: "/#faq" }, { label: "Changelog" }],
  },
];

export const docsNav = [
  { label: "Guide", href: DOCS.home, match: "guide" },
  { label: "Developers", href: `${DOCS.card}#spec`, match: "dev" },
  { label: "FAQ", href: "/#faq", match: "" },
  { label: "Site", href: "/", match: "" },
] as const;

/** Everything the ⌘K palette can jump to. */
export const searchIndex: { title: string; section?: string; href: string }[] = [
  { title: "Overview", href: DOCS.home },
  { title: "Quickstart", href: DOCS.quickstart },
  { title: "Open GAUGE", section: "Quickstart", href: `${DOCS.quickstart}#open` },
  { title: "Link your Agentic Account", section: "Quickstart", href: `${DOCS.quickstart}#link` },
  { title: "Switch to Live", section: "Quickstart", href: `${DOCS.quickstart}#live` },
  { title: "Check your gates", section: "Quickstart", href: `${DOCS.quickstart}#gates` },
  { title: "Read your first card", section: "Quickstart", href: `${DOCS.quickstart}#first-card` },
  { title: "Tap Do it", section: "Quickstart", href: `${DOCS.quickstart}#do-it` },
  { title: "Review it in History", section: "Quickstart", href: `${DOCS.quickstart}#history` },
  { title: "Stream cards yourself (SSE)", section: "Quickstart", href: `${DOCS.quickstart}#stream` },
  { title: "How a card is made", href: DOCS.card },
  { title: "Two prices", section: "How a card is made", href: `${DOCS.card}#prices` },
  { title: "The gap, in basis points", section: "How a card is made", href: `${DOCS.card}#gap` },
  { title: "The haircut", section: "How a card is made", href: `${DOCS.card}#haircut` },
  { title: "The four gates", section: "How a card is made", href: `${DOCS.card}#gates` },
  { title: "Emit the card", section: "How a card is made", href: `${DOCS.card}#emit` },
  { title: "Re-quote on confirm", section: "How a card is made", href: `${DOCS.card}#requote` },
  { title: "Gap math spec · card event", section: "How a card is made", href: `${DOCS.card}#spec` },
  { title: "Reason codes", href: DOCS.reasons },
  { title: "STALE", section: "Reason codes", href: `${DOCS.reasons}#stale` },
  { title: "CLOSED", section: "Reason codes", href: `${DOCS.reasons}#closed` },
  { title: "THIN", section: "Reason codes", href: `${DOCS.reasons}#thin` },
  { title: "DUST", section: "Reason codes", href: `${DOCS.reasons}#dust` },
  { title: "Re-quote fail", section: "Reason codes", href: `${DOCS.reasons}#requote-fail` },
  { title: "Reason event", section: "Reason codes", href: `${DOCS.reasons}#event` },
];
