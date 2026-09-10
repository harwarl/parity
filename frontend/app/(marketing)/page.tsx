import TickerStrip from "@/components/parity/TickerStrip";
import CashTokenPanels from "@/components/sections/CashTokenPanels";
import ClosingLine from "@/components/sections/ClosingLine";
import Hero from "@/components/sections/Hero";
import OneNameTwoPrices from "@/components/sections/OneNameTwoPrices";
import RailsBand from "@/components/sections/RailsBand";
import RejectSection from "@/components/sections/RejectSection";
import Steps from "@/components/sections/Steps";
import TapeSection from "@/components/sections/TapeSection";
import TimelineSection from "@/components/sections/TimelineSection";
import Waitlist from "@/components/sections/Waitlist";

export default function Page() {
  return (
    <main>
      <Hero />
      <TickerStrip />
      <TapeSection />
      <OneNameTwoPrices />
      <CashTokenPanels />
      <Steps />
      <TimelineSection />
      <RejectSection />
      <RailsBand />
      <Waitlist />
      <ClosingLine />
    </main>
  );
}
