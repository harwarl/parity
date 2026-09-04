"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/Button";

const links = [
  { label: "Tape", href: "#tape" },
  { label: "How it works", href: "#" },
  { label: "Pricing", href: "#" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-void/70 backdrop-blur-md">
      <Container className="flex h-[72px] items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-mute transition-colors hover:text-paper"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <span className="h-4 w-px bg-line" />
          <a
            href="#"
            className="text-sm text-mute transition-colors hover:text-paper"
          >
            Log in
          </a>
          <Button variant="solid">Join waitlist</Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-paper md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-line bg-void md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-chip px-2 py-2.5 text-sm text-mute transition-colors hover:bg-panel hover:text-paper"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#"
              onClick={() => setOpen(false)}
              className="rounded-chip px-2 py-2.5 text-sm text-mute transition-colors hover:bg-panel hover:text-paper"
            >
              Log in
            </a>
            <Button variant="solid" className="mt-2 w-full">
              Join waitlist
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
