"use client";

import { useEffect, useRef, useState } from "react";
import { highlight, type Lang } from "@/lib/highlight";

/** Code block .code (design.md §5C.3). Copy → "Copied ✓" for 1.6 s (K6). */
export function CodeBlock({
  code,
  lang,
  title,
  draft = true,
}: {
  code: string;
  lang: Lang;
  title: string;
  draft?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // clipboard blocked: still acknowledge; the text is selectable
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="overflow-hidden rounded-inset border border-ink/9 bg-[#0C0D10]">
      <div className="flex h-10 items-center justify-between gap-3 border-b border-ink/7 px-4">
        <span className="flex items-center gap-2.5 font-mono text-[11.5px] font-medium text-dim">
          {title}
          {draft && <span className="doc-draft">DRAFT</span>}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : `Copy ${title}`}
          className="h-[26px] cursor-pointer rounded-full border border-ink/14 px-3 font-mono text-[11px] text-ink-2 hover:border-ink/30 hover:text-ink"
        >
          <span aria-live="polite">{copied ? "Copied ✓" : "Copy"}</span>
        </button>
      </div>
      <pre className="overflow-x-auto px-[18px] py-4 font-mono text-[13.5px] leading-[1.75] whitespace-pre text-ink-2">
        <code>
          {highlight(code, lang).map((tok, i) =>
            tok.c ? (
              <span key={i} className={`tok-${tok.c}`}>
                {tok.t}
              </span>
            ) : (
              tok.t
            ),
          )}
        </code>
      </pre>
    </div>
  );
}
