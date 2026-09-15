/**
 * Server-only config for talking to gauge-api. Never import this from a
 * "use client" component or the browser bundle — GAUGE_API_TOKEN is a
 * shared secret gauge-api's auth.rs checks; it proves the caller is an
 * authorized service, not a specific end user (gauge-api has no per-user
 * auth yet). It must stay on the server, inside app/api/gauge/*'s Route
 * Handlers, never reach client JS.
 */

export const GAUGE_API_URL = process.env.GAUGE_API_URL ?? "http://127.0.0.1:8080";
export const GAUGE_API_TOKEN = process.env.GAUGE_API_TOKEN ?? "";

/**
 * Stand-in for real per-user identity, which doesn't exist yet — gauge-api
 * only proves "this caller holds a valid service token," not "this caller
 * is user X" (see gauge-api's auth.rs). Every request this frontend makes
 * acts as this one fixed demo user until real login/session auth exists.
 */
export const DEMO_USER_ID = "demo-user";

export function gaugeApiHeaders(extra?: HeadersInit): HeadersInit {
  return {
    Authorization: `Bearer ${GAUGE_API_TOKEN}`,
    ...extra,
  };
}
