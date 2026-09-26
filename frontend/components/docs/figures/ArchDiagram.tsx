/**
 * Docs home · architecture (440 × 150). Six boxes, five dashed connectors
 * flowing market → Redis → engine → SSE → exec gateway → Trading MCP (K3).
 */
const boxes = [
  { x: 0, y: 10, label: "market plane" },
  { x: 160, y: 10, label: "Redis bus", lime: true },
  { x: 320, y: 10, label: "engine · gates" },
  { x: 320, y: 100, label: "SSE → client" },
  { x: 160, y: 100, label: "exec gateway" },
  { x: 0, y: 100, label: "Trading MCP", lime: true },
];
const connectors = ["M120 30H160", "M280 30H320", "M380 50V100", "M320 120H280", "M160 120H120"];

export function ArchDiagram() {
  return (
    <svg
      viewBox="0 0 440 150"
      className="w-full overflow-visible"
      role="img"
      aria-label="Architecture: the market plane feeds the Redis bus, the engine runs the gates and pushes cards over SSE to your client; only Do it reaches the execution gateway and the Trading MCP."
    >
      <g
        fill="none"
        stroke="#B2D450"
        strokeOpacity=".6"
        strokeWidth="1.5"
        strokeDasharray="3 5"
        style={{ animation: "k-flow 1.2s linear infinite" }}
      >
        {connectors.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {boxes.map((b) => (
        <g key={b.label}>
          <rect
            x={b.x + 0.75}
            y={b.y + 0.75}
            width="118.5"
            height="38.5"
            rx="10"
            fill={b.lime ? "rgba(178,212,80,.08)" : "#0C0D10"}
            stroke={b.lime ? "#B2D450" : "#F9F7F4"}
            strokeOpacity={b.lime ? 0.6 : 0.14}
          />
          <text
            x={b.x + 60}
            y={b.y + 24}
            textAnchor="middle"
            fill={b.lime ? "#B2D450" : "#C9CBCF"}
            style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
          >
            {b.label}
          </text>
        </g>
      ))}
      <text x="300" y="80" textAnchor="end" fill="#80848A" style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>
        Do it only
      </text>
    </svg>
  );
}
