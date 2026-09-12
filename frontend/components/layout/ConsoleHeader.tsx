import type { ReactNode } from "react";

/** Shared header for each dashboard screen: eyebrow, heading, right-aligned meta. */
export default function ConsoleHeader({
  eyebrow,
  heading,
  meta,
}: {
  eyebrow: string;
  heading: string;
  meta?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-line pb-6">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 text-[1.5rem] font-medium tracking-[-0.02em] text-text sm:text-[1.8rem]">
          {heading}
        </h1>
      </div>
      {meta ? (
        <div className="tnum flex flex-wrap items-center gap-2 text-[0.78rem] text-text-mute">
          {meta}
        </div>
      ) : null}
    </div>
  );
}
