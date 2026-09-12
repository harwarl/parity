const SKIP_CODES = [
  { code: "DUST", count: 11 },
  { code: "THIN", count: 6 },
  { code: "STALE", count: 4 },
  { code: "CLOSED", count: 2 },
];

const MAX = Math.max(...SKIP_CODES.map((s) => s.count));

const STATS = [
  { k: "Promised avg", v: "+24 bps", tone: "dim" as const },
  { k: "Captured avg", v: "+19 bps", tone: "green" as const },
  { k: "Slippage to card", v: "−5 bps", tone: "halt" as const },
];

/**
 * 7-day paper diary — skip-code frequency and the promised-vs-captured read.
 * Bars are neutral counts, not a good/bad signal, so they stay off the one
 * green accent (reserved for the actionable net-bps figure elsewhere).
 */
export default function PaperDiary() {
  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <p className="eyebrow">Paper diary · 7 days</p>

      <div className="mt-4">
        <p className="text-[0.72rem] uppercase tracking-widest text-text-mute">
          Skip codes
        </p>
        <div className="mt-3 space-y-2.5">
          {SKIP_CODES.map((s) => (
            <div key={s.code} className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-[0.78rem] text-text-dim">
                {s.code}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                <span
                  className="block h-full rounded-full bg-text-mute"
                  style={{ width: `${(s.count / MAX) * 100}%` }}
                />
              </div>
              <span className="tnum w-6 shrink-0 text-right text-[0.78rem] text-text-dim">
                {s.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <dl className="mt-5 space-y-2 border-t border-line pt-4">
        {STATS.map((s) => (
          <div key={s.k} className="flex items-center justify-between">
            <dt className="text-[0.8rem] text-text-mute">{s.k}</dt>
            <dd
              className={`tnum text-[0.85rem] ${
                s.tone === "green"
                  ? "text-green"
                  : s.tone === "halt"
                    ? "text-halt"
                    : "text-text-dim"
              }`}
            >
              {s.v}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-[0.75rem] leading-relaxed text-text-mute">
        12 fills · 3 cards expired unconfirmed. This panel is the read on
        whether the signal survives contact with a real fill.
      </p>
    </div>
  );
}
