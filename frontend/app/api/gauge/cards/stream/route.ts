import { DEMO_USER_ID, GAUGE_API_URL, gaugeApiHeaders } from "@/lib/api/gaugeConfig";

// Streams — never statically optimize/cache an SSE connection.
export const dynamic = "force-dynamic";

/**
 * Passes gauge-api's GET /cards/stream (SSE) straight through. Piping
 * `upstream.body` directly means this route doesn't buffer or re-parse
 * events — the browser's EventSource on the other end sees gauge-api's
 * stream verbatim, just re-homed to same-origin so the bearer token never
 * has to reach client JS.
 */
export async function GET() {
  let upstream: Response;
  try {
    upstream = await fetch(
      `${GAUGE_API_URL}/cards/stream?user_id=${encodeURIComponent(DEMO_USER_ID)}`,
      { headers: gaugeApiHeaders(), cache: "no-store" },
    );
  } catch {
    return new Response(null, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response(null, { status: 502 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
