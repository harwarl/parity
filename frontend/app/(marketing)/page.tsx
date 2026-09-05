import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ManifestoStrip } from "@/components/sections/ManifestoStrip";
import { RejectStamp } from "@/components/sections/RejectStamp";
import { SafetyStrip } from "@/components/sections/SafetyStrip";
import { ThisNotThis } from "@/components/sections/ThisNotThis";

export default function Home() {
  return (
    <main>
      <Hero />
      <RejectStamp />
      <ManifestoStrip />
      <ThisNotThis />
      <SafetyStrip />
    </main>
  );
}
