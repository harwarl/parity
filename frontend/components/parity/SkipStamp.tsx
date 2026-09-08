import type { SkipReason } from "@/types/tape";

const rotations = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

export function SkipStamp({
  reason,
  index,
}: {
  reason: SkipReason;
  index: number;
}) {
  return (
    <div
      className={`rounded-lg border-2 border-dashed border-halt/50 bg-surface p-6 ${rotations[index % rotations.length]}`}
    >
      <span className="font-mono text-xl font-bold tracking-widest text-halt sm:text-2xl">
        {reason.code}
      </span>
      <p className="mt-3 text-xs font-medium text-foreground">{reason.label}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        {reason.description}
      </p>
    </div>
  );
}
