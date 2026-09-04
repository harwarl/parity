// Single source of truth for design tokens.
// Values are defined as CSS custom properties in app/globals.css (:root / @theme);
// components should reference these exports (or the matching Tailwind utilities,
// e.g. bg-void, text-paper, text-gap) rather than hardcoding hex values.
//
// Locked palette — steals Robinhood Chain's system (near-black, one poison accent)
// without touching Robin Neon (#CCFF00). Gap (#B8F53A) is the ONLY loud color in
// the system: it means "cheap basis / live / do it." Never add a second accent.

export const colors = {
  void: "var(--color-void)", // page background
  panel: "var(--color-panel)", // tape window, cards
  line: "var(--color-line)", // hairlines
  paper: "var(--color-paper)", // headlines, primary text
  mute: "var(--color-mute)", // subcopy, labels
  gap: "var(--color-gap)", // cheap basis, live chip, "Do it" — the only accent
  rich: "var(--color-rich)", // token rich (rare)
  halt: "var(--color-halt)", // frozen row (CLOSED / STALE)
} as const;

export const radius = {
  window: "var(--radius-window)", // 18px — the tape window
  chip: "var(--radius-chip)", // 8px — chips, small controls
} as const;

export const fonts = {
  sans: "var(--font-sans)", // Instrument Sans — UI
  mono: "var(--font-mono)", // IBM Plex Mono — ticks, bps, disclaimers
} as const;
