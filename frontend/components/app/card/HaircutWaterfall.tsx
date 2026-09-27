import { formatBps } from "@/lib/format";
import { Panel } from "@/components/ui/Panel";
import { PanelHead } from "@/components/app/ui/PanelHead";

/**
 * Haircut · gross to net. Cost bars grow from the right (J8) so the haircut
 * reads as taken off the end of the gross bar. Positions are % of |gap|.
 */
export function HaircutWaterfall({
  gap,
  fees,
  slip,
  buffer,
  floor,
}: {
  gap: number;
  fees: number;
  slip: number;
  buffer: number;
  floor: number;
}) {
  const net = gap - fees - slip - buffer;
  const pct = (v: number) => Math.max(0, Math.min(100, (v / gap) * 100));
  const netEnd = pct(net); // 55.3 for NVDA
  const bufEnd = pct(net + buffer); // 67.1
  const slipEnd = pct(net + buffer + slip); // 79.4
  const rows = [
    { label: "|gap|", value: gap.toFixed(1), from: 0, to: 100, color: "#C9CBCF", origin: "left", dur: 0.6, delay: 0 },
    { label: "− fees", value: formatBps(-fees), from: slipEnd, to: 100, color: "rgba(255,107,94,.85)", origin: "right", dur: 0.5, delay: 0.2 },
    { label: "− slippage", value: formatBps(-slip), from: bufEnd, to: slipEnd, color: "rgba(255,107,94,.65)", origin: "right", dur: 0.5, delay: 0.35 },
    { label: "− buffer", value: formatBps(-buffer), from: netEnd, to: bufEnd, color: "rgba(255,107,94,.45)", origin: "right", dur: 0.5, delay: 0.5 },
    { label: "Net", value: net.toFixed(1), from: 0, to: netEnd, color: "#B2D450", origin: "left", dur: 0.6, delay: 0.7 },
  ];
  return (
    <Panel>
      <PanelHead label="Haircut · gross to net" meta={<span className="app-meta">bps</span>} />
      <ul
        className="flex flex-col gap-3 px-[22px] py-5"
        aria-label={`Gross ${gap.toFixed(1)} bps minus fees ${fees.toFixed(1)}, slippage ${slip.toFixed(1)}, buffer ${buffer.toFixed(1)} leaves net ${net.toFixed(1)} bps, floor ${floor.toFixed(1)}.`}
      >
        {rows.map((row) => (
          <li key={row.label} className="grid grid-cols-[110px_1fr_56px] items-center gap-3">
            <span className={`font-mono text-[12px] ${row.label === "Net" ? "text-accent" : "text-muted"}`}>{row.label}</span>
            <span className="relative h-3.5 rounded-full bg-track">
              <span
                className="absolute inset-y-0 rounded-full"
                style={{
                  left: `${row.from}%`,
                  width: `${row.to - row.from}%`,
                  background: row.color,
                  transformOrigin: row.origin,
                  animation: `j-grow ${row.dur}s ease-out ${row.delay}s both`,
                  boxShadow: row.label === "Net" ? "0 0 12px rgba(178,212,80,.5)" : undefined,
                }}
              />
              {row.label === "Net" && (
                <span className="absolute -top-1 -bottom-1 w-0.5 bg-ink" style={{ left: `${pct(floor)}%` }}>
                  <span className="absolute top-full left-1/2 mt-1 -translate-x-1/2 font-mono text-[9px] tracking-[0.12em] whitespace-nowrap text-ink">
                    FLOOR {floor.toFixed(1)}
                  </span>
                </span>
              )}
            </span>
            <span className={`text-right font-mono text-[13px] ${row.label === "Net" ? "text-accent" : row.origin === "right" ? "text-neg" : "text-ink"}`}>
              {row.value}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
