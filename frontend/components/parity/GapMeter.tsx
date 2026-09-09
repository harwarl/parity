import { fmtBps } from "@/lib/parity/format";

/**
 * The gap, made visual. A centre line is parity; the fill runs right when the
 * token is rich, left when it is cheap. Width maps basis bps onto a fixed scale.
 */
export default function GapMeter({
  bps,
  scale = 60,
  showLabel = true,
}: {
  bps: number;
  /** bps value that fills the bar edge-to-centre */
  scale?: number;
  showLabel?: boolean;
}) {
  const pct = Math.max(-1, Math.min(1, bps / scale));
  const rich = bps >= 0;
  const widthPct = Math.abs(pct) * 50;

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-line">
        <span
          aria-hidden
          className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line-strong"
        />
        <span
          aria-hidden
          className={`absolute inset-y-0 transition-[left,width] duration-700 ease-out ${
            rich ? "bg-green" : "bg-text-mute"
          }`}
          style={{
            left: rich ? "50%" : `${50 - widthPct}%`,
            width: `${widthPct}%`,
          }}
        />
      </div>
      {showLabel ? (
        <span
          className={`tnum w-16 shrink-0 text-right text-xs ${
            rich ? "text-green" : "text-text-mute"
          }`}
        >
          {fmtBps(bps)}
        </span>
      ) : null}
    </div>
  );
}
