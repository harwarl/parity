import { RULES, type GateState, type WatchRow } from "@/lib/gauge/model";
import { formatBps, formatSignedBps } from "@/lib/format";
import { DataRow } from "@/components/ui/DataRow";
import { Panel } from "@/components/ui/Panel";
import { StatePill } from "@/components/app/ui/StatePill";
import { TokenBadge } from "@/components/app/ui/TokenBadge";
import { DetailChart } from "./DetailChart";

const reason: Record<GateState, string> = {
  CARD: "all gates pass",
  DUST: "net under floor",
  THIN: "depth under $100k",
  STALE: "chain feed > 2.0 s",
  CLOSED: "outside RTH",
};

/** Watchlist detail (featured). Rises in (J9) whenever the selection changes. */
export function DetailPanel({ row }: { row: WatchRow }) {
  const gates = [
    { name: "Feed", pass: row.age <= RULES.maxAge },
    { name: "Session", pass: true },
    { name: "Depth", pass: row.depth >= RULES.minDepth },
    { name: "Net", pass: row.net >= RULES.floor },
  ];
  return (
    <Panel featured style={{ animation: "j-rise .4s ease-out both" }}>
      <div className="app-ph">
        <div className="flex items-center gap-3">
          <TokenBadge sym={row.sym} size={40} />
          <div>
            <h2 className="text-[18px] font-bold text-ink">
              {row.sym} <span className="font-normal text-dim">{row.name}</span>
            </h2>
            <p className="font-mono text-[11px] text-dim">cash mid vs token × multiplier · last 60 min</p>
          </div>
        </div>
        <StatePill state={row.state}>
          {row.state} · {reason[row.state]}
        </StatePill>
      </div>
      <div className="grid gap-8 p-[22px] lg:grid-cols-[1fr_300px]">
        <DetailChart key={row.sym} row={row} />
        <div>
          <p className="app-cell-label mb-2">Gap math</p>
          <DataRow label="Cash mid" value={row.cash.toFixed(2)} />
          <DataRow label="Token / share" value={row.token.toFixed(2)} />
          <DataRow label="|gap|" value={row.absGap.toFixed(1)} />
          <DataRow label="− fees 3.5" value={formatBps(-RULES.fees)} tone="neg" />
          <DataRow label="− slippage" value={formatBps(-row.slip)} tone="neg" />
          <DataRow label="− buffer 2.0" value={formatBps(-RULES.buffer)} tone="neg" />
          <div className="g-row !border-b-0 !py-3">
            <span>Net</span>
            <span className={`!text-[18px] ${row.net >= RULES.floor ? "!text-accent" : "!text-dim"}`}>
              {formatSignedBps(row.net)} bps
            </span>
          </div>
          <p className="app-cell-label mt-4 mb-2">Gates</p>
          <ul className="grid grid-cols-2 gap-2">
            {gates.map((g) => (
              <li
                key={g.name}
                className={`flex h-[30px] items-center justify-center rounded-full border font-mono text-[11px] tracking-[0.14em] uppercase ${
                  g.pass ? "border-accent/50 bg-accent/10 text-accent" : "border-neg/50 bg-neg/10 text-neg"
                }`}
              >
                {g.name} {g.pass ? "✓" : "✕"}
                <span className="sr-only">{g.pass ? " passes" : " fails"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  );
}
