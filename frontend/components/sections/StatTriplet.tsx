import Container from "@/components/layout/Container";
import Reveal from "@/components/shared/Reveal";

const stats = [
  { value: "10", unit: "names", note: "on the shared tape at launch. One market plane, not a feed per user." },
  { value: "1–2s", unit: "fresh", note: "in RTH. Past the join budget a name goes STALE, not stale-quiet." },
  { value: "0", unit: "funds held", note: "No custody, no deposits. Execution is the official MCP, never PARITY." },
];

export default function StatTriplet() {
  return (
    <section className="relative border-t border-line py-16">
      <span aria-hidden className="absolute -top-px left-0 h-px w-16 bg-green/70" />
      <Container>
        <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-3 sm:divide-x sm:divide-line">
          {stats.map((s, i) => (
            <Reveal
              key={s.unit}
              delay={i * 80}
              className="sm:px-8 sm:first:pl-0"
            >
              <dt className="sr-only">{s.unit}</dt>
              <dd>
                <div className="flex items-baseline gap-2">
                  <span className="tnum text-[2.75rem] font-medium leading-none tracking-tight text-text">
                    {s.value}
                  </span>
                  <span className="text-[0.7rem] uppercase tracking-[0.2em] text-text-mute">
                    {s.unit}
                  </span>
                </div>
                <p className="mt-4 max-w-xs text-[0.82rem] leading-relaxed text-text-dim">
                  {s.note}
                </p>
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
