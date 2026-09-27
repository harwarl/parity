"use client";

import { useLedger } from "@/hooks/useLedger";

/** "Mon 22 → Fri 26 · 5 sessions", from whichever ledger is showing. */
export function HistoryContext() {
  const { sessions, rows } = useLedger();
  if (rows.length === 0) return <>no cards yet</>;
  const span = sessions.length > 1 ? `${sessions[0]} → ${sessions[sessions.length - 1]}` : sessions[0];
  return (
    <>
      {span} · {sessions.length} session{sessions.length === 1 ? "" : "s"} · {rows.length} cards
    </>
  );
}
