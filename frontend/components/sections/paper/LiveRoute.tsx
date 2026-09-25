/**
 * F2 · One order, only after your tap (5.2s). The packet holds at CONFIRM
 * from 22% to 52% while the tap ring fires, then runs MCP → Robinhood.
 * Drawn in a 440×64 SVG so the px keyframes stay true when it scales down.
 * "Robinhood" is a text label only; never draw their logo.
 */
const nodes = [
  { x: 10, label: "YOU" },
  { x: 150, label: "CONFIRM", lime: true },
  { x: 290, label: "MCP" },
  { x: 430, label: "ROBINHOOD" },
];

export function LiveRoute() {
  return (
    <svg
      viewBox="0 0 440 64"
      className="mt-2 w-full max-w-[440px] overflow-visible"
      role="img"
      aria-label="Route: you, confirm, Robinhood Trading MCP, Robinhood. Nothing moves past confirm until you tap."
    >
      <defs>
        <linearGradient id="gRail" x1="10" y1="0" x2="430" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F9F7F4" stopOpacity=".2" />
          <stop offset=".33" stopColor="#B2D450" stopOpacity=".75" />
          <stop offset=".66" stopColor="#B2D450" stopOpacity=".5" />
          <stop offset="1" stopColor="#F9F7F4" stopOpacity=".2" />
        </linearGradient>
      </defs>
      <rect x="10" y="20" width="420" height="2" fill="url(#gRail)" />

      {/* tap ring, 36px, centred on CONFIRM */}
      <circle
        cx="150"
        cy="21"
        r="18"
        fill="#B2D450"
        fillOpacity=".08"
        stroke="#B2D450"
        strokeWidth="1.5"
        style={{ transformOrigin: "150px 21px", animation: "g-tap 5.2s ease-out infinite both" }}
      />

      {nodes.map((n) => (
        <g key={n.label}>
          <circle
            cx={n.x}
            cy="21"
            r="7"
            fill={n.lime ? "#B2D450" : "#F9F7F4"}
            stroke="#0A0B0D"
            strokeWidth="3"
          />
          <text
            x={n.x}
            y="50"
            textAnchor="middle"
            fill={n.lime ? "#B2D450" : "#80848A"}
            style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: 1.6 }}
          >
            {n.label}
          </text>
        </g>
      ))}

      {/* packet, 14px, starts at x 3 so it centres on YOU */}
      <rect
        x="3"
        y="14"
        width="14"
        height="14"
        rx="4"
        fill="#B2D450"
        style={{
          animation: "g-packet 5.2s var(--ease-packet) infinite both",
          filter: "drop-shadow(0 0 6px rgba(178,212,80,.8))",
        }}
      />
    </svg>
  );
}
