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

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 flex size-9 items-center justify-center rounded-md border border-line-strong text-text"
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

      <div
        className={`fixed inset-0 top-14 z-40 flex flex-col transition-opacity duration-200 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        style={{ background: "var(--ground)" }}
        aria-hidden={!open}
      >
        <nav className="flex flex-col divide-y divide-line border-t border-line">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${60 + i * 35}ms` : "0ms" }}
              className={`px-6 py-4 text-[1rem] text-text-dim transition-all duration-300 hover:text-text ${
                open ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-line p-6">
          <Link
            href="/#waitlist"
            onClick={() => setOpen(false)}
            className="flex h-12 items-center justify-center rounded-md bg-green px-5 text-sm font-medium text-green-ink"
          >
            Join the waitlist
          </Link>
          <p className="tnum mt-4 text-[0.7rem] leading-relaxed text-text-mute">
            Signals, not advice. Paper is the default. PARITY does not place.
          </p>
        </div>
      </div>
    </div>
  );
}
