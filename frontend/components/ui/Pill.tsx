import type { ReactNode } from "react";
import { LiveDot } from "@/components/shared/LiveDot";

type PillProps = {
  children: ReactNode;
  tone?: "default" | "lime";
  size?: "md" | "sm";
  /** "live" = lime ping dot; "static" = cream dot at 70%. */
  dot?: "live" | "static";
  className?: string;
};

export function Pill({ children, tone = "default", size = "md", dot, className = "" }: PillProps) {
  return (
    <span
      className={`g-pill ${tone === "lime" ? "g-pill-lime" : ""} ${size === "sm" ? "g-pill-sm" : ""} ${className}`}
    >
      {dot === "live" && <LiveDot />}
      {dot === "static" && (
        <span aria-hidden className="size-1.5 flex-none rounded-full bg-ink/70" />
      )}
      {children}
    </span>
  );
}
