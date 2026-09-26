"use client";

import { useEffect, useState, type ReactNode } from "react";

export type TocItem = { id: string; label: string };

/**
 * On this page (.toc). The active link follows the section you're reading:
 * the last heading that has scrolled past the top 30% of the viewport.
 */
export function Toc({ items, children }: { items: TocItem[]; children?: ReactNode }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      () => {
        const line = window.innerHeight * 0.3;
        let current = els[0]?.id;
        for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id;
        setActive(current);
      },
      { rootMargin: "0px 0px -60% 0px", threshold: [0, 1] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="sticky top-[100px] self-start max-xl:hidden">
      <p className="mb-3 font-mono text-[10.5px] tracking-[0.2em] text-dim">ON THIS PAGE</p>
      <div className="doc-toc border-l border-ink/8 pl-4">
        {items.map((i) => (
          <a key={i.id} href={`#${i.id}`} data-active={i.id === active ? "" : undefined} aria-current={i.id === active ? "location" : undefined}>
            {i.label}
          </a>
        ))}
      </div>
      {children}
      <div className="mt-6 flex flex-col gap-2 font-mono text-[12px] text-dim">
        {/* Repo links are open placeholders: [DOCS_EDIT_URL], [ISSUES_URL] */}
        <span aria-disabled="true" title="Link pending: [DOCS_EDIT_URL]">Edit this page ↗</span>
        <span aria-disabled="true" title="Link pending: [ISSUES_URL]">Report an issue ↗</span>
      </div>
    </nav>
  );
}
