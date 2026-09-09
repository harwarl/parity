import { fmtTtl } from "@/lib/parity/format";

/** Countdown ring for a card's TTL. `progress` is 1 → 0 (full → empty). */
export default function TtlRing({
  progress,
  seconds,
  stopped = false,
}: {
  progress: number;
  seconds: number;
  stopped?: boolean;
}) {
  const r = 15;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, progress));
  const low = seconds <= 12;

  return (
    <div className="relative size-10" role="timer" aria-label={`${fmtTtl(seconds)} left`}>
      <svg viewBox="0 0 36 36" className="size-10 -rotate-90">
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth="2"
        />
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke={low ? "var(--halt)" : "var(--green)"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped)}
          style={{ transition: stopped ? "none" : "stroke-dashoffset 0.25s linear" }}
        />
      </svg>
      <span className="tnum absolute inset-0 grid place-items-center text-[10px] text-text-dim">
        {Math.ceil(seconds)}
      </span>
    </div>
  );
}
