import type { ReactNode } from "react";

/** Path chip for UI paths ("Settings → Gates"). */
export function Path({ children }: { children: ReactNode }) {
  return <span className="doc-path">{children}</span>;
}
