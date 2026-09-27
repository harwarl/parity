"use client";

import { Pill } from "@/components/ui/Pill";
import { Panel } from "@/components/ui/Panel";
import { useMode } from "@/components/app/shell/ModeProvider";
import { useLive } from "@/components/app/shell/LiveMarketProvider";
import { useGauge } from "@/components/app/shell/GaugeProvider";
import { LiveNum } from "@/components/app/ui/LiveNum";
import { PanelHead } from "@/components/app/ui/PanelHead";

/** Home · System health: six services; Trading MCP follows the mode. */
export function SystemHealth() {
  const { mode } = useMode();
  const live = mode === "live";
  const { latency } = useLive();
  const { status, health } = useGauge();
  const ms = (v: number, unit = " ms", prefix = "") => <LiveNum value={v} text={`${prefix}${v}${unit}`} invert />;

  type Row = { name: string; what: string; metric: React.ReactNode; state: string };
  let rows: Row[];
  if (status === "online" || !latency) {
    // From gauge-api's /health: what the service can actually see.
    const feedAge = health?.tape.freshest_tick_age_ms ?? null;
    rows = [
      {
        name: "Market feed",
        what: `tick bus · ${health?.tape.symbols ?? 0} names`,
        metric: feedAge == null ? "no ticks" : ms(Math.round(feedAge / 100) / 10, " s", "last "),
        state: feedAge != null && feedAge < 5_000 ? "OK" : "STALE",
      },
      {
        name: "Redis bus",
        what: "market → user plane",
        metric: health?.redis.latency_ms != null ? ms(health.redis.latency_ms, " ms", "rtt ") : "—",
        state: health?.redis.ok ? "OK" : "DOWN",
      },
      { name: "gauge-api", what: "this dashboard's backend", metric: "—", state: status === "online" ? "OK" : "DOWN" },
      {
        name: "gauge-exec",
        what: "execution boundary",
        metric: health?.exec.latency_ms != null ? ms(health.exec.latency_ms) : "—",
        state: health?.exec.ok ? "OK" : "DOWN",
      },
      {
        name: "Trading MCP",
        what: live ? "not connected yet" : "idle in paper",
        metric: "—",
        state: live ? "N/A" : "IDLE",
      },
    ];
  } else {
    rows = [
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
  }
  const checked = rows.filter((r) => r.state !== "IDLE" && r.state !== "N/A");
  const ok = checked.filter((r) => r.state === "OK").length;

  return (
    <Panel>
      <PanelHead
        label="System health"
        meta={
          <Pill size="sm" tone={ok === checked.length ? "lime" : "default"}>
            {ok}/{checked.length} OK
          </Pill>
        }
      />
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
                r.state === "OK" || r.state === "LINKED"
                  ? "border-accent/45 bg-accent/8 text-accent"
                  : r.state === "IDLE" || r.state === "N/A"
                    ? "border-ink/14 text-dim"
                    : "border-neg/45 bg-neg/8 text-neg"
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
