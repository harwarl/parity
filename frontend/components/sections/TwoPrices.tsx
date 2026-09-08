import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { KeyValueRow } from "@/components/ui/KeyValueRow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";

export function TwoPrices() {
  return (
    <section className="border-b border-border py-20 sm:py-28">
      <Container>
        <SectionHeading
          index="04"
          eyebrow="Mechanics"
          title="One name, two prices."
          description="HOOD trades as cash equity on Robinhood and as a stock token on Robinhood Chain. Same company, two venues, two clocks."
        />

        <div className="mt-10 overflow-hidden rounded-xl border border-border">
          <div className="flex h-14 w-full font-mono text-xs">
            <div className="flex-80 flex items-center justify-start truncate bg-surface-raised px-4 text-muted">
              cash · $28.41
            </div>
            <div className="flex-20 flex items-center justify-end truncate bg-accent px-4 font-semibold text-background">
              gap · −14 bps
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">
          1 HOOD today: cash mid $28.41, token mid $28.37 — a 14 bps gap.
          Width above is illustrative, not to scale.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card className="p-6 sm:p-8">
            <Tag variant="neutral">Cash leg · HOOD</Tag>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Trade it like you always have.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              The equity you already hold in a Robinhood brokerage account.
              Regular session, regular settlement.
            </p>

            <div className="mt-6">
              <KeyValueRow label="Venue" value="Robinhood equities" />
              <KeyValueRow label="Session" value="rth only" />
              <KeyValueRow label="Settlement" value="T+1" />
              <KeyValueRow label="Custody" value="your brokerage account" />
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <Tag variant="accent">Token leg · HOOD</Tag>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              The same name, on Robinhood Chain.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              A stock token priced off a Chainlink total-return feed and a
              public on-chain multiplier. Trades 24/7. Research, not a buy
              button — v1 never executes this leg for you.
            </p>

            <div className="mt-6">
              <KeyValueRow label="Feed" value="Chainlink total-return" />
              <KeyValueRow label="Multiplier" value="uiMultiplier()" />
              <KeyValueRow label="Session" value="24/7, ext + overnight" />
              <KeyValueRow label="Custody" value="not held by PARITY" />
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
