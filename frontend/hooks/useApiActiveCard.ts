"use client";

import { useMemo } from "react";
import { cardFromApi, type CardVM } from "@/lib/gauge/adapt";
import { useGauge } from "@/components/app/shell/GaugeProvider";
import { useLive } from "@/components/app/shell/LiveMarketProvider";

export type ApiActiveCard = {
  /** The viewer's open card inside its TTL (one at a time), if any. */
  card: CardVM | null;
  /** Whole seconds until it expires. */
  t: number;
};

/**
 * The open card from gauge-api, with a countdown derived from its real
 * `expires_at` (not a local timer). `null` while the API is offline, so
 * callers fall back to the sample card.
 */
export function useApiActiveCard(): ApiActiveCard | null {
  const { status, cards } = useGauge();
  const { now } = useLive();
  const open = useMemo(
    () =>
      cards
        .filter((c) => c.state === "Open")
        .map(cardFromApi)
        .sort((a, b) => b.openedAt - a.openedAt),
    [cards],
  );
  if (status !== "online") return null;
  const card = open.find((c) => c.expiresAt > now) ?? null;
  return { card, t: card ? Math.max(0, Math.ceil((card.expiresAt - now) / 1000)) : 0 };
}
