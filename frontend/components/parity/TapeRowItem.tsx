import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { formatBps, formatUsd } from "@/lib/format";
import type { TapeRow } from "@/types/tape";

const sessionLabel: Record<TapeRow["session"], string> = {
  rth: "rth",
  ext: "ext",
  overnight: "overnight",
  weekend: "weekend",
};

export function TapeRowItem({ row }: { row: TapeRow }) {
  const live = row.synced && row.session === "rth";
  const cheap = row.bps < 0;

  const dotClass = !row.synced
    ? "bg-halt"
    : live
      ? "bg-accent"
      : "bg-muted-dim";

  const bpsClass = !row.synced
    ? "text-halt"
    : !live
      ? "text-muted"
      : cheap
        ? "text-accent"
        : "text-danger";

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
          <div>
            <p className="text-sm font-semibold text-foreground">{row.symbol}</p>
            <p className="text-[11px] text-muted">{row.name}</p>
          </div>
        </div>
        <Tag variant={live ? "neutral" : row.synced ? "neutral" : "halt"}>
          {sessionLabel[row.session]}
        </Tag>
      </div>

      <div className="mt-4 space-y-2 border-t border-border pt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">cash</span>
          <span className="font-mono text-foreground">
            {formatUsd(row.cashPrice)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">token</span>
          <span className="font-mono text-foreground">
            {formatUsd(row.tokenPrice)}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="text-[10px] uppercase tracking-wider text-muted">
          {row.synced ? "gap" : "no data"}
        </span>
        <span className={`font-mono text-sm font-semibold ${bpsClass}`}>
          {row.synced ? formatBps(row.bps) : "—"}
        </span>
      </div>
    </Card>
  );
}
