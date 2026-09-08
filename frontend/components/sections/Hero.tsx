import { HeroCard } from "@/components/parity/HeroCard";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { StatTile } from "@/components/ui/StatTile";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-border pt-16 pb-20 sm:pt-24 sm:pb-28"
    >
      <div className="bg-dot-grid pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-[0.15] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      <Container className="relative grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-10">
        <div>
          <h1 className="text-balance max-w-md text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl">
            Two prices. One gap. <span className="text-accent">You tap.</span>
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted">
            Robinhood lists the stock and a Robinhood Chain token of that
            stock. PARITY measures the gap, haircuts fees and slip, and only
            then sends a card. No gap, no card. You confirm — PARITY never
            places on its own.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="#tape" variant="primary">
              Watch the tape
            </Button>
            <Button href="#how-it-works" variant="secondary">
              Get paper
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-7">
            <StatTile value="10" label="names tracked" />
            <StatTile value="rth" label="session state" />
            <StatTile value="3/day" label="card cap" />
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <HeroCard />
        </div>
      </Container>
    </section>
  );
}
