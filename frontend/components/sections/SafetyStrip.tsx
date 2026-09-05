import { Container } from "@/components/layout/Container";

const facts = [
  "75s card TTL",
  "3 cards/day",
  "Freeze on multiplier",
  "Re-quote on confirm",
];

export function SafetyStrip() {
  return (
    <section className="w-full border-y border-line bg-floor py-10">
      <Container className="flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-sm text-paper sm:justify-start">
          {facts.map((fact, index) => (
            <span key={fact} className="flex items-center gap-3">
              {index > 0 && (
                <span aria-hidden className="text-gap">
                  ·
                </span>
              )}
              {fact}
            </span>
          ))}
        </p>
        <a
          href="#"
          className="flex shrink-0 items-center gap-2 font-mono text-sm text-mute transition-colors hover:text-paper"
        >
          Systems design
          <span aria-hidden>→</span>
        </a>
      </Container>
    </section>
  );
}
