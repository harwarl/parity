/*
 * Paper vs live · design dials: VARIANCE 6 / MOTION 6 / DENSITY 4.
 * Header grid + 2 panels, live featured (F1, F2).
 */
import type { ReactNode } from "react";
import { DataRow } from "@/components/ui/DataRow";
import { Panel } from "@/components/ui/Panel";
import { Pill } from "@/components/ui/Pill";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LiveRoute } from "./LiveRoute";
import { PaperTicket } from "./PaperTicket";
import { revealInRow } from "@/lib/reveal";

type Mode = {
  title: string;
  pill: string;
  body: string;
  visual: ReactNode;
  rows: { label: string; value: string; lime?: boolean }[];
  featured?: boolean;
};

const modes: Mode[] = [
  {
    title: "Paper",
    pill: "Default",
    body: "Fills at the confirm mid. No broker, no order, no money moves. Build a record before anything is real.",
    visual: <PaperTicket />,
    rows: [
      { label: "Fill price", value: "Confirm mid" },
      { label: "Broker", value: "None" },
      { label: "Risk", value: "Zero" },
    ],
  },
  {
    title: "Live",
    pill: "Agentic Account only",
    body: "Places one cash-equity order through the official Robinhood Trading MCP, only after you confirm. Nothing on chain, no second leg.",
    visual: <LiveRoute />,
    rows: [
      { label: "Orders per card", value: "1" },
      { label: "Route", value: "Robinhood Trading MCP" },
      { label: "Trigger", value: "Your tap", lime: true },
    ],
    featured: true,
  },
];

export function PaperVsLive() {
  return (
    <section id="paper" data-motion className="g-wrap relative pt-[150px]">
      <SectionHeader
        eyebrow="04 · Paper vs live"
        title={
          <>
            Paper first.
            <br />
            <span className="g-dot">Live</span> when
            <br />
            you say.
          </>
        }
        lede="Both modes run the same gates and the same card. The only difference is what happens after you tap."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {modes.map((m, i) => (
          <Panel
            key={m.title}
            featured={m.featured}
            className="g-reveal g-rk box-content flex lg:min-h-[480px] flex-col gap-6 p-11 max-sm:p-6"
            style={revealInRow(i, modes.length)}
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="g-h3 !text-[34px]">{m.title}</h3>
              <Pill tone={m.featured ? "lime" : "default"}>{m.pill}</Pill>
            </div>
            <p className="g-p">{m.body}</p>
            {m.visual}
            <div className="mt-auto">
              {m.rows.map((r, i) => (
                <DataRow
                  key={r.label}
                  label={r.label}
                  value={r.value}
                  tone={r.lime ? "lime" : "ink"}
                  className={i === m.rows.length - 1 ? "!border-b-0" : ""}
                />
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </section>
  );
}
