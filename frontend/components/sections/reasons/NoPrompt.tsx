/*
 * 05 · No prompt? · design dials: VARIANCE 4 / MOTION 5 / DENSITY 3.
 * One compact panel (design.md §5.8, rev 2) replacing the four reason
 * panels: the one-word reasons act out their meaning in turn (L6, one 8s
 * clock, no delays: each keyframe holds still outside its own quarter).
 */
import type { CSSProperties } from "react";
import Link from "next/link";
import { DOCS } from "@/config/docs";
import { reveal } from "@/lib/reveal";

const words: { code: string; color: string; meaning: string; style: CSSProperties }[] = [
  { code: "STALE", color: "#FF6B5E", meaning: "Price too old to trust", style: { animation: "g-rStale 8s ease-in-out infinite" } },
  { code: "CLOSED", color: "#8FA6DA", meaning: "Stock market is closed", style: { animation: "g-rClosed 8s ease-in-out infinite" } },
  {
    code: "THIN",
    color: "#E8B04A",
    meaning: "Not enough shares on offer",
    style: { display: "inline-block", transformOrigin: "left", animation: "g-rThin 8s ease-in-out infinite" },
  },
  { code: "DUST", color: "#A6A9AE", meaning: "Too small after costs", style: { animation: "g-rDust 8s ease-in-out infinite" } },
];

export function NoPrompt() {
  return (
    <section id="reasons" data-motion className="g-wrap relative pt-[150px]">
      <div
        className="g-panel g-reveal grid items-center gap-10 px-10 py-9 max-sm:px-6 lg:grid-cols-[1fr_2fr]"
        style={reveal({ y: 36 })}
      >
        <div className="flex flex-col gap-3.5">
          <p className="g-eyebrow">05 · No prompt?</p>
          <h2 className="font-display text-[32px] leading-[1.1] font-extrabold tracking-[-0.04em] text-ink">
            GAUGE tells you why, in one word.
          </h2>
          <Link href={DOCS.reasons} className="text-[15px] font-semibold text-accent hover:text-accent-hover">
            All reason codes in the docs →
          </Link>
        </div>
        <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {words.map((w) => (
            <div key={w.code} className="flex flex-col gap-2 rounded-2xl border border-ink/8 bg-[#0C0D10] px-5 py-[18px]">
              <dt>
                <span className="font-dot text-[30px] leading-none font-black" style={{ color: w.color, ...w.style }}>
                  {w.code}
                </span>
              </dt>
              <dd className="text-[14px] leading-snug text-muted">{w.meaning}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
