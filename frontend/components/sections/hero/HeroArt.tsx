/**
 * Hero stage 1440 × 980 (design.md §8, animations.md §3–5).
 * Pure SVG + CSS keyframes + SMIL; no client JS.
 */
const CASH_D =
  "M640 452 C720 446,780 470,850 460 S960 430,1030 442 S1130 470,1200 448 S1330 430,1440 440";
const TOKEN_D =
  "M640 470 C720 466,780 482,850 470 S960 400,1030 386 S1130 378,1200 364 S1330 350,1440 346";

const mono = { fontFamily: "var(--font-mono)" } as const;

export function HeroArt() {
  return (
    <svg
      viewBox="0 0 1440 980"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 size-full"
      role="img"
      aria-label="Two price lines: the token per share rides above the cash mid. The bracket between them at the right edge is the live gap, widening and narrowing."
    >
      <defs>
        <radialGradient id="gAtm" cx="980" cy="1640" r="1260" gradientUnits="userSpaceOnUse">
          <stop offset=".84" stopColor="#B2D450" stopOpacity="0" />
          <stop offset=".95" stopColor="#B2D450" stopOpacity=".22" />
          <stop offset="1" stopColor="#B2D450" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gRim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B2D450" stopOpacity="0" />
          <stop offset=".35" stopColor="#E4F5A6" stopOpacity=".9" />
          <stop offset=".62" stopColor="#B2D450" />
          <stop offset="1" stopColor="#B2D450" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F9F7F4" stopOpacity="0" />
          <stop offset=".25" stopColor="#F9F7F4" stopOpacity=".9" />
          <stop offset="1" stopColor="#F9F7F4" stopOpacity=".9" />
        </linearGradient>
        <linearGradient id="gFadeL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B2D450" stopOpacity="0" />
          <stop offset=".25" stopColor="#B2D450" stopOpacity="1" />
          <stop offset="1" stopColor="#B2D450" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="gShaft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F9F7F4" stopOpacity="1" />
          <stop offset="1" stopColor="#F9F7F4" stopOpacity="0" />
        </linearGradient>
        <filter id="gBlur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id="gSoft">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <pattern id="gGrid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M48 0H0V48" fill="none" stroke="#F9F7F4" strokeOpacity=".035" />
        </pattern>
      </defs>

      {/* 1 · grid */}
      <rect width="1440" height="980" fill="url(#gGrid)" />

      {/* 2–4 · atmosphere, planet, rim */}
      <circle
        cx="980"
        cy="1640"
        r="1260"
        fill="url(#gAtm)"
        style={{ animation: "g-breathe 9s ease-in-out infinite" }}
      />
      <circle cx="980" cy="1640" r="1200" fill="#07080A" />
      <circle
        cx="980"
        cy="1640"
        r="1200"
        fill="none"
        stroke="url(#gRim)"
        strokeWidth="10"
        filter="url(#gBlur)"
        opacity=".9"
        style={{ animation: "g-breathe 9s ease-in-out infinite" }}
      />
      <circle cx="980" cy="1640" r="1200" fill="none" stroke="url(#gRim)" strokeWidth="1.5" />

      {/* 5 · light shafts */}
      <rect x="1012" y="0" width="1" height="980" fill="url(#gShaft)" opacity=".2" />
      <rect x="1184" y="0" width="1" height="980" fill="url(#gShaft)" opacity=".1" />
      <rect x="842" y="0" width="1" height="980" fill="url(#gShaft)" opacity=".05" />

      {/* 6 · cash line (A1) + flow overlay (A4) */}
      <path
        d={CASH_D}
        fill="none"
        stroke="url(#gFade)"
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
      <g style={{ transformOrigin: "1200px 448px", animation: "g-brk 6s ease-in-out infinite" }}>
        <rect x="1195" y="364" width="10" height="84" rx="5" fill="#B2D450" opacity=".18" />
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
          stroke="url(#gFadeL)"
          strokeWidth="10"
          opacity=".35"
          filter="url(#gSoft)"
          pathLength={100}
          strokeDasharray="100"
          style={{ animation: "g-draw 2.4s var(--ease-enter) .5s both" }}
        />
        <path
          d={TOKEN_D}
          fill="none"
          stroke="url(#gFadeL)"
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
        <text x="1222" y="352" fontSize="12" letterSpacing="2" fill="#B2D450" style={mono}>
          TOKEN / SHARE
        </text>
      </g>

      {/* 10 · static labels */}
      <text
        x="1222"
        y="412"
        fontSize="15"
        fontWeight="600"
        letterSpacing="2"
        fill="#B2D450"
        style={{ ...mono, animation: "g-gap 3s ease-in-out infinite" }}
      >
        GAP · LIVE
      </text>
      <text x="1222" y="468" fontSize="12" letterSpacing="2" fill="#F9F7F4" fillOpacity=".7" style={mono}>
        CASH MID
      </text>
    </svg>
  );
}
