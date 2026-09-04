import { cn } from "@/lib/cn";

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string; disabled?: boolean }[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="inline-flex items-center gap-1 rounded-chip border border-line bg-void p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          disabled={option.disabled}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-[6px] px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40",
            value === option.value
              ? "bg-paper text-void"
              : "text-mute hover:text-paper",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
