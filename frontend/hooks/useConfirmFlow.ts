"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SkipCode } from "@/lib/api/types";
import { SAMPLE_NOW, cardFromApi, sampleCard, type CardVM } from "@/lib/gauge/adapt";
import { ACTIVE } from "@/lib/gauge/model";
import { useGauge } from "@/components/app/shell/GaugeProvider";
import { useCountdown } from "@/hooks/useCountdown";
import { useApiActiveCard } from "@/hooks/useApiActiveCard";

/** 0 idle · 1 tapped · 2 re-quoted · 3 gates re-checked · 4 filled/sent. */
export type Phase = 0 | 1 | 2 | 3 | 4;

export type ConfirmResult =
  | { kind: "filled"; price: number | null }
  | { kind: "sent" }
  | { kind: "requote_fail"; code: SkipCode | null; net: number | null }
  | { kind: "expired" }
  | { kind: "live_unavailable"; reason: string }
  | { kind: "error"; reason: string };

export type ConfirmFlow = {
  source: "api" | "sample";
  /** The card on screen: the open one, or the one being/just confirmed. */
  card: CardVM | null;
  /** Seconds left (frozen while confirming). */
  t: number;
  phase: Phase;
  result: ConfirmResult | null;
  /** Re-quote shimmer (J7): mounts when prices refresh. */
  shimmer: boolean;
  doIt: () => void;
  skip: () => void;
  /** Clear a finished card and show the next open one (if any). */
  dismiss: () => void;
};

const STEP_MS = 700;

/**
 * The Do it flow shared by Home's active card and the Card screen (J6).
 * API mode calls POST /cards/:id/confirm and maps its outcome; the step
 * animation runs at the design's 0/.7/1.4/2.1 s rhythm as a floor, so a
 * fast response still reads as tap → re-quote → re-check → fill. The
 * countdown holds while confirming. Sample mode is the design.md demo.
 */
export function useConfirmFlow(): ConfirmFlow {
  const gauge = useGauge();
  const api = useApiActiveCard();
  const [phase, setPhase] = useState<Phase>(0);
  const [shimmer, setShimmer] = useState(false);
  const [result, setResult] = useState<ConfirmResult | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [heldT, setHeldT] = useState<number | null>(null);
  const sampleClock = useCountdown(phase > 0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const apiMode = api !== null;
  const pinned = pinnedId ? gauge.cards.find((c) => c.card_id === pinnedId) : undefined;
  const card: CardVM | null = apiMode
    ? pinned
      ? cardFromApi(pinned)
      : api.card
    : {
        ...sampleCard(),
        requote:
          phase >= 2
            ? { cash: ACTIVE.requote.cash, token: ACTIVE.requote.token, net: ACTIVE.requote.net, at: SAMPLE_NOW + 90 }
            : null,
      };
  const t = heldT ?? (apiMode ? api.t : sampleClock.t);

  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase(0);
    setShimmer(false);
    setResult(null);
    setPinnedId(null);
    setHeldT(null);
  }, []);

  const animate = (upTo: Phase) => {
    timers.current.push(
      setTimeout(() => {
        setPhase((p) => (p < 2 ? 2 : p));
        setShimmer(true);
      }, STEP_MS),
    );
    if (upTo >= 3) timers.current.push(setTimeout(() => setPhase((p) => (p < 3 ? 3 : p)), STEP_MS * 2));
    if (upTo >= 4) timers.current.push(setTimeout(() => setPhase(4), STEP_MS * 3));
  };

  const doIt = () => {
    if (!card || phase > 0 || result) return;
    setPhase(1);
    setShimmer(false);
    setHeldT(t);
    if (!apiMode) {
      animate(4);
      timers.current.push(setTimeout(() => setResult({ kind: "filled", price: ACTIVE.requote.cash }), STEP_MS * 3));
      return;
    }
    setPinnedId(card.id);
    const started = Date.now();
    gauge
      .confirm(card.id)
      .then((res) => {
        // Hold the result until the steps have had their 2.1 s.
        const wait = Math.max(0, STEP_MS * 3 - (Date.now() - started));
        const finish = (r: ConfirmResult, reached: Phase) => {
          animate(reached);
          timers.current.push(
            setTimeout(() => {
              setPhase(reached);
              setResult(r);
            }, wait),
          );
        };
        switch (res.status) {
          case "confirmed":
            finish(res.filled_at_price == null ? { kind: "sent" } : { kind: "filled", price: res.filled_at_price }, 4);
            break;
          case "requote_fail":
            finish({ kind: "requote_fail", code: res.code, net: res.net_bps }, res.code ? 3 : 2);
            break;
          case "stale_on_confirm":
          case "already_resolved_or_missing":
            finish({ kind: "expired" }, 1);
            break;
          case "live_action_unavailable":
            finish({ kind: "live_unavailable", reason: res.reason }, 1);
            break;
          case "live_handoff_failed":
            finish({ kind: "error", reason: res.reason }, 3);
            break;
        }
      })
      .catch((e: unknown) => {
        setPhase(1);
        setResult({ kind: "error", reason: e instanceof Error ? e.message : "request failed" });
      });
  };

  const skip = () => {
    if (apiMode && card && !result && phase === 0) gauge.skip(card.id);
    if (!apiMode) sampleClock.reset();
    reset();
  };

  return {
    source: apiMode ? "api" : "sample",
    card,
    t,
    phase,
    result,
    shimmer,
    doIt,
    skip,
    dismiss: () => {
      if (!apiMode) sampleClock.reset();
      reset();
    },
  };
}
