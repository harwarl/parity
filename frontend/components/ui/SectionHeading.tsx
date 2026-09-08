import type { ReactNode } from "react";

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <div
        className={`flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-muted ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="text-accent">{index}</span>
        <span className="text-muted-dim">/</span>
        <span>{eyebrow}</span>
      </div>
      <h2 className="mt-4 text-balance text-2xl font-semibold text-foreground sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 max-w-2xl text-sm text-muted sm:text-base ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
