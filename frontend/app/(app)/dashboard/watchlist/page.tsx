import type { Metadata } from "next";
import { NOW, ROWS } from "@/lib/gauge/model";
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
            {ROWS.length} names · <b>{NOW.time} ET</b>
          </>
        }
        pills={["rth", "cap"]}
      />
      <WatchlistView />
    </>
  );
}
