import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";

const rails = [
  {
    label: "MCP",
    title: "Official rails, equity only",
    body: "review_equity_order → confirm → place_equity_order, through Robinhood's own Agentic Trading MCP. No unofficial HTTP, no scraped session. The model captions a card — it never calls place.",
  },
  {
    label: "Feeds",
    title: "Public, checkable prices",
    body: "Cash mid from Robinhood's own price feed. Token price from a Chainlink total-return feed and the public on-chain uiMultiplier(). Both sides of every gap are numbers you could pull yourself.",
  },
  {
    label: "Halt logic",
    title: "No data isn't a bad price",
    body: "A multiplier jump, an oracle pause, a stale feed, or zero depth halts a name — gray, not red. Halted means PARITY can't see it, not that it's expensive.",
  },
];

export function OfficialRails() {
  return (
    <section id="rails" className="border-b border-border py-20 sm:py-28">
      <Container>
        <SectionHeading
          index="08"
          eyebrow="Trust"
          title="Official rails. No token."
          description="PARITY has no token, no treasury, no governance. Trust comes from using only official execution rails and public price feeds — nothing you have to take on faith."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {rails.map((rail) => (
            <Card key={rail.label} className="p-6 sm:p-8">
              <Tag variant="accent">{rail.label}</Tag>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {rail.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {rail.body}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-border p-6">
            <p className="text-xs font-medium text-foreground">
              Equity-only execution
            </p>
            <p className="mt-1 text-xs text-muted">
              Token side is research. v1 never buys it for you.
            </p>
          </div>
          <div className="rounded-xl border border-border p-6">
            <p className="text-xs font-medium text-foreground">
              You never hold keys
            </p>
            <p className="mt-1 text-xs text-muted">
              PARITY never custodies funds or a wallet.
            </p>
          </div>
          <div className="rounded-xl border border-border p-6">
            <p className="text-xs font-medium text-foreground">
              Paper default, 7 days
            </p>
            <p className="mt-1 text-xs text-muted">
              New accounts fill at confirm mid before live is offered.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
