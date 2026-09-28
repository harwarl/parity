import { sample } from "@/config/site";
import { formatPct } from "@/lib/format";
import { LiveDot } from "@/components/shared/LiveDot";

/**
 * C3 · Four gates light in sequence (5.4s, .5s apart). The mini card shows
 * only while all four are lit (3.02–4.54s).
 */
const gates = ["Worth it ✓", "Market open ✓", "Enough size ✓", "Under 3 today ✓"];

export function EmitGates() {
  return (
    <div
      role="img"
      aria-label="Four checks pass one after another: worth it after costs, market open, enough size, under 3 today. Only then does a prompt appear."
      className="mt-auto flex flex-col gap-[18px]"
    >
      <div className="grid grid-cols-2 gap-2">
        {gates.map((gate, i) => (
          <span
            key={gate}
            className="g-gate flex h-[30px] items-center justify-center rounded-full border border-ink/14 font-mono text-[11px] tracking-[0.16em] text-dim uppercase"
            style={{ animation: `g-gate 5.4s ease-in-out ${i * 0.5}s infinite both` }}
          >
            {gate}
          </span>
        ))}
      </div>
      <div
        className="flex h-[46px] items-center justify-between rounded-inset border border-accent/40 bg-inset px-4 font-mono text-[11px] tracking-[0.14em]"
        style={{
          animation: "g-mini 5.4s ease-in-out infinite both",
          boxShadow: "0 12px 30px -12px rgba(178,212,80,.45)",
        }}
      >
        <span className="flex items-center gap-2.5 text-ink">
          <LiveDot />
          PROMPT · {sample.symbol}
        </span>
        <span className="text-accent">
          {formatPct(sample.netBps, { signed: true })} · 1:15
        </span>
      </div>
    </div>
  );
}
