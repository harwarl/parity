import type { GateState, Outcome } from "@/lib/gauge/model";

/** State colours (design.md §5B.1). Tint = 8% fill, 45% border; DUST has no fill. */
const stateColor: Record<GateState, string> = {
  CARD: "#B2D450",
  THIN: "#E8B04A",
  STALE: "#FF6B5E",
  DUST: "#80848A",
  CLOSED: "#8FA6DA",
};

const base =
  "inline-flex h-6 flex-none items-center gap-1.5 rounded-full border px-2.5 font-mono text-[10px] tracking-[0.14em] whitespace-nowrap uppercase";

export function StatePill({ state, children }: { state: GateState; children?: React.ReactNode }) {
  const c = stateColor[state];
  return (
    <span
      className={base}
      style={{
        color: c,
        borderColor: `${c}73`,
        background: state === "DUST" ? "transparent" : `${c}17`,
      }}
    >
      {children ?? state}
    </span>
  );
}

export function stateHex(state: GateState) {
  return stateColor[state];
}

/** Outcome pills (design.md §5B.1). */
export function OutcomePill({ outcome }: { outcome: Outcome }) {
  const style: Record<Outcome, React.CSSProperties> = {
    TAKEN: { color: "#B2D450", borderColor: "rgba(178,212,80,.45)", background: "rgba(178,212,80,.08)" },
    SKIPPED: { color: "#C9CBCF", borderColor: "rgba(201,203,207,.35)" },
    EXPIRED: { color: "#80848A", borderColor: "rgba(249,247,244,.08)" },
    "RE-QUOTE FAIL": { color: "#FF6B5E", borderColor: "rgba(255,107,94,.45)", background: "rgba(255,107,94,.08)" },
    ACTIVE: { color: "#0B0D07", borderColor: "#B2D450", background: "#B2D450" },
  };
  return (
    <span className={base} style={style[outcome]}>
      {outcome}
    </span>
  );
}
