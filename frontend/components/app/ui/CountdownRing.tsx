import { RULES } from "@/lib/gauge/model";
import { formatClock } from "@/lib/format";

const CIRC = 339.29; // 2π · 54

type RingProps = {
  t: number;
  /** 132 (Home) or 200 (Card). */
  size: 132 | 200;
  label: string;
};

/**
 * Countdown ring in a 124 viewBox (design.md §5B.12 I). Home: stroke 7,
 * clock 24, label 8. Card: stroke 6, inner dotted ring r46, clock 22, label 6.5.
 */
export function CountdownRing({ t, size, label }: RingProps) {
  const card = size === 200;
  return (
    <svg
      viewBox="0 0 124 124"
      width={size}
      height={size}
      role="img"
      aria-label={`Card expires in ${t} seconds`}
      className="flex-none"
    >
      {card && (
        <circle cx="62" cy="62" r="46" fill="none" stroke="#F9F7F4" strokeOpacity=".08" strokeDasharray="1 4.82" />
      )}
      <circle cx="62" cy="62" r="54" fill="none" stroke="#1C1F23" strokeWidth={card ? 6 : 7} />
      <circle
        cx="62"
        cy="62"
        r="54"
        fill="none"
        stroke="#B2D450"
        strokeWidth={card ? 6 : 7}
        strokeLinecap="round"
        strokeDasharray={CIRC}
        strokeDashoffset={CIRC * (1 - t / RULES.cardLife)}
        transform="rotate(-90 62 62)"
        style={{ transition: "stroke-dashoffset 1s linear", filter: "drop-shadow(0 0 6px rgba(178,212,80,.6))" }}
      />
      <text
        x="62"
        y="62"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#F9F7F4"
        style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: card ? 22 : 24, letterSpacing: "-0.04em" }}
      >
        {formatClock(t)}
      </text>
      <text
        x="62"
        y={card ? 78 : 80}
        textAnchor="middle"
        fill="#80848A"
        style={{ fontFamily: "var(--font-mono)", fontSize: card ? 6.5 : 8, letterSpacing: 1.2 }}
      >
        {label}
      </text>
    </svg>
  );
}
