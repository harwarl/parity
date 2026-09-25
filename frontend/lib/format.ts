const MINUS = "−";

/** Signed basis points with a true minus sign: "+17.0", "−6.3". */
export function formatSignedBps(bps: number): string {
  const abs = Math.abs(bps).toFixed(1);
  return bps < 0 ? `${MINUS}${abs}` : `+${abs}`;
}

/** Negative cost figure: "−7.6". */
export function formatCost(bps: number): string {
  return `${MINUS}${bps.toFixed(1)}`;
}

/** Countdown clock, m:ss. */
export function formatClock(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
