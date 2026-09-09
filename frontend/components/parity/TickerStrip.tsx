import { SESSION_LABEL, fmtBps } from "@/lib/parity/format";
import { TAPE } from "@/lib/parity/universe";

/**
 * A ticker tape. The universe scrolls past continuously; halted and stale names
 * still ride the tape, marked. Pauses on hover. The scroll is a CSS animation,
 * so prefers-reduced-motion freezes it to a static row.
 */
export default function TickerStrip() {
  const items = [...TAPE, ...TAPE];

  return (
    <div className="group relative overflow-hidden border-y border-line bg-surface/50">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-ground to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-ground to-transparent" />

      <div className="flex w-max gap-8 py-2.5 pl-8 [animation:ticker_52s_linear_infinite] group-hover:[animation-play-state:paused]">
        {items.map((row, i) => {
          const dead = row.state === "halt" || row.state === "stale";
          const cheap = row.basisBps < 0;
          return (
            <span
              key={`${row.symbol}-${i}`}
              className="tnum flex shrink-0 items-center gap-2 text-[0.8rem]"
            >
              <span className="text-text-dim">{row.symbol}</span>
              {dead ? (
                <span className="text-halt">{SESSION_LABEL[row.state]}</span>
              ) : (
                <span className={cheap ? "text-text-mute" : "text-green/85"}>
                  {fmtBps(row.basisBps)}
                </span>
              )}
              <span aria-hidden className="pl-6 text-line-strong">
                |
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
