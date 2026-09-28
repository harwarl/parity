import type { CSSProperties, ReactNode } from "react";

/**
 * "Why you can trust it": four cells whose icons draw in and get a ✓, one
 * after another (L5, 8s, staggered by --d). Lime stroke icons, 24px, 1.6.
 */
const icon = (paths: ReactNode) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#B2D450" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="flex-none">
    {paths}
  </svg>
);

const cells = [
  {
    d: "0s",
    title: "Practice by default",
    sub: "Paper mode is on until you switch it off.",
    icon: icon(
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 9h6M9 13h6" />
      </>,
    ),
  },
  {
    d: ".8s",
    title: "No custody",
    sub: "Your money never leaves your Robinhood account.",
    icon: icon(
      <>
        <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </>,
    ),
  },
  {
    d: "1.6s",
    title: "You tap, it doesn't",
    sub: "No order without your confirmation. Ever.",
    icon: icon(
      <>
        <path d="M9 11V5a1.5 1.5 0 0 1 3 0v5" />
        <path d="M12 10V8.5a1.5 1.5 0 0 1 3 0V11" />
        <path d="M15 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-5.2-3l-1.6-2.8a1.5 1.5 0 0 1 2.6-1.5L9 15" />
      </>,
    ),
  },
  {
    d: "2.4s",
    title: "Official connection",
    sub: "Live orders go through Robinhood's official Trading MCP.",
    icon: icon(<path d="M9 7H7a5 5 0 0 0 0 10h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8" />),
  },
];

export function TrustStrip() {
  return (
    <div
      role="list"
      aria-label="Why you can trust it"
      className="g-panel g-trust mt-5 grid lg:grid-cols-4"
    >
      {cells.map((c) => (
        <div
          key={c.title}
          role="listitem"
          className="flex gap-3.5 border-b border-ink/7 p-7 last:border-b-0 lg:border-r lg:border-b-0 lg:last:border-r-0"
          style={{ "--d": c.d } as CSSProperties}
        >
          {c.icon}
          <div>
            <p className="flex items-center gap-2 text-[15px] font-bold text-ink">
              {c.title}
              <span
                aria-hidden
                className="g-check grid size-[18px] place-items-center rounded-full bg-accent/14 text-[10px] text-accent"
              >
                ✓
              </span>
            </p>
            <p className="mt-1 text-[14px] leading-[1.5] text-muted">{c.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
