import { Panel } from "@/components/ui/Panel";
import { PanelHead } from "@/components/app/ui/PanelHead";

/** 04:00 → 20:00 ET as 0 → 100%. */
const at = (h: number, m: number) => (((h - 4) * 60 + m) / (16 * 60)) * 100;

const ticks = [
  { pct: at(10, 14), title: "10:14 TSLA taken", color: "#B2D450" },
  { pct: at(11, 2), title: "11:02 COIN stale", color: "#FF6B5E" },
  { pct: at(12, 40), title: "12:40 HOOD thin", color: "#E8B04A" },
  { pct: at(14, 2), title: "14:02 NVDA card", color: "#B2D450" },
];
const RTH_START = at(9, 30); // 34.4
const RTH_END = at(16, 0); // 75
const NOW_PCT = 62.7; // 14:02:41

/** Home · Session · Fri 26 Sep · ET (design.md §5B.4, §5B.12 I). */
export function SessionTimeline() {
  return (
    <Panel className="lg:col-span-3">
      <PanelHead label="Session · Fri 26 Sep · ET" meta={<span className="app-meta">live orders RTH only</span>} />
      <div className="px-[22px] pt-8 pb-5">
        <div
          role="img"
          aria-label="Trading day from 04:00 to 20:00 ET. Regular hours 09:30 to 16:00. Now 14:02. Events: 10:14 TSLA taken, 11:02 COIN stale, 12:40 HOOD thin, 14:02 NVDA card."
          className="relative h-10"
        >
          <span className="absolute inset-x-0 top-4 h-2 rounded-full bg-track" />
          <span
            className="absolute top-4 h-2 rounded-full border border-accent/50 bg-accent/25"
            style={{ left: `${RTH_START}%`, width: `${RTH_END - RTH_START}%` }}
          />
          <span
            className="absolute top-4 h-2 rounded-full bg-accent shadow-[0_0_12px_rgba(178,212,80,.6)]"
            style={{ left: `${RTH_START}%`, width: `${NOW_PCT - RTH_START}%` }}
          />
          {ticks.map((t) => (
            <span
              key={t.title}
              title={t.title}
              className="absolute top-1.5 h-7 w-0.5 rounded-full"
              style={{ left: `${t.pct}%`, background: t.color }}
            />
          ))}
          <span
            className="absolute top-0 h-full w-0.5 bg-ink shadow-[0_0_10px_rgba(249,247,244,.8)]"
            style={{ left: `${NOW_PCT}%` }}
          >
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 font-mono text-[10px] whitespace-nowrap text-ink">
              NOW 14:02
            </span>
          </span>
        </div>
        <div className="relative mt-2 h-4 font-mono text-[10px] text-dim">
          <span className="absolute left-0">04:00 PRE</span>
          <span className="absolute -translate-x-1/2 text-accent" style={{ left: `${RTH_START}%` }}>
            09:30 RTH
          </span>
          <span className="absolute -translate-x-1/2" style={{ left: `${RTH_END}%` }}>
            16:00 AFTER
          </span>
          <span className="absolute right-0">20:00</span>
        </div>
      </div>
    </Panel>
  );
}
