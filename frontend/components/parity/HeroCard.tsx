"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatBps, formatUsd } from "@/lib/format";

const TTL_SECONDS = 75;

export function HeroCard() {
  const [ttl, setTtl] = useState(TTL_SECONDS);

  useEffect(() => {
    const id = setInterval(() => {
      setTtl((t) => (t <= 1 ? TTL_SECONDS : t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full max-w-xl">
      <Card className="p-7">
        <div className="flex items-center justify-between text-[11px] text-muted">
          <span className="font-mono uppercase tracking-wider">
            Parity card · HOOD
          </span>
          <span className="flex items-center gap-2 font-mono">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {ttl}s
          </span>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-dim">
              01 · Monitor
            </span>
            <div className="mt-2 flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-md border border-border-strong bg-surface-raised px-2.5 py-1.5 text-xs text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-muted" />
                HOOD · cash
              </span>
              <span className="flex-1 border-t border-dashed border-border-strong" />
              <span className="flex items-center gap-1.5 rounded-md border border-border-strong bg-surface-raised px-2.5 py-1.5 text-xs text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                HOOD · token
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-halt">
                gap?
              </span>
            </div>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-dim">
              02 · Gap, after haircut
            </span>
            <div className="mt-2 rounded-lg border border-accent/30 bg-accent-dim p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">cash {formatUsd(28.41)}</span>
                <span className="text-muted">token {formatUsd(28.37)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-accent/20 pt-2">
                <span className="flex items-center gap-1.5 text-xs text-foreground">
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-[9px] text-background">
                    ✓
                  </span>
                  clears haircut
                </span>
                <span className="font-mono text-sm font-semibold text-accent">
                  {formatBps(-14)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-dim">
              03 · Confirm re-quotes
            </span>
            <div className="mt-2 space-y-1.5 font-mono text-xs">
              {[0, 1, 2].map((i) => {
                const price = 28.39 + Math.sin((ttl - i * 5) / 10) * 0.03;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-md bg-surface-raised px-3 py-2"
                  >
                    <span className="text-muted">re-quote {i + 1}</span>
                    <span className="text-foreground">
                      {formatUsd(price)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Button variant="primary" className="flex-1">
                Do it · {formatUsd(15)}
              </Button>
              <Button variant="secondary">Skip</Button>
            </div>
            <p className="mt-2 text-[11px] text-muted-dim">
              You confirm. The model never places.
            </p>
          </div>
        </div>
      </Card>

      <p className="mt-4 text-xs leading-relaxed text-muted-dim">
        Gap survives fees, slip, and session. Confirm re-quotes — stale on
        confirm, and it&rsquo;s dead. No gap, no card. Paper first; live is
        equity-only, in the ring-fenced account.
      </p>
    </div>
  );
}
