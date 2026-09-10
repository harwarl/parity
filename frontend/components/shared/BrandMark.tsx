/**
 * Monogram mark for a ticker — a real <svg> so a licensed brand glyph can be
 * dropped into GLYPHS later without touching call sites. Monochrome by design:
 * the page runs one green accent and no brand colors (see CLAUDE.md palette).
 */

// optional hand-drawn glyph paths, viewBox 0 0 24 24, currentColor fill
const GLYPHS: Record<string, string> = {
  AAPL: "M16.3 12.9c0-2 1.6-3 1.7-3-.9-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.3 2-1.4 2.5-.4 6.1 1 8.1.7 1 1.5 2.1 2.5 2 1-.03 1.4-.65 2.6-.65 1.2 0 1.5.65 2.6.63 1.1-.02 1.8-1 2.4-2 .8-1.1 1.1-2.2 1.1-2.3 0 0-2.1-.8-2.1-3.2Zm-2-6c.6-.7 1-1.6.9-2.6-.85.04-1.9.58-2.5 1.3-.55.6-1 1.6-.9 2.5 1 .08 1.9-.5 2.5-1.2Z",
  TSLA: "M12 4c2.6 0 4.9.7 6.7 1.9L17.4 8c-1-.5-2-.9-3-1.1l-.2-.05-.9 12.2h-2.6l-.9-12.2-.2.05c-1 .2-2 .6-3 1.1L5.3 5.9C7.1 4.7 9.4 4 12 4Z",
};

export default function BrandMark({
  symbol,
  className = "size-9",
}: {
  symbol: string;
  className?: string;
}) {
  const glyph = GLYPHS[symbol];
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`shrink-0 rounded-md border border-line bg-surface text-text-dim ${className}`}
    >
      {glyph ? (
        <path d={glyph} fill="currentColor" />
      ) : (
        <text
          x="12"
          y="12"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="9.5"
          fontWeight="600"
          fill="currentColor"
          fontFamily="var(--font-mono)"
        >
          {symbol.slice(0, 2)}
        </text>
      )}
    </svg>
  );
}
