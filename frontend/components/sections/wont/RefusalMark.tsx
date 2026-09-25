/**
 * G1 · 28px ✕: circle at 60% cost-red, 1.6px cross that draws in and out (6s).
 * Authored rather than library-drawn because the cross itself animates.
 */
export function RefusalMark({ delay = 0 }: { delay?: number }) {
  return (
    <svg viewBox="0 0 28 28" width="28" height="28" aria-hidden className="flex-none">
      <circle cx="14" cy="14" r="12.5" fill="none" stroke="#FF6B5E" strokeOpacity=".6" strokeWidth="1.6" />
      <path
        d="M10 10 L18 18 M18 10 L10 18"
        fill="none"
        stroke="#FF6B5E"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="30"
        style={{ animation: `g-xdraw 6s ease-in-out ${delay}s infinite` }}
      />
    </svg>
  );
}
