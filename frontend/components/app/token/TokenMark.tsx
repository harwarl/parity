/**
 * J11 · Pre-launch token mark (300 × 300): dotted orbit + satellite (40s),
 * lime arc ring (26s reverse), breathing hexagon (5s), flat G. Placeholder
 * until token art exists.
 */
export function TokenMark() {
  return (
    <svg viewBox="0 0 300 300" width="300" height="300" className="max-w-full" role="img" aria-label="Placeholder token mark">
      <g style={{ transformOrigin: "150px 150px", animation: "j-orbit 40s linear infinite" }}>
        <circle cx="150" cy="150" r="136" fill="none" stroke="#F9F7F4" strokeOpacity=".08" strokeDasharray="2 8" />
        <circle cx="286" cy="150" r="4" fill="#B2D450" style={{ filter: "drop-shadow(0 0 6px #B2D450)" }} />
      </g>
      <circle
        cx="150"
        cy="150"
        r="112"
        fill="none"
        stroke="#B2D450"
        strokeOpacity=".25"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="60 644"
        style={{ transformOrigin: "150px 150px", animation: "j-orbit 26s linear infinite reverse" }}
      />
      <path d="M150 54l83 48v96l-83 48-83-48v-96z" fill="#0F1113" />
      <path
        d="M150 54l83 48v96l-83 48-83-48v-96z"
        fill="none"
        stroke="#B2D450"
        strokeOpacity=".5"
        strokeWidth="1.5"
        style={{ animation: "j-breathe 5s ease-in-out infinite" }}
      />
      <g transform="translate(111 111) scale(1.34)">
        <path d="M45.6 12.4A23.5 23.5 0 1 0 52.5 29" fill="none" stroke="#F9F7F4" strokeWidth="11" />
        <rect x="29" y="23.5" width="29" height="11" fill="#B2D450" />
      </g>
    </svg>
  );
}
