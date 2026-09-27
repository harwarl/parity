# GAUGE frontend

Next.js app: the landing page (`/`), the docs (`/docs`) and the dashboard (`/dashboard`). The design source of truth is `design.md` and `animations.md`.

## Run it against the backend

```bash
# 1. backend, with simulated dev prices (needs a local redis-server)
cd ../backend && make up-sim

# 2. frontend
cp .env.example .env.local   # GAUGE_API_URL + GAUGE_API_TOKEN (dev defaults match `make up`)
npm install && npm run dev
```

Open <http://localhost:3000/dashboard>. The top bar shows **LIVE API** when the dashboard is reading gauge-api, and **SAMPLE DATA · API OFFLINE** when it can't reach it (it then shows design.md's sample day and retries every 10 s).

## How it talks to gauge-api

- The browser only ever calls `/api/gauge/*` (`app/api/gauge/[...path]/route.ts`). That proxy adds the bearer token and the viewer's user id server-side, forwards only an allow-list of routes, and streams SSE straight through. Neither the token nor a user id reaches the browser, so a browser can't act as another user.
- Until real auth exists, each browser is its own paper account: an httpOnly `gauge_uid` cookie is minted on first request, and the account is created with default gates on first visit.
- `components/app/shell/GaugeProvider.tsx` owns the connection: tape every 1 s; cards, history, stats and health every 5 s; SSE card events refresh cards at once. Polling pauses while the tab is hidden.
- `lib/gauge/adapt.ts` maps backend ticks and cards onto the dashboard's view models, re-running the gates (feed → session → depth → net) under the viewer's own rules, the same as backend `carder::gates`.

`make up-sim` is dev only: `mod market`'s real poll loop doesn't exist yet, so without it gauge-api has no prices and the board shows "No prices yet".
