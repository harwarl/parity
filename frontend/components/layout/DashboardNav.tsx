"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";
import Container from "./Container";

const links = [
  { label: "Tape", href: "/dashboard" },
  { label: "Log", href: "/dashboard/log" },
  { label: "You", href: "/dashboard/you" },
];

/**
 * Console-style nav for the dashboard shell: pill nav + a right-hand icon
 * cluster (status pill, notifications, live pulse, help, primary CTA) — the
 * same arrangement as a wallet-app header, minus anything implying a
 * connected wallet or custody (CLAUDE.md: no custody, no wallet to connect).
 */
export default function DashboardNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ground/80 py-2.5 backdrop-blur-md md:py-0">
      <Container>
        {/* desktop: brand · pills · status cluster, one line */}
        <div className="hidden h-16 items-center justify-between md:flex">
          <div className="flex items-center gap-8">
            <Brand />
            <nav aria-label="Dashboard" className="flex items-center gap-1.5">
              <Pills />
            </nav>
          </div>
          <RightCluster />
        </div>

        {/* mobile: brand + cta on row one, pills scroll on row two */}
        <div className="flex items-center justify-between gap-3 md:hidden">
          <Brand />
          <CtaLink />
        </div>
        <nav
          aria-label="Dashboard"
          className="-mx-6 mt-2.5 flex gap-1.5 overflow-x-auto px-6 pb-0.5 sm:-mx-12 sm:px-12 md:hidden"
        >
          <Pills />
        </nav>
      </Container>
    </header>
  );
}

function Brand() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-baseline gap-2 text-text"
      aria-label="TAPE home"
    >
      <span className="text-[1.1rem] font-semibold tracking-[0.14em] md:text-[0.95rem]">
        TAPE
      </span>
      <span className="tnum hidden text-[10px] text-text-mute sm:inline">
        v1
      </span>
    </Link>
  );
}

function Pills() {
  const pathname = usePathname();
  return (
    <>
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={[
              "shrink-0 whitespace-nowrap px-1.5 py-1.5 text-[0.82rem] transition-colors",
              active ? "text-text" : "text-text-dim hover:text-text",
            ].join(" ")}
          >
            {l.label}
          </Link>
        );
      })}
    </>
  );
}

function PaperBadge() {
  return (
    <span className="tnum inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line-strong px-2.5 py-1.5 text-[10px] tracking-widest text-text-mute">
      <span className="size-1.5 rounded-full bg-green" />
      PAPER
    </span>
  );
}

function IconButton({
  name,
  label,
}: {
  name: "bell" | "activity" | "help";
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line-strong text-text-dim transition-colors hover:border-text-mute hover:text-text"
    >
      <Icon name={name} size={14} />
    </button>
  );
}

function CtaLink() {
  return (
    <Link
      href="/dashboard"
      className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-green px-4 text-[0.8rem] font-medium text-green-ink transition-colors hover:bg-[#12e888]"
    >
      Check the Tape
    </Link>
  );
}

function RightCluster() {
  return (
    <div className="flex shrink-0 items-center gap-2.5">
      <PaperBadge />
      <IconButton name="bell" label="Notifications" />
      <IconButton name="activity" label="Live status" />
      <IconButton name="help" label="Help" />
      <CtaLink />
    </div>
  );
}
