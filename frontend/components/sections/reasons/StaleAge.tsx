/** E1 · The quote ages; the bar fills and turns red as the timestamp dies (4.4s). */
export function StaleAge() {
  return (
    <div
      role="img"
      aria-label="Quote timestamp ageing until it is too old to trust."
      className="flex h-16 flex-col justify-center gap-3"
    >
      <div className="flex items-baseline justify-between">
        <span
          className="font-mono text-[16px] text-ink"
          style={{ animation: "g-stalet 4.4s ease-in infinite" }}
        >
          14:31:07.112
        </span>
        <span className="font-mono text-[9px] tracking-[0.16em] text-dim">QUOTE AGE</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-track">
        <span
          className="g-age block h-full rounded-full"
          style={{ animation: "g-age 4.4s ease-in infinite" }}
        />
      </div>
    </div>
  );
}
