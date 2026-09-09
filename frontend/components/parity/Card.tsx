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
}

type Action =
  | { type: "tick"; dt: number }
  | { type: "setClip"; clip: Clip }
  | { type: "smaller" }
  | { type: "confirm" }
  | { type: "skip"; code: SkipCode }
  | { type: "reset" }
  | { type: "setRunning"; running: boolean };

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
        running: state.running,
      };
    case "setRunning":
      return { ...state, running: action.running };
    default:
      return state;
  }
}

export default function Card({
  data,
  loop = true,
  active = true,
  className = "max-w-[4400px]",
}: {
  data: CardData;
  /** Marketing loop mode. */
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
  });

  const raf = useRef<number>(0);
  const last = useRef<number>(0);

  // TTL clock — only runs while the card is open, in loop mode, and on-screen.
  useEffect(() => {
    dispatch({ type: "setRunning", running: loop && active });
  }, [loop, active]);

  useEffect(() => {
    if (state.status !== "open" || !state.running) return;
    const step = (now: number) => {
      if (!last.current) last.current = now;
      const dt = (now - last.current) / 1000;
      last.current = now;
      dispatch({ type: "tick", dt });
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf.current);
      last.current = 0;
    };
  }, [state.status, state.running]);

  // Loop: after a terminal state, pause, then reset.
  useEffect(() => {
    if (!loop) return;
    if (state.status === "open") return;
    const t = setTimeout(() => dispatch({ type: "reset" }), 2600);
    return () => clearTimeout(t);
  }, [state.status, loop]);

  const cut = netBps({ gapBps: data.gapBps, clipUsd: state.clip });
  const progress = state.remaining / TTL_SECONDS;

  const onConfirm = useCallback(() => dispatch({ type: "confirm" }), []);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-line-strong bg-surface-2 ${className}`}
    >
      {/* header */}
      <div className="grid-texture flex items-center justify-between border-b border-line px-5 py-3.5">
        <div className="flex items-baseline gap-2">
          <span className="text-[0.95rem] font-semibold tracking-tight text-text">
            {data.symbol}
          </span>
          <span className="tnum rounded-sm border border-line-strong px-1 py-px text-[9px] tracking-widest text-text-mute">
            SAMPLE
          </span>
        </div>
        <TtlRing
          progress={progress}
          seconds={state.remaining}
          stopped={!state.running}
        />
      </div>

      <div className="space-y-4 p-5">
        {/* the single number */}
        <div>
          <p className="eyebrow">Net basis</p>
          <div className="mt-1.5 flex items-end gap-2">
            <span
              key={cut.net}
              className="tnum num-pop text-[3.25rem] font-medium leading-none text-green"
            >
              {cut.net}
            </span>
            <span className="tnum pb-1.5 text-sm text-text-mute">bps</span>
          </div>
        </div>

        {/* cash vs token */}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
          <Pane
            label="Cash"
            price={data.cashPrice}
            sub={`${data.symbol} · exchange · RTH`}
          />
          <Pane
            label="Token"
            price={data.tokenPrice}
            sub={`${data.symbol}x · chain · 24/7`}
          />
        </div>

        {/* haircut line — the subtracted terms strike through */}
        <p className="tnum flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-text-mute">
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

        {/* clip selector */}
        <div>
          <p className="eyebrow mb-1.5">Clip</p>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-line-strong bg-line-strong">
            {CLIPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => dispatch({ type: "setClip", clip: c })}
                aria-pressed={state.clip === c}
                disabled={state.status !== "open"}
                className={[
                  "tnum py-1.5 text-xs transition-colors disabled:opacity-40",
                  state.clip === c
                    ? "bg-surface-2 text-text"
                    : "bg-surface text-text-mute hover:text-text-dim",
                ].join(" ")}
              >
                ${c}
              </button>
            ))}
          </div>
        </div>

        {/* actions / outcome */}
        {state.status === "open" ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onConfirm}
              className="h-10 flex-1 rounded-md bg-green text-sm font-medium text-green-ink transition-colors hover:bg-[#12e888]"
            >
              Gap fill
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "smaller" })}
              disabled={state.clip === CLIPS[0]}
              className="h-10 rounded-md border border-line-strong px-3 text-sm text-text-dim transition-colors hover:text-text disabled:opacity-40"
            >
              smaller
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "skip", code: "THIN" })}
              className="h-10 rounded-md border border-line-strong px-3 text-sm text-text-dim transition-colors hover:text-text"
            >
              Skip
            </button>
          </div>
        ) : (
          <Outcome status={state.status} skip={state.skip} />
        )}
      </div>
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

function Pane({
  label,
  price,
  sub,
}: {
  label: string;
  price: number;
  sub: string;
}) {
  return (
    <div className="bg-surface-2 p-3">
      <p className="eyebrow">{label}</p>
      <p className="tnum mt-1 text-lg text-text">{fmtPrice(price)}</p>
      <p className="tnum mt-0.5 text-[10px] leading-tight text-text-mute">
        {sub}
      </p>
    </div>
  );
}

const OUTCOME: Record<
  Exclude<CardState, "open">,
  { line: string; tone: "mute" | "green" }
> = {
  confirmed: {
    line: "Confirmed. PARITY hands off to review, then place. You confirm the place.",
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
    <div className="flex items-start gap-3 rounded-md border border-line bg-surface px-3 py-3">
      <span
        className={[
          "tnum mt-px shrink-0 rounded-sm border px-1.5 py-0.5 text-[10px] tracking-widest",
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
