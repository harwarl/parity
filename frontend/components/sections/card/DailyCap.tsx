import { Panel } from "@/components/ui/Panel";

/**
 * D3 · Three pips fill 1.4s apart on a 6s clock; the lock line lands after
 * the third. Bar 1 carries g-cap-1 so it reads 1/3 with motion off.
 */
export function DailyCap() {
  return (
    <Panel className="flex flex-col p-11 max-sm:p-6">
      <p className="g-eyebrow">Daily cap</p>
      <p className="mt-[68px] font-display text-[120px] leading-[0.9] font-extrabold tracking-[-0.06em] text-ink">
        3
      </p>
      <p className="g-p mt-4 max-w-[420px]">
        cards a day, maximum. Fewer, better prompts beat a feed that trains you to tap.
      </p>
      <div
        role="img"
        aria-label="Daily cap: three cards, then the cap locks until tomorrow."
        className="mt-20"
      >
        <div className="grid grid-cols-3 gap-2">
          {[0, 1.4, 2.8].map((delay, i) => (
            <span
              key={delay}
              className={`h-2 rounded-full bg-track ${i === 0 ? "g-cap-1" : ""}`}
              style={{ animation: `g-capfill 6s ease-in-out ${delay}s infinite both` }}
            />
          ))}
        </div>
        <p
          className="mt-4 font-mono text-[12px] tracking-[0.14em] text-accent"
          style={{ animation: "g-lock 6s ease-in-out 2.8s infinite both" }}
        >
          3/3 · CAP LOCKED UNTIL TOMORROW
        </p>
      </div>
    </Panel>
  );
}
