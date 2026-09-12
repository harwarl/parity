import SiteBackground from "@/components/background/SiteBackground";
import LandingFooter from "@/components/layout/LandingFooter";
import LandingNavbar from "@/components/layout/LandingNavbar";
import CtaBanner from "@/components/sections/CtaBanner";
import DoesDoesnt from "@/components/sections/DoesDoesnt";
import FaqAccordion from "@/components/sections/FaqAccordion";
import HeroLanding from "@/components/sections/HeroLanding";
import HowItWorksSteps from "@/components/sections/HowItWorksSteps";
import LiveOpportunities from "@/components/sections/LiveOpportunities";
import StatBar from "@/components/sections/StatBar";

/**
 * The landing page, rebuilt to the supplied reference design exactly (see
 * conversation) — headline, opportunity framing, live-opportunities table,
 * FAQ, CTA banner. The hero's card is the real dashboard SignalCard, not a
 * mockup. The pre-redesign page lives on at /classic.
 */
export default function Page() {
  return (
    <>
      <SiteBackground />
      <LandingNavbar />
      <main>
        <HeroLanding />
        <StatBar />
        <HowItWorksSteps />
        <DoesDoesnt />
        <LiveOpportunities />
        <FaqAccordion />
        <CtaBanner />
      </main>
      <LandingFooter />
    </>
  );
}
