/**
 * Hero stage 1440 × 980 (design.md §8, animations.md §3–5).
 * Pure SVG + CSS keyframes + SMIL; no client JS.
 *
 * `compact` (below lg) crops to the gap region on the right (bracket and
 * labels) and drops the paint-heavy layers: no Gaussian blurs and no
 * breathing on the 1200px circles, which repaint every frame on phones.
 * The rim and token glow become plain soft strokes instead.
 */
const CASH_D =
  "M640 452 C720 446,780 470,850 460 S960 430,1030 442 S1130 470,1200 448 S1330 430,1440 440";
const TOKEN_D =
  "M640 470 C720 466,780 482,850 470 S960 400,1030 386 S1130 378,1200 364 S1330 350,1440 346";

const mono = { fontFamily: "var(--font-mono)" } as const;

export function HeroArt({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  // Unique ids per instance: gradients inside a display:none SVG don't resolve.
  const p = compact ? "gm" : "gd";
  const url = (id: string) => `url(#${p}${id})`;

  return (
    <svg
      viewBox={compact ? "600 250 840 440" : "0 0 1440 980"}
      preserveAspectRatio={compact ? "xMaxYMid slice" : "xMidYMax slice"}
      className={`absolute inset-0 size-full ${className}`}
      role="img"
      aria-label="Two price lines: the token price rides above the stock price. The bracket between them at the right edge is the difference, widening and narrowing."
    >
      <defs>
        <radialGradient
          id={`${p}Atm`}
          cx="980"
          cy="1640"
          r="1260"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".84" stopColor="#B2D450" stopOpacity="0" />
          <stop offset=".95" stopColor="#B2D450" stopOpacity=".22" />
          <stop offset="1" stopColor="#B2D450" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${p}Rim`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B2D450" stopOpacity="0" />
          <stop offset=".35" stopColor="#E4F5A6" stopOpacity=".9" />
          <stop offset=".62" stopColor="#B2D450" />
          <stop offset="1" stopColor="#B2D450" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${p}Fade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F9F7F4" stopOpacity="0" />
          <stop offset=".25" stopColor="#F9F7F4" stopOpacity=".9" />
          <stop offset="1" stopColor="#F9F7F4" stopOpacity=".9" />
        </linearGradient>
        <linearGradient id={`${p}FadeL`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B2D450" stopOpacity="0" />
          <stop offset=".25" stopColor="#B2D450" stopOpacity="1" />
          <stop offset="1" stopColor="#B2D450" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`${p}Shaft`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F9F7F4" stopOpacity="1" />
          <stop offset="1" stopColor="#F9F7F4" stopOpacity="0" />
        </linearGradient>
        {!compact && (
          <>
            <filter
              id={`${p}Blur`}
              x="-10%"
              y="-10%"
              width="120%"
              height="120%"
            >
              <feGaussianBlur stdDeviation="18" />
            </filter>
            <filter id={`${p}Soft`}>
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </>
        )}
        <pattern
          id={`${p}Grid`}
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M48 0H0V48"
            fill="none"
            stroke="#F9F7F4"
            strokeOpacity=".035"
          />
        </pattern>
      </defs>

      {/* 1 · grid */}
      <rect width="1440" height="980" fill={url("Grid")} />

      {/* 2–4 · atmosphere, planet, rim */}
      <circle
        cx="980"
        cy="1640"
        r="1260"
        fill={url("Atm")}
        style={
          compact
            ? undefined
            : { animation: "g-breathe 9s ease-in-out infinite" }
        }
      />
      <circle cx="980" cy="1640" r="1200" fill="#07080A" />
      {compact ? (
        <circle
          cx="980"
          cy="1640"
          r="1200"
          fill="none"
          stroke={url("Rim")}
          strokeWidth="8"
          opacity=".22"
        />
      ) : (
        <circle
          cx="980"
          cy="1640"
          r="1200"
          fill="none"
          stroke={url("Rim")}
          strokeWidth="10"
          filter={url("Blur")}
          opacity=".9"
          style={{ animation: "g-breathe 9s ease-in-out infinite" }}
        />
      )}
      <circle
        cx="980"
        cy="1640"
        r="1200"
        fill="none"
        stroke={url("Rim")}
        strokeWidth="1.5"
      />

      {/* 5 · light shafts */}
      <rect
        x="1012"
        y="0"
        width="1"
        height="980"
        fill={url("Shaft")}
        opacity=".2"
      />
      <rect
        x="1184"
        y="0"
        width="1"
        height="980"
        fill={url("Shaft")}
        opacity=".1"
      />
      <rect
        x="842"
        y="0"
        width="1"
        height="980"
        fill={url("Shaft")}
        opacity=".05"
      />

      {/* 6 · cash line (A1) + flow overlay (A4) */}
      <path
        d={CASH_D}
        fill="none"
        stroke={url("Fade")}
        strokeWidth="2"
        pathLength={100}
        strokeDasharray="100"
        style={{ animation: "g-draw 2.4s var(--ease-enter) .3s both" }}
      />
      <path
        d={CASH_D}
        fill="none"
        stroke="#F9F7F4"
        strokeOpacity=".35"
        strokeWidth="2"
        strokeDasharray="2 22"
        style={{ animation: "g-flow 2.2s linear infinite" }}
      />

      {/* 7 · gap bracket (A2b), scales from the cash end */}
      <g
        style={{
          transformOrigin: "1200px 448px",
          animation: "g-brk 6s ease-in-out infinite",
        }}
      >
        <rect
          x="1195"
          y="364"
          width="10"
          height="84"
          rx="5"
          fill="#B2D450"
          opacity=".18"
        />
        <line
          x1="1200"
          y1="366"
          x2="1200"
          y2="446"
          stroke="#B2D450"
          strokeWidth="1.5"
          strokeDasharray="3 4"
        />
      </g>

      {/* 8 · cash end marker */}
      <circle cx="1200" cy="448" r="5" fill="#F9F7F4" />

      {/* 9 · token group (A2a): line, glow, tick, marker, label */}
      <g style={{ animation: "g-lime 6s ease-in-out infinite" }}>
        <path
          d={TOKEN_D}
          fill="none"
          stroke={url("FadeL")}
          strokeWidth={compact ? 7 : 10}
          opacity={compact ? 0.16 : 0.35}
          filter={compact ? undefined : url("Soft")}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="100"
          style={{ animation: "g-draw 2.4s var(--ease-enter) .5s both" }}
        />
        <path
          d={TOKEN_D}
          fill="none"
          stroke={url("FadeL")}
          strokeWidth="2.5"
          pathLength={100}
          strokeDasharray="100"
          style={{ animation: "g-draw 2.4s var(--ease-enter) .5s both" }}
        />
        {/* A3 · travelling tick */}
        <circle className="g-tick" r="12" fill="#B2D450" opacity=".25">
          <animateMotion dur="4s" repeatCount="indefinite" path={TOKEN_D} />
        </circle>
        <circle className="g-tick" r="4" fill="#E4F5A6">
          <animateMotion dur="4s" repeatCount="indefinite" path={TOKEN_D} />
        </circle>
        {/* A5 · marker halo */}
        <circle
          cx="1200"
          cy="364"
          r="14"
          fill="#B2D450"
          fillOpacity=".25"
          style={{ animation: "g-gap 1.6s ease-in-out infinite" }}
        />
        <circle cx="1200" cy="364" r="5" fill="#B2D450" />
        <text
          x="1222"
          y="352"
          fontSize={compact ? 14 : 12}
          letterSpacing="2"
          fill="#B2D450"
          style={mono}
        >
          TOKEN PRICE
        </text>
      </g>

      {/* 10 · static labels */}
      <text
        x="1222"
        y="412"
        fontSize={compact ? 17 : 15}
        fontWeight="600"
        letterSpacing="2"
        fill="#B2D450"
        style={{ ...mono, animation: "g-gap 3s ease-in-out infinite" }}
      >
        THE GAP
      </text>
      <text
        x="1222"
        y="468"
        fontSize={compact ? 14 : 12}
        letterSpacing="2"
        fill="#F9F7F4"
        fillOpacity=".7"
        style={mono}
      >
        STOCK PRICE
      </text>
    </svg>
  );
}
