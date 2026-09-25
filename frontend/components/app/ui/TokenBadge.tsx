/** Round token badge `.tk`: 32 (Home), 40 (detail/card), 28 (History). */
export function TokenBadge({ sym, size = 32 }: { sym: string; size?: 28 | 32 | 40 }) {
  return (
    <span
      aria-hidden
      className="grid flex-none place-items-center rounded-full border border-ink/10 bg-[#1A1D21] font-mono text-[9px] font-medium text-muted"
      style={{ width: size, height: size }}
    >
      {sym}
    </span>
  );
}
