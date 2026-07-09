# Phoenix Group Website — Developer Handover

A premium marketing site for **Phoenix Group**, a construction developer in Hyderabad.
This is a working **testing model** — real content is still being supplied by the client, so
some copy is placeholder (clearly labelled in the UI and in `src/lib/content.ts`).

---

## 1. Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router) + TypeScript | ⚠️ Read `AGENTS.md` — this Next.js has breaking changes vs. older docs. Bundled docs live in `node_modules/next/dist/docs/`. |
| Styling | **Tailwind CSS v4** | Config is CSS-first in `src/app/globals.css` (`@theme`), no `tailwind.config.js`. |
| UI primitives | **shadcn/ui (Nova preset)** on **Base UI** | In `src/components/ui/`. NOTE: buttons use Base UI's `render={<a/>}` + `nativeButton={false}`, **not** Radix `asChild`. |
| Animation | **motion** (framer-motion successor) + **GSAP** | `motion/react` for reveals/panels; GSAP only in the intro hand-off. |
| Globe | **cobe** | Partners page only. |
| Fonts | **Inter** (stand-in for brand's *Untitled Sans*) + Geist Mono for technical labels |

Node 20+. Package manager: npm.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build — keep this green
npx tsc --noEmit # typecheck
```

> **OneDrive gotcha:** the repo currently lives under OneDrive, which sometimes serves a stale
> Turbopack cache. If the dev server shows old code after an edit, stop it, `rm -rf .next`, restart.

---

## 2. Design system — use these, don't reinvent

Everything is driven by the `.phoenix` theme class on `<body>` (`src/app/layout.tsx`).
Colors are CSS variables in `globals.css`; **never hardcode hex** — use the tokens.

- **Base:** white background (`--background`), ink-navy text (`--foreground`)
- **Brand blue:** `--primary` = `#0078F3` (Pantone 2727 C digital value, from brand guidelines)
- **Secondary palette** (brand guidelines): `--brand-cream #fbf1e5`, `--brand-yellow`, `--brand-sky`, `--brand-green`, `--brand-purple`
- **Engineering red:** `--eng-red #b0554b` — used only for globe connection routes / "active network"
- **Radius scale:** `--radius-*`

**Reusable utilities (in `globals.css`) — reach for these to stay on-brand:**
- `.bp-grid` — blueprint grid background
- `.tech-label` — uppercase mono micro-label (kickers, tags)
- `.sheet-corners` — architectural drawing-sheet corner ticks on a bordered box

**Reusable animation primitives (`src/components/reveal.tsx`):**
- `<Reveal delay y>` — scroll-in fade/rise (once, viewport-triggered)
- `<Stagger gap>` + `staggerItem` variant — staggered children
- `<SectionHeading kicker title>` — standard section header with the animated rule

Motion conventions: ease `[0.22, 1, 0.36, 1]`; reveals 0.6–0.9s; hovers 300ms; **always honour
`prefers-reduced-motion`** (see how `useReducedMotion()` is used in the intro/globe).

---

## 3. Structure & routes

```
src/
  app/
    layout.tsx           # theme class, fonts, metadata
    globals.css          # theme tokens + utilities  ← design source of truth
    page.tsx             # home — renders <HomeShell/>
    projects/[id]/       # per-project detail pages (SSG via generateStaticParams)
    partners/page.tsx    # OUR PARTNERS page
  components/
    home-shell.tsx       # orchestrates intro → main site hand-off
    intro-experience.tsx # one-time cinematic video intro (overlay, not a section)
    navbar.tsx           # shared nav; hidden during intro, sticky after
    reveal.tsx           # animation primitives (above)
    construction-intro.tsx  # per-building "constructing → built" animation
    sections/            # home page sections (hero removed; About…Contact)
    partners/            # partner-globe, partner-panel, partners-page-client
    ui/                  # shadcn primitives
  lib/
    content.ts           # ALL home/company/project content  ← edit data here
    partners.ts          # ALL partner data  ← edit data here
public/phoenix/          # images, videos, partner logos
```

**Pages that exist:** `/` (home), `/projects/equinox`, `/projects/aquila`, `/partners`.

---

## 4. Key behaviours already built (don't break these)

- **Intro** (`intro-experience.tsx`): full-screen video intro plays **once** on first scroll,
  then a GSAP veil hands off to the site and the navbar fades in. It's an overlay above the
  page — normal scrolling never re-enters it. Logo click / refresh replays it. Has escape
  hatches (Skip button, Esc, auto-bail if video stalls) so it can never trap the user.
- **Project pages**: open with a scheme-driven "construction" animation (blueprint → floors
  rise → photo develops), data-driven from each project's `scheme` in `content.ts`.
- **Partners globe** (`partner-globe.tsx`): logos-as-markers, HQ diamonds vs office rings,
  curved great-circle red routes on select, screen-space collision with leader lines, idle
  "featured partner" spotlight, keyboard-focusable chips. All positioning runs in a rAF loop
  outside React (no re-render on rotation) — keep it that way for perf.

---

## 5. Everything is data-driven — where to add content

- **Company info, stats, services, process, portfolio projects, testimonials, foundation:**
  `src/lib/content.ts`. Adding a project = one entry (include a `scheme` for the build animation).
- **Partners:** `src/lib/partners.ts`. Adding a partner = one entry + drop its logo in
  `public/phoenix/partners/`. The globe, legend, directory, filters and panel all render from it.

Placeholder copy is marked with `[PLACEHOLDER]` comments and "pending client confirmation"
labels in the UI — replace as real content arrives. **Don't invent facts** (dates, figures).

---

## 6. Good first tasks to split up

These are independent and safe to build in parallel:

1. **Team / Leadership page** (`/team`) — mirror the Partners data-driven pattern.
2. **Clients page or logo wall** — data list + marquee, reuse `Reveal`/`Stagger`.
3. **Full Portfolio index** (`/projects`) — grid of all projects linking to detail pages.
4. **Awards & Certifications section** — the IGBC/CII data is noted in `content.ts`.
5. **Contact form backend** — the form in `sections/contact.tsx` is currently front-end only.
6. **Real hero video** — client is sending a cropped cut; swap `videoSrc` in the intro.
7. **Accessibility + responsive audit** across new pages.

**Conventions to follow:** new page = a route under `app/`, content in `lib/`, sections built
from `Reveal`/`SectionHeading`/`Stagger`, colors via tokens, `sheet-corners`/`bp-grid`/`tech-label`
for the architectural feel. Run `npx tsc --noEmit` and `npm run build` before pushing.

---

## 7. Still pending from client
Real project list (only Equinox + Aquila so far vs. 40M sq ft claimed), more images/videos,
real services/process/testimonials copy, vector logo + Untitled Sans web license, partner
"relationship since" dates. See `design-references.md` for the visual direction and reference sites.
