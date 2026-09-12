import type { ReactNode, SVGProps } from "react";

/**
 * One hand-drawn icon set — 16px grid, 1.5 stroke, round caps, currentColor.
 * Keep every glyph in this file so the weight stays consistent project-wide.
 */

type Name =
  | "activity"
  | "clock"
  | "infinity"
  | "lock"
  | "freeze"
  | "route"
  | "layers"
  | "shield"
  | "arrow"
  | "help"
  | "bell"
  | "download"
  | "search"
  | "info"
  | "chevronDown";

const paths: Record<Name, ReactNode> = {
  activity: <path d="M1.5 8h3l2-5 3 10 2-5h3.5" />,
  clock: (
    <>
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 4.5V8l2.5 1.5" />
    </>
  ),
  infinity: (
    <path d="M5 8c0-1.7-1.1-2.8-2.4-2.8S.5 6.3.5 8 1.6 10.8 3 10.8C5.5 10.8 6.5 5.2 9 5.2c1.4 0 2.5 1.1 2.5 2.8S10.4 10.8 9 10.8C6.5 10.8 5.5 8 5 8Z" />
  ),
  lock: (
    <>
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" />
    </>
  ),
  freeze: (
    <>
      <path d="M8 1.5v13M2.4 4.75l11.2 6.5M13.6 4.75 2.4 11.25" />
      <path d="M8 1.5 6.4 3.1M8 1.5l1.6 1.6M8 14.5l-1.6-1.6M8 14.5l1.6-1.6" />
    </>
  ),
  route: (
    <>
      <circle cx="4" cy="12" r="2" />
      <circle cx="12" cy="4" r="2" />
      <path d="M6 12h3a3 3 0 0 0 3-3V6" />
    </>
  ),
  layers: <path d="M8 1.8 14.5 5 8 8.2 1.5 5 8 1.8ZM1.5 8 8 11.2 14.5 8M1.5 11 8 14.2 14.5 11" />,
  shield: <path d="M8 1.5 13.5 3.5v4c0 3.6-2.4 6-5.5 7-3.1-1-5.5-3.4-5.5-7v-4L8 1.5Z" />,
  arrow: <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />,
  help: (
    <>
      <circle cx="8" cy="8" r="6.25" />
      <path d="M6.1 6.2c.15-1.05 1.05-1.7 1.95-1.7 1 0 1.85.62 1.85 1.6 0 1.05-.85 1.35-1.4 1.85-.4.36-.5.68-.5 1.15" />
      <circle cx="8" cy="11.35" r="0.35" fill="currentColor" stroke="none" />
    </>
  ),
  bell: (
    <>
      <path d="M8 2.2c-1.8 0-3.1 1.4-3.1 3.2v2.1c0 .5-.2 1-.5 1.4l-.7.9c-.4.5 0 1.2.6 1.2h7.4c.6 0 1-.7.6-1.2l-.7-.9c-.3-.4-.5-.9-.5-1.4V5.4c0-1.8-1.3-3.2-3.1-3.2Z" />
      <path d="M6.3 12.8c.2.75.9 1.3 1.7 1.3s1.5-.55 1.7-1.3" />
    </>
  ),
  download: (
    <>
      <path d="M8 2v7.2M5 6.7 8 9.7l3-3" />
      <path d="M2.5 11v1.5A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V11" />
    </>
  ),
  search: (
    <>
      <circle cx="6.8" cy="6.8" r="4.3" />
      <path d="M10.1 10.1 14 14" />
    </>
  ),
  info: (
    <>
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 7.3v4.2" />
      <circle cx="8" cy="4.9" r="0.4" fill="currentColor" stroke="none" />
    </>
  ),
  chevronDown: <path d="M4 6.2 8 10.2 12 6.2" />,
};

export default function Icon({
  name,
  size = 16,
  ...props
}: { name: Name; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
