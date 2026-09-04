import { cn } from "@/lib/cn";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  tone?: "gap" | "rich";
}

export function Switch({ checked, onChange, label, tone = "gap" }: SwitchProps) {
  const trackTone = tone === "rich" ? "bg-rich" : "bg-gap";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-line transition-colors",
        checked ? trackTone : "bg-void",
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 rounded-full bg-paper transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}
