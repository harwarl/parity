@AGENTS.md

## Component architecture

Use a scalable Next.js App Router structure:

```
app/
  (marketing)/
    page.tsx
    about/page.tsx
    layout.tsx
  api/
    .../route.ts
  layout.tsx
  globals.css

components/
  ui/              # low-level reusable primitives (Button, Input, Card, Badge)
  sections/        # page-section-level blocks (Hero, FeatureGrid, Testimonials, CTA)
  layout/          # Navbar, Footer, Container, PageShell
  shared/          # things used across sections but not primitives (Logo, IconWrapper)

lib/               # utilities, helpers, constants, formatting
hooks/             # custom React hooks
types/             # shared TypeScript types
config/            # site config, nav data, theme tokens
public/            # static assets, images, fonts (if self-hosted outside next/font)
styles/            # tailwind config extensions, design tokens if not co-located
```

Rules:

- One component per file. Co-locate a component's minor sub-parts in the same file only if they're not reused elsewhere.
- Client-only logic (motion, scroll listeners, pointer state) lives in isolated leaf components marked `"use client"` — keep everything else as Server Components.
- Shared design tokens (colors, radii, spacing scale) live in one place (`config/theme.ts` or Tailwind config) — components reference tokens, not one-off magic values.
- Keep a single corner-radius system and a single icon library across the whole project.

**Reuse before creating.** Search `components/` for something that already does the job or can be extended with props before adding a new file. No `Button2` / `CardV2` duplicates. One component per file. Client-only logic (motion, pointer, scroll, WebGL) lives in isolated `"use client"` leaf components; everything else stays a Server Component.

## Skills — invoke these BEFORE writing UI

1. **design-taste-frontend** / **frontend-design** — run first on every new page or
   major section. Set the dials (variance / motion / density) for that section and
   leave them in a top-of-file comment so the next pass stays consistent.
2. **ui-ux-design-reference** ("UI UX Pro Max") — palette logic, type pairing,
   spacing scale, and the priority-ranked checklist. Check work against it before
   calling a section done.
3. **impeccable** — for the signature moments: the card widget, the tape grid, the
   WebGL hero, the reject tiles. The bar is "technically extraordinary," not
   "clean." Use it for live browser iteration on these.
4. **threejs-\*** (installed globally) — the hero and any 3D. Start with
   `threejs-fundamentals`; pull `threejs-shaders` + `threejs-postprocessing` for
   grain / bloom / refraction, `threejs-interaction` for pointer parallax,
   `threejs-materials` for the card surface.
5. **dataviz** — before ANY number row, sparkline, gap meter, or chart. The tape is
   a data-viz surface; treat it like one.

---
