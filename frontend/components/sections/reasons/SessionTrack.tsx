/**
 * E2 · The marker sweeps the day (6.6s linear); the RTH window lights only
 * while the marker is inside it (35%–67% of travel).
 *
 * The rail is (track − 15px) wide and the marker's carrier is 100% of the
 * rail, so translateX(100%) equals the spec's "track width − 15px" at any size.
 */
export function SessionTrack() {
  return (
    <div
      role="img"
      aria-label="Session track: the cash market is only open inside the regular trading hours window."
      className="flex h-16 flex-col justify-center gap-2"
    >
      <div className="relative h-7 rounded-full border border-ink/10 bg-inset">
        <span
          className="absolute inset-y-[3px] grid place-items-center rounded-full border border-accent/40 bg-accent/15 font-mono text-[9px] tracking-[0.12em] text-accent"
          style={{
            left: "35%",
            width: "32%",
            animation: "g-sessin 6.6s linear infinite",
          }}
        >
          RTH
        </span>
        <span className="absolute inset-y-0 right-[13px] left-[2px]">
          <span
            className="absolute inset-0"
            style={{ ["--sess-travel" as string]: "100%", animation: "g-sess 6.6s linear infinite" }}
          >
            <span
              className="absolute top-1/2 left-0 size-2.5 -translate-y-1/2 rounded-full bg-ink"
              style={{ boxShadow: "0 0 10px rgba(249,247,244,.7)" }}
            />
          </span>
        </span>
      </div>
      <div className="flex justify-between font-mono text-[9px] tracking-[0.16em] text-dim">
        <span>PRE</span>
        <span>AFTER</span>
      </div>
    </div>
  );
}
