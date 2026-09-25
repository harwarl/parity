/**
 * GAUGE wordmark, vector redraw on a 270 × 58 grid, stroke 11 (design.md §7).
 * First G bar lime, second G bar ink. Replace with the master SVG when it exists.
 */
export function Wordmark({ width = 112, className = "" }: { width?: number; className?: string }) {
  const height = (width * 58) / 270;
  return (
    <svg
      viewBox="0 0 270 58"
      width={width}
      height={height}
      role="img"
      aria-label="GAUGE"
      className={className}
    >
      <g fill="none" stroke="#F9F7F4" strokeWidth="11">
        {/* G */}
        <path d="M45.6 12.4 A23.5 23.5 0 1 0 52.5 29" />
        {/* U */}
        <path d="M117.5 0 V34 A18.5 18.5 0 0 0 154.5 34 V0" />
        {/* second G, centre shifted +166 */}
        <path d="M211.6 12.4 A23.5 23.5 0 1 0 218.5 29" />
      </g>
      <rect x="29" y="23.5" width="29" height="11" fill="#B2D450" />
      <polygon points="62,58 85,0 108,58 96.5,58 85,23 73.5,58" fill="#F9F7F4" />
      <rect x="195" y="23.5" width="29" height="11" fill="#F9F7F4" />
      {/* E */}
      <g fill="#F9F7F4">
        <rect x="230" y="0" width="11" height="58" />
        <rect x="230" y="0" width="40" height="11" />
        <rect x="230" y="23.5" width="36" height="11" />
        <rect x="230" y="47" width="40" height="11" />
      </g>
    </svg>
  );
}
