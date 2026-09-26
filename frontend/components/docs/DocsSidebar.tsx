"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebar } from "@/config/docs";

function Tree({ pathname }: { pathname: string }) {
  return (
    <>
      {sidebar.map((g) => (
        <div key={g.label}>
          <p className="mb-1.5 ml-3 flex items-center gap-2 font-mono text-[10.5px] font-medium tracking-[0.2em] text-dim uppercase">
            {g.label}
            {g.draft && <span className="doc-draft">DRAFT</span>}
          </p>
          <ul>
            {g.items.map((item) =>
              item.href ? (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={item.href === pathname ? "page" : undefined}
                    className="doc-nl"
                  >
                    {item.label}
                  </Link>
                </li>
              ) : (
                <li key={item.label}>
                  <span className="doc-nl !cursor-default opacity-50 hover:!bg-transparent" aria-disabled="true">
                    {item.label}
                    <span className="ml-auto font-mono text-[10px] text-dim">soon</span>
                  </span>
                </li>
              ),
            )}
          </ul>
        </div>
      ))}
    </>
  );
}

/** Sidebar .side: sticky tree; a collapsible menu below lg. */
export function DocsSidebar() {
  const pathname = usePathname();
  return (
    <>
      <aside aria-label="Docs navigation" className="sticky top-[100px] flex flex-col gap-[22px] self-start max-lg:hidden">
        <Tree pathname={pathname} />
      </aside>
      <details className="mb-2 rounded-inset border border-ink/10 bg-panel lg:hidden">
        <summary className="cursor-pointer px-4 py-3 font-mono text-[12px] tracking-[0.14em] text-ink-2 uppercase">
          Docs menu
        </summary>
        <nav aria-label="Docs navigation" className="flex flex-col gap-4 px-2 pb-4">
          <Tree pathname={pathname} />
        </nav>
      </details>
    </>
  );
}
