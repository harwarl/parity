import { Container } from "@/components/layout/Container";
import { Dashboard } from "@/components/sections/dashboard/Dashboard";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-32 pt-32 sm:pt-32 lg:pt-44 xl:pt-52">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-void from-35% to-mute/70"
      />
      <Container>
        <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-paper sm:text-5xl lg:text-6xl">
          Two prices. One gap.
          <br />
          You tap.
        </h1>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-lg text-base text-mute sm:text-lg">
            PARITY measures the gap, haircuts fees and slip, and only then sends
            a card. You confirm. It does not place.
          </p>
          <a
            href="#tape"
            className="flex shrink-0 items-center gap-2 text-sm text-mute transition-colors hover:text-paper"
          >
            <span className="text-gap">Live</span>
            public tape
            <span aria-hidden>→</span>
          </a>
        </div>

        <div id="tape" className="relative mt-16 scroll-mt-24 sm:mt-24">
          {/* Contact shadow — the panel's own dark pool on the lighter floor below it. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-16 -bottom-10 -z-10 h-20 rounded-[100%] bg-void/80 blur-2xl sm:inset-x-24 sm:-bottom-12 sm:h-24"
          />
          <div className="relative shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7),0_16px_32px_-12px_rgba(0,0,0,0.6)]">
            <Dashboard />
          </div>
        </div>
      </Container>
    </section>
  );
}
