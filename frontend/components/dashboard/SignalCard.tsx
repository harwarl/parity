"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import TtlRing from "@/components/parity/TtlRing";
import BrandMark from "@/components/shared/BrandMark";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";
import { fmtBps, fmtPrice } from "@/lib/parity/format";
import { ROW_HAIRCUT } from "@/lib/parity/universe";
import type { TapeRow } from "@/types/parity";

const TTL_SECONDS = 75;
const CLIPS = [15, 25, 50] as const;

function fmtTtlClock(seconds: number): string {
  const s = Math.max(0, Math.ceil(seconds));
  const mm = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <p className="text-[0.72rem] text-text-mute">{label}</p>
      <p
        key={value}
        className="tnum tick-flash mt-1.5 text-[1.15rem] font-semibold text-text sm:text-[1.3rem]"
      >
        {value}
      </p>
      {sub ? <p className="mt-0.5 text-[0.72rem] text-text-mute">{sub}</p> : null}
    </div>
  );
}

/** The dashboard's signal card — a bespoke layout for this screen (not the
 * shared marketing/app Card), matching a supplied reference design exactly.
 * `onExpire` fires once, when the TTL clock reaches zero — callers that loop
 * through names (e.g. the landing hero) use it to advance to the next one.
 * `confirmHref` makes "Confirm & Do It" a real link (the landing hero sends
 * it to /dashboard); left unset, "Confirm & Do It" opens a clip-size modal —
 * picking a clip is the buy action, a one-step simulated paper fill.
 * `onConfirm` fires once with the row and chosen clip. Users can confirm the
 * same or different names as many times as they like — no daily cap gating. */
export default function SignalCard({
  row,
  onExpire,
  confirmHref,
  onConfirm,
}: {
  row: TapeRow;
  onExpire?: () => void;
  confirmHref?: string;
  onConfirm?: (row: TapeRow, clip: number) => void;
}) {
  const [remaining, setRemaining] = useState(TTL_SECONDS);
  const [confirmed, setConfirmed] = useState(false);
  const [clip, setClip] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [updated, setUpdated] = useState("");
  const modalBodyRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (!modalOpen || reducedMotion || !modalBodyRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-modal-item]", {
        opacity: 0,
        y: 12,
        duration: 0.35,
        stagger: 0.06,
        delay: 0.1,
        ease: "power2.out",
      });
      gsap.from("[data-modal-clip]", {
        opacity: 0,
        scale: 0.85,
        duration: 0.3,
        stagger: 0.06,
        delay: 0.25,
        ease: "back.out(2.2)",
      });
    }, modalBodyRef);
    return () => ctx.revert();
  }, [modalOpen, reducedMotion]);

  useEffect(() => {
    const tick = () =>
      setUpdated(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 0) return 0;
        const next = r - 1;
        if (next === 0) onExpireRef.current?.();
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const dead = row.state === "halt" || row.state === "stale";
  const tradable = !dead && row.state === "rth" && row.netBps > 0;
  const rich = row.basisBps >= 0;
  const moveAbs = row.tokenPerShare - row.shareMid;
  const movePct = (moveAbs / row.shareMid) * 100;

  const tone = dead ? "halt" : tradable ? "green" : "mute";

  const handlePickClip = (amount: number) => {
    if (confirmed) return;
    setClip(amount);
    setConfirmed(true);
    setModalOpen(false);
    onConfirm?.(row, amount);
  };

  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 sm:p-7 ${
        tone === "green"
          ? "border-green/25"
          : tone === "halt"
            ? "border-halt/30"
            : "border-line-strong"
      }`}
      style={
        tone === "green"
          ? {
              background:
                "radial-gradient(140% 100% at 0% 0%, color-mix(in oklab, var(--green) 11%, var(--surface)), var(--surface) 65%)",
            }
          : { background: "var(--surface)" }
      }
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-2 text-[0.8rem] font-medium tracking-[0.14em] ${
            confirmed ? "text-green" : tone === "green" ? "text-green" : tone === "halt" ? "text-halt" : "text-text-mute"
          }`}
        >
          <span
            className={`size-2 rounded-full ${
              confirmed || tone === "green" ? "animate-pulse bg-green" : tone === "halt" ? "bg-halt" : "bg-text-mute"
            }`}
          />
          {confirmed ? "CONFIRMED" : dead ? row.state.toUpperCase() : tradable ? "SIGNAL" : "NO SIGNAL"}
        </span>
        {!dead && !confirmed ? (
          <span className="tnum inline-flex items-center gap-1.5 text-[0.8rem] text-text-dim">
            <Icon name="clock" size={14} />
            Expires in <span className="text-text">{fmtTtlClock(remaining)}</span>
          </span>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <BrandMark symbol={row.symbol} className="size-16 rounded-xl text-text-dim sm:size-18" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[1.6rem] font-semibold tracking-tight text-text sm:text-[1.8rem]">
              {row.symbol}
            </span>
            {!dead ? (
              <span
                className={`rounded-md border px-2 py-0.5 text-[10px] tracking-widest ${
                  tone === "green" ? "border-green/40 text-green" : "border-line-strong text-text-mute"
                }`}
              >
                NET EDGE
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-[0.85rem] text-text-mute">{row.name}</p>
        </div>
        <div className="ml-auto text-right">
          <p
            key={dead ? "dead" : row.netBps.toFixed(2)}
            className={`tnum num-pop text-[2.4rem] font-bold leading-none sm:text-[2.9rem] ${
              tone === "green" ? "text-green" : tone === "halt" ? "text-halt" : "text-text-mute"
            }`}
          >
            {dead ? "—" : fmtBps(row.netBps)}
          </p>
          <p className="mt-1.5 text-[0.78rem] text-text-mute">Net after costs</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-line pt-5 sm:grid-cols-4">
        <Stat label="Cash Price (Mid)" value={fmtPrice(row.shareMid)} sub="(RTH only)" />
        <Stat label="Token Price (Implied)" value={fmtPrice(row.tokenPerShare)} sub="(24/7)" />
        <Stat label="Raw Basis" value={dead ? "—" : fmtBps(row.basisBps)} />
        <Stat label="Est. Costs" value={`${ROW_HAIRCUT} bps`} />
      </div>

      {tradable && confirmed ? (
        <div className="mt-6 flex flex-1 flex-col justify-center gap-2 rounded-xl border border-green/30 bg-green-soft p-5">
          <span className="tnum w-fit rounded-md border border-green/40 px-2 py-0.5 text-[10px] tracking-widest text-green">
            TRADE PLACED
          </span>
          <p className="text-[0.85rem] leading-relaxed text-text">
            {row.symbol} order placed at {fmtPrice(row.tokenPerShare)}
            {clip ? ` · $${clip} clip` : ""}. Filled in paper mode.
          </p>
          <Link
            href="/dashboard/log"
            className="mt-1 text-[0.78rem] text-green transition-colors hover:text-[#12e888]"
          >
            View in log →
          </Link>
        </div>
      ) : tradable ? (
        <>
          <div className="mt-6 grid grid-cols-1 gap-5 rounded-xl border border-line-strong/60 bg-ground/25 p-5 sm:grid-cols-2">
            <div>
              <p className="text-[0.75rem] text-text-mute">Direction</p>
              <div className="mt-2 flex items-center gap-2">
                <Icon
                  name="arrow"
                  size={18}
                  className={rich ? "-rotate-45 text-green" : "rotate-45 text-green"}
                />
                <span className="text-[1.2rem] font-bold tracking-tight text-green">
                  {rich ? "BUY" : "SELL"} {row.symbol}
                </span>
              </div>
              <p className="mt-1.5 text-[0.8rem] leading-relaxed text-text-dim">
                {rich
                  ? "Token trades higher. Bet on convergence."
                  : "Token trades lower. Bet on convergence."}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-[0.75rem] text-text-mute">Est. Move to Token</p>
              <p className="tnum mt-2 text-[1.2rem] font-bold text-green">
                {moveAbs >= 0 ? "+" : "−"}
                {Math.abs(moveAbs).toFixed(2)}
              </p>
              <p className="tnum mt-0.5 text-[0.78rem] text-text-mute">
                ({movePct >= 0 ? "+" : "−"}
                {Math.abs(movePct).toFixed(2)}%)
              </p>
            </div>
          </div>

          {showDetails ? (
            <dl className="mt-5 divide-y divide-line rounded-xl border border-line-strong/60 bg-ground/25 px-5">
              {[
                ["Market", "US"],
                ["Feed", "RHJ · Chainlink"],
                ["Oracle", "Chainlink"],
                ["Confidence", "98%"],
                ["Updated", updated || "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-2.5">
                  <dt className="text-[0.78rem] text-text-mute">{k}</dt>
                  <dd className="tnum text-[0.8rem] text-text-dim">{v}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1.5fr]">
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              aria-expanded={showDetails}
              className="h-12 rounded-xl border border-line-strong bg-surface-2 text-[0.9rem] font-medium text-text transition-colors hover:border-text-mute"
            >
              {showDetails ? "Hide Details" : "View Details"}
            </button>
            {confirmHref ? (
              <Link
                href={confirmHref}
                className="flex h-12 items-center justify-center rounded-xl bg-green text-[0.9rem] font-bold text-green-ink transition-colors hover:bg-[#12e888]"
              >
                Confirm &amp; Do It
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="h-12 rounded-xl bg-green text-[0.9rem] font-bold text-green-ink transition-colors hover:bg-[#12e888]"
              >
                Confirm &amp; Do It
              </button>
            )}
          </div>
          <p className="mt-auto pt-4 text-center text-[0.76rem] text-text-mute">
            Re-quotes at confirm. Valid for 75 seconds.
          </p>
        </>
      ) : (
        <div className="mt-6 flex flex-1 flex-col justify-center rounded-xl border border-line-strong/60 bg-ground/25 p-5">
          <p className="text-[0.85rem] leading-relaxed text-text-dim">
            {dead
              ? row.state === "halt"
                ? "Multiplier jump or oracle pause. This name is frozen until a clean resume."
                : "The cash and chain join blew its freshness budget. No card until it recovers."
              : "Net edge is real but below the bar after costs. Not worth the tap."}
          </p>
          <p className="mt-3 text-[0.76rem] text-text-mute">No card beats a wrong card.</p>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} labelledBy="clip-modal-title">
        <div ref={modalBodyRef}>
          {/* top accent tick, matching the site's section-rule motif, scaled up */}
          <span aria-hidden className="block h-0.75 w-full bg-linear-to-r from-green via-green/60 to-transparent" />

          <div data-modal-item className="flex items-center justify-between gap-3 px-6 pt-5 sm:px-7">
            <span className="flex items-center gap-3 min-w-0">
              <BrandMark symbol={row.symbol} className="size-11 shrink-0 rounded-xl text-text-dim" />
              <span className="min-w-0">
                <span id="clip-modal-title" className="block text-[1.15rem] font-bold tracking-tight text-text">
                  {row.symbol}
                </span>
                <span className="block text-[0.72rem] text-text-mute">{row.name}</span>
              </span>
            </span>
            <TtlRing progress={remaining / TTL_SECONDS} seconds={remaining} />
          </div>

          <div data-modal-item className="px-6 pt-4 sm:px-7">
            <p className="eyebrow">Net after costs</p>
            <p className="tnum num-pop mt-1 text-[2.5rem] font-bold leading-none text-green">
              {fmtBps(row.netBps)}
            </p>
          </div>

          <div data-modal-item className="mt-4 flex items-center gap-3 px-6 text-text-mute sm:px-7">
            <span className="h-px flex-1 bg-linear-to-r from-transparent to-line-strong" />
            <span className="text-[9px] uppercase tracking-[0.22em]">two prices</span>
            <span className="h-px flex-1 bg-linear-to-l from-transparent to-line-strong" />
          </div>

          <div data-modal-item className="divide-y divide-line px-6 sm:px-7">
            <div className="flex items-center gap-3 py-2.5">
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1">
                <span className="size-1.5 rounded-full bg-text-dim" />
                <span className="tnum text-[10px] tracking-[0.15em] text-text-dim">CASH</span>
              </span>
              <span className="flex-1 text-[13px] text-text-dim">RTH only</span>
              <span className="tnum text-[15px] text-text">{fmtPrice(row.shareMid)}</span>
            </div>
            <div className="flex items-center gap-3 py-2.5">
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1">
                <span className="size-1.5 rounded-full bg-green" />
                <span className="tnum text-[10px] tracking-[0.15em] text-text-dim">TOKEN</span>
              </span>
              <span className="flex-1 text-[13px] text-text-dim">24/7</span>
              <span className="tnum text-[15px] text-text">{fmtPrice(row.tokenPerShare)}</span>
            </div>
          </div>

          <div data-modal-item className="px-6 pt-4 sm:px-7">
            <p className="eyebrow">Pick a clip — this is the buy</p>

            <div className="mt-3 grid grid-cols-3 gap-3">
              {CLIPS.map((c) => {
                const est = (row.netBps / 10_000) * c;
                return (
                  <button
                    key={c}
                    data-modal-clip
                    type="button"
                    onClick={() => handlePickClip(c)}
                    className="group relative flex flex-col items-center gap-1 overflow-hidden rounded-xl border border-line-strong bg-surface py-4 transition-colors duration-150 hover:-translate-y-1 hover:border-green active:translate-y-0 active:scale-95"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-linear-to-t from-green/25 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    />
                    {c === CLIPS[0] ? (
                      <span className="tnum absolute -top-2.5 rounded-full border border-line-strong bg-surface-2 px-1.5 py-0.5 text-[9px] tracking-widest text-text-mute group-hover:border-green/50 group-hover:text-green">
                        MIN
                      </span>
                    ) : null}
                    <span className="tnum relative text-[1.4rem] font-bold text-text group-hover:text-green">
                      ${c}
                    </span>
                    <span className="tnum relative text-[0.7rem] text-text-mute group-hover:text-green/80">
                      +${est.toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="mt-4 w-full pb-5 text-center text-[0.8rem] text-text-mute transition-colors hover:text-text-dim"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
