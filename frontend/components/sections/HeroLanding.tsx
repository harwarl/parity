"use client";

import {
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import SignalCard from "@/components/dashboard/SignalCard";
import Container from "@/components/layout/Container";
import LiveClock from "@/components/parity/LiveClock";
import Tilt from "@/components/shared/Tilt";
import { useLiveTape } from "@/hooks/useLiveTape";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";
import { TAPE } from "@/lib/parity/universe";

const FEATURES = [
  { icon: <BoltIcon />, label: "Real-time detection" },
  { icon: <BarsIcon />, label: "Costs & slippage built in" },
  { icon: <ShieldIcon />, label: "You're always in control" },
];

// names worth featuring: in RTH and clearing the bar right now
const ROTATION_SYMBOLS = TAPE.filter(
  (r) => r.state === "rth" && r.netBps > 0,
).map((r) => r.symbol);

/**
 * Hero for the new "/" landing page. The right-side widget is the real
 * dashboard SignalCard (components/dashboard/SignalCard.tsx) — reused as-is
 * rather than a hand-drawn mockup, per instruction to pull the card from the
 * dashboard.
 */
export default function HeroLanding() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { rows } = useLiveTape(1800);
  const [rotationIndex, setRotationIndex] = useState(0);
  const symbol = ROTATION_SYMBOLS[rotationIndex % ROTATION_SYMBOLS.length];
  const row = rows.find((r) => r.symbol === symbol) ?? rows[0];

  const advance = useCallback(() => {
    setRotationIndex((i) => i + 1);
  }, []);

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero-pill]", { opacity: 0, y: -8, duration: 0.5 });
      tl.from(
        "[data-hero-line]",
        { opacity: 0, y: 18, duration: 0.6, stagger: 0.08 },
        "-=0.25",
      );
      tl.from(
        "[data-hero-feature]",
        { opacity: 0, y: 10, duration: 0.4, stagger: 0.08 },
        "-=0.2",
      );
      tl.from(
        "[data-hero-card]",
        { opacity: 0, y: 28, scale: 0.95, duration: 0.7 },
        "-=0.55",
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden lg:min-h-[calc(80dvh-3.5rem)]"
    >
      <Container className="grid gap-12 py-16 sm:py-20 lg:min-h-[calc(95dvh-3.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:py-28">
        <div className="min-w-0">
          <p className="tnum flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] tracking-[0.15em] text-text-mute">
            <span className="inline-flex items-center gap-1.5 text-green">
              <span className="size-1 animate-pulse rounded-full bg-green" />
              GUAGE
            </span>
            <span aria-hidden>·</span>
            <span>Watching market inefficiencies 24/7</span>
            <span aria-hidden>·</span>
            <span>
              RTH <LiveClock />
            </span>
          </p>
          <h1
            data-hero-line
            className="mt-6 text-balance text-[2.1rem] font-bold leading-[1.08] tracking-[-0.02em] text-text sm:text-[2.75rem] lg:text-[3.1rem]"
          >
            Profit from price gaps between the stock and its token.
          </h1>

          <p
            data-hero-line
            className="mt-6 max-w-xl text-pretty text-[1rem] leading-relaxed text-text-dim"
          >
            GAUGE is a basis tape for Robinhood cash equities vs. Robinhood
            Chain stock tokens. It watches the same name trade at two prices —
            the exchange price (cash, RTH only) and the token&apos;s implied
            per-share price (chain, 24/7) — and tells you when the gap is real
            money after costs.
          </p>

          <div
            data-hero-line
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-md bg-green px-5 text-sm font-semibold text-green-ink transition-[background-color,transform] duration-200 hover:bg-[#12e888] active:scale-[0.97]"
            >
              Get paper account
            </a>
            <a
              href="#how"
              className="inline-flex h-11 items-center gap-2 justify-center rounded-md border border-line-strong px-5 text-sm text-text-dim transition-colors duration-200 hover:border-text-mute hover:text-text"
            >
              <PlayIcon />
              Watch demo
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                data-hero-feature
                className="flex items-center gap-2.5"
              >
                <span className="flex size-8 items-center justify-center rounded-full border border-line-strong bg-surface text-green">
                  {f.icon}
                </span>
                <span className="text-[0.85rem] text-text-dim">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div data-hero-card className="w-full min-w-0">
          <Tilt max={4}>
            <SignalCard
              key={symbol}
              row={row}
              onExpire={advance}
              confirmHref="/dashboard"
            />
          </Tilt>
        </div>
      </Container>
    </section>
  );
}

function BoltIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 1.5 3 9h4l-1 5.5 6-7.5H8l1-5.5Z" />
    </svg>
  );
}
function BarsIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2.5 13.5v-4M7 13.5v-8M11.5 13.5v-6" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8 1.5 13.5 3.5v4c0 3.6-2.4 6-5.5 7-3.1-1-5.5-3.4-5.5-7v-4L8 1.5Z" />
    </svg>
  );
}
function PlayIcon(): ReactNode {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
    >
      <path d="M4 2.5v11l10-5.5-10-5.5Z" />
    </svg>
  );
}
