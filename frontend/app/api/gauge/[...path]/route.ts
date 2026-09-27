import type { NextRequest } from "next/server";

/**
 * Backend-for-frontend proxy to gauge-api. Holds the service token and the
 * viewer's user id server-side:
 *
 *   - GAUGE_API_URL   gauge-api base (default http://127.0.0.1:8080)
 *   - GAUGE_API_TOKEN bearer token (defaults to "dev-token" in dev only)
 *
 * The user id is an httpOnly cookie minted on first request, so each browser
 * is its own paper account until real auth exists. Only the routes below
 * are forwarded; the browser never picks the user id, so it can't act as
 * someone else.
 */

const COOKIE = "gauge_uid";
const UPSTREAM = process.env.GAUGE_API_URL ?? "http://127.0.0.1:8080";
const TOKEN = process.env.GAUGE_API_TOKEN ?? (process.env.NODE_ENV === "production" ? undefined : "dev-token");

type Target = { path: string; user?: boolean };

/** Browser path → backend path. `user` adds `?user_id=`. */
function resolve(method: string, parts: string[], uid: string): Target | null {
  const [a, b, c] = parts;
  const n = parts.length;
  if (method === "GET" && n === 1 && a === "tape") return { path: "/tape" };
  if (method === "GET" && n === 1 && a === "health") return { path: "/health" };
  if (method === "GET" && n === 1 && ["cards", "history", "stats", "log"].includes(a)) return { path: `/${a}`, user: true };
  if (method === "GET" && n === 1 && a === "stream") return { path: "/cards/stream", user: true };
  if ((method === "GET" || method === "PUT") && n === 1 && a === "settings") {
    return { path: `/users/${encodeURIComponent(uid)}/settings` };
  }
  if (method === "POST" && n === 3 && a === "cards" && (c === "confirm" || c === "skip")) {
    return { path: `/cards/${encodeURIComponent(b)}/${c}` };
  }
  return null;
}

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const existing = req.cookies.get(COOKIE)?.value;
  const uid = existing && /^[\w-]{8,64}$/.test(existing) ? existing : `web-${crypto.randomUUID()}`;

  const target = resolve(req.method, path, uid);
  if (!target) return Response.json({ error: "not found" }, { status: 404 });
  if (!TOKEN) return Response.json({ error: "GAUGE_API_TOKEN is not set" }, { status: 503 });

  const url = new URL(target.path, UPSTREAM);
  if (target.user) url.searchParams.set("user_id", uid);

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: req.method,
      headers: {
        authorization: `Bearer ${TOKEN}`,
        ...(req.method === "PUT" ? { "content-type": "application/json" } : {}),
      },
      body: req.method === "PUT" ? await req.text() : undefined,
      cache: "no-store",
      signal: req.signal,
    });
  } catch {
    return Response.json({ error: "gauge-api unreachable" }, { status: 502 });
  }

  // Stream the body straight through: SSE stays live, JSON stays JSON.
  const headers = new Headers();
  for (const h of ["content-type", "cache-control"]) {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  }
  if (target.path === "/cards/stream") {
    headers.set("cache-control", "no-cache, no-transform");
    headers.set("x-accel-buffering", "no");
  }
  if (!existing || existing !== uid) {
    headers.append(
      "set-cookie",
      `${COOKIE}=${uid}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
    );
  }
  return new Response(upstream.body, { status: upstream.status, headers });
}

export const GET = proxy;
export const PUT = proxy;
export const POST = proxy;
