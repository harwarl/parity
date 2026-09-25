"use client";

import Link from "next/link";
import { Panel } from "@/components/ui/Panel";
import { useMode } from "@/components/app/shell/ModeProvider";
import { ModePill } from "@/components/app/ui/ModePill";
import { PanelHead } from "@/components/app/ui/PanelHead";

/** Home · Route: the four steps after a tap, by mode. */
export function RouteModule() {
  const { mode } = useMode();
  const live = mode === "live";
  const lime = "#B2D450";
  const steps = [
    { name: "You tap Do it", sub: "the only trigger", color: lime },
    { name: "Re-quote + gate re-check", sub: "both legs, fresh prices", color: lime },
    live
      ? { name: "Robinhood Trading MCP", sub: "one cash-equity order", color: lime }
      : { name: "Paper engine", sub: "fill at confirm mid", color: "#C9CBCF" },
    live
      ? { name: "Agentic Account", sub: "your account, your funds", color: lime }
      : { name: "Paper ledger", sub: "no money moves", color: "#C9CBCF" },
  ];
  return (
    <Panel className="flex flex-col">
      <PanelHead label="Route" meta={<ModePill />} />
      <ol className="flex flex-col gap-4 px-[22px] pt-5">
        {steps.map((s) => (
          <li key={s.name} className="grid grid-cols-[22px_1fr]">
            <span
              aria-hidden
              className="mt-[5px] ml-1 size-3 rounded-full"
              style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }}
            />
            <span>
              <span className="block text-[14px] font-semibold text-ink">{s.name}</span>
              <span className="block font-mono text-[11px] text-dim">{s.sub}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-auto p-[22px]">
        <Link href="/dashboard/settings" className="g-btn g-btn-secondary g-btn-xs w-full">
          Execution settings
        </Link>
      </div>
    </Panel>
  );
}
