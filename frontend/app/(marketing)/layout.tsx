import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { EdgeGlows } from "@/components/shared/EdgeGlows";
import { MotionGate } from "@/components/shared/MotionGate";
import { RevealObserver } from "@/components/shared/RevealObserver";

/** Root is overflow:clip (never hidden) so the sticky nav keeps working. */
export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative isolate overflow-clip">
      <EdgeGlows />
      <AnnouncementBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <MotionGate />
      <RevealObserver />
    </div>
  );
}
