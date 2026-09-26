import type { ReactNode } from "react";

/** Callout .note: TIP/NOTE/RULE (lime) or ORDER/REQUIRED (amber), full border. */
export function Note({
  tone,
  tag,
  lead,
  children,
}: {
  tone: "tip" | "warn";
  tag: string;
  lead: string;
  children?: ReactNode;
}) {
  const tip = tone === "tip";
  return (
    <div
      role="note"
      className={`flex gap-3.5 rounded-inset border px-[18px] py-4 text-[15px] leading-[1.65] ${
        tip ? "border-accent/30 bg-accent/6 text-[#D9EBA0]" : "border-thin/35 bg-thin/6 text-[#F0D39A]"
      }`}
    >
      <span className={`flex-none pt-0.5 font-mono text-[12px] tracking-[0.08em] ${tip ? "text-accent" : "text-thin"}`}>
        {tag}
      </span>
      <p className="!text-[15px] !leading-[1.65] !text-inherit">
        <strong className="!text-inherit">{lead}</strong> {children}
      </p>
    </div>
  );
}
