import type { ApiCard, ApiUser, BasisTick, ConfirmResponse, Health, HistoryRow, TodayStats } from "./types";

/**
 * Browser-side client. Every call goes through the Next proxy
 * (`app/api/gauge/[...path]`), which adds the bearer token and the user id
 * on the server — neither ever reaches the browser, and a browser can't
 * name another user.
 */
const BASE = "/api/gauge";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  const text = await res.text();
  // Confirm reports its outcome in the body even on 409/502.
  if (!res.ok && !(path.endsWith("/confirm") && text.startsWith("{"))) {
    throw new ApiError(res.status, text || res.statusText);
  }
  return (text ? JSON.parse(text) : undefined) as T;
}

export const api = {
  tape: () => call<BasisTick[]>("tape"),
  health: () => call<Health>("health"),
  cards: () => call<ApiCard[]>("cards"),
  history: () => call<HistoryRow[]>("history"),
  stats: () => call<TodayStats>("stats"),
  settings: () => call<ApiUser>("settings"),
  saveSettings: (user: ApiUser) => call<ApiUser>("settings", { method: "PUT", body: JSON.stringify(user) }),
  confirm: (cardId: string) => call<ConfirmResponse>(`cards/${encodeURIComponent(cardId)}/confirm`, { method: "POST" }),
  skip: (cardId: string) => call<void>(`cards/${encodeURIComponent(cardId)}/skip`, { method: "POST" }),
  /** SSE: `event: card` and `event: reason`. */
  streamUrl: () => `${BASE}/stream`,
};
