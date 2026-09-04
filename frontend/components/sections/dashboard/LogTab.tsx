import { ArrowUpRight } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { formatPrice } from "@/lib/format";
import { logEntries } from "@/lib/dashboard-data";
import type { LogEntry } from "@/types/tape";

function statusCell(entry: LogEntry): string {
  if (entry.status === "filled") return "FILLED";
  return `SKIPPED · ${entry.skipCode}`;
}

export function LogTab() {
  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[640px] grid-cols-[72px_72px_100px_1fr_140px] gap-4 border-b border-line px-5 py-2.5 font-mono text-[11px] uppercase tracking-wide text-mute">
        <span>Ticker</span>
        <span>Kind</span>
        <span className="text-right">Mid</span>
        <span>Status</span>
        <span className="text-right">Time</span>
      </div>

      {logEntries.map((entry, index) => (
        <div
          key={`${entry.ticker}-${entry.timestamp}-${index}`}
          className="grid min-w-[640px] grid-cols-[72px_72px_100px_1fr_140px] items-center gap-4 border-b border-line px-5 py-3.5 last:border-b-0"
        >
          <span className="font-mono text-sm font-medium text-paper">
            {entry.ticker}
          </span>
          <span>
            <Chip tone={entry.kind === "live" ? "rich" : "neutral"}>
              {entry.kind === "live" ? "LIVE" : "PAPER"}
            </Chip>
          </span>
          <span className="text-right font-mono text-sm tabular-nums text-mute">
            {formatPrice(entry.mid)}
          </span>
          <span className="font-mono text-xs text-mute">
            {statusCell(entry)}
            {entry.brokerOrderId && (
              <span className="ml-2 text-halt">{entry.brokerOrderId}</span>
            )}
          </span>
          <span className="text-right font-mono text-xs tabular-nums text-mute">
            {entry.timestamp}
          </span>
        </div>
      ))}

      <div className="flex items-center justify-between px-5 py-4">
        <p className="max-w-md font-mono text-xs text-mute">
          This is the autopsy, not a brokerage statement. Mid is captured at
          confirm time.
        </p>
        <span className="flex shrink-0 items-center gap-1 font-mono text-xs text-mute transition-colors hover:text-paper">
          Real positions on Robinhood
          <ArrowUpRight size={13} />
        </span>
      </div>
    </div>
  );
}
