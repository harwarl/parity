import { NextResponse } from "next/server";

/**
 * Waitlist intake. This landing build validates the address and acknowledges;
 * wiring it to a real store is an infra task, not a page concern.
 */
export async function POST(request: Request) {
  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 422 });
  }

  return NextResponse.json({ ok: true });
}
