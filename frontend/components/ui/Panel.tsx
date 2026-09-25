import type { ComponentProps } from "react";

type PanelProps = ComponentProps<"div"> & {
  /** Lime-edged featured panel. At most one per row. */
  featured?: boolean;
};

export function Panel({ featured = false, className = "", children, ...props }: PanelProps) {
  return (
    <div className={`g-panel ${featured ? "g-feat" : ""} ${className}`} {...props}>
      {children}
    </div>
  );
}
