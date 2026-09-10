"use client";

import Link from "next/link";
import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * The full-screen mobile nav panel. Portaled to <body> so it escapes the
 * header's backdrop-filter containing block (which would otherwise clip a
 * fixed child to the 64px header). Loaded client-only via next/dynamic, so
 * document.body is always defined here.
 */
export default function MobileMenuOverlay({
  links,
  open,
  onClose,
}: {
  links: { label: string; href: string }[];
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return createPortal(
    <div
      className={`fixed inset-0 top-16 z-[60] flex flex-col transition-opacity duration-200 md:hidden ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{ background: "var(--ground)" }}
      aria-hidden={!open}
    >
      <nav className="flex flex-col divide-y divide-line border-t border-line">
        {links.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={onClose}
            style={{ transitionDelay: open ? `${60 + i * 35}ms` : "0ms" }}
            className={`px-6 py-5 text-[1.2rem] tracking-tight text-text-dim transition-all duration-300 hover:text-text ${
              open ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-line p-6">
        <Link
          href="/#waitlist"
          onClick={onClose}
          className="flex h-12 items-center justify-center rounded-md bg-green px-5 text-[0.95rem] font-medium text-green-ink"
        >
          Join the waitlist
        </Link>
        <p className="tnum mt-4 text-[0.75rem] leading-relaxed text-text-mute">
          Signals, not advice. Paper is the default. TAPE does not place.
        </p>
      </div>
    </div>,
    document.body,
  );
}
