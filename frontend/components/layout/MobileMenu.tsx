"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function MobileMenu({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex size-9 items-center justify-center rounded-md border border-line-strong text-text"
      >
        <span className="relative block h-3 w-4">
          <span
            className={`absolute left-0 block h-px w-4 bg-current transition-transform duration-200 ${
              open ? "top-1.5 rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute left-0 top-1.5 block h-px w-4 bg-current transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 block h-px w-4 bg-current transition-transform duration-200 ${
              open ? "top-1.5 -rotate-45" : "top-3"
            }`}
          />
        </span>
      </button>

      {open ? (
        <div className="fixed inset-x-0 top-14 bottom-0 z-40 border-t border-line bg-ground">
          <nav className="flex flex-col divide-y divide-line">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-6 py-4 text-[0.95rem] text-text-dim transition-colors hover:text-text"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/#waitlist"
              onClick={() => setOpen(false)}
              className="m-6 mt-8 inline-flex h-11 items-center justify-center rounded-md bg-green px-5 text-sm font-medium text-green-ink"
            >
              Join the waitlist
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
