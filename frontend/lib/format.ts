export function formatUsd(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatBps(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value} bps`;
}
