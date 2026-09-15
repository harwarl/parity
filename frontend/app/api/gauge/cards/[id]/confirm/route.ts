import { NextResponse } from "next/server";
import { GAUGE_API_URL, gaugeApiHeaders } from "@/lib/api/gaugeConfig";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const res = await fetch(
      `${GAUGE_API_URL}/cards/${encodeURIComponent(id)}/confirm`,
      { method: "POST", headers: gaugeApiHeaders() },
    );
    const body = await res.json().catch(() => null);
    return NextResponse.json(body, { status: res.status });
  } catch {
    return NextResponse.json({ error: "gauge-api unreachable" }, { status: 502 });
  }
}
