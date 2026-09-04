"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { universeTickers, defaultPolicy } from "@/lib/dashboard-data";
import type { PolicyMode, PolicySettings } from "@/types/tape";

const clipOptions = [
  { value: "25" as const, label: "$25" },
  { value: "50" as const, label: "$50" },
  { value: "100" as const, label: "$100" },
];

const modeOptions: { value: PolicyMode; label: string; disabled?: boolean }[] = [
  { value: "watcher", label: "Watcher" },
  { value: "paper", label: "Paper" },
  { value: "live", label: "Live", disabled: true },
];

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 border-b border-line px-5 py-4 last:border-b-0 sm:grid-cols-[160px_1fr] sm:items-center sm:gap-4">
      <div>
        <p className="text-sm text-paper">{label}</p>
        {hint && <p className="mt-0.5 font-mono text-xs text-mute">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function PolicyTab() {
  const [policy, setPolicy] = useState<PolicySettings>(defaultPolicy);

  function toggleTicker(ticker: string) {
    setPolicy((current) => ({
      ...current,
      universe: current.universe.includes(ticker)
        ? current.universe.filter((t) => t !== ticker)
        : [...current.universe, ticker],
    }));
  }

  return (
    <div>
      <Field label="Universe" hint="Top 10 names eligible for a card.">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-5">
          {universeTickers.map((ticker) => (
            <Checkbox
              key={ticker}
              label={ticker}
              checked={policy.universe.includes(ticker)}
              onChange={() => toggleTicker(ticker)}
            />
          ))}
        </div>
      </Field>

      <Field label="Clip size" hint="Per-card size after haircut.">
        <SegmentedControl
          options={clipOptions}
          value={String(policy.clipSize) as "25" | "50" | "100"}
          onChange={(value) =>
            setPolicy((current) => ({
              ...current,
              clipSize: Number(value) as PolicySettings["clipSize"],
            }))
          }
        />
      </Field>

      <Field label="Name %" hint="Max share of daily cap per name.">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={5}
            max={50}
            step={5}
            value={policy.namePct}
            onChange={(event) =>
              setPolicy((current) => ({
                ...current,
                namePct: Number(event.target.value),
              }))
            }
            className="h-1 w-40 accent-gap"
          />
          <span className="font-mono text-sm tabular-nums text-paper">
            {policy.namePct}%
          </span>
        </div>
      </Field>

      <Field label="Mute until" hint="Pause new cards until this time.">
        <input
          type="time"
          value={policy.muteUntil}
          onChange={(event) =>
            setPolicy((current) => ({
              ...current,
              muteUntil: event.target.value,
            }))
          }
          className="rounded-chip border border-line bg-void px-3 py-1.5 font-mono text-sm text-paper outline-none focus:border-mute"
        />
      </Field>

      <Field label="Quiet hours" hint="No cards fire in this window.">
        <div className="flex items-center gap-2 font-mono text-sm text-paper">
          <input
            type="time"
            value={policy.quietHoursStart}
            onChange={(event) =>
              setPolicy((current) => ({
                ...current,
                quietHoursStart: event.target.value,
              }))
            }
            className="rounded-chip border border-line bg-void px-3 py-1.5 outline-none focus:border-mute"
          />
          <span className="text-mute">to</span>
          <input
            type="time"
            value={policy.quietHoursEnd}
            onChange={(event) =>
              setPolicy((current) => ({
                ...current,
                quietHoursEnd: event.target.value,
              }))
            }
            className="rounded-chip border border-line bg-void px-3 py-1.5 outline-none focus:border-mute"
          />
        </div>
      </Field>

      <Field label="Mode" hint="Live stays locked until MCP is green.">
        <div className="flex items-center gap-3">
          <SegmentedControl
            options={modeOptions}
            value={policy.mode}
            onChange={(value) =>
              setPolicy((current) => ({ ...current, mode: value }))
            }
          />
          <Lock size={13} className="text-mute" />
        </div>
      </Field>
    </div>
  );
}
