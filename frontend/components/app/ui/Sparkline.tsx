import { RULES, type WatchRow } from "@/lib/gauge/model";
import { sparkline } from "@/lib/gauge/series";

/** Net colour rule: lime when CARD, ink-2 at or above floor, dim below. */
export function netColor(row: WatchRow) {
  return row.state === "CARD" ? "#B2D450" : row.net >= RULES.floor ? "#C9CBCF" : "#80848A";
}

/** 112 × 28, 24 seeded points ending on the live net, dashed floor. */
export function Sparkline({ row }: { row: WatchRow }) {
  const s = sparkline(row);
  const c = netColor(row);
  return (
    <svg viewBox="0 0 112 28" width="112" height="28" role="img" aria-label={`${row.sym} net, last 60 minutes, now ${row.net.toFixed(1)} bps`}>
      <line x1="0" x2="112" y1={s.floorY} y2={s.floorY} stroke="#F9F7F4" strokeOpacity=".12" strokeDasharray="2 3" />
      <path d={s.d} fill="none" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="110" cy={s.end[1]} r="2.5" fill={c} />
    </svg>
  );
}
