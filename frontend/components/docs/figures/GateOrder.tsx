/** How a card is made · gate order (680 × 150). K2 flow at 1.4s. */
const pills = [
  { x: 0, w: 92, label: "FEED", code: "STALE", rule: "age > 2.0 s", color: "#FF6B5E" },
  { x: 145, w: 104, label: "SESSION", code: "CLOSED", rule: "outside RTH", color: "#8FA6DA" },
  { x: 302, w: 92, label: "DEPTH", code: "THIN", rule: "depth < $100k", color: "#E8B04A" },
  { x: 447, w: 104, label: "NET GAP", code: "DUST", rule: "net < 2.0 bps", color: "#80848A" },
];
const mono = { fontFamily: "var(--font-mono)" } as const;

export function GateOrder() {
  return (
    <svg
      viewBox="0 0 680 150"
      className="w-full min-w-[560px] overflow-visible"
      role="img"
      aria-label="Gates run in order: feed, session, depth, net gap, then a card. The first gate to fail becomes the reason: STALE, CLOSED, THIN or DUST."
    >
      <line
        x1="40"
        x2="640"
        y1="44"
        y2="44"
        stroke="#B2D450"
        strokeOpacity=".5"
        strokeWidth="2"
        strokeDasharray="4 8"
        style={{ animation: "k-flow 1.4s linear infinite" }}
      />
      {pills.map((p, i) => {
        const cx = [46, 197, 348, 499][i];
        return (
          <g key={p.label}>
            <rect x={p.x + 0.75} y="22.75" width={p.w - 1.5} height="42.5" rx="21.25" fill="#0C0D10" stroke="#F9F7F4" strokeOpacity=".14" />
            <text x={p.x + p.w / 2} y="48" textAnchor="middle" fill="#F9F7F4" style={{ ...mono, fontSize: 11, letterSpacing: 1.2 }}>
              {p.label}
            </text>
            <line x1={cx} x2={cx} y1="66" y2="106" stroke={p.color} strokeWidth="1.5" strokeDasharray="2 3" />
            <text x={cx} y="124" textAnchor="middle" fill={p.color} style={{ ...mono, fontSize: 14, fontWeight: 600 }}>
              {p.code}
            </text>
            <text x={cx} y="142" textAnchor="middle" fill="#80848A" style={{ ...mono, fontSize: 10 }}>
              {p.rule}
            </text>
          </g>
        );
      })}
      <rect x="590" y="22" width="90" height="44" rx="22" fill="#B2D450" />
      <text x="635" y="48" textAnchor="middle" fill="#0B0D07" style={{ ...mono, fontSize: 11, fontWeight: 600, letterSpacing: 1.2 }}>
        CARD
      </text>
    </svg>
  );
}
