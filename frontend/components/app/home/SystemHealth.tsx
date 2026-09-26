"use client";

import { Pill } from "@/components/ui/Pill";
import { Panel } from "@/components/ui/Panel";
import { useMode } from "@/components/app/shell/ModeProvider";
import { useLive } from "@/components/app/shell/LiveMarketProvider";
import { LiveNum } from "@/components/app/ui/LiveNum";
import { PanelHead } from "@/components/app/ui/PanelHead";

/** Home · System health: six services; Trading MCP follows the mode. */
export function SystemHealth() {
  const { mode } = useMode();
  const live = mode === "live";
  const { latency } = useLive();
  const ms = (v: number, unit = " ms", prefix = "") => <LiveNum value={v} text={`${prefix}${v}${unit}`} invert />;
  const rows = [
    { name: "Robinhood quotes", what: "cash mid · 11 names", metric: ms(latency.quotes), state: "OK" },
    { name: "Chainlink", what: "token / share feed", metric: ms(latency.chainlink, " s", "hb "), state: "OK" },
    { name: "Robinhood Chain RPC", what: "block + depth reads", metric: ms(latency.rpc), state: "OK" },
    { name: "Redis bus", what: "market → user plane", metric: ms(latency.redis, " ms", "lag "), state: "OK" },
    { name: "SSE stream", what: "this client", metric: ms(latency.sse), state: "OK" },
    {
      name: "Trading MCP",
      what: live ? "Agentic Account · linked" : "idle in paper",
      metric: live ? ms(latency.mcp) : "—",
      state: live ? "LINKED" : "IDLE",
    },
  ];
  return (
    <Panel>
      <PanelHead label="System health" meta={<Pill size="sm" tone="lime">6/6 OK</Pill>} />
      <ul className="px-[22px] pb-2">
        {rows.map((r) => (
          <li key={r.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-line-row py-3 last:border-b-0">
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-ink">{r.name}</p>
              <p className="truncate font-mono text-[11px] text-dim">{r.what}</p>
            </div>
            <span className="font-mono text-[12px] text-ink-2">{r.metric}</span>
            <span
              className={`inline-flex h-[22px] items-center rounded-full border px-2 font-mono text-[9.5px] tracking-[0.14em] ${
                r.state === "IDLE" ? "border-ink/14 text-dim" : "border-accent/45 bg-accent/8 text-accent"
              }`}
            >
              {r.state}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
