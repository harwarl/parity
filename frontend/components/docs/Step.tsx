import type { ReactNode } from "react";

/** Quickstart step: 36px number badge + section; the number shows once. */
export function Step({ n, id, title, children }: { n: string; id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="!mt-14 grid grid-cols-[40px_1fr] gap-[18px]">
      <span className="grid size-9 place-items-center rounded-full border border-accent/50 bg-accent/8 font-mono text-[13px] font-semibold text-accent">
        {n}
      </span>
      <div className="art min-w-0">
        <h2
          id={id}
          className="mb-3.5 scroll-mt-[100px] pt-1 font-display text-[23px] leading-tight font-semibold tracking-[-0.03em] text-ink"
        >
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
