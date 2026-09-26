import type { Metadata } from "next";
import Link from "next/link";
import { DOCS, DOCS_META } from "@/config/docs";
import { ArticleHeader } from "@/components/docs/ArticleHeader";
import { ArticleShell } from "@/components/docs/ArticleShell";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { H2 } from "@/components/docs/H2";
import { Note } from "@/components/docs/Note";
import { Path } from "@/components/docs/Path";
import { PrevNext } from "@/components/docs/PrevNext";
import { Step } from "@/components/docs/Step";
import { MiniCard } from "@/components/docs/figures/MiniCard";

export const metadata: Metadata = { title: "Quickstart · GAUGE docs" };

const toc = [
  { id: "open", label: "Open GAUGE" },
  { id: "link", label: "Link your Agentic Account" },
  { id: "live", label: "Switch to Live" },
  { id: "gates", label: "Check your gates" },
  { id: "first-card", label: "Read your first card" },
  { id: "do-it", label: "Tap Do it" },
  { id: "history", label: "Review it in History" },
  { id: "stream", label: "Stream cards yourself" },
];

const CURL = `# subscribe to your card and reason events
curl -N "[API_BASE]/v1/stream" \\
  -H "Authorization: Bearer [TOKEN]" \\
  -H "Accept: text/event-stream"`;

/** Quickstart (design.md §5C.5). Seven steps, straight to live, then DEV. */
export default function QuickstartPage() {
  return (
    <ArticleShell toc={toc}>
      <ArticleHeader
        crumbs={["Docs", "Get started", "Quickstart"]}
        title="Quickstart"
        lede="From zero to your first live card in seven steps. You link your Robinhood Agentic Account, check your gates, and tap Do it when a card clears."
        meta={["5 min read", "Live mode", `Updated ${DOCS_META.updated}`]}
      />

      <Step n="01" id="open" title="Open GAUGE">
        <p>
          Go to <Path>[APP_URL]</Path> and sign in with <Path>[AUTH_METHOD]</Path>. You land on Home: the active card, the
          four gates, and the live gap board for every name you watch.
        </p>
      </Step>

      <Step n="02" id="link" title="Link your Agentic Account">
        <p>
          Open <Path>Settings → Mode &amp; account</Path> and choose <Path>Link via Trading MCP</Path>. GAUGE connects
          through the official Robinhood Trading MCP.
        </p>
        <Note tone="warn" tag="REQUIRED" lead="Agentic Account only.">
          Live orders go through a Robinhood Agentic Account, and only during regular trading hours (09:30–16:00 ET).
          GAUGE never holds your funds.
        </Note>
        <p>
          When the link works, the account row reads <code>Linked via Robinhood Trading MCP · live orders RTH only</code>.
        </p>
      </Step>

      <Step n="03" id="live" title="Switch to Live">
        <p>
          Use the <Path>Paper · Live</Path> toggle in the top bar. In Live, a lime strip stays under the top bar so you
          always know what a tap does:
        </p>
        <p
          role="img"
          aria-label="The live strip: Do it places one cash-equity order on your Agentic Account through the Robinhood Trading MCP."
          className="flex flex-wrap items-center gap-3 rounded-inset border border-accent/35 bg-accent/8 px-5 py-3 !text-[14px] !leading-relaxed"
        >
          <span className="g-live" />
          <span className="font-mono text-[11px] tracking-[0.2em] text-accent">LIVE</span>
          Do it places one cash-equity order on your Agentic Account through the Robinhood Trading MCP.
        </p>
        <Note tone="tip" tag="TIP" lead="Want to practice first?">
          Paper runs the same gates and the same card. It fills at the confirm mid and moves no money.
        </Note>
      </Step>

      <Step n="04" id="gates" title="Check your gates">
        <p>
          A card only appears when every gate passes. The defaults are strict on purpose. Change them in{" "}
          <Path>Settings → Gates</Path>.
        </p>
        <div className="overflow-x-auto">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Gate</th>
                <th>Default</th>
                <th>Fails as</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Max quote age</td><td className="v">2.0 s</td><td className="v !text-neg">STALE</td></tr>
              <tr><td>Session</td><td className="v">RTH</td><td className="v !text-closed">CLOSED</td></tr>
              <tr><td>Min depth</td><td className="v">$100k</td><td className="v !text-thin">THIN</td></tr>
              <tr>
                <td>Net floor <span className="text-dim">after fees 3.5, slippage, buffer 2.0</span></td>
                <td className="v">2.0 bps</td>
                <td className="v !text-dim">DUST</td>
              </tr>
              <tr><td>Daily cap</td><td className="v">3 cards</td><td className="v !text-muted">no 4th card</td></tr>
            </tbody>
          </table>
        </div>
      </Step>

      <Step n="05" id="first-card" title="Read your first card">
        <p>When a name clears, you get a card. It lives for 75 seconds.</p>
        <MiniCard />
        <p>
          For the math behind the net number, read <Link href={DOCS.card}>How a card is made</Link>.
        </p>
      </Step>

      <Step n="06" id="do-it" title="Tap Do it">
        <p>A tap doesn&apos;t send the card as-is. GAUGE checks again first:</p>
        <ul>
          <li>The countdown holds while GAUGE confirms.</li>
          <li>Both legs are <strong>re-quoted</strong> at fresh prices.</li>
          <li>All four gates are <strong>re-checked</strong> on the new prices.</li>
        </ul>
        <p>
          If everything still clears, GAUGE places <strong>one cash-equity order</strong> on your Agentic Account. If
          not, nothing happens.
        </p>
        <Note tone="tip" tag="RULE" lead="The model does not place.">
          GAUGE never trades the token, never hedges both legs, and never places without your tap.
        </Note>
      </Step>

      <Step n="07" id="history" title="Review it in History">
        <p>
          Every card lands in <Link href="/dashboard/history">History</Link> with its net at card, its net at confirm,
          the outcome, and a full audit trail. You can export the ledger as CSV.
        </p>
      </Step>

      <H2 id="stream" n="DEV" draft>
        Stream cards yourself
      </H2>
      <p>Cards and reasons are pushed over Server-Sent Events. The endpoint and payload below are drafts until the API is published.</p>
      <CodeBlock title="shell" lang="shell" code={CURL} />

      <PrevNext prev={{ label: "Overview", href: DOCS.home }} next={{ label: "How a card is made", href: DOCS.card }} />
    </ArticleShell>
  );
}
