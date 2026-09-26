const MINUS = "−";

/** Signed basis points with a true minus sign: "+17.0", "−6.3". */
export function formatSignedBps(bps: number): string {
  const r = Math.round(bps * 10) / 10;
  if (r === 0) return "0.0";
  const abs = Math.abs(r).toFixed(1);
  return r < 0 ? `${MINUS}${abs}` : `+${abs}`;
}

/** Negative cost figure: "−7.6". */
export function formatCost(bps: number): string {
  return `${MINUS}${bps.toFixed(1)}`;
}

/** Countdown clock, m:ss. */
export function formatClock(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

/** Signed dollars: "+$354.00", "−$19.00". */
export function formatSignedUsd(value: number): string {
  const abs = Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return value < 0 ? `${MINUS}$${abs}` : `+$${abs}`;
}

/** Plain one-decimal with a true minus: "9.4", "−0.3". */
export function formatBps(bps: number): string {
  const r = Math.round(bps * 10) / 10;
  const s = Math.abs(r).toFixed(1);
  return r < 0 ? `${MINUS}${s}` : s;
}
