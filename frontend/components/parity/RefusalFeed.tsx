"use client";

import { useEffect, useState } from "react";
import type { SkipCode } from "@/types/parity";

/**
 * A running feed of the last few refusals — the product doing its job in real
 * time. Cycles on a timer; freezes on the first entry under reduced motion.
 */
const SAMPLE: { code: SkipCode | "HALT"; sym: string }[] = [
  { code: "THIN", sym: "COIN" },
  { code: "STALE", sym: "AMD" },
  { code: "DUST", sym: "MSFT" },
  { code: "HALT", sym: "NVDA" },
  { code: "CLOSED", sym: "TSLA" },
  { code: "THIN", sym: "META" },
];

export default function RefusalFeed() {
  const [i, setI] = useState(0);
  const [age, setAge] = useState(1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tick = window.setInterval(() => setAge((a) => a + 1), 1000);
    const advance = window.setInterval(() => {
      setI((v) => (v + 1) % SAMPLE.length);
      setAge(0);
    }, 2600);
    return () => {
      window.clearInterval(tick);
      window.clearInterval(advance);
    };
  }, []);

  const cur = SAMPLE[i];

  return (
    <div className="inline-flex items-center gap-2.5 rounded-md border border-line bg-surface/70 px-3 py-1.5">
      <span className="size-1.5 animate-pulse rounded-full bg-halt" />
      <span className="eyebrow">last refusal</span>
      <span
        key={i}
        className="tnum num-pop inline-flex items-center gap-2 text-[0.8rem]"
      >
        <span className="rounded-sm border border-halt/50 px-1.5 py-0.5 text-[10px] tracking-[0.16em] text-halt">
          {cur.code}
        </span>
        <span className="text-text-dim">{cur.sym}</span>
        <span className="text-text-mute">· {age}s ago</span>
      </span>
    </div>
  );
}
