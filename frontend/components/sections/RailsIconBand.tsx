"use client";

import { type ReactNode, useEffect, useLayoutEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";

const rails: { icon: ReactNode; k: string; v: string }[] = [
  { icon: <LayersIcon />, k: "Paper default", v: "7+ days on paper before live is even offered." },
  { icon: <LockIcon />, k: "No custody", v: "No deposits, no balance held, no wallet to connect." },
  { icon: <RouteIcon />, k: "Official MCP only", v: "Live equity routes through the official Trading MCP." },
  { icon: <ShieldIcon />, k: "Confirm-gated", v: "Every live place is a review, then your explicit confirm." },
  { icon: <FreezeIcon />, k: "One-name freeze", v: "Halt a single symbol in seconds, with an audit row." },
  { icon: <PulseIcon />, k: "Self-directed", v: "Signals only. You place every trade yourself, on the official rails." },
];

/** Rails band — the guardrails, as icon tiles with a magnetic hover pull. */
export default function RailsIconBand() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-rib-head]", {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
      gsap.from("[data-rib-item]", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: "[data-rib-grid]", start: "top 85%" },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={ref} id="rails" className="scroll-mt-24 border-t border-line py-16 sm:py-20">
      <div className="mx-auto w-full max-w-360 px-6 sm:px-12 lg:px-16">
        <div data-rib-head className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight text-text sm:text-[2rem]">
            The guardrails are the product too.
          </h2>
        </div>

        <div data-rib-grid className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rails.map((r) => (
            <div
              key={r.k}
              data-rib-item
              className="group flex items-start gap-3.5 rounded-xl border border-line bg-surface p-5 transition-colors duration-300 hover:border-line-strong"
            >
              <Magnetic>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface-2 text-green">
                  {r.icon}
                </span>
              </Magnetic>
              <div>
                <p className="text-[0.9rem] font-semibold text-text">{r.k}</p>
                <p className="mt-1.5 text-[0.82rem] leading-relaxed text-text-dim">{r.v}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = parent.getBoundingClientRect();
      const x = (e.clientX - r.left - 30) * 0.1;
      const y = (e.clientY - r.top - 30) * 0.1;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    const onLeave = () => {
      el.style.transform = "translate(0, 0)";
    };

    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);
    return () => {
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <span ref={ref} className="inline-block transition-transform duration-150 ease-out will-change-transform">
      {children}
    </span>
  );
}

function LayersIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 1.8 14.5 5 8 8.2 1.5 5 8 1.8ZM1.5 8 8 11.2 14.5 8M1.5 11 8 14.2 14.5 11" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
function RouteIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="4" cy="12" r="2" />
      <circle cx="12" cy="4" r="2" />
      <path d="M6 12h3a3 3 0 0 0 3-3V6" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 1.5 13.5 3.5v4c0 3.6-2.4 6-5.5 7-3.1-1-5.5-3.4-5.5-7v-4L8 1.5Z" />
    </svg>
  );
}
function FreezeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 1.5v13M2.4 4.75l11.2 6.5M13.6 4.75 2.4 11.25" />
    </svg>
  );
}
function PulseIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1.5 8h3l2-5 3 10 2-5h3.5" />
    </svg>
  );
}
