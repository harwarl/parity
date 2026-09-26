import type { Metadata } from "next";
import Link from "next/link";
import { DOCS } from "@/config/docs";
import { ArticleHeader } from "@/components/docs/ArticleHeader";
import { ArticleShell } from "@/components/docs/ArticleShell";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Formula } from "@/components/docs/Formula";
import { H2 } from "@/components/docs/H2";
import { Note } from "@/components/docs/Note";
import { Path } from "@/components/docs/Path";
import { PrevNext } from "@/components/docs/PrevNext";
import { DocsWaterfall } from "@/components/docs/figures/DocsWaterfall";
import { GateOrder } from "@/components/docs/figures/GateOrder";

export const metadata: Metadata = { title: "How a card is made · GAUGE docs" };

const toc = [
  { id: "prices", label: "Two prices" },
  { id: "gap", label: "The gap, in basis points" },
  { id: "haircut", label: "The haircut" },
  { id: "gates", label: "The four gates" },
  { id: "emit", label: "Emit the card" },
  { id: "requote", label: "Re-quote on confirm" },
  { id: "spec", label: "Spec (draft)" },
];

const GAP_RS = `pub struct Costs { pub fees_bps: f64, pub slip_bps: f64, pub buffer_bps: f64 }

/// |token×mult − cash| / cash × 1e4. The multiplier only touches the chain leg.
pub fn gap_bps(cash_mid: f64, token: f64, mult: f64) -> f64 {
    ((token * mult - cash_mid) / cash_mid).abs() * 1e4
}

pub fn net_bps(gap: f64, c: &Costs) -> f64 {
    gap - c.fees_bps - c.slip_bps - c.buffer_bps
}`;

const CARD_JSON = `{
  "type": "card",
  "id": "card_7f3a91",
  "sym": "NVDA",
  "cash_mid": 182.40,
  "token_per_share": 182.71,
  "gap_bps": 17.0,
  "costs": { "fees_bps": 3.5, "slip_bps": 2.1, "buffer_bps": 2.0 },
  "net_bps": 9.4,
  "gates": { "feed_age_s": 0.3, "session": "RTH", "depth_usd": 420000, "cap": "1/3" },
  "leg": "cash_equity",
  "emitted_at": "2026-09-26T14:02:18.412-04:00",
  "expires_at": "2026-09-26T14:03:33.412-04:00",
  "mode": "live"
}`;

function AtAGlance() {
  return (
    <div className="mt-6 rounded-inset border border-ink/8 bg-[#0C0D10] p-3.5 font-mono text-[12px]">
      <p className="mb-2 text-[10.5px] tracking-[0.2em] text-dim">NVDA AT A GLANCE</p>
      {[
        ["gap", "17.0", "text-ink"],
        ["costs", "−7.6", "text-neg"],
        ["net", "9.4", "text-accent"],
      ].map(([k, v, c]) => (
        <p key={k} className="flex justify-between py-1">
          <span className="text-muted">{k}</span>
          <span className={c}>{v}</span>
        </p>
      ))}
    </div>
  );
}

/** How a card is made (design.md §5C.6). */
export default function HowACardIsMadePage() {
  return (
    <ArticleShell toc={toc} tocExtra={<AtAGlance />}>
      <ArticleHeader
        crumbs={["Docs", "How GAUGE works", "How a card is made"]}
        title="How a card is made"
        lede="Every card goes through the same four steps: measure the gap, take the costs off, pass the gates, emit. This page walks through all four with one real-shaped example: NVDA at 14:02:18 ET."
        meta={["8 min read", "Concept", "Numbers are illustrative"]}
      />

      <H2 id="prices" n="01">Two prices</H2>
      <p>GAUGE watches two prices for the same name:</p>
      <ul>
        <li><strong>Cash mid.</strong> The Robinhood stock&apos;s mid price.</li>
        <li>
          <strong>Token per share.</strong> The Robinhood Chain stock token, priced per share. The token feed is
          multiplied by the token&apos;s multiplier so both prices are in the same unit.
        </li>
      </ul>
      <Note tone="tip" tag="NOTE" lead="The multiplier only touches the chain feed.">
        The cash price is never adjusted.
      </Note>
      <div className="overflow-x-auto">
        <table className="doc-table">
          <thead><tr><th>Leg</th><th>Source</th><th>NVDA</th></tr></thead>
          <tbody>
            <tr><td>Cash mid</td><td>Robinhood quotes</td><td className="v">$182.40</td></tr>
            <tr><td>Token per share</td><td>Chainlink · token × multiplier</td><td className="v !text-accent">$182.71</td></tr>
          </tbody>
        </table>
      </div>

      <H2 id="gap" n="02">The gap, in basis points</H2>
      <Formula label="GAP">|gap| = | token_per_share − cash_mid | ÷ cash_mid × 10,000</Formula>
      <p>
        Basis points make every name comparable. A 31¢ gap on a $182 stock and a 53¢ gap on a $118 stock are very
        different trades, and bps shows it.
      </p>
      <Formula label="NVDA" example>
        | 182.71 − 182.40 | ÷ 182.40 × 10,000 = <span className="text-accent">17.0 bps</span>
      </Formula>
      <p>
        The token is trading <strong>rich</strong>: above the cash price. A negative gap (token cheap) is measured the
        same way. GAUGE uses the absolute value.
      </p>

      <H2 id="haircut" n="03">The haircut</H2>
      <p>A gap that looks good before costs isn&apos;t a gap. GAUGE takes three things off every time:</p>
      <div className="overflow-x-auto">
        <table className="doc-table">
          <thead><tr><th>Cost</th><th>What it is</th><th>NVDA</th></tr></thead>
          <tbody>
            <tr><td>Fees</td><td>From the fee schedule. Same for every name.</td><td className="v !text-neg">−3.5</td></tr>
            <tr><td>Slippage</td><td>Estimated for this name. Thinner books cost more.</td><td className="v !text-neg">−2.1</td></tr>
            <tr><td>Buffer</td><td>Your safety margin. Set in <Path>Settings → Gates</Path>.</td><td className="v !text-neg">−2.0</td></tr>
          </tbody>
        </table>
      </div>
      <Formula label="NET">
        net = |gap| − fees − slippage − buffer
        <br />
        <span className="text-muted">17.0 − 3.5 − 2.1 − 2.0 =</span> <span className="text-accent">9.4 bps</span>
      </Formula>
      <DocsWaterfall />

      <H2 id="gates" n="04">The four gates</H2>
      <p>
        Gates run <strong>in order</strong>. The first one that fails becomes the reason you see instead of a card.
      </p>
      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-[#0C0D10] px-6 py-5">
        <GateOrder />
      </div>
      <div className="overflow-x-auto">
        <table className="doc-table">
          <thead><tr><th>Gate</th><th>Passes when</th><th>NVDA</th></tr></thead>
          <tbody>
            <tr><td>Feed</td><td>Both legs are younger than the max quote age (2.0 s)</td><td className="v !text-accent">0.3 s ✓</td></tr>
            <tr><td>Session</td><td>The cash market is in regular hours, 09:30–16:00 ET</td><td className="v !text-accent">RTH ✓</td></tr>
            <tr><td>Depth</td><td>Top of book is at least $100k</td><td className="v !text-accent">$420k ✓</td></tr>
            <tr><td>Net gap</td><td>Net is at least the floor (2.0 bps)</td><td className="v !text-accent">9.4 ✓</td></tr>
            <tr><td>Cap</td><td>You have had fewer than 3 cards today</td><td className="v !text-accent">1/3 ✓</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        See <Link href={DOCS.reasons}>Reason codes</Link> for what each failure means and what to do about it.
      </p>

      <H2 id="emit" n="05">Emit the card</H2>
      <p>
        When every gate passes, GAUGE emits one card and pushes it to you. For NVDA that happened at{" "}
        <code>14:02:18.412 ET</code>. The card:
      </p>
      <ul>
        <li>lives for <strong>75 seconds</strong>, then expires on its own;</li>
        <li>shows the net, both prices and the leg GAUGE would trade (cash equity only);</li>
        <li>counts toward your cap of 3 whether you take it, skip it or let it expire.</li>
      </ul>

      <H2 id="requote" n="06">Re-quote on confirm</H2>
      <p>
        The numbers on a card are never traded as-is. When you tap <strong>Do it</strong>, GAUGE holds the clock,
        fetches fresh prices for both legs and runs every gate again.
      </p>
      <div className="overflow-x-auto">
        <table className="doc-table">
          <thead><tr><th></th><th>At card</th><th>At confirm</th></tr></thead>
          <tbody>
            <tr><td>Cash mid</td><td className="v">$182.40</td><td className="v">$182.41</td></tr>
            <tr><td>Token per share</td><td className="v">$182.71</td><td className="v">$182.71</td></tr>
            <tr><td>Net</td><td className="v">9.4 bps</td><td className="v !text-accent">8.9 bps · clears</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        If the re-quote drops net under the floor, the card closes as <strong>RE-QUOTE FAIL</strong> and nothing is
        placed. Example from the ledger: META on Thu 25 Sep went from 4.6 at card to 1.4 at confirm.
      </p>
      <Note tone="tip" tag="RULE" lead="The model does not place.">
        In live mode a clear re-quote results in exactly one cash-equity order through the official Robinhood Trading
        MCP. In paper mode it fills at the confirm mid.
      </Note>

      <H2 id="spec" n="DEV" draft>Spec</H2>
      <p>The same math as code. Names, types and field names are drafts until the engine API is published.</p>
      <CodeBlock title="gauge-engine / src/gap.rs" lang="rust" code={GAP_RS} />
      <CodeBlock title="event: card" lang="json" code={CARD_JSON} />

      <PrevNext prev={{ label: "Quickstart", href: DOCS.quickstart }} next={{ label: "Reason codes", href: DOCS.reasons }} />
    </ArticleShell>
  );
}
