"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "@/config/docs";
import { urls } from "@/config/site";
import { Wordmark } from "@/components/shared/Wordmark";
import { Button } from "@/components/ui/Button";
import { SearchTrigger } from "./SearchTrigger";

/** Docs nav .dnav: floating glass pill (design.md §5C.1). */
export function DocsNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Docs"
      className="sticky top-4 z-40 mx-auto mt-4 flex h-[60px] w-[min(1376px,calc(100%-32px))] items-center justify-between gap-4 rounded-full border border-ink/10 pr-2 pl-[22px]"
      style={{
        background: "rgba(12,13,15,.7)",
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
        boxShadow: "0 16px 50px rgba(0,0,0,.45), inset 0 1px 0 rgba(249,247,244,.06)",
      }}
    >
      <div className="flex items-center gap-3.5">
        <Link href="/" aria-label="GAUGE home" className="flex">
          <Wordmark width={96} />
        </Link>
        <Link
          href="/docs"
          className="rounded-full border border-accent/40 px-[9px] py-[3px] font-mono text-[11px] tracking-[0.2em] text-accent"
        >
          DOCS
        </Link>
        <ul className="ml-3 flex items-center gap-[26px] max-md:hidden">
          {docsNav.map((l) => {
            const active = l.match === "guide" && pathname.startsWith("/docs");
            return (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className={`text-[14px] font-medium transition-colors ${active ? "text-accent" : "text-ink-2 hover:text-ink"}`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex items-center gap-2.5">
        <SearchTrigger />
        <Button href={urls.app} size="sm" external className="!h-11 max-sm:hidden">
          Open GAUGE
        </Button>
      </div>
    </nav>
  );
}
