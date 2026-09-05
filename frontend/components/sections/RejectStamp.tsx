"use client";

import { Container } from "@/components/layout/Container";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/cn";

const rejectCodes = [
  { code: "STALE", meaning: "feeds didn't join" },
  { code: "CLOSED", meaning: "session isn't RTH" },
  { code: "THIN", meaning: "book too small for the clip" },
  { code: "DUST", meaning: "size under $15" },
];

export function RejectStamp() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section className="relative w-full overflow-hidden bg-void py-24 sm:py-32">
      {/* A rejected tick, dead behind the type. Kill it if it ever competes. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span className="whitespace-nowrap font-mono text-6xl text-paper opacity-[0.08] blur-[1px] grayscale">
          HOOD 28.40 → 28.03 −130bps · STALE
        </span>
      </div>

      <Container>
        <div ref={ref} className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2
            className={cn(
              "text-4xl font-semibold tracking-tight text-paper transition-all duration-[400ms] ease-out sm:text-5xl md:text-[56px]",
              inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            )}
          >
            No gap. No card.
          </h2>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {rejectCodes.map(({ code, meaning }, index) => (
              <span
                key={code}
                title={meaning}
                style={{ transitionDelay: `${index * 60}ms` }}
                className={cn(
                  "rounded-[6px] border border-line px-[10px] py-[6px] font-mono text-[11px] uppercase tracking-[0.08em] text-mute transition-all duration-[400ms] ease-out hover:border-gap hover:text-paper",
                  inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                )}
              >
                {code}
              </span>
            ))}
          </div>

          <p className="mt-6 text-[15px] text-mute">
            If it fails a check, it dies here.
          </p>
        </div>
      </Container>
    </section>
  );
}
