import { Container } from "@/components/layout/Container";
import { SkipStamp } from "@/components/parity/SkipStamp";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skipReasons } from "@/config/tape";

export function RejectStamp() {
  return (
    <section className="border-b border-border py-20 sm:py-28">
      <Container>
        <SectionHeading
          index="02"
          eyebrow="Trust"
          title="No gap. No card."
          description="Most ticks never make it to a card. PARITY checks every name, every few seconds, and says no far more often than it says yes."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skipReasons.map((reason, i) => (
            <SkipStamp key={reason.code} reason={reason} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
