/**
 * C1 · 300×84 ruler. Token dot travels 90px; the span grows 40 → 130 (scale
 * 3.25) on the same 4s clock, so the measured gap stays glued to both dots.
 */
const ticks = [30, 70, 110, 150, 190, 230, 270];
const label = { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1.6 } as const;

export function MeasureRuler() {
  return (
    <svg
      viewBox="0 0 300 84"
      width="300"
      height="84"
      className="mt-3 max-w-full"
      role="img"
      aria-label="Ruler measuring the distance between the cash mid and the token per share. The gap is token minus cash."
    >
      <line x1="10" y1="56" x2="290" y2="56" stroke="#F9F7F4" strokeOpacity=".14" />
      {ticks.map((x) => (
        <line key={x} x1={x} y1="52" x2={x} y2="60" stroke="#F9F7F4" strokeOpacity=".14" />
      ))}
      <rect
        x="60"
        y="54.5"
        width="40"
        height="3"
        rx="1.5"
        fill="#B2D450"
        style={{ transformOrigin: "60px 56px", animation: "g-span 4s ease-in-out infinite" }}
      />
      <circle cx="60" cy="56" r="6" fill="#F9F7F4" />
      <text x="60" y="30" textAnchor="middle" fill="#A6A9AE" style={label}>
        CASH
      </text>
      <g style={{ animation: "g-meas 4s ease-in-out infinite" }}>
        <circle cx="100" cy="56" r="11" fill="#B2D450" fillOpacity=".22" />
        <circle cx="100" cy="56" r="6" fill="#B2D450" />
        <text x="100" y="30" textAnchor="middle" fill="#B2D450" style={label}>
          TOKEN
        </text>
      </g>
    </svg>
  );
}
