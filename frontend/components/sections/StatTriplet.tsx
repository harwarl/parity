import Container from "@/components/layout/Container";
import CountUp from "@/components/shared/CountUp";
import Reveal from "@/components/shared/Reveal";
import Icon from "@/components/ui/Icon";

const stats = [
  {
    icon: "activity" as const,
    render: <CountUp value={10} />,
    unit: "names",
    note: "on the shared tape at launch. One market plane, not a feed per user.",
    pulse: true,
  },
  {
    icon: "clock" as const,
    render: "1–2s",
    unit: "fresh",
    note: "in RTH. Past the join budget a name goes STALE, not stale-quiet.",
  },
  {
    icon: "shield" as const,
    render: <CountUp value={0} />,
    unit: "funds held",
    note: "No custody, no deposits. Execution is the official MCP, never PARITY.",
  },
];

export default function StatTriplet() {
  return (
    <section className="relative border-t border-line py-16">
      <span aria-hidden className="absolute -top-px left-0 h-px w-16 bg-green/70" />
      <Container>
        <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-3 sm:divide-x sm:divide-line">
          {stats.map((s, i) => (
            <Reveal key={s.unit} delay={i * 80} className="sm:px-8 sm:first:pl-0">
              <dt className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-text-mute">
                <span className="relative text-green">
                  <Icon name={s.icon} size={13} />
                  {s.pulse ? (
                    <span className="absolute -right-1 -top-1 size-1.5 animate-ping rounded-full bg-green" />
                  ) : null}
                </span>
                {s.unit}
              </dt>
              <dd>
                <span className="tnum block text-[2.75rem] font-medium leading-none tracking-tight text-text">
                  {s.render}
                </span>
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
