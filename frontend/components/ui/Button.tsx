import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 h-10 text-sm font-medium tracking-tight transition-[transform,background-color,border-color,color] duration-150 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "bg-green text-green-ink hover:bg-[#12e888]",
  ghost:
    "border border-line-strong text-text-dim hover:border-text-mute hover:text-text",
};

export function Button({
  variant = "ghost",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "ghost",
  className = "",
  href,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
