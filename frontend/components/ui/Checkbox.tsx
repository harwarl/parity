import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-left"
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
          checked ? "border-gap bg-gap" : "border-line bg-transparent",
        )}
      >
        {checked && <Check size={11} strokeWidth={3} className="text-void" />}
      </span>
      <span className="font-mono text-xs text-paper">{label}</span>
    </button>
  );
}
