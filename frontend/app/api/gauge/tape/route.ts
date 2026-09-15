import { NextResponse } from "next/server";
import { GAUGE_API_URL, gaugeApiHeaders } from "@/lib/api/gaugeConfig";

/**
 * Proxies gauge-api's public GET /tape. Doesn't strictly need the bearer
 * token (that route is deliberately unauthenticated — see gauge-api's
 * routes/mod.rs), but goes through this same server-side proxy pattern as
 * every other gauge-* route for one consistent client-side calling surface.
 */
export async function GET() {
  try {
    const res = await fetch(`${GAUGE_API_URL}/tape`, {
      headers: gaugeApiHeaders(),
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ error: "gauge-api returned an error" }, { status: 502 });
    }
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: "gauge-api unreachable" }, { status: 502 });
  }
}
