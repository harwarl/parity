import { Container } from "@/components/layout/Container";
import { TapeRowItem } from "@/components/parity/TapeRowItem";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { tapeRows } from "@/config/tape";

export function Tape() {
  return (
    <section id="tape" className="border-b border-border py-20 sm:py-28">
      <Container>
        <SectionHeading
          index="03"
          eyebrow="Tape"
          title="The gap, across the top 10."
          description="Cash mid vs. token USD, divided by the on-chain multiplier, in basis points. Gray means no live data — not a bad price, just none."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tapeRows.map((row) => (
            <TapeRowItem key={row.symbol} row={row} />
          ))}
        </div>
      </Container>
    </section>
  );
}
