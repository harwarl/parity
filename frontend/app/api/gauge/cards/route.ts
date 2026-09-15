import { NextResponse } from "next/server";
import { DEMO_USER_ID, GAUGE_API_URL, gaugeApiHeaders } from "@/lib/api/gaugeConfig";

/**
 * Proxies gauge-api's GET /cards for the fixed DEMO_USER_ID — the client
 * can't ask for a different user's cards through this route (there's no
 * real identity to check it against yet, so the server just doesn't accept
 * one).
 */
export async function GET() {
  try {
    const res = await fetch(
      `${GAUGE_API_URL}/cards?user_id=${encodeURIComponent(DEMO_USER_ID)}`,
      { headers: gaugeApiHeaders(), cache: "no-store" },
    );
    if (!res.ok) {
      return NextResponse.json({ error: "gauge-api returned an error" }, { status: 502 });
    }
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: "gauge-api unreachable" }, { status: 502 });
  }
}
