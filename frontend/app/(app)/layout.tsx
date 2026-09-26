/*
 * GAUGE app shell · design dials: VARIANCE 3 / MOTION 3 / DENSITY 8.
 * Operate mode: motion only signals state or liveness (animations.md §6B).
 */
import { AppRail } from "@/components/app/shell/AppRail";
import { LiveMarketProvider } from "@/components/app/shell/LiveMarketProvider";
import { ModeProvider } from "@/components/app/shell/ModeProvider";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <ModeProvider>
      <LiveMarketProvider>
      <div className="flex min-h-screen bg-bg">
        <AppRail />
        <main className="min-w-0 flex-1 px-4 pb-24 sm:px-8 md:pb-14">{children}</main>
      </div>
      </LiveMarketProvider>
    </ModeProvider>
  );
}
