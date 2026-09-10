"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MobileMenuOverlay = dynamic(() => import("./MobileMenuOverlay"), {
  ssr: false,
});

export default function MobileMenu({
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

      <MobileMenuOverlay
        links={links}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
