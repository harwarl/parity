"use client";

/** Opens the docs search palette. Nav size (300×40) or the large home pill (640×56). */
export function SearchTrigger({ size = "nav" }: { size?: "nav" | "large" }) {
  const large = size === "large";
  const open = () => window.dispatchEvent(new CustomEvent("docs:search"));
  return (
    <button
      type="button"
      onClick={open}
      aria-label="Search docs"
      className={`flex cursor-pointer items-center gap-2.5 rounded-full border border-ink/12 bg-bg text-left text-muted transition-colors hover:border-ink/25 ${
        large ? "h-14 w-full max-w-[640px] px-5 text-[16px]" : "h-10 w-[300px] px-4 text-[14px] max-lg:w-10 max-lg:justify-center max-lg:px-0"
      }`}
    >
      <svg viewBox="0 0 24 24" width={large ? 17 : 15} height={large ? 17 : 15} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-4-4" />
      </svg>
      <span className={`flex-1 ${large ? "" : "max-lg:hidden"}`}>
        {large ? "Search gates, reason codes, events…" : "Search docs"}
      </span>
      <kbd
        className={`rounded-md border border-ink/14 px-2 py-0.5 font-mono font-medium text-dim ${large ? "text-[12px]" : "text-[11px] max-lg:hidden"}`}
      >
        ⌘K
      </kbd>
    </button>
  );
}
