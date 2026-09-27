/*
 * GAUGE app shell · design dials: VARIANCE 3 / MOTION 3 / DENSITY 8.
 * Operate mode: motion only signals state or liveness (animations.md §6B).
 * GaugeProvider is the one connection to gauge-api; everything below reads
 * it, falling back to design.md sample data when the API is offline.
 */
import { AppRail } from "@/components/app/shell/AppRail";
import { GaugeProvider } from "@/components/app/shell/GaugeProvider";
import { LiveMarketProvider } from "@/components/app/shell/LiveMarketProvider";
import { ModeProvider } from "@/components/app/shell/ModeProvider";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <GaugeProvider>
      <ModeProvider>
        <LiveMarketProvider>
          <div className="flex min-h-screen bg-bg">
            <AppRail />
            <main className="min-w-0 flex-1 px-4 pb-24 sm:px-8 md:pb-14">{children}</main>
          </div>
        </LiveMarketProvider>
      </ModeProvider>
    </GaugeProvider>
  );
}
