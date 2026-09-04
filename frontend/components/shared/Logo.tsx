import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-sans text-lg font-semibold tracking-tight text-paper",
        className,
      )}
    >
      PARITY
    </span>
  );
}
