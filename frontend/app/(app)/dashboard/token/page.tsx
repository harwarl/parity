/*
 * Token · pre-launch (design.md §5B.8, §5B.12 F). Every value is a
 * placeholder in --thin so it can't be mistaken for data. Nothing invented.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Panel } from "@/components/ui/Panel";
import { Pill } from "@/components/ui/Pill";
import { TopBar } from "@/components/app/shell/TopBar";
import { PanelHead } from "@/components/app/ui/PanelHead";
import { TokenMark } from "@/components/app/token/TokenMark";

export const metadata: Metadata = { title: "Token · GAUGE" };

const Ph = ({ children }: { children: React.ReactNode }) => <span className="text-thin">{children}</span>;

function Rows({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="px-[22px] pb-3">
      {rows.map(([k, v]) => (
        <div key={k} className="g-row last:!border-b-0">
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function TokenPage() {
  return (
    <>
      <TopBar
        title="Token"
        context="$[TICKER] · details pending"
        actions={
          <span className="inline-flex h-6 items-center rounded-full border border-thin/45 bg-thin/8 px-2.5 font-mono text-[10px] tracking-[0.14em] text-thin uppercase">
            Pre-launch
          </span>
        }
      />
      <div className="app-rows flex flex-col gap-5">
        <Panel featured className="grid overflow-hidden lg:grid-cols-[380px_1fr]">
          <div
            className="flex flex-col items-center justify-center gap-4 border-b border-line-row p-8 lg:border-r lg:border-b-0"
            style={{ background: "radial-gradient(60% 60% at 50% 50%, rgba(178,212,80,.14), transparent 70%)" }}
          >
            <TokenMark />
            <p className="font-mono text-[10px] tracking-[0.16em] text-dim">MARK · PLACEHOLDER UNTIL TOKEN ART</p>
          </div>
          <div className="flex flex-col gap-6 p-7 max-sm:p-5">
            <div>
              <p className="g-eyebrow">GAUGE token</p>
              <h2 className="mt-3 flex items-baseline font-display text-[56px] leading-none font-extrabold tracking-[-0.04em] text-ink">
                $<span className="g-dot text-[60px]">[TICKER]</span>
              </h2>
              <p className="mt-3 font-mono text-[13px] text-dim">
                <Ph>[TOKEN_NAME]</Ph> · on <Ph>[CHAIN]</Ph>
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button type="button" disabled className="g-btn g-btn-secondary g-btn-xs cursor-not-allowed opacity-60" title="Available at launch">
                Add to wallet
              </button>
              <Link href="/dashboard/settings#notifications" className="g-btn g-btn-primary g-btn-xs">
                Get notified at launch
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
              {[
                ["Price", "[PRICE]"],
                ["24h", "[CHANGE_24H]"],
                ["Market cap", "[MCAP]"],
                ["Holders", "[HOLDERS]"],
              ].map(([k, v]) => (
                <div key={k} className="app-cell">
                  <p className="app-cell-label">{k}</p>
                  <p className="app-cell-value text-thin">{v}</p>
                </div>
              ))}
            </div>
            <div className="relative grid h-[150px] place-items-center overflow-hidden rounded-inset border border-dashed border-ink/14">
              <svg aria-hidden viewBox="0 0 600 150" preserveAspectRatio="none" className="absolute inset-0 size-full">
                <path
                  d="M0 110 C80 100,140 70,220 84 S360 50,440 62 S540 40,600 44"
                  fill="none"
                  stroke="#E8B04A"
                  strokeOpacity=".5"
                  strokeWidth="1.5"
                  strokeDasharray="6 14"
                  vectorEffect="non-scaling-stroke"
                  style={{ animation: "j-dash 3s linear infinite" }}
                />
              </svg>
              <p className="relative font-mono text-[11px] tracking-[0.16em] text-dim">PRICE CHART APPEARS AT LAUNCH</p>
            </div>
          </div>
        </Panel>

        <div className="grid gap-5 lg:grid-cols-3">
          <Panel className="flex flex-col">
            <PanelHead label="Your position" meta={<Pill size="sm">Wallet not linked</Pill>} />
            <Rows
              rows={[
                ["Balance", <><Ph>[AMOUNT]</Ph> $[TICKER]</>],
                ["Value", <Ph key="v">[USD_VALUE]</Ph>],
                ["Wallet", "—"],
              ]}
            />
            <div className="mt-auto px-[22px] pb-[22px]">
              <button type="button" disabled className="g-btn g-btn-secondary g-btn-xs w-full cursor-not-allowed opacity-60" title="Available at launch">
                Link a wallet
              </button>
              <p className="mt-3 text-[13px] leading-relaxed text-dim">
                GAUGE never holds funds. Wallet flow is a placeholder until launch.
              </p>
            </div>
          </Panel>
          <Panel>
            <PanelHead label="Token facts" meta={<span className="app-meta">fill before launch</span>} />
            <Rows
              rows={[
                ["Chain", <Ph key="c">[CHAIN]</Ph>],
                ["Contract", <Ph key="a">[CONTRACT_ADDRESS]</Ph>],
                ["Supply", <Ph key="s">[SUPPLY]</Ph>],
                ["Decimals", <Ph key="d">[DECIMALS]</Ph>],
                ["Launch", <Ph key="l">[LAUNCH_DATE]</Ph>],
                ["Explorer", <Ph key="e">[EXPLORER_URL]</Ph>],
              ]}
            />
          </Panel>
          <Panel>
            <PanelHead label="Launch checklist" meta={<Pill size="sm">0/5</Pill>} />
            <ul className="px-[22px] pb-3">
              {["Ticker and name", "Utility inside GAUGE", "Contract address", "Chain and explorer", "Launch date"].map((item) => (
                <li key={item} className="flex items-center gap-3 border-b border-line-row py-3 text-[14px] text-ink-2 last:border-b-0">
                  <span aria-hidden className="size-4 rounded-[5px] border border-ink/20" />
                  {item}
                  <span className="sr-only">, not done</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <section aria-labelledby="utility">
          <div className="mb-3 flex items-baseline justify-between px-1">
            <h2 id="utility" className="app-ph-label">Utility inside GAUGE</h2>
            <span className="app-meta">three slots · defined at launch</span>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["01", "[UTILITY_1]", "What holding $[TICKER] changes inside GAUGE. Written once the token design is final."],
              ["02", "[UTILITY_2]", "A second benefit, if any. Leave empty rather than invent one."],
              ["03", "[UTILITY_3]", "A third benefit, if any. Leave empty rather than invent one."],
            ].map(([n, title, body]) => (
              <Panel key={n} className="p-[22px]">
                <p className="font-mono text-[12px] text-accent">{n}</p>
                <h3 className="mt-2 font-mono text-[16px] text-thin">{title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{body}</p>
              </Panel>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
