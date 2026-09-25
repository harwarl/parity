import { footerProduct, footerResources, site, urls } from "@/config/site";
import { Wordmark } from "@/components/shared/Wordmark";
import { Pill } from "@/components/ui/Pill";
import type { NavLink } from "@/types/content";

function LinkColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <p className="g-label mb-5">{title}</p>
      <ul className="flex flex-col gap-3.5">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="text-[16px] text-ink-2 transition-colors hover:text-ink">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 5.11 · 5fr/2fr/2fr/3fr + bottom bar. */
export function Footer() {
  return (
    <footer className="g-wrap pt-[90px] pb-12">
      <div className="grid gap-12 border-b border-ink/8 pb-16 sm:grid-cols-2 lg:grid-cols-[5fr_2fr_2fr_3fr] lg:gap-6">
        <div>
          <Wordmark width={150} />
          <p className="mt-5 text-[16px] text-muted">Two prices. One gap. You tap.</p>
          <Pill size="sm" dot="live" className="mt-6">
            Paper live
          </Pill>
        </div>
        <LinkColumn title="Product" links={footerProduct} />
        <LinkColumn title="Resources" links={footerResources} />
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <Pill size="sm" dot="live">
            Watches Robinhood Chain
          </Pill>
          <a
            href={`mailto:${urls.contactEmail}`}
            className="font-mono text-[13px] text-dim transition-colors hover:text-ink"
          >
            {urls.contactEmail}
          </a>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-4 pt-9 sm:flex-row sm:items-center">
        <p className="text-[13px] text-dim">{site.disclaimer}</p>
        <p className="font-mono text-[12px] text-dim">© 2026 GAUGE</p>
      </div>
    </footer>
  );
}
