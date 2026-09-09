import type { ReactNode } from "react";
import Reveal from "@/components/shared/Reveal";
import Container from "./Container";

/**
 * Standard section frame: hairline top rule with a green tick, tracked eyebrow,
 * tight heading, optional lede. More space above the heading than below it.
 */
export default function Section({
  id,
  eyebrow,
  heading,
  lede,
  children,
  className = "",
  surface = false,
}: {
  id?: string;
  eyebrow: string;
  heading: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  className?: string;
  surface?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 border-t border-line py-20 sm:py-28 ${
        surface ? "bg-surface" : ""
      } ${className}`}
    >
      <span
        aria-hidden
        className="absolute -top-px left-0 h-px w-16 bg-green/70"
      />
      <Container>
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-4 text-balance text-2xl font-medium leading-[1.12] tracking-[-0.02em] text-text sm:text-[2.15rem]">
            {heading}
          </h2>
          {lede ? (
            <p className="mt-4 text-pretty text-[0.95rem] leading-relaxed text-text-dim">
              {lede}
            </p>
          ) : null}
        </Reveal>
        {children ? <div className="mt-12 sm:mt-14">{children}</div> : null}
      </Container>
    </section>
  );
}
