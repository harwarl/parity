import { sample } from "@/config/site";
import { formatPct } from "@/lib/format";

/**
 * C2 · Haircut peel (5s). The 0.17% difference splits into left 0.09% |
 * margin | fill | fees. Costs peel right to left, then "left 0.09%" lights.
 * (Rev 2 labels; widths are still 9.4 | 2.0 | 2.1 | 3.5 bps.)
 */
const segments = [
  { key: "buffer", pct: 11.8, alpha: 0.45, delay: 1.2 },
  { key: "slip", pct: 12.4, alpha: 0.65, delay: 0.6 },
  { key: "fees", pct: 20.6, alpha: 0.85, delay: 0 },
];

export function HaircutBar() {
  return (
    <div
      role="img"
      aria-label={`A ${formatPct(sample.gapBps)} difference, minus fees, the cost of filling and a safety margin, leaves ${formatPct(sample.netBps)}.`}
      className="mt-3"
    >
      <div className="flex h-3.5 overflow-hidden rounded-full bg-track">
        <span className="h-full bg-accent" style={{ width: "55.3%" }} />
        {segments.map((s) => (
          <span
            key={s.key}
            className="h-full origin-left"
            style={{
              width: `${s.pct}%`,
              background: `rgba(255,107,94,${s.alpha})`,
              animation: `g-peel 5s ease-in-out ${s.delay}s infinite both`,
            }}
          />
        ))}
      </div>
      <div className="mt-3 flex justify-between font-mono text-[10px] tracking-[0.16em] text-dim">
        <span>LEFT</span>
        <span>MARGIN</span>
        <span>FILL</span>
        <span>FEES</span>
      </div>
      <div className="mt-3 flex justify-between font-mono text-[13px]">
        <span className="text-ink-2">difference {formatPct(sample.gapBps)}</span>
        <span className="text-dim" style={{ animation: "g-netc 5s ease-in-out infinite" }}>
          left {formatPct(sample.netBps)}
        </span>
      </div>
    </div>
  );
}
