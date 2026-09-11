"use client";

import { type FormEvent, useState } from "react";
import Container from "@/components/layout/Container";
import Eyebrow from "@/components/ui/Eyebrow";

type Status = "idle" | "loading" | "done" | "error";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="waitlist" className="border-t border-line py-14 sm:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div>
            <Eyebrow>Waitlist</Eyebrow>
            <h2 className="mt-4 max-w-md text-2xl font-medium leading-[1.12] tracking-[-0.02em] text-text sm:text-[2rem]">
              Start on paper. Watch the tape for a week.
            </h2>
            <p className="mt-4 max-w-md text-[0.9rem] leading-relaxed text-text-dim">
              US only for the live equity path, and only through the Agentic
              Account. Paper and the tape are open to everyone on the list.
            </p>
          </div>

          <div>
            {status === "done" ? (
              <p className="rounded-lg border border-green/30 bg-green-soft p-5 text-sm text-text">
                On the list. We will only email about access.
              </p>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <label htmlFor="wl-email" className="eyebrow">
                  Email
                </label>
                <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-2">
                  <input
                    id="wl-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="tnum h-13 flex-1 rounded-md border border-line-strong bg-surface px-4 text-[0.95rem] text-text outline-none transition-colors placeholder:text-text-mute focus:border-text-mute sm:h-11 sm:px-3 sm:text-sm"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="h-13 rounded-md bg-green px-5 text-[0.95rem] font-medium text-green-ink transition-colors hover:bg-[#12e888] disabled:opacity-50 sm:h-11 sm:text-sm"
                  >
                    {status === "loading" ? "Adding…" : "Join"}
                  </button>
                </div>
                <p className="text-[0.75rem] text-text-mute" aria-live="polite">
                  {status === "error"
                    ? "That did not go through. Try again in a moment."
                    : "No card is placed for you, ever. Signals only."}
                </p>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
