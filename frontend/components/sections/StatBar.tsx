"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";

const STATS: { icon: ReactNode; value: string; label: string }[] = [
  { icon: <ClockIcon />, value: "24/7", label: "Token market coverage" },
  { icon: <BankIcon />, value: "RTH only", label: "Exchange (cash) price" },
  { icon: <ShieldIcon />, value: "3/day", label: "Opportunity limit" },
  { icon: <BoltIcon />, value: "~75 seconds", label: "Card TTL (re-quote on confirm)" },
];

/** The stat strip beneath the hero — four quick facts, each an icon tile. */
export default function StatBar() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-stat-item]", {
        opacity: 0,
        y: 16,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 88%" },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="border-t border-line py-10">
      <div
        ref={ref}
        className="mx-auto grid w-full max-w-360 grid-cols-2 gap-x-6 gap-y-8 px-6 sm:px-12 md:grid-cols-4 lg:px-16"
      >
        {STATS.map((s) => (
          <div key={s.label} data-stat-item className="group flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-green transition-transform duration-300 group-hover:-translate-y-0.5">
              {s.icon}
            </span>
            <div className="min-w-0">
              <p className="tnum text-[1.05rem] font-semibold text-text">{s.value}</p>
              <p className="text-[0.78rem] text-text-mute">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 4.5V8l2.5 1.5" />
    </svg>
  );
}
function BankIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 1.5 14.5 5H1.5L8 1.5Z" />
      <path d="M2.5 6.5v6M6 6.5v6M10 6.5v6M13.5 6.5v6M1.5 14.5h13" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 1.5 13.5 3.5v4c0 3.6-2.4 6-5.5 7-3.1-1-5.5-3.4-5.5-7v-4L8 1.5Z" />
    </svg>
  );
}
function BoltIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 1.5 3 9h4l-1 5.5 6-7.5H8l1-5.5Z" />
    </svg>
  );
}
