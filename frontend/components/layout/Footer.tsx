import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { footerLinks } from "@/config/nav";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-accent text-[10px] font-bold text-background">
              P
            </span>
            Parity
          </div>

          <p className="max-w-2xl text-xs leading-relaxed text-muted-dim">
            PARITY is software and signals, not investment advice. Every trade
            is self-directed and confirmed by you. Paper mode is the default
            for new accounts. A token is exposure, not a share of the
            underlying company. Overnight and weekend gaps are not free
            money — they can persist, widen, or disappear before the cash
            market reopens.
          </p>

          <div className="flex gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
