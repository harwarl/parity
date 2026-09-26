import type { ReactNode } from "react";

/** Formula block .formula, or the plainer worked-example variant. */
export function Formula({ label, children, example = false }: { label: string; children: ReactNode; example?: boolean }) {
  return (
    <div
      className={`rounded-2xl px-6 py-[22px] font-mono font-medium text-ink ${
        example ? "border border-ink/10 bg-[#0C0D10] text-[15px] leading-[1.7]" : "border border-accent/30 text-[17px] leading-[1.7]"
      }`}
      style={
        example
          ? undefined
          : { background: "radial-gradient(120% 120% at 0 0, rgba(178,212,80,.08), transparent 60%), #0C0D10" }
      }
    >
      <p className={`mb-2 text-[10.5px] tracking-[0.2em] ${example ? "text-dim" : "text-accent"}`}>{label}</p>
      <div>{children}</div>
    </div>
  );
}
