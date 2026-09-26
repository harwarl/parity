import type { Metadata } from "next";
import { ROWS } from "@/lib/gauge/model";
import { LiveClock } from "@/components/app/ui/LiveClock";
import { TopBar } from "@/components/app/shell/TopBar";
import { WatchlistView } from "@/components/app/watchlist/WatchlistView";

export const metadata: Metadata = { title: "Watchlist · GAUGE" };

export default function WatchlistPage() {
  return (
    <>
      <TopBar
        title="Watchlist"
        context={
          <>
            {ROWS.length} names · <b>
              <LiveClock /> ET
            </b>
          </>
        }
        pills={["rth", "cap"]}
      />
      <WatchlistView />
    </>
  );
}
