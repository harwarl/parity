import Section from "@/components/layout/Section";
import TapeBoard from "@/components/parity/TapeBoard";

export default function TapeSection() {
  return (
    <Section
      id="tape"
      eyebrow="The tape"
      heading="Ten names. Cash, token, and the net gap between them."
      lede="One shared market plane. The same prices for everyone. Your clip and your mutes are yours. The tape is not re-priced per user. Numbers here are sample data."
    >
      <TapeBoard />
      <p className="mt-4 text-[0.78rem] leading-relaxed text-text-mute">
        Open a row for the basis trail, the feed it reads, and the card. Green
        marks a name whose net clears the bar right now. HALT and STALE names
        quote nothing.
      </p>
    </Section>
  );
}
