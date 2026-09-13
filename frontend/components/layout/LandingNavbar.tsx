"use client";

import Link from "next/link";
import Container from "./Container";
import MobileMenu from "./MobileMenu";

const links = [
  { label: "App", href: "/app" },
  { label: "Lend", href: "#lend" },
  { label: "Oracle", href: "#oracle" },
  { label: "Docs", href: "#docs" },
  { label: "Deck", href: "#deck" },
];

/**
 * Header for the new "/" landing page only — a different nav shape (App /
 * Lend / Oracle / Docs / Deck + a wallet pill) than the shared Navbar used by
 * /about and /app, so it lives on its own rather than forcing those pages to
 * carry links that don't apply to them.
 */
export default function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ground/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between md:h-14">
        <div className="flex items-center gap-8 lg:gap-10">
          <Link href="/" className="flex items-center gap-2 text-text" aria-label="GAUGE home">
            <GaugeMark />
            <span className="text-[1.05rem] font-semibold tracking-tight md:text-[0.95rem]">
              GAUGE
            </span>
          </Link>

          <nav className="hidden items-center gap-5 text-[0.85rem] text-text-dim md:flex lg:gap-7">
            {links.map((l) => (
              <Link key={l.label} href={l.href} className="transition-colors hover:text-text">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <span className="tnum rounded-md border border-line-strong bg-surface px-3 py-1.5 text-[0.78rem] text-text-dim">
            0x825b&hellip;bc48
          </span>
          <Link
            href="#waitlist"
            className="inline-flex h-9 items-center justify-center rounded-md bg-green px-4 text-[0.8rem] font-medium text-green-ink transition-colors hover:bg-[#12e888]"
          >
            Get paper account
          </Link>
        </div>

        <MobileMenu links={links} />
      </Container>
    </header>
  );
}

function GaugeMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="1" y="1" width="22" height="22" rx="6" fill="var(--green)" />
      <path
        d="M12 6.5v5.5l4 2.3"
        stroke="var(--green-ink)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
