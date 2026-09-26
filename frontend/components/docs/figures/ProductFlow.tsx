/** Docs home · the whole product in one line (900 × 96). K2 flow at 1.6s. */
const stations = [
  { x: 40, label: "MEASURE", sub: "cash vs token", stroke: "#C9CBCF" },
  { x: 177, label: "HAIRCUT", sub: "fees·slip·buffer", stroke: "#FF6B5E" },
  { x: 314, label: "4 GATES", sub: "feed→session→depth→net", stroke: "#C9CBCF" },
  { x: 451, label: "CARD", sub: "lives 75 s", stroke: "#B2D450", card: true },
  { x: 588, label: "YOU TAP", sub: "Do it", stroke: "#B2D450" },
  { x: 725, label: "RE-QUOTE", sub: "gates again", stroke: "#C9CBCF" },
  { x: 860, label: "ONE ORDER", sub: "or paper fill", stroke: "#B2D450" },
];

export function ProductFlow() {
  return (
    <svg
      viewBox="0 0 900 96"
      className="w-full min-w-[640px] overflow-visible"
      role="img"
      aria-label="Measure the gap, take the haircut, pass four gates, emit a 75-second card, you tap Do it, GAUGE re-quotes and re-checks the gates, then one order or a paper fill."
    >
      <line
        x1="40"
        x2="860"
        y1="30"
        y2="30"
        stroke="#B2D450"
        strokeOpacity=".5"
        strokeWidth="2"
        strokeDasharray="4 8"
        style={{ animation: "k-flow 1.6s linear infinite" }}
      />
      {stations.map((s) => (
        <g key={s.label}>
          {s.card && <circle cx={s.x} cy="30" r="20" fill="#B2D450" fillOpacity=".18" />}
          <circle
            cx={s.x}
            cy="30"
            r={s.card ? 12 : 9}
            fill={s.card ? "#B2D450" : "#0A0B0D"}
            stroke={s.stroke}
            strokeWidth="1.5"
          />
          <text x={s.x} y="66" textAnchor="middle" fill={s.card ? "#B2D450" : "#F9F7F4"} style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 1 }}>
            {s.label}
          </text>
          <text x={s.x} y="84" textAnchor="middle" fill="#80848A" style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>
            {s.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}
