import type { ReactNode, Ref } from "react";

/** Centered column with responsive gutters. Dense, not airy. */
export default function Container({
  children,
  className = "",
  ref,
}: {
  children: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      className={`mx-auto w-full max-w-[1440px] px-6 sm:px-12 lg:px-16 ${className}`}
    >
      {children}
    </div>
  );
}
