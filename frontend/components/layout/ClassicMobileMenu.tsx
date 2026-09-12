"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const ClassicMobileMenuOverlay = dynamic(
  () => import("./ClassicMobileMenuOverlay"),
  { ssr: false },
);

/** Frozen copy of the pre-redesign MobileMenu, kept for /classic only. Do not edit. */
export default function ClassicMobileMenu({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-[70] flex size-11 items-center justify-center rounded-md border border-line-strong text-text"
      >
        <span className="relative block h-3.5 w-5">
          <span
            className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-200 ${
              open ? "top-1.5 rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute left-0 top-1.5 block h-px w-5 bg-current transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-200 ${
              open ? "top-1.5 -rotate-45" : "top-3"
            }`}
          />
        </span>
      </button>

      <ClassicMobileMenuOverlay
        links={links}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
