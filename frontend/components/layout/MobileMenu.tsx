"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { navLinks, urls } from "@/config/site";
import { Wordmark } from "@/components/shared/Wordmark";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";

type Phase = "closed" | "open" | "closing";

const OPEN_MS = 560;
const CLOSE_MS = 420;
const EASE_OPEN = "cubic-bezier(.76,0,.24,1)";
const EASE_CLOSE = "cubic-bezier(.6,0,.4,1)";

/** Three lines that morph into an X (the middle one collapses). */
function Burger({ x }: { x: boolean }) {
  const line = "absolute left-0 h-[1.6px] w-[18px] rounded-full bg-current transition-[transform,opacity] duration-300 ease-[cubic-bezier(.76,0,.24,1)]";
  return (
    <span aria-hidden className="relative block h-[14px] w-[18px]">
      <span className={line} style={{ top: 0, transform: x ? "translateY(6.2px) rotate(45deg)" : undefined }} />
      <span className={line} style={{ top: 6.2, opacity: x ? 0 : 1, transform: x ? "scaleX(0)" : undefined }} />
      <span className={line} style={{ top: 12.4, transform: x ? "translateY(-6.2px) rotate(-45deg)" : undefined }} />
    </span>
  );
}

/**
 * Full-screen menu below lg: a native modal <dialog> (focus trap, inert page,
 * Esc) that grows out of the hamburger as a circular reveal while the burger
 * morphs into an X; links then rise in. Closing reverses it back into the
 * button. Reduced motion: instant. Page scroll is locked while open.
 */
export function MobileMenu() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [morph, setMorph] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const anim = useRef<Animation | null>(null);

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Circle centred on the hamburger, and the radius that covers the screen. */
  const circle = () => {
    const r = trigger.current?.getBoundingClientRect();
    const cx = r ? r.left + r.width / 2 : window.innerWidth - 40;
    const cy = r ? r.top + r.height / 2 : 40;
    const far = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy));
    return { from: `circle(22px at ${cx}px ${cy}px)`, to: `circle(${Math.ceil(far)}px at ${cx}px ${cy}px)` };
  };

  const open = () => {
    const d = dialog.current;
    if (!d || phase !== "closed") return;
    setPhase("open");
    d.showModal();
    document.documentElement.style.overflow = "hidden";
    closeBtn.current?.focus(); // showModal would pick the logo
    requestAnimationFrame(() => setMorph(true));
    if (reduced()) return;
    const { from, to } = circle();
    anim.current?.cancel();
    anim.current = d.animate({ clipPath: [from, to] }, { duration: OPEN_MS, easing: EASE_OPEN, fill: "both" });
  };

  const close = useCallback(() => {
    const d = dialog.current;
    if (!d || !d.open) return;
    const finish = () => {
      anim.current?.cancel();
      d.close();
      document.documentElement.style.overflow = "";
      setPhase("closed");
      trigger.current?.focus();
    };
    setMorph(false);
    if (reduced()) return finish();
    setPhase("closing");
    const { from, to } = circle();
    anim.current?.cancel();
    anim.current = d.animate({ clipPath: [to, from] }, { duration: CLOSE_MS, easing: EASE_CLOSE, fill: "both" });
    anim.current.onfinish = finish;
  }, []);

  // Esc: animate out instead of the dialog's instant close.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      close();
    };
    d.addEventListener("cancel", onCancel);
    return () => d.removeEventListener("cancel", onCancel);
  }, [close]);

  // Close if the viewport grows past the breakpoint; unlock scroll on unmount.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => mq.matches && close();
    mq.addEventListener("change", onMq);
    return () => {
      mq.removeEventListener("change", onMq);
      document.documentElement.style.overflow = "";
    };
  }, [close]);

  /** Close, then follow an in-page link once the page is scrollable again. */
  const onLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href") ?? "";
    if (!href.startsWith("#")) return close(); // real navigation proceeds
    e.preventDefault();
    close();
    const go = () => {
      document.querySelector(href)?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth" });
      history.replaceState(null, "", href);
    };
    setTimeout(go, reduced() ? 0 : CLOSE_MS + 20);
  };

  const rise = (i: number) =>
    phase === "open" ? { animation: `j-rise .5s cubic-bezier(.2,.7,.2,1) ${200 + i * 55}ms both` } : undefined;

  return (
    <div className="lg:hidden">
      <button
        ref={trigger}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={phase === "open"}
        aria-label="Open menu"
        onClick={open}
        className="grid size-12 cursor-pointer place-items-center rounded-full border border-ink/18 bg-ink/3 text-ink transition-colors hover:border-ink/40"
      >
        <Burger x={false} />
      </button>

      <dialog
        ref={dialog}
        aria-label="Menu"
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto border-0 bg-bg p-0 text-ink backdrop:bg-transparent"
      >
        {phase !== "closed" && (
          <div
            className="flex min-h-dvh flex-col px-4 pt-4 pb-8 transition-opacity duration-300"
            style={{
              background: "radial-gradient(90% 55% at 70% 105%, rgba(178,212,80,.14), transparent 60%)",
              opacity: phase === "closing" ? 0.4 : 1,
            }}
          >
            {/* Same geometry as the nav pill so the X lands where the burger was */}
            <div className="flex h-[68px] items-center justify-between rounded-full border border-ink/10 bg-[rgba(12,13,15,.94)] pr-2.5 pl-6">
              <a href="#top" onClick={onLink} aria-label="GAUGE home" className="flex">
                <Wordmark width={112} />
              </a>
              <button
                ref={closeBtn}
                type="button"
                aria-label="Close menu"
                onClick={close}
                className="grid size-12 cursor-pointer place-items-center rounded-full border border-ink/18 bg-ink/3 text-ink transition-colors hover:border-ink/40"
              >
                <Burger x={morph} />
              </button>
            </div>

            <nav aria-label="Primary" className="mt-10 px-2">
              <ul className="flex flex-col">
                {navLinks.map((link, i) => (
                  <li key={link.label} className="border-b border-ink/8" style={rise(i)}>
                    <a
                      href={link.href}
                      onClick={onLink}
                      className="flex items-center justify-between py-5 font-display text-[30px] font-semibold tracking-[-0.03em] text-ink transition-colors hover:text-accent"
                    >
                      {link.label}
                      <span aria-hidden className="font-mono text-[12px] tracking-[0.2em] text-dim">
                        0{i + 1}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-8 flex flex-wrap gap-2 px-2" style={rise(navLinks.length)}>
              <Pill size="sm" dot="live">Paper live</Pill>
              <Pill size="sm" dot="static">RTH open</Pill>
            </div>

            <div className="mt-auto grid gap-3 px-2 pt-10" style={rise(navLinks.length + 1)}>
              <Button href={urls.app} external onClick={onLink} className="w-full">
                Open GAUGE
              </Button>
              <Button href={urls.docs} variant="secondary" onClick={onLink} className="w-full">
                Read the docs
              </Button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
