"use client";

import { Container } from "@/components/layout/Container";
import { IsometricPlate } from "@/components/ui/IsometricPlate";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/cn";
import {
  buildCardFigure,
  buildHaircutFigure,
  buildMeasureFigure,
} from "@/lib/manifesto-figures";

const figures = [
  {
    id: "FIG 0.1",
    build: buildMeasureFigure,
    title: "Measure",
    body: "Cash vs token, divided by the multiplier. One function, run once — never tuned per name.",
  },
  {
    id: "FIG 0.2",
    build: buildHaircutFigure,
    title: "Haircut",
    body: "Fees, funding, and slip come out first. What clears the haircut is the only edge that counts.",
  },
  {
    id: "FIG 0.3",
    build: buildCardFigure,
    title: "Card",
    body: "Only a haircut-adjusted gap becomes a card. You confirm it — PARITY never sends on its own.",
  },
];

export function ManifestoStrip() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section className="bg-void py-24 sm:py-32">
      <Container>
        <div
          ref={ref}
          className={cn(
            "transition-all duration-[400ms] ease-out",
            inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
          )}
        >
          <p className="max-w-2xl text-2xl leading-tight tracking-tight sm:text-3xl md:text-4xl">
            <span className="font-semibold text-paper">
              A confirmation layer, not a trading bot.{" "}
            </span>
            <span className="font-normal text-mute">
              PARITY watches the gap between cash and token markets, haircuts
              the noise out of it, and hands you a card only when there is
              something real left to act on.
            </span>
          </p>

          <div className="mt-24 grid grid-cols-1 divide-y divide-line sm:mt-32 md:grid-cols-3 md:divide-x md:divide-y-0 text-left">
            {figures.map((fig) => (
              <div
                key={fig.id}
                className="flex flex-col items-start px-6 py-12 text-left text-paper md:px-10"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-mute">
                  {fig.id}
                </span>
                <div className="flex h-75 w-full items-center justify-center overflow-visible sm:h-85">
                  <IsometricPlate build={fig.build} size={280} />
                </div>
                <h3 className="text-base sm:text-lg">{fig.title}</h3>
                <p className="mt-3 max-w-65 text-sm leading-relaxed text-mute sm:text-[15px]">
                  {fig.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
