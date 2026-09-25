import { sample } from "@/config/site";
import { formatCost, formatSignedBps } from "@/lib/format";
import { LiveDot } from "@/components/shared/LiveDot";
import { DataRow } from "@/components/ui/DataRow";
import { Pill } from "@/components/ui/Pill";

/** 5.2 · Glass readout of the NVDA sample gap. */
export function LiveGapWidget({ className = "" }: { className?: string }) {
  return (
    <aside
      aria-label={`Live gap for ${sample.symbol}, illustrative`}
      className={`box-content w-[min(360px,calc(100vw-76px))] rounded-panel border border-ink/12 px-[22px] py-5 ${className}`}
      style={{
        background: "rgba(15,17,19,.72)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.16em] text-ink">
          <LiveDot />
          LIVE GAP · {sample.symbol}
        </span>
        <span className="font-mono text-[10px] tracking-[0.16em] text-dim">ILLUSTRATIVE</span>
      </div>

      <DataRow label="Cash mid" value={`$${sample.cashMid}`} />
      <DataRow label="Token / share" value={`$${sample.tokenPerShare}`} tone="lime" />
      <DataRow label="|Gap|" value={`${sample.gapBps.toFixed(1)} bps`} />
      <DataRow label="Fees · slip · buffer" value={`${formatCost(sample.costBps)} bps`} tone="neg" />
      <div className="g-row !border-b-0 !py-3">
        <span>Net</span>
        <span className="!text-[20px] font-semibold !text-accent">
          {formatSignedBps(sample.netBps)} bps
        </span>
      </div>

      <div className="mt-2 flex gap-2">
        <Pill size="sm" tone="lime">
          Session ✓
        </Pill>
        <Pill size="sm" tone="lime">
          Depth ✓
        </Pill>
        <Pill size="sm">Cap 1/3</Pill>
      </div>
    </aside>
  );
}
