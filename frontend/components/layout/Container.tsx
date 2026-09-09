import type { ReactNode } from "react";

/** Centered column with responsive gutters. Dense, not airy. */
export default function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[84rem] px-6 sm:px-10 ${className}`}>
      {children}
    </div>
  );
}
