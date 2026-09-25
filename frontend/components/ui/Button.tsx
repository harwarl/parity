import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ink" | "outline-ink";

type ButtonProps = ComponentProps<"a"> & {
  variant?: Variant;
  size?: "md" | "sm";
  /** Trailing ↗ for links that leave the page (Open GAUGE). */
  external?: boolean;
};

const variantClass: Record<Variant, string> = {
  primary: "g-btn-primary",
  secondary: "g-btn-secondary",
  ink: "g-btn-ink",
  "outline-ink": "g-btn-outline-ink",
};

export function Button({
  variant = "primary",
  size = "md",
  external = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <a
      className={`g-btn ${variantClass[variant]} ${size === "sm" ? "g-btn-sm" : ""} ${className}`}
      {...props}
    >
      {children}
      {external && <ArrowUpRightIcon size={18} weight="light" aria-hidden />}
    </a>
  );
}
