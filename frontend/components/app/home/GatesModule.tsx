import { NOW, RULES, rowBySym, ACTIVE } from "@/lib/gauge/model";
import { Pill } from "@/components/ui/Pill";
import { Panel } from "@/components/ui/Panel";
import { PanelHead } from "@/components/app/ui/PanelHead";

/** Home · Gates · NVDA: four passing gates plus net vs floor on the gross scale. */
export function GatesModule() {
  const row = rowBySym(ACTIVE.sym);
  const gates = [
    { name: "Net gap", rule: `net ≥ ${RULES.floor.toFixed(1)} bps floor`, value: row.net.toFixed(1) },
    { name: "Session", rule: "RTH 09:30–16:00 ET", value: NOW.rthLeft },
    { name: "Depth", rule: `top of book ≥ $${RULES.minDepth}k`, value: `$${row.depth}k` },
    { name: "Cap", rule: `≤ ${RULES.cap} cards per day`, value: "1/3" },
  ];
  const netPct = (row.net / row.absGap) * 100; // 55%
  const floorPct = (RULES.floor / row.absGap) * 100; // 11.7%

  return (
    <Panel className="flex flex-col">
      <PanelHead label={`Gates · ${row.sym}`} meta={<Pill size="sm" tone="lime">4/4 pass</Pill>} />
      <ul className="px-[22px]">
        {gates.map((g) => (
          <li
            key={g.name}
            className="grid grid-cols-[28px_1fr_auto] items-center gap-3 border-b border-line-row py-3.5 last:border-b-0"
          >
            <span
              aria-hidden
              className="grid size-6 place-items-center rounded-full border border-accent/50 bg-accent/12 text-[12px] text-accent"
            >
              ✓
            </span>
            <div>
              <p className="text-[15px] font-semibold text-ink">
                {g.name} <span className="sr-only">passes</span>
              </p>
              <p className="font-mono text-[11.5px] text-dim">{g.rule}</p>
            </div>
            <p className="font-mono text-[14px] text-accent">{g.value}</p>
          </li>
        ))}
      </ul>

      <div
        role="img"
        aria-label={`Net ${row.net.toFixed(1)} bps against a floor of ${RULES.floor.toFixed(1)} bps, on a gross gap of ${row.absGap.toFixed(1)} bps.`}
        className="mt-auto border-t border-line-row px-[22px] pt-4 pb-5"
      >
        <div className="mb-3 flex justify-between font-mono text-[10px] tracking-[0.14em] text-dim">
          <span>NET VS FLOOR</span>
          <span className="tracking-normal">
            floor {RULES.floor.toFixed(1)} · net <span className="text-accent">{row.net.toFixed(1)}</span>
          </span>
        </div>
        <div className="relative h-2 rounded-full bg-track">
          <span
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${netPct}%`,
              background: "linear-gradient(90deg, rgba(178,212,80,.4), #B2D450)",
              boxShadow: "0 0 12px rgba(178,212,80,.5)",
            }}
          />
          <span className="absolute -top-1 -bottom-1 w-0.5 bg-ink" style={{ left: `${floorPct}%` }} />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] text-dim">
          <span>0</span>
          <span>{row.absGap.toFixed(1)} bps gross</span>
        </div>
      </div>
    </Panel>
  );
}
