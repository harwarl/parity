import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

const kills = [
  {
    code: "STALE",
    title: "A quote that's lying to you",
    body: "If the cash or token feed hasn't ticked recently enough, the gap you'd see isn't real anymore — it's a snapshot of a market that's already moved on.",
    protects: "Protects against trading a price that no longer exists.",
  },
  {
    code: "CLOSED",
    title: "Half the trade isn't there",
    body: "The token trades 24/7. Cash equity doesn't. A move that only shows up while the equity session is shut isn't a two-sided gap — it's one leg moving alone.",
    protects: "Protects against pricing a weekend drift as if it were arb.",
  },
  {
    code: "THIN",
    title: "Not enough book to fill you",
    body: "A gap only counts if there's real depth behind both legs. PARITY sizes against the thinner side, not the headline number.",
    protects: "Protects against slipping through the edge you thought you had.",
  },
  {
    code: "DUST",
    title: "Real, but not worth a tap",
    body: "Some gaps survive fees and slip and still round down to a clip too small to matter. PARITY would rather say nothing than send a card for pennies.",
    protects: "Protects your attention — fewer cards, all of them real.",
  },
];

export function RejectsCompound() {
  return (
    <section className="border-b border-border py-20 sm:py-28">
      <Container>
        <SectionHeading
          index="07"
          eyebrow="Trust"
          title="Rejects compound."
          description="Each skip code is a specific check, not a shrug. Here's what each one is actually protecting you from."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {kills.map((kill) => (
            <Card key={kill.code} className="p-6 sm:p-8">
              <span className="font-mono text-[11px] uppercase tracking-wider text-halt">
                {kill.code}
              </span>
              <h3 className="mt-3 text-base font-semibold text-foreground">
                {kill.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {kill.body}
              </p>
              <p className="mt-4 border-t border-border pt-4 text-xs text-foreground">
                {kill.protects}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
