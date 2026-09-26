import { navLinks, urls } from "@/config/site";
import { Wordmark } from "@/components/shared/Wordmark";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { MobileMenu } from "./MobileMenu";

/**
 * 5.1 · Floating glass pill. Sticky at top 16; the −84px bottom margin lets
 * the hero run underneath it. Below lg the links, pills and buttons move
 * into the hamburger menu; glass blur only at md+ (it repaints over the
 * animated hero on phones).
 */
export function Navbar() {
  return (
    <header
      className="sticky top-4 z-40 mx-auto mt-4 mb-[-84px] flex h-[68px] w-[min(1232px,calc(100%-32px))] items-center justify-between gap-6 rounded-full border border-ink/10 bg-[rgba(12,13,15,.94)] pr-2.5 pl-6 md:bg-[rgba(12,13,15,.62)] md:backdrop-blur-[18px] md:backdrop-saturate-[1.4]"
      style={{ boxShadow: "0 16px 50px rgba(0,0,0,.45), inset 0 1px 0 rgba(249,247,244,.06)" }}
    >
      <div className="flex items-center gap-2.5">
        <a href="#top" aria-label="GAUGE home" className="mr-2 flex items-center">
          <Wordmark width={112} />
        </a>
        <Pill size="sm" dot="live" className="max-md:hidden">
          Paper live
        </Pill>
        <Pill size="sm" dot="static" className="max-md:hidden">
          RTH open
        </Pill>
      </div>

      <nav aria-label="Primary" className="max-lg:hidden">
        <ul className="flex items-center gap-[34px]">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-[15px] font-medium text-ink-2 transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-2.5">
        <Button href={urls.docs} variant="secondary" size="sm" className="max-lg:hidden">
          Read the docs
        </Button>
        <Button href={urls.app} size="sm" external className="max-sm:hidden">
          Open GAUGE
        </Button>
        <MobileMenu />
      </div>
    </header>
  );
}
