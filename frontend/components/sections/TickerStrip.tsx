import { sample, ticker } from "@/config/site";
import { formatSignedBps } from "@/lib/format";
import type { TickerItem } from "@/types/content";

function Chip({ item, index }: { item: TickerItem; index: number }) {
  // Lime and flashing only when the gross gap clears total cost (7.6 bps).
  const clears = Math.abs(item.gapBps) >= sample.costBps;
  return (
    <li
      className="flex h-[52px] flex-none items-center gap-3 rounded-full border border-ink/[.09] bg-[#0F1113] pr-[22px] pl-2"
      style={
        clears ? { animation: `g-flash 4.2s ease-in-out ${index * 0.9}s infinite` } : undefined
      }
    >
      <span className="grid size-9 place-items-center rounded-full border border-ink/10 bg-bg font-mono text-[9px] tracking-tight text-dim">
        {item.symbol}
      </span>
      <span className="font-mono text-[15px] font-semibold text-ink">{item.symbol}</span>
      <span className="text-[14px] text-dim">{item.name}</span>
      <span className={`font-mono text-[14px] ${clears ? "text-accent" : "text-dim"}`}>
        {formatSignedBps(item.gapBps)} bps
      </span>
    </li>
  );
}

/** 5.3 · Watched names, gross gap. Full-width masked marquee (B1, B2). */
export function TickerStrip() {
  const mask = "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)";
  return (
    <section
      data-motion
      aria-label="Robinhood Chain stock tokens, gross gap, illustrative"
      className="relative border-y border-ink/6 pt-[26px] pb-[30px]"
    >
      <div className="g-wrap mb-5 flex items-center justify-between gap-4 font-mono text-[12px] tracking-[0.22em] text-dim">
        <span>ROBINHOOD CHAIN STOCK TOKENS · GROSS GAP</span>
        <span className="max-sm:hidden">ILLUSTRATIVE</span>
      </div>
      <div className="overflow-hidden" style={{ maskImage: mask, WebkitMaskImage: mask }}>
        <div
          className="flex w-max"
          style={{ animation: "g-marq 48s linear infinite" }}
        >
          <ul className="flex gap-3.5 pr-3.5">
            {ticker.map((item, i) => (
              <Chip key={item.symbol} item={item} index={i} />
            ))}
          </ul>
          <ul className="flex gap-3.5 pr-3.5" aria-hidden>
            {ticker.map((item, i) => (
              <Chip key={item.symbol} item={item} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
