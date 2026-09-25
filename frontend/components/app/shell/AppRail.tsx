"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ACTIVE, ROWS } from "@/lib/gauge/model";
import { RailIcon, type RailIconName } from "./RailIcon";

type Item = { href: string; label: string; tip: string; icon: RailIconName; badge?: boolean };

const main: Item[] = [
  { href: "/dashboard", label: "Home", tip: "Home", icon: "home" },
  { href: "/dashboard/watchlist", label: "Watchlist", tip: `Watchlist · ${ROWS.length}`, icon: "watchlist" },
  { href: "/dashboard/card", label: "Active card", tip: `Active card · ${ACTIVE.sym}`, icon: "card", badge: true },
  { href: "/dashboard/history", label: "History", tip: "History", icon: "history" },
  { href: "/dashboard/token", label: "Token", tip: "Token", icon: "token" },
];
const settings: Item = { href: "/dashboard/settings", label: "Settings", tip: "Settings", icon: "settings" };

function RailLink({ item, active }: { item: Item; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      data-tip={item.tip}
      className={`app-tip relative grid size-11 flex-none place-items-center rounded-xl transition-colors ${
        active
          ? "bg-accent/12 text-accent shadow-[inset_0_0_0_1px_rgba(178,212,80,.3)]"
          : "text-dim hover:bg-ink/5 hover:text-ink-2"
      }`}
    >
      <RailIcon name={item.icon} />
      {item.badge && (
        <span aria-hidden className="absolute top-2 right-2 size-2 rounded-full bg-accent shadow-[0_0_8px_#B2D450]" />
      )}
    </Link>
  );
}

/** 76px sticky icon rail (design.md §5B.2). Bottom bar below md. */
export function AppRail() {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  // Search ⌘K: jump to the watchlist search field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        router.push("/dashboard/watchlist#search");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <>
      <nav
        aria-label="App"
        className="sticky top-0 z-30 flex h-screen min-h-[640px] w-[76px] flex-none flex-col items-center gap-2 border-r border-ink/7 bg-rail py-[18px] max-md:hidden"
      >
        <Link href="/" aria-label="GAUGE home" className="mb-2 grid size-11 place-items-center">
          <svg viewBox="-2 -2 62 62" width="34" height="34" aria-hidden>
            <path d="M45.6 12.4A23.5 23.5 0 1 0 52.5 29" fill="none" stroke="#F9F7F4" strokeWidth="11" />
            <rect x="29" y="23.5" width="29" height="11" fill="#B2D450" />
          </svg>
        </Link>
        <Link
          href="/dashboard/watchlist#search"
          aria-label="Search"
          data-tip="Search ⌘K"
          className="app-tip grid size-11 place-items-center rounded-xl text-dim transition-colors hover:bg-ink/5 hover:text-ink-2"
        >
          <RailIcon name="search" />
        </Link>
        <span aria-hidden className="my-1 h-px w-7 bg-ink/10" />
        {main.map((item) => (
          <RailLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
        <div className="mt-auto flex flex-col items-center gap-2">
          <RailLink item={settings} active={isActive(settings.href)} />
          <span
            data-tip="All systems OK"
            tabIndex={0}
            aria-label="All systems OK"
            className="app-tip grid size-11 place-items-center rounded-xl"
          >
            <span className="g-live" />
          </span>
          <span
            aria-label="Account"
            className="grid size-9 place-items-center rounded-full border border-ink/14 bg-panel-2 font-mono text-[10px] text-muted"
          >
            [AV]
          </span>
        </div>
      </nav>

      {/* Mobile: bottom bar with the same destinations */}
      <nav
        aria-label="App"
        className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around border-t border-ink/7 bg-rail/95 px-2 backdrop-blur md:hidden"
      >
        {[...main, settings].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={`relative grid size-11 place-items-center rounded-xl ${
              isActive(item.href) ? "bg-accent/12 text-accent" : "text-dim"
            }`}
          >
            <RailIcon name={item.icon} />
            {item.badge && <span aria-hidden className="absolute top-2 right-2 size-1.5 rounded-full bg-accent" />}
          </Link>
        ))}
      </nav>
    </>
  );
}
