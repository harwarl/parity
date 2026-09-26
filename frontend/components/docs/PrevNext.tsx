import Link from "next/link";

/** Prev/next panels at the foot of an article. */
export function PrevNext({ prev, next }: { prev: { label: string; href: string }; next: { label: string; href: string } }) {
  const card = "doc-plain doc-edge block rounded-2xl border border-line bg-[linear-gradient(180deg,#131519,#0F1113)] px-5 py-[18px]";
  return (
    <nav aria-label="Previous and next" className="!mt-12 grid gap-3.5 sm:grid-cols-2">
      <Link href={prev.href} className={card}>
        <span className="block font-mono text-[11px] text-dim">← PREVIOUS</span>
        <span className="mt-1 block text-[16px] font-semibold text-ink">{prev.label}</span>
      </Link>
      <Link href={next.href} className={`${card} sm:text-right`}>
        <span className="block font-mono text-[11px] text-dim">NEXT →</span>
        <span className="mt-1 block text-[16px] font-semibold text-ink">{next.label}</span>
      </Link>
    </nav>
  );
}
