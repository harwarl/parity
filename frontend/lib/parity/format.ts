/** Display-only formatting. The basis is always bps, never percent. */

export function fmtPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

/** Signed basis points, e.g. "+28 bps" / "−14 bps" (real minus sign). */
export function fmtBps(bps: number): string {
  const n = Math.round(bps);
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${Math.abs(n)} bps`;
}

/** Unsigned, for net where the sign is implied. */
export function fmtNet(bps: number): string {
  return `${Math.round(bps)} bps`;
}

export function fmtTtl(seconds: number): string {
  const s = Math.max(0, Math.ceil(seconds));
  return `${s}s`;
}

export function fmtMultiplier(uiMultiplier: number): string {
  return `${(uiMultiplier / 1e18).toFixed(3)}×`;
}

export const SESSION_LABEL: Record<string, string> = {
  rth: "RTH",
  ext: "EXT",
  overnight: "OVERNIGHT",
  weekend: "WEEKEND",
  halt: "HALT",
  stale: "STALE",
};
