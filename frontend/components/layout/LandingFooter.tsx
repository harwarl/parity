import Link from "next/link";

const links = [
  { label: "App", href: "/app" },
  { label: "Lend", href: "#" },
  { label: "Oracle", href: "#" },
  { label: "Docs", href: "#" },
  { label: "Deck", href: "#" },
];

const legal = [
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Risk Disclosures", href: "#" },
  { label: "Contact", href: "#" },
];

const socials = [
  { label: "X", href: "#", d: "M4 4l16 16M20 4 4 20" },
  {
    label: "GitHub",
    href: "#",
    d: "M8 15.5c-3 1-3-1.5-4.5-1.5m9 3v-2.7c0-.75.25-1.25.5-1.5-1.75-.2-3.5-.9-3.5-3.85 0-.85.3-1.55.8-2.1-.1-.2-.35-1 .1-2.1 0 0 .65-.2 2.1.8a7.3 7.3 0 0 1 3.8 0c1.45-1 2.1-.8 2.1-.8.45 1.1.2 1.9.1 2.1.5.55.8 1.25.8 2.1 0 3-1.75 3.65-3.5 3.85.3.25.55.7.55 1.5V19",
  },
  { label: "Discord", href: "#", d: "M5 15.5S3 10 4.5 6.5C6 5 8 5 8 5l.5 1s1.5-.4 3.5-.4 3.5.4 3.5.4l.5-1s2 0 3.5 1.5C21 10 19 15.5 19 15.5s-1.7 1.6-4 1.9l-.6-1.2s1.3-.5 1.6-1.1c0 0-2.5 1.3-5 1.3s-5-1.3-5-1.3c.3.6 1.6 1.1 1.6 1.1L7 17.4c-2.3-.3-4-1.9-4-1.9" },
  { label: "YouTube", href: "#", d: "M3.5 8.2s.2-1.4 .8-2c.75-.8 1.6-.8 2-.85 2.8-.2 7-.2 7-.2s4.2 0 7 .2c.4.05 1.25.05 2 .85.6.6.8 2 .8 2S23.5 9.9 23.5 11.6v1.5c0 1.7-.3 3.4-.3 3.4s-.2 1.4-.8 2c-.75.8-1.75.78-2.2.86-1.6.15-6.7.2-6.7.2s-5.2 0-6.7-.15c-.45-.08-1.45-.06-2.2-.86-.6-.6-.8-2-.8-2s-.3-1.7-.3-3.4v-1.5c0-1.7.3-3.4.3-3.4Z" },
];

/**
 * Footer for the new "/" landing page — App/Lend/Oracle/Docs/Deck repeated
 * next to the logo, social row, and the legal links, per the reference design.
 */
export default function LandingFooter() {
  return (
    <footer className="border-t border-line py-12">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 sm:px-12 lg:px-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-text">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="1" y="1" width="22" height="22" rx="6" fill="var(--green)" />
                <path d="M12 6.5v5.5l4 2.3" stroke="var(--green-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[0.95rem] font-semibold tracking-tight">GAUGE</span>
            </div>
            <p className="mt-2 text-[0.8rem] text-text-mute">
              Clean. Simple. Transparent. Token ≠ the share.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.82rem] text-text-dim">
              {links.map((l) => (
                <Link key={l.label} href={l.href} className="transition-colors hover:text-text">
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3 text-text-mute">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="transition-colors hover:text-text"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={s.d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.78rem] text-text-mute">
            © {new Date().getFullYear()} GAUGE. All rights reserved.
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[0.78rem] text-text-mute">
            {legal.map((l) => (
              <a key={l.label} href={l.href} className="transition-colors hover:text-text-dim">
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
