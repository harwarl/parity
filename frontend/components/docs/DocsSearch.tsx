"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { searchIndex } from "@/config/docs";

/**
 * ⌘K palette over the docs pages and their sections. Opens on ⌘K / Ctrl-K
 * or a "docs:search" event from any SearchTrigger. Esc closes.
 */
export function DocsSearch() {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const open = () => {
      setQ("");
      setActive(0);
      dialog.current?.showModal();
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("docs:search", open);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("docs:search", open);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t
      ? searchIndex.filter((r) => `${r.title} ${r.section ?? ""}`.toLowerCase().includes(t))
      : searchIndex;
  }, [q]);

  const go = (href: string) => {
    dialog.current?.close();
    router.push(href);
  };

  return (
    <dialog
      ref={dialog}
      aria-label="Search docs"
      className="fixed inset-x-0 top-[12vh] m-auto w-[min(640px,calc(100vw-32px))] rounded-[20px] border border-ink/12 bg-panel p-0 text-ink shadow-[0_30px_90px_rgba(0,0,0,.6)] backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
    >
      <div className="flex items-center gap-3 border-b border-ink/8 px-5">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#80848A" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <input
          autoFocus
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter" && results[active]) go(results[active].href);
          }}
          placeholder="Search gates, reason codes, events…"
          aria-label="Search docs"
          role="combobox"
          aria-expanded="true"
          aria-controls="docs-search-results"
          className="h-14 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-dim"
        />
        <kbd className="rounded-md border border-ink/14 px-2 py-0.5 font-mono text-[11px] text-dim">esc</kbd>
      </div>
      <ul id="docs-search-results" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
        {results.length === 0 && <li className="px-4 py-6 text-center text-[14px] text-muted">No matches for “{q}”.</li>}
        {results.map((r, i) => (
          <li key={r.href + r.title} role="option" aria-selected={i === active}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onClick={() => go(r.href)}
              className={`flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl px-4 py-2.5 text-left ${
                i === active ? "bg-accent/10 text-accent" : "text-ink-2"
              }`}
            >
              <span className="text-[14.5px]">{r.title}</span>
              <span className="font-mono text-[11px] text-dim">{r.section ?? "Page"}</span>
            </button>
          </li>
        ))}
      </ul>
    </dialog>
  );
}
