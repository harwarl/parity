import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { historySteps } from "@/config/tape";

export function History() {
  return (
    <section id="history" className="border-b border-border py-20 sm:py-28">
      <Container>
        <SectionHeading
          index="06"
          eyebrow="Precedent"
          title="Old trade. New venue."
          description="Trading the gap between two prices on the same name isn't new. Robinhood just opened a venue where retail can see it too."
        />

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {historySteps.map((step) => (
            <div key={step.year} className="relative pt-6">
              <div className="absolute left-0 top-0 h-px w-full bg-border" />
              <span
                className={`absolute left-0 top-0 h-2 w-2 -translate-y-1/2 rounded-full ${
                  step.active ? "bg-accent" : "bg-muted-dim"
                }`}
              />

              <div className="font-mono text-[11px] uppercase tracking-wider text-muted">
                {step.year} · {step.label}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
