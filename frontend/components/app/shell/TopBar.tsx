import type { ReactNode } from "react";
import { Pill } from "@/components/ui/Pill";
import { RthLeft } from "@/components/app/ui/LiveClock";
import { ModeToggle } from "./ModeToggle";

type StatusPill = "rth" | "cap" | "feeds";

type TopBarProps = {
  title: string;
  /** Context label; wrap the --ink part in <b>. */
  context: ReactNode;
  pills?: StatusPill[];
  actions?: ReactNode;
};

/** 80px top bar (design.md §5B.2): H1 + context left; pills, actions, mode toggle right. */
export function TopBar({ title, context, pills = [], actions }: TopBarProps) {
  return (
    <header className="mb-6 flex min-h-20 flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-ink/7 py-4">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="font-display text-[26px] font-bold tracking-[-0.04em] text-ink">{title}</h1>
        <p className="font-mono text-[12px] text-dim [&_b]:font-normal [&_b]:text-ink">{context}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        {pills.includes("rth") && (
          <Pill size="sm" tone="lime" dot="live">
            RTH · <RthLeft /> left
          </Pill>
        )}
        {pills.includes("cap") && <Pill size="sm">Cap 1/3</Pill>}
        {pills.includes("feeds") && <Pill size="sm">Feeds 6/6 OK</Pill>}
        {actions}
        <ModeToggle />
      </div>
    </header>
  );
}
