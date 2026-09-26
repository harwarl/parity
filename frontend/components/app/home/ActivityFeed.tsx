"use client";

import { Panel } from "@/components/ui/Panel";
import { useCardClock } from "@/components/app/shell/CountdownProvider";
import { useLive } from "@/components/app/shell/LiveMarketProvider";
import { clockAt } from "@/lib/gauge/live";
import { PanelHead } from "@/components/app/ui/PanelHead";

/**
 * Home · Activity · today: the latest gate events stream in (each new row
 * rises in), then the NOW row counting down the open card.
 */
export function ActivityFeed() {
  const { t } = useCardClock();
  const { events, elapsed, nextId } = useLive();
  const total = 8 + (nextId - 9) + 1; // seeded events + streamed + NOW

  return (
    <Panel>
      <PanelHead label="Activity · today" meta={<span className="app-meta">{total} events</span>} />
      <ol className="px-[22px] pb-2" aria-live="polite" aria-relevant="additions">
        {events.map((e) => (
          <li
            key={e.id}
            className="grid grid-cols-[70px_70px_1fr] gap-2 border-b border-ink/5 py-2.5 font-mono text-[12px]"
            style={e.id > 8 ? { animation: "j-rise .45s ease-out both" } : undefined}
          >
            <span className="text-dim">{e.time}</span>
            <span style={{ color: e.color }}>{e.kind}</span>
            <span className="truncate text-ink-2">{e.msg}</span>
          </li>
        ))}
        <li className="grid grid-cols-[70px_70px_1fr] gap-2 py-2.5 font-mono text-[12px]" aria-live="off">
          <span className="text-dim">{clockAt(elapsed)}</span>
          <span className="text-ink">NOW</span>
          <span className="truncate text-ink-2">awaiting your tap · {t} s left</span>
        </li>
      </ol>
    </Panel>
  );
}
