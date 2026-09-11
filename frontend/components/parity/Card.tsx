"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { fmtPrice } from "@/lib/parity/format";
import { netBps } from "@/lib/parity/math";
import type { CardState, SkipCode } from "@/types/parity";
import TtlRing from "./TtlRing";

/**
 * The card — one component, marketing AND app. On the marketing site it loops
 * through one full cycle: open -> TTL drains -> auto-Skip -> reset. It NEVER
 * renders a fake fill as if it were real. In the app the same component is live.
 *
 * States: open | confirmed | rejected | expired | stale_on_confirm
 */

const CLIPS = [15, 25, 50] as const;
type Clip = (typeof CLIPS)[number];

const TTL_SECONDS = 75;

interface CardData {
  symbol: string;
  cashPrice: number;
  tokenPrice: number;
  gapBps: number;
}

interface State {
  status: CardState;
  clip: Clip;
  remaining: number;
  skip: SkipCode | null;
  running: boolean;
  /** index into the marketing rotation */
  idx: number;
}

type Action =
  | { type: "tick"; dt: number }
  | { type: "setClip"; clip: Clip }
  | { type: "smaller" }
  | { type: "confirm" }
  | { type: "skip"; code: SkipCode }
  | { type: "reset"; nextIdx: number }
  | { type: "setRunning"; running: boolean };

const SKIP_CYCLE: SkipCode[] = ["THIN", "STALE", "DUST", "CLOSED"];

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "tick": {
      if (state.status !== "open" || !state.running) return state;
      const remaining = state.remaining - action.dt;
      if (remaining <= 0) {
        return { ...state, remaining: 0, status: "expired", running: false };
      }
      return { ...state, remaining };
    }
    case "setClip":
      return { ...state, clip: action.clip };
    case "smaller": {
      const idx = CLIPS.indexOf(state.clip);
      return idx > 0 ? { ...state, clip: CLIPS[idx - 1] } : state;
    }
    case "confirm":
      // Marketing: re-reads the tick, which has moved. No fill is shown.
      return { ...state, status: "stale_on_confirm", running: false };
    case "skip":
      return {
        ...state,
        status: "rejected",
        skip: action.code,
        running: false,
      };
    case "reset":
      return {
        status: "open",
        clip: 15,
        remaining: TTL_SECONDS,
        skip: null,
        running: true,
        idx: action.nextIdx,
      };
    case "setRunning":
      return { ...state, running: action.running };
    default:
      return state;
  }
}

export default function Card({
  data,
  rotation,
  loop = true,
  active = true,
  className = "max-w-[440px]",
}: {
  data: CardData;
  /** Marketing loop mode: cycle through these names, one per TTL cycle. */
  rotation?: CardData[];
  loop?: boolean;
  /** Whether the card is on-screen — drives pause/resume of the TTL. */
  active?: boolean;
  className?: string;
}) {
  const [state, dispatch] = useReducer(reducer, {
    status: "open",
    clip: 15,
    remaining: TTL_SECONDS,
    skip: null,
    running: false,
    idx: 0,
  });

  const raf = useRef<number>(0);
  const last = useRef<number>(0);

  const cycle =
    loop && rotation && rotation.length > 0 ? rotation : null;
  const view = cycle ? cycle[state.idx % cycle.length] : data;

  // TTL clock — only runs while the card is open, in loop mode, and on-screen.
  useEffect(() => {
    dispatch({ type: "setRunning", running: loop && active });
  }, [loop, active]);

  useEffect(() => {
    if (state.status !== "open" || !state.running) return;
    const step = (now: number) => {
      if (!last.current) last.current = now;
      // marketing loop drains a little faster than the real 75s
      const dt = ((now - last.current) / 1000) * (loop ? 2.4 : 1);
      last.current = now;
      dispatch({ type: "tick", dt });
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf.current);
      last.current = 0;
    };
  }, [state.status, state.running, loop]);

  // Loop: after a terminal state, pause, then reset onto the next name.
  useEffect(() => {
    if (!loop) return;
    if (state.status === "open") return;
    const t = setTimeout(
      () => dispatch({ type: "reset", nextIdx: state.idx + 1 }),
      2400,
    );
    return () => clearTimeout(t);
  }, [state.status, state.idx, loop]);

  const cut = netBps({ gapBps: view.gapBps, clipUsd: state.clip });
  const progress = state.remaining / TTL_SECONDS;

  const onConfirm = useCallback(() => dispatch({ type: "confirm" }), []);
  const onSkip = useCallback(
    () =>
      dispatch({
        type: "skip",
        code: SKIP_CYCLE[Math.abs(state.idx) % SKIP_CYCLE.length],
      }),
    [state.idx],
  );

  return (
    <div
      className={`relative w-full rounded-lg border border-line bg-surface-2 p-4 sm:p-6 ${className}`}
    >
      {/* top line — small, muted, like a live-status readout */}
      <div className="flex items-center justify-between">
        <span className="tnum flex items-baseline gap-2 tracking-wide">
          <span
            key={view.symbol}
            className="num-pop text-[15px] font-semibold text-text"
          >
            {view.symbol}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-text-mute">
            <span className="size-1.5 rounded-full bg-green" />
            sample
          </span>
        </span>
        <TtlRing
          progress={progress}
          seconds={state.remaining}
          stopped={!state.running}
        />
      </div>

      {/* net basis — the single number, in its own nested panel */}
      <div className="mt-4 rounded-lg bg-surface p-4 sm:p-5">
        <p className="eyebrow">Net basis</p>
        <div className="mt-2 flex items-end gap-2">
          <span
            key={cut.net}
            className="tnum num-pop text-[2.75rem] font-medium leading-none text-green"
          >
            {cut.net}
          </span>
          <span className="tnum pb-1 text-sm text-text-mute">bps</span>
        </div>

        {/* haircut line — the subtracted terms strike through */}
        <p className="tnum mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-text-mute">
          <span className="text-text-dim">gap {cut.gap}</span>
          <span aria-hidden>−</span>
          <StrikeTerm delay={80}>fee {cut.fee}</StrikeTerm>
          <span aria-hidden>−</span>
          <StrikeTerm delay={200}>slip {cut.slip}</StrikeTerm>
          <span aria-hidden>−</span>
          <StrikeTerm delay={320}>buffer {cut.buffer}</StrikeTerm>
          <span aria-hidden>=</span>
          <span key={`net-${cut.net}`} className="num-pop text-green">
            net {cut.net}
          </span>
        </p>
      </div>

      {/* faded divider with a centred label */}
      <div className="my-3 flex items-center gap-3 text-text-mute">
        <span className="h-px flex-1 bg-linear-to-r from-transparent to-line-strong" />
        <span className="text-[9px] uppercase tracking-[0.22em]">two prices</span>
        <span className="h-px flex-1 bg-linear-to-l from-transparent to-line-strong" />
      </div>

      {/* cash vs token — two feed rows */}
      <div className="divide-y divide-line">
        <FeedRow
          tone="cash"
          tag="CASH"
          title="The exchange price"
          sub={`${view.symbol} · RTH only`}
          price={view.cashPrice}
        />
        <FeedRow
          tone="token"
          tag="TOKEN"
          title="The chain price"
          sub={`${view.symbol}x · 24/7`}
          price={view.tokenPrice}
        />
      </div>

      {/* clip selector */}
      <div className="mt-4">
        <p className="eyebrow mb-1.5">Clip</p>
        <div className="grid grid-cols-3 gap-1 rounded-md border border-line p-1">
          {CLIPS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => dispatch({ type: "setClip", clip: c })}
              aria-pressed={state.clip === c}
              disabled={state.status !== "open"}
              className={[
                "tnum rounded-sm py-2 text-xs transition-colors disabled:opacity-40",
                state.clip === c
                  ? "bg-surface text-text"
                  : "text-text-mute hover:text-text-dim",
              ].join(" ")}
            >
              ${c}
            </button>
          ))}
        </div>
      </div>

      {/* actions / outcome */}
      {state.status === "open" ? (
        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={onConfirm}
            className="h-12 w-full rounded-md bg-green text-sm font-semibold text-green-ink transition-colors hover:bg-[#12e888]"
          >
            Gap fill
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => dispatch({ type: "smaller" })}
              disabled={state.clip === CLIPS[0]}
              className="h-10 flex-1 rounded-md border border-line-strong text-sm text-text-dim transition-colors hover:border-text-mute hover:text-text disabled:opacity-40"
            >
              smaller
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="h-10 flex-1 rounded-md border border-line-strong text-sm text-text-dim transition-colors hover:border-text-mute hover:text-text"
            >
              Skip
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <Outcome status={state.status} skip={state.skip} />
        </div>
      )}
    </div>
  );
}

function StrikeTerm({
  children,
  delay,
}: {
  children: ReactNode;
  delay: number;
}) {
  return (
    <span className="relative inline-block">
      {children}
      <span
        aria-hidden
        className="absolute inset-x-0 top-1/2 h-px origin-left bg-halt"
        style={{
          animation: `strike 0.4s ease-out ${delay}ms both`,
        }}
      />
    </span>
  );
}

function FeedRow({
  tone,
  tag,
  title,
  sub,
  price,
}: {
  tone: "cash" | "token";
  tag: string;
  title: string;
  sub: string;
  price: number;
}) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1">
        <span
          className={`size-1.5 rounded-full ${
            tone === "token" ? "bg-green" : "bg-text-dim"
          }`}
        />
        <span className="tnum text-[10px] tracking-[0.15em] text-text-dim">
          {tag}
        </span>
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] leading-tight text-text">{title}</p>
        <p className="tnum mt-0.5 truncate text-[11px] leading-tight text-text-mute">
          {sub}
        </p>
      </div>
      <span key={price} className="tnum num-pop shrink-0 text-[15px] text-text">
        {fmtPrice(price)}
      </span>
    </div>
  );
}

const OUTCOME: Record<
  Exclude<CardState, "open">,
  { line: string; tone: "mute" | "green" }
> = {
  confirmed: {
    line: "Confirmed. TAPE hands off to review, then place. You confirm the place.",
    tone: "green",
  },
  rejected: { line: "Skipped. This tick will not be retried.", tone: "mute" },
  expired: {
    line: "Expired. The card timed out before you tapped.",
    tone: "mute",
  },
  stale_on_confirm: {
    line: "Confirm re-read the tick. It moved past the buffer. No fill.",
    tone: "mute",
  },
};

function Outcome({
  status,
  skip,
}: {
  status: Exclude<CardState, "open">;
  skip: SkipCode | null;
}) {
  const o = OUTCOME[status];
  return (
    <div className="flex items-start gap-3 rounded-lg border border-line bg-surface p-4">
      <span
        className={[
          "tnum mt-px shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] tracking-widest",
          o.tone === "green"
            ? "border-green/30 text-green"
            : "border-halt/40 text-halt",
        ].join(" ")}
      >
        {status === "rejected" && skip
          ? skip
          : status.replace(/_/g, " ").toUpperCase()}
      </span>
      <p className="text-[11px] leading-relaxed text-text-dim">{o.line}</p>
    </div>
  );
}

export { TTL_SECONDS };
export type { CardData };
