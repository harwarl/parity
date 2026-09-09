import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { History } from "@/components/sections/History";
import { OfficialRails } from "@/components/sections/OfficialRails";
import { RejectStamp } from "@/components/sections/RejectStamp";
import { RejectsCompound } from "@/components/sections/RejectsCompound";
import { Tape } from "@/components/sections/Tape";
import { TwoPrices } from "@/components/sections/TwoPrices";

export default function Home() {
  return (
    <>
      <Hero />
      <RejectStamp />
      <Tape />
      <TwoPrices />
      <HowItWorks />
      <History />
      <RejectsCompound />
      <OfficialRails />
    </>
  );
}
