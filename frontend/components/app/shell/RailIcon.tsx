/**
 * Rail icons, 18px, stroke 1.6, currentColor. Paths are the spec's own
 * (design.md §5B.2), not a library set, so they match the artboards.
 */
export type RailIconName = "home" | "watchlist" | "card" | "history" | "token" | "settings" | "search";

export function RailIcon({ name, size = 18 }: { name: RailIconName; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {name === "home" && <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />}
      {name === "watchlist" && (
        <>
          <path d="M3 17l5-5 4 3 8-8" />
          <path d="M3 21h18" />
        </>
      )}
      {name === "card" && (
        <>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="M3 10h18" />
        </>
      )}
      {name === "history" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      )}
      {name === "token" && (
        <>
          <path d="M12 2.5l8.2 4.75v9.5L12 21.5l-8.2-4.75v-9.5z" />
          <path d="M9 12h6" />
        </>
      )}
      {name === "settings" && (
        <>
          <path d="M4 6h16M4 12h16M4 18h16" />
          <circle cx="9" cy="6" r="2" fill="var(--color-rail)" />
          <circle cx="15" cy="12" r="2" fill="var(--color-rail)" />
          <circle cx="8" cy="18" r="2" fill="var(--color-rail)" />
        </>
      )}
      {name === "search" && (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </>
      )}
    </svg>
  );
}
