import type { ReactNode } from "react";

/** Breadcrumb, H1, lede and meta row for an article. */
export function ArticleHeader({
  crumbs,
  title,
  lede,
  meta,
}: {
  crumbs: string[];
  title: string;
  lede: ReactNode;
  meta: string[];
}) {
  return (
    <header className="border-b border-ink/8 pb-7">
      <nav aria-label="Breadcrumb" className="mb-[18px] font-mono text-[12px] text-dim">
        {crumbs.map((c, i) => (
          <span key={c}>
            {i > 0 && <span className="mx-2">/</span>}
            <span className={i === crumbs.length - 1 ? "text-ink" : ""}>{c}</span>
          </span>
        ))}
      </nav>
      <h1 className="font-display text-[40px] leading-[1.08] font-bold tracking-[-0.045em] text-ink max-sm:text-[32px]">
        {title}
      </h1>
      <p className="mt-4 mb-5 text-[19px] leading-[1.6] text-muted">{lede}</p>
      <p className="font-mono text-[12px] text-dim">{meta.join(" · ")}</p>
    </header>
  );
}
