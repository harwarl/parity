/** Quickstart step 05 · a static card at 0:52 with its four parts annotated. */
export function MiniCard() {
  const notes = [
    ["Countdown.", "75 s, then it's gone."],
    ["Net.", "What's left of the gap after every cost."],
    ["Do it.", "The only way an order is ever placed."],
    ["Skip.", "Nothing happens. The card still counts toward the cap."],
  ];
  return (
    <figure className="grid items-center gap-6 sm:grid-cols-[300px_1fr]">
      <div
        role="img"
        aria-label="A card for NVDA in live mode: 52 seconds left, net +9.4 bps, with Do it and Skip."
        className="rounded-[20px] border border-accent/45 p-5 shadow-[0_0_0_1px_rgba(178,212,80,.1),0_30px_80px_-30px_rgba(178,212,80,.3)]"
        style={{
          background:
            "radial-gradient(120% 90% at 0 0, rgba(178,212,80,.10), transparent 55%), linear-gradient(180deg,#131519,#0F1113)",
        }}
      >
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-dim">
          <span>CARD · NVDA</span>
          <span className="flex items-center gap-1.5 rounded-full border border-accent/40 px-2 py-0.5 text-accent">
            <span className="g-live !size-[5px]" /> LIVE
          </span>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <svg viewBox="0 0 124 124" width="84" height="84" aria-hidden>
            <circle cx="62" cy="62" r="54" fill="none" stroke="#1C1F23" strokeWidth="8" />
            <circle
              cx="62"
              cy="62"
              r="54"
              fill="none"
              stroke="#B2D450"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="339.29"
              strokeDashoffset="104"
              transform="rotate(-90 62 62)"
              style={{ filter: "drop-shadow(0 0 6px rgba(178,212,80,.6))" }}
            />
            <text x="62" y="62" textAnchor="middle" dominantBaseline="middle" fill="#F9F7F4" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26 }}>
              0:52
            </text>
          </svg>
          <div>
            <p className="font-display text-[30px] leading-none font-extrabold tracking-[-0.04em] text-accent">+9.4</p>
            <p className="mt-1.5 font-mono text-[11px] text-dim">net bps</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2" aria-hidden>
          <span className="grid h-9 flex-1 place-items-center rounded-full bg-accent text-[13px] font-bold text-accent-ink">Do it</span>
          <span className="grid h-9 place-items-center rounded-full border border-ink/18 px-4 text-[13px] font-bold text-ink">Skip</span>
        </div>
      </div>
      <figcaption>
        <ul className="!my-0 !list-none !pl-0">
          {notes.map(([k, v]) => (
            <li key={k} className="!my-2 !pl-0">
              <strong>{k}</strong> {v}
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
