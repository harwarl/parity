import type { Metadata } from "next";
import { NOW } from "@/lib/gauge/model";
import { CountdownProvider } from "@/components/app/shell/CountdownProvider";
import { LiveStrip } from "@/components/app/shell/LiveStrip";
import { TopBar } from "@/components/app/shell/TopBar";
import { ActiveCardModule } from "@/components/app/home/ActiveCardModule";
import { ActivityFeed } from "@/components/app/home/ActivityFeed";
import { GapBoard } from "@/components/app/home/GapBoard";
import { GatesModule } from "@/components/app/home/GatesModule";
import { OutcomesModule } from "@/components/app/home/OutcomesModule";
import { PerformanceModule } from "@/components/app/home/PerformanceModule";
import { RouteModule } from "@/components/app/home/RouteModule";
import { SessionTimeline } from "@/components/app/home/SessionTimeline";
import { SystemHealth } from "@/components/app/home/SystemHealth";
import { TodayModule } from "@/components/app/home/TodayModule";

export const metadata: Metadata = { title: "Home · GAUGE" };

/** Home (design.md §5B.4): four rows, 20px gaps. */
export default function HomePage() {
  return (
    <CountdownProvider>
      <TopBar
        title="Home"
        context={
          <>
            {NOW.day} · <b>{NOW.time} ET</b>
          </>
        }
        pills={["rth", "cap", "feeds"]}
      />
      <LiveStrip />
      <div className="flex flex-col gap-5">
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-[5fr_4fr_3fr]">
          <ActiveCardModule />
          <GatesModule />
          <TodayModule />
        </div>
        <GapBoard />
        <div className="grid gap-5 xl:grid-cols-[8fr_4fr]">
          <PerformanceModule />
          <OutcomesModule />
        </div>
        <div className="grid gap-5 lg:grid-cols-[4fr_5fr_3fr]">
          <SessionTimeline />
          <SystemHealth />
          <ActivityFeed />
          <RouteModule />
        </div>
      </div>
    </CountdownProvider>
  );
}
