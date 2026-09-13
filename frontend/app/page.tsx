import SiteBackground from "@/components/background/SiteBackground";
import LandingFooter from "@/components/layout/LandingFooter";
import LandingNavbar from "@/components/layout/LandingNavbar";
import TickerStrip from "@/components/parity/TickerStrip";
import CashTokenExplainer from "@/components/sections/CashTokenExplainer";
import ClosingLine from "@/components/sections/ClosingLine";
import CtaBanner from "@/components/sections/CtaBanner";
import DoesDoesnt from "@/components/sections/DoesDoesnt";
import FaqAccordion from "@/components/sections/FaqAccordion";
import HeroLanding from "@/components/sections/HeroLanding";
import HowItWorksSteps from "@/components/sections/HowItWorksSteps";
import Lineage from "@/components/sections/Lineage";
import LiveOpportunities from "@/components/sections/LiveOpportunities";
import RailsIconBand from "@/components/sections/RailsIconBand";
import RefusalsTrust from "@/components/sections/RefusalsTrust";
import StatBar from "@/components/sections/StatBar";

/**
 * The landing page, rebuilt to the supplied reference design exactly (see
 * conversation) — headline, opportunity framing, live-opportunities table,
 * FAQ, CTA banner. The hero's card is the real dashboard SignalCard, not a
 * mockup. Brought up to the same depth as the pre-redesign page (which lives
 * on at /classic) with the explainer/rails/refusals/lineage/closing beats it
 * carried, re-executed in this page's visual language.
 */
export default function Page() {
  return (
    <>
      <SiteBackground />
      <LandingNavbar />
      <main>
        <HeroLanding />
        <TickerStrip />
        <StatBar />
        <HowItWorksSteps />
        <CashTokenExplainer />
        <DoesDoesnt />
        <RailsIconBand />
        <LiveOpportunities />
        <RefusalsTrust />
        <Lineage />
        <FaqAccordion />
        <CtaBanner />
        <ClosingLine />
      </main>
      <LandingFooter />
    </>
  );
}
