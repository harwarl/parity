import type { ReactNode } from "react";

type Variant = "accent" | "neutral" | "danger" | "halt";

const variantClasses: Record<Variant, string> = {
  accent: "text-accent border-accent/30 bg-accent-dim",
  neutral: "text-muted border-border-strong bg-surface-raised",
  danger: "text-danger border-danger/30 bg-danger-dim",
  halt: "text-halt border-halt/40 bg-halt-dim",
};

export function Tag({
  children,
  variant = "neutral",
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={`font-mono inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wider ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
