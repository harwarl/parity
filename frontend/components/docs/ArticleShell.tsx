import type { ReactNode } from "react";
import { DocsSidebar } from "./DocsSidebar";
import { Toc, type TocItem } from "./Toc";

/** Article layout: 248px sidebar · 720px reading column · 220px TOC, gap 56. */
export function ArticleShell({ toc, tocExtra, children }: { toc: TocItem[]; tocExtra?: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto grid w-[min(1300px,calc(100%-32px))] gap-14 pt-12 pb-24 lg:grid-cols-[248px_minmax(0,1fr)] xl:grid-cols-[248px_minmax(0,720px)_220px]">
      <DocsSidebar />
      <article className="art min-w-0">{children}</article>
      <Toc items={toc}>{tocExtra}</Toc>
    </div>
  );
}
