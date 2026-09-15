import { NextResponse } from "next/server";
import { GAUGE_API_URL, gaugeApiHeaders } from "@/lib/api/gaugeConfig";

/** gauge-api's skip_card returns a bare status code, no JSON body. */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const res = await fetch(
      `${GAUGE_API_URL}/cards/${encodeURIComponent(id)}/skip`,
      { method: "POST", headers: gaugeApiHeaders() },
    );
    return new NextResponse(null, { status: res.status });
  } catch {
    return NextResponse.json({ error: "gauge-api unreachable" }, { status: 502 });
  }
}
