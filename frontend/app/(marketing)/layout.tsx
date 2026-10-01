import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { DotField } from "@/components/shared/DotField";
import { EdgeGlows } from "@/components/shared/EdgeGlows";
import { MotionGate } from "@/components/shared/MotionGate";
import { RevealObserver } from "@/components/shared/RevealObserver";

/**
 * Root is overflow:clip (never hidden) so the sticky nav keeps working, and
 * `isolate` (the spec's .g-page) so the dot field can sit at z-index −1
 * under all content. Keep transform/filter off this root and DotField's
 * other ancestors, or its position:fixed breaks.
 */
export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative isolate overflow-clip">
      <DotField />
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
