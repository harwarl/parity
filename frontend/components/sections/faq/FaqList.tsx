"use client";

import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { useId, useState } from "react";
import type { FaqItem } from "@/types/content";

/**
 * 5.9 · One row open at a time; the first is open by default. The answer
 * remounts on open so H1 (g-rise .6s) replays; H2 scans the open row's rule.
 */
export function FaqList({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="border-t border-ink/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <div key={item.question} className="relative border-b border-ink/10">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full cursor-pointer items-center justify-between gap-6 py-[26px] text-left text-[20px] font-semibold tracking-[-0.01em] text-ink transition-colors hover:text-accent-soft"
              >
                {item.question}
                {isOpen ? (
                  <MinusIcon size={18} className="flex-none text-accent" aria-hidden />
                ) : (
                  <PlusIcon size={18} className="flex-none text-accent" aria-hidden />
                )}
              </button>
            </h3>
            {isOpen && (
              <>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="g-p pr-[60px] pb-[30px] max-sm:pr-0"
                  style={{ animation: "g-rise .6s var(--ease-enter) both" }}
                >
                  {item.answer}
                </div>
                <span aria-hidden className="absolute inset-x-0 -bottom-px h-px overflow-hidden">
                  <span
                    className="block h-full w-2/5"
                    style={{
                      background: "linear-gradient(90deg, transparent, #B2D450, transparent)",
                      animation: "g-scan 3.4s linear infinite",
                    }}
                  />
                </span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
