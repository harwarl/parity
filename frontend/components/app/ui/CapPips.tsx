export type PipKind = "taken" | "skipped" | "expired" | "fail" | "pending" | "empty";

const pipClass: Record<PipKind, string> = {
  taken: "bg-accent shadow-[0_0_10px_rgba(178,212,80,.6)]",
  skipped: "bg-ink-2",
  expired: "bg-dead",
  fail: "bg-neg",
  pending: "app-pip-pending",
  empty: "bg-track",
};

/** Three cap pips: 6px (Home, pending blinks) or 8px (History, static). */
export function CapPips({ pips, size = 6, blink = false }: { pips: PipKind[]; size?: 6 | 8; blink?: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-x-1.5 gap-y-1" aria-hidden>
      {pips.map((p, i) => (
        <span
          key={i}
          className={`rounded-full ${pipClass[p]}`}
          style={{
            height: size,
            animation: blink && p === "pending" ? "j-blink 2s ease-in-out infinite" : undefined,
          }}
        />
      ))}
    </div>
  );
}
