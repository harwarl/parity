/*
 * GAUGE landing · design read: dark-tech fintech landing for active retail
 * traders, rule-like voice, lime-on-near-black, data-viz as the visual.
 * Page dials: VARIANCE 7 / MOTION 7 / DENSITY 4. Source of truth:
 * references/*.png, design.md, animations.md.
 */
import { ClosingCta } from "@/components/sections/ClosingCta";
import { TickerStrip } from "@/components/sections/TickerStrip";
import { TheCard } from "@/components/sections/card/TheCard";
import { Faq } from "@/components/sections/faq/Faq";
import { Hero } from "@/components/sections/hero/Hero";
import { HowItWorks } from "@/components/sections/how/HowItWorks";
import { PaperVsLive } from "@/components/sections/paper/PaperVsLive";
import { ReasonCodes } from "@/components/sections/reasons/ReasonCodes";
import { WontDo } from "@/components/sections/wont/WontDo";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <TickerStrip />
      <HowItWorks />
      <TheCard />
      <ReasonCodes />
      <PaperVsLive />
      <WontDo />
      <Faq />
      <ClosingCta />
    </>
  );
}
