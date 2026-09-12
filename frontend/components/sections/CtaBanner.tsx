"use client";

import { useLayoutEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";

/** Closing CTA banner — "Try GAUGE in paper mode today." */
export default function CtaBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 88%" },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="waitlist" className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-360 px-6 sm:px-12 lg:px-16">
        <div
          ref={ref}
          className="flex flex-col items-start gap-6 rounded-2xl border border-green/25 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10"
          style={{
            background:
              "radial-gradient(120% 160% at 0% 0%, color-mix(in oklab, var(--green) 10%, var(--surface)), var(--surface) 70%)",
          }}
        >
          <div>
            <h2 className="text-[1.4rem] font-bold tracking-tight text-text sm:text-2xl">
              Try GAUGE in paper mode today.
            </h2>
            <p className="mt-2 max-w-md text-[0.9rem] leading-relaxed text-text-dim">
              No capital required. Real market data. See the opportunities
              for yourself.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <a
              href="/app"
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
        </div>
      </div>
    </section>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M4 2.5v11l10-5.5-10-5.5Z" />
    </svg>
  );
}
