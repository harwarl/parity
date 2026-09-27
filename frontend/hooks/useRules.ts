"use client";

import { RULES, type Rules } from "@/lib/gauge/model";
import { useGauge } from "@/components/app/shell/GaugeProvider";

/**
 * The viewer's gates in the dashboard's units (bps, seconds, $k): their
 * saved rules from gauge-api, or design.md's defaults offline. Fees come
 * from the fee schedule, not the user.
 */
export function useRules(): Rules {
  const { status, user } = useGauge();
  if (status !== "online" || !user) return RULES;
  return {
    fees: RULES.fees,
    buffer: user.rules.buffer_bps,
    floor: user.rules.floor_bps,
    maxAge: user.rules.max_quote_age_ms / 1000,
    minDepth: user.rules.min_depth_usd / 1000,
    cap: user.daily_card_cap,
  };
}
