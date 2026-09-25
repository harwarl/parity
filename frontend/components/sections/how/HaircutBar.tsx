import { sample } from "@/config/site";

/**
 * C2 · Haircut peel (5s). Gross 17.0 splits into net 9.4 | buffer 2.0 |
 * slip 2.1 | fees 3.5. Costs peel right to left, then "net 9.4 bps" lights.
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
      aria-label={`Gross gap ${sample.gapBps.toFixed(1)} basis points minus fees ${sample.feesBps}, slippage ${sample.slipBps} and buffer ${sample.bufferBps} leaves net ${sample.netBps} basis points.`}
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
        <span>NET</span>
        <span>BUF {sample.bufferBps.toFixed(1)}</span>
        <span>SLIP {sample.slipBps.toFixed(1)}</span>
        <span>FEES {sample.feesBps.toFixed(1)}</span>
      </div>
      <div className="mt-3 flex justify-between font-mono text-[13px]">
        <span className="text-ink-2">|gap| {sample.gapBps.toFixed(1)}</span>
        <span className="text-dim" style={{ animation: "g-netc 5s ease-in-out infinite" }}>
          net {sample.netBps} bps
        </span>
      </div>
    </div>
  );
}
