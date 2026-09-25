import type { ReactNode } from "react";

type DataRowProps = {
  label: ReactNode;
  value: ReactNode;
  tone?: "ink" | "lime" | "neg";
  className?: string;
};

const toneClass = {
  ink: "",
  lime: "!text-accent",
  neg: "!text-neg",
} as const;

/** Mono 13 row: label muted left, value right. */
export function DataRow({ label, value, tone = "ink", className = "" }: DataRowProps) {
  return (
    <div className={`g-row ${className}`}>
      <span>{label}</span>
      <span className={toneClass[tone]}>{value}</span>
    </div>
  );
}
