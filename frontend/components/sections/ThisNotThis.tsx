"use client";

import { Container } from "@/components/layout/Container";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/cn";

const thisPoints = [
  "Two prices you can point at",
  "One shared tape, your clip",
  "Paper for seven days",
  "You confirm; confirm re-quotes",
];

const notThisPoints = [
  "“Buy good stocks”",
  "A bot per user",
  "Live on day one",
  "The model calls place",
];

export function ThisNotThis() {
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
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-mute">
            Boundary
          </p>

          <div className="mt-8 grid grid-cols-1 divide-y divide-line overflow-hidden rounded-window border border-line bg-panel shadow-[inset_0_1px_0_0_rgba(244,247,242,0.06),0_24px_48px_-16px_rgba(0,0,0,0.6)] sm:mt-10 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="p-8 sm:p-10 md:p-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-gap">
                This
              </p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-gap sm:text-5xl md:text-[56px]">
                Two prices.
              </p>
              <ul className="mt-10 flex flex-col gap-3">
                {thisPoints.map((row) => (
                  <li
                    key={row}
                    className="flex items-start gap-2.5 text-sm text-paper"
                  >
                    <span className="font-mono text-gap">{"→"}</span>
                    <span>{row}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 sm:p-10 md:p-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-halt">
                Not this
              </p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-halt sm:text-5xl md:text-[56px]">
                A prompt.
              </p>
              <ul className="mt-10 flex flex-col gap-3">
                {notThisPoints.map((row) => (
                  <li
                    key={row}
                    className="flex items-start gap-2.5 text-sm text-mute"
                  >
                    <span className="font-mono text-halt">{"×"}</span>
                    <span>{row}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
