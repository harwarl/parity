import type { ReactNode } from "react";

type SectionHeaderProps = {
  /** "01 · How it works" */
  eyebrow: string;
  /** H2 content; wrap the one Doto word in <span className="g-dot">. */
  title: ReactNode;
  lede: ReactNode;
  id?: string;
};

/**
 * Sections 4–7 header (design.md §5): grid 1fr 1fr, gap 80, align end, mb 56.
 * Left: eyebrow + H2. Right: lede.
 */
export function SectionHeader({ eyebrow, title, lede, id }: SectionHeaderProps) {
  return (
    <div className="mb-14 grid items-end gap-8 lg:grid-cols-2 lg:gap-20">
      <div>
        <p className="g-eyebrow mb-7">{eyebrow}</p>
        <h2 id={id} className="g-h2">
          {title}
        </h2>
      </div>
      <p className="g-lede max-w-[600px]">{lede}</p>
    </div>
  );
}
