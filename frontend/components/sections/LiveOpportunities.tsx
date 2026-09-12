"use client";

import { useLayoutEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";

const rows = [
  {
    symbol: "HOOD",
    icon: "hood",
    stock: "$20.01",
    token: "$20.08",
    net: "$0.05 (+25 bps)",
    netTone: "green",
    status: "Eligibe",
    statusTone: "green",
    expires: "00:42",
    cta: "green",
  },
  {
    symbol: "TSLA",
    icon: "tsla",
    stock: "$248.32",
    token: "$248.11",
    net: "$0.00 (dust)",
    netTone: "mute",
    status: "Dust",
    statusTone: "mute",
    expires: "—",
    cta: "dark",
  },
  {
    symbol: "AAPL",
    icon: "aapl",
    stock: "$227.14",
    token: "$226.90",
    net: "$0.00 (after costs)",
    netTone: "mute",
    status: "Thin",
    statusTone: "mute",
    expires: "—",
    cta: "dark",
  },
] as const;

/** "Live Opportunities (Paper Mode)" — the sample tape table on the landing page. */
export default function LiveOpportunities() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-lo-head]", {
        opacity: 0,
        y: 14,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
      gsap.from("[data-lo-row]", {
        opacity: 0,
        y: 14,
        duration: 0.45,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: "[data-lo-table]", start: "top 85%" },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={ref} className="border-t border-line py-16 sm:py-20" id="tape">
      <div className="mx-auto w-full max-w-360 px-6 sm:px-12 lg:px-16">
        <div data-lo-head className="flex items-center justify-between gap-4">
          <h2 className="text-[1.4rem] font-bold tracking-tight text-text sm:text-2xl">
            Live Opportunities (Paper Mode)
          </h2>
          <a href="#" className="flex items-center gap-1 text-[0.85rem] text-green transition-colors hover:text-[#12e888]">
            View all
            <ArrowIcon />
          </a>
        </div>

        <div data-lo-table className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line text-[0.7rem] uppercase tracking-widest text-text-mute">
                <th className="py-3 pr-4 font-normal">Asset</th>
                <th className="py-3 pr-4 font-normal">Stock Price</th>
                <th className="py-3 pr-4 font-normal">Token Price</th>
                <th className="py-3 pr-4 font-normal">Net Edge (after costs)</th>
                <th className="py-3 pr-4 font-normal">Status</th>
                <th className="py-3 pr-4 font-normal">Expires In</th>
                <th className="py-3 pl-4 font-normal" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.symbol}
                  data-lo-row
                  className="group border-b border-line transition-colors duration-200 hover:bg-surface/60"
                >
                  <td className="py-4 pr-4">
                    <span className="flex items-center gap-2.5">
                      <AssetIcon kind={r.icon} />
                      <span className="text-[0.9rem] font-medium text-text">{r.symbol}</span>
                    </span>
                  </td>
                  <td className="tnum py-4 pr-4 text-[0.88rem] text-text-dim">{r.stock}</td>
                  <td className="tnum py-4 pr-4 text-[0.88rem] text-text-dim">{r.token}</td>
                  <td
                    className={`tnum py-4 pr-4 text-[0.88rem] ${
                      r.netTone === "green" ? "text-green" : "text-text-mute"
                    }`}
                  >
                    {r.net}
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.72rem] ${
                        r.statusTone === "green"
                          ? "border-green/30 bg-green-soft text-green"
                          : "border-line-strong text-text-mute"
                      }`}
                    >
                      <span className={`size-1.5 rounded-full ${r.statusTone === "green" ? "bg-green" : "bg-text-mute"}`} />
                      {r.status}
                    </span>
                  </td>
                  <td className="tnum py-4 pr-4 text-[0.85rem] text-text-mute">{r.expires}</td>
                  <td className="py-4 pl-4 text-right">
                    <button
                      type="button"
                      className={`h-8 rounded-md px-4 text-[0.8rem] font-medium transition-colors ${
                        r.cta === "green"
                          ? "bg-green text-green-ink hover:bg-[#12e888]"
                          : "border border-line-strong text-text-dim hover:border-text-mute hover:text-text"
                      }`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

function AssetIcon({ kind }: { kind: "hood" | "tsla" | "aapl" }) {
  if (kind === "hood") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-green/15 text-green">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
          <path d="M8 1.5C5 4 3 6.5 3 9.5A5 5 0 0 0 8 14.5 5 5 0 0 0 13 9.5c0-3-2-5.5-5-8Z" />
        </svg>
      </span>
    );
  }
  if (kind === "tsla") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-[#e82127]/20 text-[#e82127]">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
          <circle cx="8" cy="8" r="7" fillOpacity="0" />
          <path d="M8 3c1.8 0 3.4.5 4.6 1.3l-1 1.4c-.9-.4-1.8-.7-2.7-.75L8 15h-1L6.1 4.95c-.9.05-1.9.35-2.8.75l-1-1.4C3.5 3.5 5.2 3 7 3h1Z" />
        </svg>
      </span>
    );
  }
  return (
    <span className="flex size-6 items-center justify-center rounded-full bg-text-dim/15 text-text-dim">
      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
        <path d="M11.3 8.4c0-1.7 1.4-2.5 1.5-2.6-.8-1.1-2-1.3-2.4-1.3-1 0-1.9.6-2.4.6s-1.3-.6-2.2-.6c-1.1 0-2.2.7-2.8 1.7-1.2 2.1-.3 5.2.8 6.9.6.8 1.3 1.8 2.1 1.7.8-.02 1.2-.55 2.2-.55s1.3.55 2.2.53c.9-.02 1.5-.85 2-1.7.7-.9.9-1.9.9-1.95 0 0-1.75-.68-1.75-2.68Zm-1.7-5c.5-.6.8-1.4.75-2.2-.7.04-1.6.5-2.1 1.1-.45.5-.85 1.35-.75 2.1.8.06 1.6-.4 2.1-1Z" />
      </svg>
    </span>
  );
}
