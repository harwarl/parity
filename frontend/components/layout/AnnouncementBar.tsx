import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

/** 5.0 · 44px paper notice. */
export function AnnouncementBar() {
  return (
    <div
      className="flex min-h-11 items-center justify-center gap-3 border-b border-accent/[.18] px-4 py-2 text-center text-[14px] text-ink-2 max-sm:flex-wrap max-sm:gap-x-2 max-sm:gap-y-1"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(178,212,80,.10), transparent), #0D0F0B",
      }}
    >
      <span className="font-mono text-[11px] tracking-[0.22em] text-accent">PAPER</span>
      <span>Every account starts in paper. Fills at the confirm mid, no money moves.</span>
      <a
        href="#paper"
        className="inline-flex items-center gap-1 font-semibold text-accent hover:text-accent-hover"
      >
        See paper vs live
        <ArrowRightIcon size={14} weight="bold" aria-hidden />
      </a>
    </div>
  );
}
