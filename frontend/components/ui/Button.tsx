import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "solid" | "accent" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  // Paper-on-Void — the nav CTA treatment (Linear).
  solid: "bg-paper text-void hover:bg-paper/90",
  // Gap fill — lives only inside a live card ("Do it"). The one loud surface in the system.
  accent: "bg-gap text-void hover:bg-gap/90",
  // Bordered, quiet — "Skip" and secondary actions.
  ghost: "border border-line text-mute hover:text-paper hover:border-mute",
};

export function Button({
  variant = "solid",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
