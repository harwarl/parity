import type { CSSProperties } from "react";

/**
 * The three Overview icons, 48 × 48, stroke 1.6 (design.md §5.3), with
 * their L2 loops. SVG transforms use fill-box so scale/translate act on
 * each shape itself.
 */
const box: CSSProperties = { transformBox: "fill-box" };

/** The problem: two bars drifting apart and back (g-barA / g-barB, one 4.2s clock). */
export function ProblemIcon() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" strokeWidth="1.6" aria-hidden>
      <path d="M8 6h32" stroke="#80848A" strokeDasharray="2 4" strokeLinecap="round" />
      <path d="M4 40h40" stroke="#80848A" strokeLinecap="round" />
      <rect
        x="10"
        y="20"
        width="10"
        height="20"
        rx="3"
        stroke="#F9F7F4"
        style={{ ...box, transformOrigin: "bottom", animation: "g-barA 4.2s ease-in-out infinite" }}
      />
      <rect
        x="28"
        y="12"
        width="10"
        height="28"
        rx="3"
        stroke="#B2D450"
        style={{ ...box, transformOrigin: "bottom", animation: "g-barB 4.2s ease-in-out infinite" }}
      />
    </svg>
  );
}

/** What GAUGE does: grey dots fall into a funnel; one lime dot comes out. */
export function FunnelIcon() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" strokeWidth="1.6" aria-hidden>
      <path d="M6 8h36l-13 16v12l-10 6V24z" stroke="#B2D450" strokeLinejoin="round" />
      {[14, 24, 34].map((x, i) => (
        <circle
          key={x}
          cx={x}
          cy="4"
          r="2"
          fill="#80848A"
          style={{ ...box, animation: `g-fall 3s ease-in ${i * 0.6}s infinite both` }}
        />
      ))}
      <circle
        cx="24"
        cy="44"
        r="2.5"
        fill="#B2D450"
        style={{ ...box, transformOrigin: "center", animation: "g-lockp 3s ease-in-out 1.6s infinite" }}
      />
    </svg>
  );
}

/** What stays with you: a lock with a pulsing lime core. */
export function LockIcon() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" strokeWidth="1.6" aria-hidden>
      <rect x="10" y="22" width="28" height="20" rx="5" stroke="#F9F7F4" />
      <path d="M16 22v-6a8 8 0 0 1 16 0v6" stroke="#F9F7F4" strokeLinecap="round" />
      <circle
        cx="24"
        cy="32"
        r="3"
        fill="#B2D450"
        style={{ ...box, transformOrigin: "center", animation: "g-lockp 2.6s ease-in-out infinite" }}
      />
    </svg>
  );
}
