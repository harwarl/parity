import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ChipTone = "neutral" | "gap" | "rich" | "halt";

interface ChipProps {
  children: ReactNode;
  tone?: ChipTone;
  dot?: boolean;
}

const toneClasses: Record<ChipTone, string> = {
  neutral: "text-mute border-line",
  gap: "text-gap border-gap/30",
  rich: "text-rich border-rich/30",
  halt: "text-halt border-line",
};

const dotClasses: Record<ChipTone, string> = {
  neutral: "bg-mute",
  gap: "bg-gap",
  rich: "bg-rich",
  halt: "bg-halt",
};

export function Chip({ children, tone = "neutral", dot = false }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-chip border px-2 py-0.5 font-mono text-xs uppercase tracking-wide",
        toneClasses[tone],
      )}
    >
      {dot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", dotClasses[tone])} />
      )}
      {children}
    </span>
  );
}
