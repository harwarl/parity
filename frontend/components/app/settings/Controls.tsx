"use client";

import type { ReactNode } from "react";

/** Settings field row: label + help left, 200px control right (design.md §5B.9). */
export function FieldRow({
  id,
  label,
  help,
  children,
}: {
  id: string;
  label: string;
  help: string;
  children: ReactNode;
}) {
  return (
    <div className="grid items-center gap-4 border-b border-line-row px-6 py-[18px] last:border-b-0 sm:grid-cols-[1fr_200px]">
      <div>
        <label htmlFor={id} className="text-[16px] font-semibold text-ink">
          {label}
        </label>
        <p className="mt-1 text-[14px] text-muted">{help}</p>
      </div>
      {children}
    </div>
  );
}

/** 46px mono input, right-aligned, unit suffix. Amber when changed; 60% when read-only. */
export function NumberInput({
  id,
  value,
  unit,
  onChange,
  changed = false,
  readOnly = false,
}: {
  id: string;
  value: string;
  unit: string;
  onChange?: (v: string) => void;
  changed?: boolean;
  readOnly?: boolean;
}) {
  return (
    <div
      className={`flex h-[46px] items-center rounded-xl border bg-bg px-3.5 focus-within:border-accent/60 ${
        changed ? "border-thin" : "border-ink/14"
      } ${readOnly ? "opacity-60" : ""}`}
    >
      <input
        id={id}
        inputMode="decimal"
        value={value}
        readOnly={readOnly}
        aria-readonly={readOnly}
        onChange={(e) => onChange?.(e.target.value.replace(/[^0-9.,]/g, ""))}
        className="w-full min-w-0 bg-transparent text-right font-mono text-[15px] text-ink outline-none"
      />
      <span className="ml-2 font-mono text-[12px] text-dim">{unit}</span>
    </div>
  );
}

/** 46 × 28 switch, role="switch". */
export function Switch({ id, on, onChange, label }: { id: string; on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-7 w-[46px] flex-none cursor-pointer rounded-full transition-colors duration-200 ${
        on ? "bg-ink" : "bg-track shadow-[inset_0_0_0_1px_rgba(249,247,244,.14)]"
      }`}
    >
      <span
        className={`absolute top-[3px] size-[22px] rounded-full transition-[left] duration-200 ${
          on ? "left-[21px] bg-accent-ink" : "left-[3px] bg-dim"
        }`}
      />
    </button>
  );
}
