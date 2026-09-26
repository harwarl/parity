/*
 * GAUGE docs · design dials: VARIANCE 3 / MOTION 2 / DENSITY 5.
 * Read mode, "calm reading mode" (design.md §5C): same tokens, dialled down.
 * Motion only where animations.md §6C allows it (K1–K7).
 */
import { DocsNav } from "@/components/docs/DocsNav";
import { DocsSearch } from "@/components/docs/DocsSearch";

export default function DocsLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative isolate min-h-screen overflow-clip bg-bg">
      <DocsNav />
      {children}
      <DocsSearch />
    </div>
  );
}
