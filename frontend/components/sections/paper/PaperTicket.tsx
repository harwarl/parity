import { sample } from "@/config/site";

/** F1 · Dashed paper ticket; "FILLED @ MID" stamps down with overshoot (4.8s). */
export function PaperTicket() {
  return (
    <div
      role="img"
      aria-label={`Paper ticket for ${sample.symbol} filled at the confirm mid, ${sample.cashMid}. No broker.`}
      className="relative mt-2 w-full max-w-[340px] rounded-inset border border-dashed border-ink/20 bg-inset px-5 py-[18px]"
    >
      <p className="font-mono text-[11px] tracking-[0.16em] text-dim">
        PAPER TICKET · {sample.symbol}
      </p>
      <p className="mt-2 font-mono text-[22px] text-ink">@ {sample.cashMid}</p>
      <p className="mt-1.5 font-mono text-[11px] text-dim">confirm mid · no broker</p>
      <span
        aria-hidden
        className="absolute top-7 right-5 rounded-stamp border-2 border-accent bg-inset/60 px-2.5 py-1.5 font-mono text-[13px] font-semibold tracking-[0.14em] text-accent"
        style={{
          animation: "g-stamp 4.8s var(--ease-stamp) infinite both",
          boxShadow: "0 0 18px -4px rgba(178,212,80,.5)",
        }}
      >
        FILLED @ MID
      </span>
    </div>
  );
}
