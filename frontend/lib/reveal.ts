import type { CSSProperties } from "react";

/**
 * Animate on scroll (landing). Pair with className="g-reveal"; add "g-rk" to
 * a panel so its own children assemble in sequence after it lands.
 * The element starts offset by (x, y), faded and blurred, and comes together
 * when it scrolls into view. Scrolling back up past it scatters it again.
 * `delay` is in ms.
 */
export function reveal({ x = 0, y = 32, delay = 0 }: { x?: number; y?: number; delay?: number } = {}): CSSProperties {
  return { "--rx": `${x}px`, "--ry": `${y}px`, "--rdl": `${delay}ms` } as CSSProperties;
}

/** Item c of n in a row: outer items converge from their side, staggered left to right. */
export function revealInRow(c: number, n: number): CSSProperties {
  const t = n === 1 ? 0 : (c / (n - 1)) * 2 - 1; // −1 … 1
  return reveal({ x: t * 48, y: 36, delay: c * 90 });
}
