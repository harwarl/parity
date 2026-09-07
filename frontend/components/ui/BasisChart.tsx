const toneClasses = {
  gap: "stroke-gap",
  rich: "stroke-rich",
  halt: "stroke-halt",
  mute: "stroke-mute",
} as const;

type ChartTone = keyof typeof toneClasses;

/** Rounds a magnitude up to a "nice" step (25/50/100/...) so axis ticks read clean. */
function niceMax(magnitude: number): number {
  if (magnitude <= 25) return 25;
  if (magnitude <= 50) return 50;
  if (magnitude <= 100) return 100;
  const step = 10 ** Math.floor(Math.log10(magnitude));
  return Math.ceil(magnitude / step) * step;
}

export function BasisChart({
  data,
  tone = "mute",
  height = 44,
  showAxis = false,
}: {
  data: number[];
  tone?: ChartTone;
  height?: number;
  showAxis?: boolean;
}) {
  if (data.length < 2) return null;

  const axisWidth = showAxis ? 34 : 0;
  const width = 240;
  const max = showAxis ? niceMax(Math.max(...data.map(Math.abs), 1)) : undefined;
  const min = max !== undefined ? -max : Math.min(...data);
  const range = max !== undefined ? max * 2 : Math.max(...data) - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const zeroY = height - ((0 - min) / range) * height;
  const strokeClass = toneClasses[tone];
  const ticks = max !== undefined ? [max, max / 2, 0, -max / 2, -max] : [];

  return (
    <div className="flex items-start gap-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="overflow-visible"
        aria-hidden
      >
        {showAxis && (
          <line
            x1={0}
            y1={zeroY}
            x2={width}
            y2={zeroY}
            className="stroke-line"
            strokeWidth={1}
            strokeDasharray="2 3"
          />
        )}
        <polyline
          points={points.join(" ")}
          fill="none"
          className={strokeClass}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / range) * height}
          r={2.5}
          className={strokeClass}
          fill="currentColor"
        />
      </svg>

      {showAxis && (
        <div
          className="flex shrink-0 flex-col justify-between font-mono text-[10px] text-mute"
          style={{ height, width: axisWidth }}
        >
          {ticks.map((tick) => (
            <span key={tick}>
              {tick > 0 ? "+" : ""}
              {tick}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
