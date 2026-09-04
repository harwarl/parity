const WIDTH = 240;
const HEIGHT = 48;

export function Sparkline({
  data,
  tone = "mute",
}: {
  data: number[];
  tone?: "gap" | "rich" | "mute";
}) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * WIDTH;
    const y = HEIGHT - ((value - min) / range) * HEIGHT;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const strokeClass =
    tone === "gap"
      ? "stroke-gap"
      : tone === "rich"
        ? "stroke-rich"
        : "stroke-mute";

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width={WIDTH}
      height={HEIGHT}
      className="overflow-visible"
      aria-hidden
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        className={strokeClass}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={WIDTH}
        cy={HEIGHT - ((data[data.length - 1] - min) / range) * HEIGHT}
        r={2.5}
        className={strokeClass}
        fill="currentColor"
      />
    </svg>
  );
}
