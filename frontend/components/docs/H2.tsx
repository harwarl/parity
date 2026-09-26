import type { ReactNode } from "react";

/** Section heading (.art H2) with optional mono number prefix and DRAFT chip. */
export function H2({ id, n, draft, children }: { id: string; n?: string; draft?: boolean; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="!mt-14 mb-3.5 flex scroll-mt-[100px] flex-wrap items-center gap-x-3 gap-y-1 font-display text-[23px] leading-tight font-semibold tracking-[-0.03em] text-ink"
    >
      {n && <span className="font-mono text-[13px] font-medium tracking-[0.1em] text-accent">{n}</span>}
      {children}
      {draft && <span className="doc-draft">DRAFT</span>}
    </h2>
  );
}
