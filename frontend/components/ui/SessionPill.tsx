import type { RowState } from "@/types/parity";
import { SESSION_LABEL } from "@/lib/parity/format";

/**
 * Session / state pill. Live sessions read neutral; RTH gets the one green dot
 * because it is the only session a live equity leg can trade in. HALT and STALE
 * are "no data" — desaturated halt gray, never the expensive-red treatment.
 */
export default function SessionPill({ state }: { state: RowState }) {
  const label = SESSION_LABEL[state] ?? state.toUpperCase();
  const isLive = state === "rth";
  const isDead = state === "halt" || state === "stale";

  return (
    <span
      className={[
        "tnum inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] tracking-widest",
        isDead
          ? "border-halt/40 text-halt"
          : isLive
            ? "border-green/30 text-green"
            : "border-line-strong text-text-mute",
      ].join(" ")}
    >
      <span
        aria-hidden
        className={[
          "size-1 rounded-full",
          isDead ? "bg-halt" : isLive ? "bg-green" : "bg-text-mute",
        ].join(" ")}
      />
      {label}
    </span>
  );
}
