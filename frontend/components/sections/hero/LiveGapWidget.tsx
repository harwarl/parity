import { sample } from "@/config/site";
import { formatPct } from "@/lib/format";
import { LiveDot } from "@/components/shared/LiveDot";
import { DataRow } from "@/components/ui/DataRow";
import { Pill } from "@/components/ui/Pill";

/**
 * 5.2 · Glass readout of the NVDA example, in % first (rev 2: 17 bps = 0.17%). Glass (backdrop blur) at lg
 * only; phones get a near-opaque fill, since blurring over animated art
 * repaints every frame.
 */
export function LiveGapWidget({ className = "" }: { className?: string }) {
  return (
    <aside
      aria-label={`Live example for ${sample.symbol}, illustrative`}
      className={`box-content w-[min(360px,calc(100vw-76px))] rounded-panel border border-ink/12 bg-[rgba(15,17,19,.94)] px-[22px] py-5 lg:bg-[rgba(15,17,19,.72)] lg:backdrop-blur-[16px] ${className}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.16em] text-ink">
          <LiveDot />
          LIVE EXAMPLE · {sample.symbol}
        </span>
        <span className="font-mono text-[10px] tracking-[0.16em] text-dim">ILLUSTRATIVE</span>
      </div>

      <DataRow label="Stock on Robinhood" value={`$${sample.cashMid}`} />
      <DataRow label="Token on Robinhood Chain" value={`$${sample.tokenPerShare}`} tone="lime" />
      <DataRow label="Difference" value={formatPct(sample.gapBps)} />
      <DataRow label="All costs" value={formatPct(-sample.costBps)} tone="neg" />
      <div className="g-row !border-b-0 !py-3">
        <span>Left for you</span>
        <span className="!text-[20px] font-semibold !text-accent">{formatPct(sample.netBps, { signed: true })}</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <Pill size="sm" tone="lime">
          Market open ✓
        </Pill>
        <Pill size="sm" tone="lime">
          Enough size ✓
        </Pill>
        <Pill size="sm">1 of 3 today</Pill>
      </div>
    </aside>
  );
}
