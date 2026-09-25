/** J2 · 1px lime scan along a panel's top edge (4.6s, the app's own clock). */
export function ScanLine() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden rounded-t-panel">
      <span
        className="block h-full w-1/2"
        style={{
          background: "linear-gradient(90deg, transparent, #B2D450, transparent)",
          animation: "j-scan 4.6s linear infinite",
        }}
      />
    </span>
  );
}
