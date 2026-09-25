import type { ReactNode } from "react";

/** Panel header `.ph`: mono label left, meta or pill right. */
export function PanelHead({
  label,
  meta,
  id,
  className = "",
}: {
  label: ReactNode;
  meta?: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <div className={`app-ph ${className}`}>
      <h2 id={id} className="app-ph-label">
        {label}
      </h2>
      {meta && <div className="flex flex-wrap items-center justify-end gap-2">{meta}</div>}
    </div>
  );
}
