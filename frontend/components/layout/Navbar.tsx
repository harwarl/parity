import Link from "next/link";
import Container from "./Container";
import MobileMenu from "./MobileMenu";

const links = [
  { label: "The tape", href: "/#tape" },
  { label: "How it works", href: "/#how" },
  { label: "Refusals", href: "/#refusals" },
  { label: "Rails", href: "/#rails" },
  { label: "App", href: "/app" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ground/80 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between">
        <Link
          href="/"
          className="flex items-baseline gap-2 text-text"
          aria-label="PARITY home"
        >
          <span className="text-[0.95rem] font-semibold tracking-[0.14em]">
            PARITY
          </span>
          <span className="tnum hidden text-[10px] text-text-mute sm:inline">
            v1
          </span>
        </Link>

        <nav className="hidden items-center gap-4 text-[0.8rem] text-text-dim md:flex lg:gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-text"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#waitlist"
          className="tnum hidden rounded-md border border-line-strong px-3 py-1.5 text-[0.8rem] text-text transition-colors hover:border-text-mute md:inline-flex"
        >
          Join the waitlist
        </Link>

        <MobileMenu links={links} />
      </Container>
    </header>
  );
}
