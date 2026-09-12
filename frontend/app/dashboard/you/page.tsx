"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import ConsoleHeader from "@/components/layout/ConsoleHeader";
import Icon from "@/components/ui/Icon";
import { TAPE } from "@/lib/parity/universe";

// controls-heavy settings screen — every value here is local UI state only,
// nothing persists or wires to a backend (CLAUDE.md: illustrative unless
// wired to a live tape endpoint).

const MODES = ["Watcher", "Paper", "Live"] as const;
const CLIPS = ["$25", "$50", "$100"] as const;
const MORE_SYMBOLS = ["NFLX", "PLTR", "MSTR"];

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  lockedOptions = [],
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  lockedOptions?: readonly T[];
}) {
  return (
    <div className="inline-flex flex-wrap gap-2">
      {options.map((o) => {
        const locked = lockedOptions.includes(o);
        const active = value === o;
        return (
          <button
            key={o}
            type="button"
            disabled={locked}
            onClick={() => onChange(o)}
            className={[
              "inline-flex h-9 items-center gap-1.5 rounded-md border px-4 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              active
                ? "border-green/50 text-text"
                : "border-line-strong text-text-dim hover:border-text-mute hover:text-text",
            ].join(" ")}
          >
            {locked ? <Icon name="lock" size={12} /> : null}
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Panel({
  eyebrow,
  children,
  className = "",
}: {
  eyebrow: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-line bg-surface p-5 ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-5.5 w-9.5 shrink-0 rounded-full border transition-colors ${
        on ? "border-green/50 bg-green/20" : "border-line-strong bg-surface-2"
      }`}
    >
      <span
        className={`absolute top-0.5 size-4 rounded-full transition-transform ${
          on ? "translate-x-4.5 bg-green" : "translate-x-0.5 bg-text-mute"
        }`}
      />
    </button>
  );
}

export default function DashboardYouPage() {
  const [mode, setMode] = useState<(typeof MODES)[number]>("Paper");
  const [clip, setClip] = useState<(typeof CLIPS)[number]>("$50");
  const [minEdge, setMinEdge] = useState(20);
  const [muted, setMuted] = useState<string[]>(["HOOD"]);
  const [refreshOnOpen, setRefreshOnOpen] = useState(false);

  const universe = TAPE.map((r) => r.symbol);

  const exportEverything = () => {
    const snapshot = {
      mode,
      maxClip: clip,
      perNameCap: "20%",
      minNetEdgeBps: minEdge,
      universe,
      muted,
      nav: 25000,
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tape-settings-sample.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container className="py-8 sm:py-12">
      <ConsoleHeader eyebrow="Settings · policy · connection" heading="You" />

      <div className="mt-8 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Panel eyebrow="Mode">
            <SegmentedControl
              options={MODES}
              value={mode}
              onChange={setMode}
              lockedOptions={["Live"]}
            />
            <p className="mt-3 text-[0.78rem] leading-relaxed text-text-mute">
              Live unlocks when the Trading MCP health check is green. Paper
              stays available for at least 7 days first.
            </p>
          </Panel>

          <Panel eyebrow="Size">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[0.8rem] text-text-dim">Max clip</span>
            </div>
            <div className="mt-2">
              <SegmentedControl options={CLIPS} value={clip} onChange={setClip} />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
              <span className="text-[0.8rem] text-text-mute">Per-name cap</span>
              <span className="tnum text-[0.85rem] text-text-dim">20%</span>
            </div>
          </Panel>
        </div>

        <Panel eyebrow="Universe">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[0.78rem] text-text-mute">
              {universe.length} of 50 names
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {universe.map((s) => (
              <span
                key={s}
                className="tnum rounded-md border border-green/40 px-2.5 py-1 text-[0.78rem] text-text"
              >
                {s}
              </span>
            ))}
            {MORE_SYMBOLS.map((s) => (
              <span
                key={s}
                className="tnum rounded-md border border-line-strong px-2.5 py-1 text-[0.78rem] text-text-mute"
              >
                {s}
              </span>
            ))}
            <span className="tnum rounded-md border border-transparent px-2.5 py-1 text-[0.78rem] text-text-mute">
              + 37 more
            </span>
          </div>
        </Panel>

        <div className="grid gap-6 sm:grid-cols-2">
          <Panel eyebrow="Signal">
            <div className="flex items-center justify-between">
              <span className="text-[0.8rem] text-text-dim">
                Min net edge to card
              </span>
              <span className="tnum text-[0.85rem] text-text">
                {minEdge} bps
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={minEdge}
              onChange={(e) => setMinEdge(Number(e.target.value))}
              className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-green"
            />
            <p className="mt-3 text-[0.78rem] leading-relaxed text-text-mute">
              Below this, TAPE logs a DUST skip instead of showing a card.
            </p>
          </Panel>

          <Panel eyebrow="Mutes">
            {muted.length === 0 ? (
              <p className="text-[0.8rem] text-text-mute">No muted names.</p>
            ) : (
              <div className="space-y-2">
                {muted.map((m) => (
                  <div
                    key={m}
                    className="flex items-center justify-between rounded-md border border-line px-3 py-2"
                  >
                    <span className="text-[0.85rem] text-text">{m}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setMuted((cur) => cur.filter((x) => x !== m))
                      }
                      className="text-[0.78rem] text-green transition-colors hover:text-[#12e888]"
                    >
                      unmute
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-3 text-[0.78rem] leading-relaxed text-text-mute">
              Muted names stay on the shared tape but never card you.
            </p>
          </Panel>
        </div>

        <Panel eyebrow="Connection">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <span className="tnum inline-flex items-center gap-1.5 text-[0.8rem] text-text-mute">
              <span className="size-1.5 rounded-full bg-halt" />
              Trading MCP · not connected
            </span>
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-md border border-line-strong px-4 text-[0.8rem] text-text transition-colors hover:border-text-mute"
            >
              Connect Robinhood Agentic
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[0.8rem] text-text-mute">NAV</span>
              <span className="tnum rounded-md border border-line-strong px-3 py-1.5 text-[0.85rem] text-text-dim">
                $25,000
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Toggle
                on={refreshOnOpen}
                onChange={setRefreshOnOpen}
                label="Refresh NAV on app open"
              />
              <span className="text-[0.8rem] text-text-mute">
                Refresh NAV on app open
              </span>
            </div>
          </div>
          <p className="mt-4 text-[0.78rem] leading-relaxed text-text-mute">
            Live places into the Agentic Account only, never your primary
            Robinhood account. Keys are vaulted and only the exec service can
            read them.
          </p>
        </Panel>

        <div className="rounded-lg border border-halt/40 bg-halt/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[0.78rem] font-medium uppercase tracking-widest text-halt">
                Kill switch
              </p>
              <p className="mt-1.5 max-w-md text-[0.82rem] leading-relaxed text-text-dim">
                Stops all live placement for your account immediately. Paper
                and the tape keep running.
              </p>
            </div>
            <button
              type="button"
              disabled={mode !== "Live"}
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-halt/50 px-4 text-[0.85rem] text-halt transition-colors hover:border-halt disabled:cursor-not-allowed disabled:opacity-40"
            >
              Freeze live
            </button>
          </div>
        </div>

        <Panel eyebrow="Data">
          <div className="flex items-center justify-between gap-4">
            <p className="max-w-md text-[0.82rem] leading-relaxed text-text-dim">
              Everything above, as sample JSON. Nothing here is a live
              account export.
            </p>
            <button
              type="button"
              onClick={exportEverything}
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-line-strong px-4 text-[0.8rem] text-text-dim transition-colors hover:border-text-mute hover:text-text"
            >
              <Icon name="download" size={13} />
              Export everything
            </button>
          </div>
        </Panel>
      </div>
    </Container>
  );
}
