import { Container } from "@/components/layout/Container";
import { NumberedStep } from "@/components/ui/NumberedStep";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border py-20 sm:py-28">
      <Container>
        <SectionHeading
          index="05"
          eyebrow="How it works"
          title="Three steps. No autonomy."
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          <NumberedStep
            number="01"
            title="Measure"
            description="Cash mid vs. token USD, divided by the on-chain multiplier. One function, fixture-tested on 1.0×, a dividend, and a 10:1 split."
          />
          <NumberedStep
            number="02"
            title="Haircut"
            description="Subtract fees and depth-aware slip, then tag the session — rth, ext, overnight, or weekend. Most gaps die here."
          />
          <NumberedStep
            number="03"
            title="Card"
            description="Clip = min(your cap, name limit, book-safe notional). TTL ~75s. Confirm re-quotes. You tap — PARITY never places on its own."
          />
        </div>
      </Container>
    </section>
  );
}
