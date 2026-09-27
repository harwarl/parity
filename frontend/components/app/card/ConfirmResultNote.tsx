import type { ConfirmResult } from "@/hooks/useConfirmFlow";

const GATE: Record<string, string> = {
  Stale: "a price went stale",
  Closed: "the market is outside RTH",
  Thin: "the book got too thin",
  Dust: "net fell under your floor",
};

/** What Do it came to, in one line. Success in lime; everything else says why nothing happened. */
export function ConfirmResultNote({ result, live, capLine }: { result: ConfirmResult; live: boolean; capLine?: string }) {
  const ok = result.kind === "filled" || result.kind === "sent";
  const text = (() => {
    switch (result.kind) {
      case "filled":
        return `Paper fill recorded at $${result.price?.toFixed(2)}${capLine ? ` · ${capLine}` : ""} · see History.`;
      case "sent":
        return live
          ? `Order sent to your Agentic Account through the Robinhood Trading MCP${capLine ? ` · ${capLine}` : ""}.`
          : "Confirmed. No fresh price to fill against, so no paper fill was recorded.";
      case "requote_fail":
        return result.code
          ? `Re-quote failed: ${GATE[result.code]}${result.net != null ? ` (net ${result.net.toFixed(1)} bps)` : ""}. Nothing was placed.`
          : "Re-quote failed: no fresh price to check against. Nothing was placed.";
      case "expired":
        return "Too late: the card expired before the confirm. Nothing was placed.";
      case "live_unavailable":
        return `Confirmed, but there's nothing to place live: ${result.reason}.`;
      case "error":
        return `Couldn't confirm: ${result.reason}. Nothing was placed.`;
    }
  })();
  return (
    <p
      role="status"
      className={`rounded-inset border px-4 py-3 text-[14px] leading-relaxed ${
        ok ? "border-accent/35 bg-accent/8 text-ink" : "border-neg/35 bg-neg/8 text-ink"
      }`}
    >
      {text}
    </p>
  );
}
