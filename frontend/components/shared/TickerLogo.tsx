import type { CSSProperties } from "react";
import { LOGOS } from "@/config/logos";

/**
 * A company's logo inside a round ticker badge, in the badge's text colour
 * (`currentColor`), or the ticker text when there's no logo file. Always
 * decorative: the symbol is printed beside every badge.
 */
export function TickerLogo({ sym, size }: { sym: string; size: number }) {
  const logo = LOGOS[sym];
  if (!logo) return <>{sym}</>;
  const px = Math.round(size * (logo.scale ?? 0.56));
  const mask = `url(${logo.src}) center / contain no-repeat`;
  const style: CSSProperties = {
    width: px,
    height: px,
    backgroundColor: "currentColor",
    mask,
    WebkitMask: mask,
    maskMode: logo.mode,
  };
  return <span aria-hidden className="block" style={style} />;
}
