"use client";

import { useLayoutEffect, useRef } from "react";
import Container from "@/components/layout/Container";
import RefusalFeed from "@/components/parity/RefusalFeed";
import BrandMark from "@/components/shared/BrandMark";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";

const rows = [
  {
    symbol: "HOOD",
    stock: "$20.01",
    token: "$20.08",
    net: "$0.05 (+25 bps)",
    netTone: "green",
    status: "Eligibe",
    statusTone: "green",
    expires: "00:42",
  },
  {
    symbol: "TSLA",
    stock: "$248.32",
    token: "$248.11",
    net: "$0.00 (dust)",
    netTone: "mute",
    status: "Dust",
    statusTone: "mute",
    expires: "—",
  },
  {
    symbol: "AAPL",
    stock: "$227.14",
    token: "$226.90",
    net: "$0.00 (after costs)",
    netTone: "mute",
    status: "Thin",
    statusTone: "mute",
    expires: "—",
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
      <Container>
        <div data-lo-head className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[1.4rem] font-bold tracking-tight text-text sm:text-2xl">
            Live Opportunities (Paper Mode)
          </h2>
          <a href="#" className="flex items-center gap-1 text-[0.85rem] text-green transition-colors hover:text-[#12e888]">
            View all
            <ArrowIcon />
          </a>
        </div>

        <div data-lo-head className="mt-4">
          <RefusalFeed />
        </div>

        <div data-lo-table className="mt-6 overflow-x-auto">
          <table className="w-full min-w-180 border-collapse text-left">
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
                      <BrandMark symbol={r.symbol} className="size-6" />
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
                      className="h-8 rounded-md bg-green px-4 text-[0.8rem] font-medium text-green-ink transition-colors hover:bg-[#12e888]"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
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
