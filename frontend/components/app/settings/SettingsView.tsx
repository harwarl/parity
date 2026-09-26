"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RULES, WATCHLIST, evaluate } from "@/lib/gauge/model";
import { Panel } from "@/components/ui/Panel";
import { Pill } from "@/components/ui/Pill";
import { ModeToggle } from "@/components/app/shell/ModeToggle";
import { useMode } from "@/components/app/shell/ModeProvider";
import { TopBar } from "@/components/app/shell/TopBar";
import { FieldRow, NumberInput, Switch } from "./Controls";

type Form = {
  floor: string;
  buffer: string;
  maxAge: string;
  minDepth: string;
  cap: number;
  notional: string;
  watch: string[];
  notify: { push: boolean; sound: boolean; email: boolean; stale: boolean };
};

const DEFAULTS: Form = {
  floor: "2.0",
  buffer: "2.0",
  maxAge: "2.0",
  minDepth: "100",
  cap: RULES.cap,
  notional: "100,000",
  watch: WATCHLIST.map((w) => w.sym),
  notify: { push: true, sound: false, email: true, stale: true },
};

const num = (s: string) => Number(s.replace(/,/g, "")) || 0;
const sections = [
  ["mode", "Mode & account"],
  ["gates", "Gates"],
  ["paper", "Paper"],
  ["watchlist", "Watchlist"],
  ["notifications", "Notifications"],
  ["danger", "Danger zone"],
] as const;

function SectionHead({ title, meta, id }: { title: string; meta?: React.ReactNode; id: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-row px-6 py-[18px]">
      <h2 id={id} className="app-ph-label">{title}</h2>
      {meta}
    </div>
  );
}

/** Settings (design.md §5B.9, §5B.12 G): live preview, dirty state, Save / Revert. */
export function SettingsView() {
  const { mode, linked, setLinked, setMode } = useMode();
  const [saved, setSaved] = useState<Form>(DEFAULTS);
  const [form, setForm] = useState<Form>(DEFAULTS);
  const [justSaved, setJustSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  const update = (patch: Partial<Form>) => {
    setForm((f) => ({ ...f, ...patch }));
    setJustSaved(false);
  };
  const changed = (k: keyof Form) => JSON.stringify(form[k]) !== JSON.stringify(saved[k]);

  // Header preview: which watched names would card under these rules, now.
  const carding = useMemo(() => {
    const rules = {
      fees: RULES.fees,
      buffer: num(form.buffer),
      floor: num(form.floor),
      maxAge: num(form.maxAge),
      minDepth: num(form.minDepth),
      cap: form.cap,
    };
    return WATCHLIST.filter((w) => form.watch.includes(w.sym))
      .map((w) => evaluate(w, rules))
      .filter((r) => r.state === "CARD")
      .map((r) => r.sym);
  }, [form]);

  const gateFields: { key: "floor" | "buffer" | "maxAge" | "minDepth"; label: string; help: string; unit: string }[] = [
    { key: "floor", label: "Net floor", help: "Minimum net bps after all costs. Below it: DUST.", unit: "bps" },
    { key: "buffer", label: "Buffer", help: "Safety margin taken off every gap.", unit: "bps" },
    { key: "maxAge", label: "Max quote age", help: "Either leg older than this: STALE.", unit: "s" },
    { key: "minDepth", label: "Min depth", help: "Top-of-book size needed to fill. Below it: THIN.", unit: "$k" },
  ];

  return (
    <>
      <TopBar
        title="Settings"
        context="rules are yours · the model never places"
        actions={
          <>
            {dirty && (
              <span className="inline-flex h-6 items-center rounded-full border border-thin/45 bg-thin/8 px-2.5 font-mono text-[10px] tracking-[0.14em] text-thin uppercase">
                Unsaved changes
              </span>
            )}
            <button
              type="button"
              disabled={!dirty}
              onClick={() => setForm(saved)}
              className="g-btn g-btn-secondary g-btn-xs disabled:cursor-default disabled:opacity-50"
            >
              Revert
            </button>
            <button
              type="button"
              disabled={!dirty && !justSaved}
              onClick={() => {
                setSaved(form);
                setJustSaved(true);
              }}
              className="g-btn g-btn-primary g-btn-xs disabled:cursor-default disabled:opacity-50"
            >
              {justSaved && !dirty ? "Saved ✓" : "Save changes"}
            </button>
          </>
        }
      />

      <div className="grid gap-7 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Settings sections" className="self-start lg:sticky lg:top-6">
          <ul className="flex flex-wrap gap-1 lg:flex-col">
            {sections.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`block rounded-xl px-3 py-2.5 text-[14px] transition-colors hover:bg-ink/5 hover:text-ink ${
                    id === "danger" ? "text-neg/80" : "text-ink-2"
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex min-w-0 flex-col gap-5">
          {/* 1 · Mode & account */}
          <section id="mode" aria-labelledby="h-mode" className="scroll-mt-6">
            <Panel featured>
              <SectionHead id="h-mode" title="Mode & account" />
              <div className="grid items-center gap-4 border-b border-line-row px-6 py-[18px] sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-[16px] font-semibold text-ink">Mode</p>
                  <p className="mt-1 text-[14px] text-muted">
                    Paper fills at the confirm mid. Live places one cash-equity order after you tap Do it.
                  </p>
                </div>
                <ModeToggle />
              </div>
              <div className="grid items-center gap-4 border-b border-line-row px-6 py-[18px] sm:grid-cols-[1fr_auto]">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 flex-none place-items-center rounded-full border border-ink/10 bg-[#1A1D21] font-mono text-[11px] text-ink-2">
                    RH
                  </span>
                  <div>
                    <p className="text-[16px] font-semibold text-ink">Robinhood Agentic Account</p>
                    <p className={`mt-1 font-mono text-[12px] ${linked ? "text-accent" : "text-dim"}`}>
                      {linked ? "Linked via Robinhood Trading MCP · live orders RTH only" : "Not linked · paper only"}
                    </p>
                  </div>
                </div>
                {linked ? (
                  <span className="g-btn g-btn-secondary g-btn-xs" aria-live="polite">Linked ✓</span>
                ) : (
                  <button type="button" onClick={() => setLinked(true)} className="g-btn g-btn-primary g-btn-xs">
                    Link via Trading MCP
                  </button>
                )}
              </div>
              <div className="grid items-center gap-4 px-6 py-[18px] sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-[16px] font-semibold text-ink">Confirm before every order</p>
                  <p className="mt-1 text-[14px] text-muted">Always on. GAUGE has no auto-place setting.</p>
                </div>
                <Pill size="sm" tone="lime">Locked on</Pill>
              </div>
            </Panel>
          </section>

          {/* 2 · Gates */}
          <section id="gates" aria-labelledby="h-gates" className="scroll-mt-6">
            <Panel>
              <SectionHead
                id="h-gates"
                title="Gates"
                meta={
                  <p role="status" className="font-mono text-[12px] text-dim">
                    With these rules, now:{" "}
                    <span className={carding.length ? "text-accent" : "text-ink-2"}>
                      {carding.length ? `${carding.join(", ")} would card` : "no name would card"}
                    </span>
                  </p>
                }
              />
              {gateFields.slice(0, 2).map((f) => (
                <FieldRow key={f.key} id={`f-${f.key}`} label={f.label} help={f.help}>
                  <NumberInput id={`f-${f.key}`} value={form[f.key]} unit={f.unit} changed={changed(f.key)} onChange={(v) => update({ [f.key]: v })} />
                </FieldRow>
              ))}
              <FieldRow id="f-fees" label="Fees (read-only)" help="From the fee schedule. Not editable.">
                <NumberInput id="f-fees" value={RULES.fees.toFixed(1)} unit="bps" readOnly />
              </FieldRow>
              {gateFields.slice(2).map((f) => (
                <FieldRow key={f.key} id={`f-${f.key}`} label={f.label} help={f.help}>
                  <NumberInput id={`f-${f.key}`} value={form[f.key]} unit={f.unit} changed={changed(f.key)} onChange={(v) => update({ [f.key]: v })} />
                </FieldRow>
              ))}
              <FieldRow id="f-cap" label="Daily cap" help="Cards per session. Maximum 3.">
                <div className={`flex items-center justify-end gap-3 ${changed("cap") ? "text-thin" : "text-ink"}`}>
                  <button
                    type="button"
                    aria-label="Decrease daily cap"
                    disabled={form.cap <= 1}
                    onClick={() => update({ cap: form.cap - 1 })}
                    className="grid size-9 cursor-pointer place-items-center rounded-full border border-ink/18 text-[18px] text-ink disabled:cursor-default disabled:opacity-40"
                  >
                    −
                  </button>
                  <output id="f-cap" aria-live="polite" className="w-7 text-center font-display text-[26px] font-bold">
                    {form.cap}
                  </output>
                  <button
                    type="button"
                    aria-label="Increase daily cap"
                    disabled={form.cap >= 3}
                    onClick={() => update({ cap: form.cap + 1 })}
                    className="grid size-9 cursor-pointer place-items-center rounded-full border border-ink/18 text-[18px] text-ink disabled:cursor-default disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </FieldRow>
              <FieldRow id="f-life" label="Card lifetime (read-only)" help="Fixed. A card that isn't tapped in time is gone.">
                <NumberInput id="f-life" value={String(RULES.cardLife)} unit="s" readOnly />
              </FieldRow>
            </Panel>
          </section>

          {/* 3 · Paper */}
          <section id="paper" aria-labelledby="h-paper" className="scroll-mt-6">
            <Panel>
              <SectionHead id="h-paper" title="Paper" />
              <FieldRow id="f-notional" label="Notional per card" help="Used to turn captured bps into paper P&L.">
                <NumberInput id="f-notional" value={form.notional} unit="USD" changed={changed("notional")} onChange={(v) => update({ notional: v })} />
              </FieldRow>
              <div className="grid items-center gap-4 px-6 py-[18px] sm:grid-cols-[1fr_200px]">
                <div>
                  <p className="text-[16px] font-semibold text-ink">Paper ledger</p>
                  <p className="mt-1 text-[14px] text-muted">13 closed cards · since Mon 22 Sep</p>
                </div>
                <Link href="/dashboard/history" className="g-btn g-btn-secondary g-btn-xs">
                  Open history
                </Link>
              </div>
            </Panel>
          </section>

          {/* 4 · Watchlist */}
          <section id="watchlist" aria-labelledby="h-watch" className="scroll-mt-6">
            <Panel>
              <SectionHead
                id="h-watch"
                title={`Watchlist · ${form.watch.length}`}
                meta={<span className="app-meta">Robinhood Chain stock tokens · [LIST_TBD]</span>}
              />
              <ul className="flex flex-wrap gap-2 px-6 py-5">
                {form.watch.map((sym) => (
                  <li
                    key={sym}
                    className="flex h-[34px] items-center gap-2 rounded-full border border-ink/12 bg-[#0F1113] pr-2 pl-3.5 font-mono text-[13px] font-medium text-ink"
                  >
                    {sym}
                    <button
                      type="button"
                      aria-label={`Remove ${sym}`}
                      onClick={() => update({ watch: form.watch.filter((s) => s !== sym) })}
                      className="grid size-5 cursor-pointer place-items-center rounded-full bg-ink/5 text-[11px] text-dim hover:bg-neg/15 hover:text-neg"
                    >
                      ✕
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => update({ watch: WATCHLIST.map((w) => w.sym) })}
                    className="h-[34px] cursor-pointer rounded-full border border-dashed border-ink/25 px-4 font-mono text-[13px] text-muted hover:border-accent/60 hover:text-accent"
                  >
                    + Add name
                  </button>
                </li>
              </ul>
            </Panel>
          </section>

          {/* 5 · Notifications */}
          <section id="notifications" aria-labelledby="h-notify" className="scroll-mt-6">
            <Panel>
              <SectionHead id="h-notify" title="Notifications" />
              {(
                [
                  ["push", "Push on new card", "A card lasts 75 s. Get it on your phone."],
                  ["sound", "Sound on new card", "Short chime in the browser tab."],
                  ["email", "Daily summary email", "Cards, outcomes and paper P&L after the close."],
                  ["stale", "Alert on stale feed", "When either leg goes older than max quote age."],
                ] as const
              ).map(([key, label, help]) => (
                <FieldRow key={key} id={`n-${key}`} label={label} help={help}>
                  <div className="flex justify-end">
                    <Switch
                      id={`n-${key}`}
                      label={label}
                      on={form.notify[key]}
                      onChange={(v) => update({ notify: { ...form.notify, [key]: v } })}
                    />
                  </div>
                </FieldRow>
              ))}
            </Panel>
          </section>

          {/* 6 · Danger zone */}
          <section id="danger" aria-labelledby="h-danger" className="scroll-mt-6">
            <Panel className="!border-neg/30 hover:!border-neg/45 hover:!shadow-none">
              <SectionHead id="h-danger" title="Danger zone" />
              <div className="grid items-center gap-4 border-b border-line-row px-6 py-[18px] sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-[16px] font-semibold text-ink">Reset paper ledger</p>
                  <p className="mt-1 text-[14px] text-muted">
                    {resetDone ? "Reset requested. It applies once the ledger service is connected." : "Clears 13 paper cards and P&L. Live history is untouched."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirmReset) {
                      setResetDone(true);
                      setConfirmReset(false);
                    } else setConfirmReset(true);
                  }}
                  onBlur={() => setConfirmReset(false)}
                  className="g-btn g-btn-danger g-btn-xs"
                >
                  {confirmReset ? "Click again to reset" : "Reset paper"}
                </button>
              </div>
              <div className="grid items-center gap-4 px-6 py-[18px] sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-[16px] font-semibold text-ink">Unlink Agentic Account</p>
                  <p className="mt-1 text-[14px] text-muted">GAUGE drops back to paper. Nothing in your account changes.</p>
                </div>
                <button
                  type="button"
                  disabled={!linked}
                  onClick={() => {
                    setLinked(false);
                    if (mode === "live") setMode("paper");
                  }}
                  className="g-btn g-btn-danger g-btn-xs disabled:cursor-default disabled:opacity-40"
                >
                  Unlink
                </button>
              </div>
            </Panel>
          </section>
        </div>
      </div>
    </>
  );
}
