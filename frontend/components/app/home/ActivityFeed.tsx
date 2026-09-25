"use client";

import { Panel } from "@/components/ui/Panel";
import { useCardClock } from "@/components/app/shell/CountdownProvider";
import { PanelHead } from "@/components/app/ui/PanelHead";

const events = [
  { time: "09:30:00", kind: "SESSION", color: "#8FA6DA", msg: "RTH open · 11 names armed" },
  { time: "10:14:07", kind: "CARD", color: "#B2D450", msg: "TSLA · net 6.8 bps · cap 1/3" },
  { time: "10:14:31", kind: "DO IT", color: "#B2D450", msg: "TSLA re-quote 5.9 bps · clears" },
  { time: "10:14:31", kind: "FILL", color: "#B2D450", msg: "TSLA paper fill at confirm mid" },
  { time: "11:02:44", kind: "STALE", color: "#FF6B5E", msg: "COIN chain feed 3.8 s old" },
  { time: "12:40:10", kind: "THIN", color: "#E8B04A", msg: "HOOD depth $45k < $100k" },
  { time: "13:15:02", kind: "DUST", color: "#80848A", msg: "META net 1.2 < floor 2.0" },
  { time: "14:02:18", kind: "CARD", color: "#B2D450", msg: "NVDA · net 9.4 bps · #2 today" },
];

/** Home · Activity · today: 9 mono rows, the last one counting down. */
export function ActivityFeed() {
  const { t } = useCardClock();
  return (
    <Panel>
      <PanelHead label="Activity · today" meta={<span className="app-meta">9 events</span>} />
      <ol className="px-[22px] pb-2">
        {[...events, { time: "14:02:41", kind: "NOW", color: "#F9F7F4", msg: `awaiting your tap · ${t} s left` }].map((e, i) => (
          <li
            key={i}
            className="grid grid-cols-[70px_70px_1fr] gap-2 border-b border-ink/5 py-2.5 font-mono text-[12px] last:border-b-0"
          >
            <span className="text-dim">{e.time}</span>
            <span style={{ color: e.color }}>{e.kind}</span>
            <span className="truncate text-ink-2">{e.msg}</span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
