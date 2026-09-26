import type { ReactNode } from "react";
import { reveal } from "@/lib/reveal";

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
      <div className="g-reveal" style={reveal({ x: -40, y: 24 })}>
        <p className="g-eyebrow mb-7">{eyebrow}</p>
        <h2 id={id} className="g-h2">
          {title}
        </h2>
      </div>
      <p className="g-lede g-reveal max-w-[600px]" style={reveal({ x: 40, y: 24, delay: 120 })}>
        {lede}
      </p>
    </div>
  );
}
