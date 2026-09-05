"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { formatBps, formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

interface DemoRow {
  ticker: string;
  cash: number;
  token: number;
  bps: number;
  net?: number;
  fee?: number;
  slip?: number;
  buffer?: number;
  tap?: number;
}

const rows: DemoRow[] = [
  {
    ticker: "HOOD",
    cash: 28.41,
    token: 28.37,
    bps: -14,
    net: -8,
    fee: 3,
    slip: 2,
    buffer: 1,
    tap: 15,
  },
  { ticker: "NVDA", cash: 174.2, token: 174.91, bps: 41 },
  { ticker: "AAPL", cash: 232.08, token: 232.1, bps: 1 },
];

const captions = [
  "Cash mid versus token ÷ multiplier. One function.",
  "Headline isn't the edge. What's left after the haircut is.",
  "You send it. PARITY never does.",
];

const steps = ["01", "02", "03"];
const PAGER_STEP = 44;
const AUTO_ADVANCE_MS = 4000;

function Countdown() {
  const [remaining, setRemaining] = useState(75);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-xs tabular-nums text-gap">
      {remaining}s
    </span>
  );
}

export function HowItWorks() {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!auto || hovered) return;
    const id = setInterval(() => setStep((s) => (s + 1) % 3), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [auto, hovered]);

  function handleSelect(index: number) {
    setStep(index);
    setAuto(false);
  }

  return (
    <section id="how" className="scroll-mt-24 bg-void py-24 sm:py-32">
      <Container>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="overflow-hidden rounded-window border border-line bg-panel"
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <span className="font-mono text-xs uppercase tracking-wide text-mute">
              Tape · shared
            </span>

            <div className="relative flex items-center gap-5">
              {steps.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  aria-label={`Step ${index + 1}`}
                  aria-current={step === index ? "step" : undefined}
                  onClick={() => handleSelect(index)}
                  className={cn(
                    "w-6 text-center font-mono text-xs tabular-nums transition-colors",
                    step === index ? "text-gap" : "text-mute hover:text-paper",
                  )}
                >
                  {label}
                </button>
              ))}
              <span
                aria-hidden
                className="absolute -bottom-1.5 left-0 h-px w-6 bg-gap transition-transform duration-[280ms] ease-out"
                style={{ transform: `translateX(${step * PAGER_STEP}px)` }}
              />
            </div>

            {step === 2 ? (
              <Countdown />
            ) : (
              <Chip tone="neutral">RTH</Chip>
            )}
          </div>

          <div className="relative h-52 overflow-hidden px-5 py-6">
            {/* 01 — Measure */}
            <div
              className={cn(
                "absolute inset-5 flex flex-col justify-center gap-3 transition-opacity duration-[280ms] ease-out",
                step === 0 ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              {rows.map((row) => (
                <div
                  key={row.ticker}
                  className="flex items-center justify-between font-mono text-sm"
                >
                  <span className="w-14 text-paper">{row.ticker}</span>
                  <div className="flex flex-1 items-center justify-end gap-6 tabular-nums text-mute">
                    <span>cash {formatPrice(row.cash)}</span>
                    <span>token {formatPrice(row.token)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 02 — Haircut */}
            <div
              className={cn(
                "absolute inset-5 flex flex-col justify-center gap-3 transition-opacity duration-[280ms] ease-out",
                step === 1 ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              {rows.map((row) => {
                const selected = row.net !== undefined;
                return (
                  <div key={row.ticker}>
                    <div className="flex items-center justify-between font-mono text-sm">
                      <span className="w-14 text-paper">{row.ticker}</span>
                      <div className="flex flex-1 items-center justify-end gap-4 tabular-nums">
                        <span className="text-mute">
                          {formatPrice(row.cash)}
                        </span>
                        <span className="text-mute">
                          {formatPrice(row.token)}
                        </span>
                        {selected ? (
                          <>
                            <span className="text-mute line-through">
                              {formatBps(row.bps)}
                            </span>
                            <span className="text-gap">
                              net {formatBps(row.net!)}
                            </span>
                          </>
                        ) : (
                          <span
                            className={
                              row.bps < 0 ? "text-gap" : "text-mute"
                            }
                          >
                            {formatBps(row.bps)}
                          </span>
                        )}
                      </div>
                    </div>
                    {selected && (
                      <p className="mt-1 pl-14 font-mono text-xs text-mute">
                        fee {row.fee} · slip {row.slip} · buffer {row.buffer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 03 — Card */}
            <div
              className={cn(
                "absolute inset-5 flex flex-col justify-center gap-3 transition-opacity duration-[280ms] ease-out",
                step === 2 ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              {rows.map((row) => (
                <div key={row.ticker}>
                  <div className="flex items-center justify-between font-mono text-sm">
                    <span className="w-14 text-paper">{row.ticker}</span>
                    <div className="flex flex-1 items-center justify-end gap-6 tabular-nums text-mute">
                      <span>cash {formatPrice(row.cash)}</span>
                      <span>token {formatPrice(row.token)}</span>
                    </div>
                  </div>
                  {row.ticker === "HOOD" && (
                    <div className="mt-2 flex items-center gap-3 pl-14">
                      <Button variant="accent">{`Do it · $${row.tap}`}</Button>
                      <Button variant="ghost">Skip</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-[15px] text-mute">
          {captions[step]}
        </p>
      </Container>
    </section>
  );
}
