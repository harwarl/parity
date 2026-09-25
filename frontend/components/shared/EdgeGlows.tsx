/**
 * Z · three blurred lime blobs at the page edges, drifting on g-drift
 * (design.md §4, animations.md §7). Decorative.
 */
const glows = [
  { size: 760, top: 1500, side: { left: -380 }, alpha: 0.1, blur: 40, anim: "g-drift 38s ease-in-out infinite" },
  { size: 820, top: 2900, side: { right: -420 }, alpha: 0.08, blur: 50, anim: "g-drift 46s ease-in-out -12s infinite" },
  { size: 800, top: 4500, side: { left: -420 }, alpha: 0.08, blur: 50, anim: "g-drift 42s ease-in-out -20s infinite" },
];

export function EdgeGlows() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 max-md:hidden">
      {glows.map((g) => (
        <div
          key={g.top}
          className="absolute rounded-full"
          style={{
            width: g.size,
            height: g.size,
            top: g.top,
            ...g.side,
            background: `radial-gradient(closest-side, rgba(178,212,80,${g.alpha}), transparent)`,
            filter: `blur(${g.blur}px)`,
            animation: g.anim,
          }}
        />
      ))}
    </div>
  );
}
