import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DOCS } from "@/config/docs";
import { WHY_NO_CARD } from "@/lib/gauge/model";
import { ArticleHeader } from "@/components/docs/ArticleHeader";
import { ArticleShell } from "@/components/docs/ArticleShell";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { H2 } from "@/components/docs/H2";
import { Note } from "@/components/docs/Note";
import { Path } from "@/components/docs/Path";
import { PrevNext } from "@/components/docs/PrevNext";

export const metadata: Metadata = { title: "Reason codes · GAUGE docs" };

const COLOR = { STALE: "#FF6B5E", CLOSED: "#8FA6DA", THIN: "#E8B04A", DUST: "#80848A" } as const;
type Code = keyof typeof COLOR;

const toc = [
  { id: "glance", label: "At a glance" },
  { id: "stale", label: "STALE" },
  { id: "closed", label: "CLOSED" },
  { id: "thin", label: "THIN" },
  { id: "dust", label: "DUST" },
  { id: "requote-fail", label: "Re-quote fail" },
  { id: "how-often", label: "How often" },
  { id: "event", label: "Reason event (draft)" },
];

const REASON_RS = `/// First failing gate wins. Order matters.
pub enum Reason { Stale, Closed, Thin, Dust }

pub fn gate(q: &Quote, r: &Rules) -> Result<(), Reason> {
    if q.age_s > r.max_age_s          { return Err(Reason::Stale) }
    if !q.session.is_rth()             { return Err(Reason::Closed) }
    if q.depth_usd < r.min_depth_usd   { return Err(Reason::Thin) }
    if q.net_bps < r.floor_bps         { return Err(Reason::Dust) }
    Ok(())
}`;

const REASON_JSON = `{
  "type": "reason",
  "sym": "HOOD",
  "code": "THIN",
  "gate": "depth",
  "observed": { "depth_usd": 45000, "gap_bps": 44.8 },
  "threshold": { "min_depth_usd": 100000 },
  "at": "2026-09-26T12:40:10-04:00"
}`;

/** Doto code word; DUST dissolves (K5), the only looping text in the docs. */
function CodeWord({ code, size }: { code: Code; size: 26 | 40 }) {
  return (
    <span
      className="inline-block font-dot leading-none font-black"
      style={{
        color: COLOR[code],
        fontSize: size,
        animation: code === "DUST" ? "k-dust 3.2s ease-in-out infinite" : undefined,
      }}
    >
      {code}
    </span>
  );
}

/** Reason panel .rc: code + gate left; title, body, what to do, example right. */
function ReasonPanel({
  id,
  code,
  gate,
  title,
  children,
  todo,
  example,
}: {
  id: string;
  code: Code;
  gate: string;
  title: string;
  children: ReactNode;
  todo: ReactNode;
  example: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-h`}
      className="!mt-5 grid scroll-mt-[100px] gap-7 rounded-panel border border-line bg-[linear-gradient(180deg,#131519,#0F1113)] p-[26px] sm:grid-cols-[200px_1fr]"
    >
      <div>
        <CodeWord code={code} size={40} />
        <p className="mt-2 font-mono text-[11px] tracking-[0.16em] text-dim uppercase">{gate}</p>
      </div>
      <div className="art min-w-0">
        <h3 id={`${id}-h`} className="font-display text-[18px] font-semibold tracking-[-0.03em] text-ink">
          {title}
        </h3>
        <p>{children}</p>
        <p>
          <strong>What to do:</strong> {todo}
        </p>
        <div className="rounded-xl bg-bg px-3.5 py-3 font-mono text-[12.5px] leading-[1.6] text-ink-2">{example}</div>
      </div>
    </section>
  );
}

/** Reason codes (design.md §5C.7). */
export default function ReasonCodesPage() {
  const tiles: { code: Code; gate: string; id: string }[] = [
    { code: "STALE", gate: "FEED gate", id: "stale" },
    { code: "CLOSED", gate: "SESSION gate", id: "closed" },
    { code: "THIN", gate: "DEPTH gate", id: "thin" },
    { code: "DUST", gate: "NET GAP gate", id: "dust" },
  ];

  return (
    <ArticleShell toc={toc}>
      <ArticleHeader
        crumbs={["Docs", "How GAUGE works", "Reason codes"]}
        title="Reason codes"
        lede="No gap, no card. When a name doesn't clear, GAUGE tells you why in one word. The word is the first gate that failed."
        meta={["4 min read", "Reference", "Examples from the sample watchlist"]}
      />

      <H2 id="glance">At a glance</H2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiles.map((t) => (
          <a key={t.code} href={`#${t.id}`} className="doc-plain doc-edge block rounded-2xl border border-ink/8 bg-[#0C0D10] p-4">
            <CodeWord code={t.code} size={26} />
            <span className="mt-2 block font-mono text-[11px] text-dim">{t.gate}</span>
          </a>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="doc-table">
          <thead><tr><th>Code</th><th>Gate</th><th>Fires when</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td className="v !text-neg">STALE</td><td>Feed</td><td>Either price is older than the max quote age</td><td className="v">2.0 s</td></tr>
            <tr><td className="v !text-closed">CLOSED</td><td>Session</td><td>The cash market is outside regular hours</td><td className="v">09:30–16:00 ET</td></tr>
            <tr><td className="v !text-thin">THIN</td><td>Depth</td><td>Top of book is below the minimum size</td><td className="v">$100k</td></tr>
            <tr><td className="v !text-dim">DUST</td><td>Net gap</td><td>Net after fees, slippage and buffer is below the floor</td><td className="v">2.0 bps</td></tr>
          </tbody>
        </table>
      </div>
      <Note tone="warn" tag="ORDER" lead="Gates run feed → session → depth → net.">
        A name with an old price and a tiny gap shows STALE, not DUST. Fix the first failure and the next one may
        appear.
      </Note>

      <ReasonPanel
        id="stale"
        code="STALE"
        gate="Feed gate"
        title="A price is too old to trust"
        todo={
          <>
            usually nothing. It clears on the next fresh tick. If a name stays STALE, check{" "}
            <Path>Home → System health</Path>.
          </>
        }
        example={
          <>
            COIN · chain feed 3.8 s old · max 2.0 s → <span className="text-neg">STALE</span>
            <br />
            <span className="text-dim">net would have been 3.4 bps, but the price was too old to use</span>
          </>
        }
      >
        Both legs have to be fresh at the same moment. If either the cash quote or the chain token price is older than
        your max quote age, the gap might not exist anymore, so GAUGE stays quiet.
      </ReasonPanel>

      <ReasonPanel
        id="closed"
        code="CLOSED"
        gate="Session gate"
        title="The cash market isn't in its session"
        todo="wait for 09:30 ET. Cards resume at the open."
        example={
          <>
            any name · 17:40 ET · after hours → <span className="text-closed">CLOSED</span>
            <br />
            <span className="text-dim">the token may still tick; GAUGE waits for the cash market</span>
          </>
        }
      >
        Stock tokens can keep trading after hours. The cash leg can&apos;t be placed live outside regular hours, so
        GAUGE doesn&apos;t emit a card it can&apos;t act on.
      </ReasonPanel>

      <ReasonPanel
        id="thin"
        code="THIN"
        gate="Depth gate"
        title="Not enough size to fill"
        todo={
          <>
            treat a big THIN gap as a warning, not a miss. You can lower min depth in <Path>Settings → Gates</Path>, at
            your own risk.
          </>
        }
        example={
          <>
            HOOD · |gap| 44.8 bps · depth $45k · min $100k → <span className="text-thin">THIN</span>
            <br />
            <span className="text-dim">the biggest raw gap of the day, and the least fillable</span>
          </>
        }
      >
        A wide gap on a thin book usually disappears the moment you trade into it. GAUGE needs at least your minimum
        depth at the top of the book before it believes the gap.
      </ReasonPanel>

      <ReasonPanel
        id="dust"
        code="DUST"
        gate="Net gap gate"
        title="A gap, but not after costs"
        todo="nothing. DUST is GAUGE working as intended."
        example={
          <>
            META · |gap| 8.8 − costs 7.6 = net 1.2 · floor 2.0 → <span className="text-dim">DUST</span>
          </>
        }
      >
        The prices differ, but once fees, slippage and your buffer are taken off, what&apos;s left is below the floor.
        This is the most common reason by far.
      </ReasonPanel>

      <H2 id="requote-fail">Not a reason code: re-quote fail</H2>
      <p>
        A card can pass every gate and still not trade. When you tap <strong>Do it</strong>, GAUGE re-quotes both legs
        and runs the gates again. If net has dropped below the floor, the card closes as{" "}
        <strong>RE-QUOTE FAIL</strong> and nothing is placed.
      </p>
      <div className="grid gap-4 rounded-panel border border-neg/30 bg-[linear-gradient(180deg,#131519,#0F1113)] p-[22px] sm:grid-cols-[200px_1fr] sm:items-center">
        <span className="font-mono text-[13px] font-semibold tracking-[0.12em] text-neg">RE-QUOTE FAIL</span>
        <p className="font-mono !text-[12.5px] !leading-[1.6]">
          META · Thu 25 Sep 15:21 · net 4.6 at card → <span className="text-neg">1.4 at confirm</span> · floor 2.0 → no
          order
        </p>
      </div>

      <H2 id="how-often">How often each one fires</H2>
      <p>On a normal session almost every evaluation ends in DUST. That&apos;s the point: GAUGE is built to say no.</p>
      <div
        role="img"
        aria-label="Share of evaluations by reason, illustrative: DUST 71%, THIN 12%, STALE 9%, CLOSED 8%."
      >
        <div className="flex h-4 gap-0.5 overflow-hidden rounded-full">
          {WHY_NO_CARD.map((w) => (
            <span key={w.state} style={{ flexGrow: w.pct, background: COLOR[w.state] }} />
          ))}
        </div>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[12px] text-ink-2">
          {WHY_NO_CARD.map((w) => (
            <span key={w.state}>
              <span style={{ color: COLOR[w.state] }}>■</span> {w.state} {w.pct}%
            </span>
          ))}
          <span className="text-dim">illustrative</span>
        </p>
      </div>

      <H2 id="event" draft>Reason event</H2>
      <p>Reasons are streamed like cards, one per name per state change. Field names are drafts.</p>
      <CodeBlock title="gauge-engine / src/reason.rs" lang="rust" code={REASON_RS} />
      <CodeBlock title="event: reason" lang="json" code={REASON_JSON} />

      <PrevNext prev={{ label: "How a card is made", href: DOCS.card }} next={{ label: "Card lifecycle", href: `${DOCS.card}#emit` }} />
    </ArticleShell>
  );
}
