"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Types `text` out, then holds with a blinking caret. SSR renders the full
 * string, so no-JS, screen readers, and prefers-reduced-motion just get it
 * whole. A hidden copy reserves the final box so nothing reflows while typing.
 *
 * trigger="mount" starts on load; "inView" waits until it scrolls into view.
 * pre keeps whitespace and newlines (for code).
 */
export default function Typewriter({
  text,
  className = "",
  speed = 24,
  startDelay = 200,
  trigger = "mount",
  pre = false,
}: {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
  trigger?: "mount" | "inView";
  pre?: boolean;
}) {
  const wrap = useRef<HTMLSpanElement | null>(null);
  const [n, setN] = useState(text.length);
  const [done, setDone] = useState(true);
  const started = useRef(false);

  useEffect(() => {
    const el = wrap.current;
    if (started.current || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let timer = 0;

    const run = () => {
      if (started.current) return;
      started.current = true;
      let i = 0;
      const tick = () => {
        i += 1;
        setN(i);
        if (i >= text.length) {
          setDone(true);
          return;
        }
        const ch = text[i - 1];
        const pause =
          ch === "\n" ? speed * 8 : ch === " " ? speed * 0.5 : ch === "." ? speed * 5 : speed;
        timer = window.setTimeout(tick, pause);
      };
      raf = requestAnimationFrame(() => {
        setN(0);
        setDone(false);
        timer = window.setTimeout(tick, startDelay);
      });
    };

    if (trigger === "mount") {
      run();
      return () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(timer);
      };
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [text, speed, startDelay, trigger]);

  const ws = pre ? "whitespace-pre" : "";

  return (
    <span
      ref={wrap}
      className={`relative ${pre ? "block" : "inline-block"} ${className}`}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden className={`invisible ${ws}`}>
        {text}
      </span>
      <span aria-hidden className={`absolute inset-0 ${ws}`}>
        {text.slice(0, n)}
        <span
          className={`ml-0.5 inline-block h-[0.9em] w-[0.5ch] translate-y-[0.12em] bg-green ${
            done ? "animate-[caret_1.1s_step-end_infinite]" : ""
          }`}
        />
      </span>
    </span>
  );
}
