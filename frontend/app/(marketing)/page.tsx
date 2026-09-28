/*
 * GAUGE landing · design read: dark-tech fintech landing for active retail
 * traders, rule-like voice, lime-on-near-black, data-viz as the visual.
 * Page dials: VARIANCE 7 / MOTION 7 / DENSITY 4. Rev 2 (plain language):
 * what GAUGE is (Overview, Who) comes before how it works. Source of truth:
 * references/*.png, design.md, animations.md.
 */
import { ClosingCta } from "@/components/sections/ClosingCta";
import { TickerStrip } from "@/components/sections/TickerStrip";
import { TheCard } from "@/components/sections/card/TheCard";
import { Faq } from "@/components/sections/faq/Faq";
import { Hero } from "@/components/sections/hero/Hero";
import { HowItWorks } from "@/components/sections/how/HowItWorks";
import { PaperVsLive } from "@/components/sections/paper/PaperVsLive";
import { NoPrompt } from "@/components/sections/reasons/NoPrompt";
import { Overview } from "@/components/sections/overview/Overview";
import { WhoItsFor } from "@/components/sections/who/WhoItsFor";
import { WontDo } from "@/components/sections/wont/WontDo";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Overview />
      <WhoItsFor />
      <TickerStrip />
      <HowItWorks />
      <TheCard />
      <NoPrompt />
      <PaperVsLive />
      <WontDo />
      <Faq />
      <ClosingCta />
    </>
  );
}
