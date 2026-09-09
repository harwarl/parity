import Section from "@/components/layout/Section";
import TapeGrid from "@/components/parity/TapeGrid";

export default function TapeSection() {
  return (
    <Section
      id="tape"
      eyebrow="The tape"
      heading="Ten names. Cash, token, and the net gap between them."
      lede="One shared market plane. The same prices for everyone. Your clip and your mutes are yours. The tape is not re-priced per user. Numbers here are sample data."
    >
      <TapeGrid />
      <p className="mt-4 text-[0.78rem] leading-relaxed text-text-mute">
        Net is the basis after fee, slippage, and buffer. Green marks a name whose
        net clears the bar right now. HALT and STALE names quote nothing.
      </p>
    </Section>
  );
}
