# Session Handover — Phoenix Group Website

> For **Claude in the next session** (and the user). Read this first, then `HANDOVER.md`
> (developer/coworker onboarding) and `design-references.md` (visual direction).
> Last updated: 2026-07-08.

## What this is
A premium marketing site for **Phoenix Group**, a Hyderabad construction developer. Built as a
**testing model** to show stakeholders. Next.js 16 (App Router) + TS, Tailwind v4 (CSS-first in
`globals.css`), shadcn/Nova on Base UI, `motion` + GSAP, cobe (globe). White + architectural-blue
theme, blueprint motifs. Everything is data-driven.

## Current state — what's DONE and working (all verified in-browser, `npm run build` green)
- **Homepage** (`/`): one-time cinematic **intro overlay** (`intro-experience.tsx`) plays the
  client video `public/phoenix/videos/hero-scrub.mp4` once on first scroll/gesture, GSAP veil
  hands off to the site, navbar fades in. Sections: About, Services, Portfolio, Process,
  Experience, Testimonials, Contact. Hero-as-a-section was removed; intro replaced it.
- **Intro state machine** (`home-shell.tsx`): `NOT_STARTED → PLAYING → COMPLETED`. A
  **module-scoped `introCompleted` flag** persists across client navigation and only resets on a
  full refresh. All internal nav uses `next/link` (navbar, portfolio cards) so navigation is
  client-side and never replays the intro. Verified: Home→Partners→Home = no replay; hard
  refresh = replay; Skip button works (smooth GSAP fade). Reduced-motion skips straight in.
- **Project pages** (`/projects/equinox`, `/projects/aquila`): `construction-reveal.tsx` plays
  the uploaded construction-sim video once inside the blueprint frame ("Constructing…" → "As
  built"), then clip-reveals the final photo. The old 2D SVG `construction-intro.tsx` is DELETED.
- **Partners page** (`/partners`): interactive **cobe globe**, logos-as-markers (HQ diamond +
  logo chip, office rings), curved great-circle **engineering-red dotted routes** on select,
  screen-space collision + leader lines, idle **featured-partner spotlight** with pulse,
  architectural info-sheet panel (bottom sheet on mobile), interactive legend, searchable/
  sortable/filterable directory synced with the globe. Data in `src/lib/partners.ts` (19 real
  partners, real HQ coords, logos in `public/phoenix/partners/`).
- **Brand applied**: primary blue `#0078F3` (Pantone 2727 C), cream/secondary palette,
  `--eng-red #b0554b`, Inter (stand-in for licensed Untitled Sans), sentence-case tagline.
- **Latest assets swapped in**: final photos `public/phoenix/images/{equinox,aquila}.png`
  (2700px), construction videos `public/phoenix/videos/construction-{equinox,aquila}.mp4`.
  Old placeholders (`phoenix-equinox.jpg`, `image.jpg`) deleted, no stale refs.
- **Desktop shortcut**: `Launch Phoenix Site.cmd` + `~/Desktop/Phoenix Website.lnk` start the
  dev server and open the browser for quick demos.

## Where things live (edit DATA, not components, to add content)
- `src/lib/content.ts` — company, stats, services, process, **projects** (image/video/specs),
  certifications, foundation, testimonials, sections. `projects[].video` = construction sim.
- `src/lib/partners.ts` — all partner data + categories/regions.
- `src/app/globals.css` — **design source of truth**: theme tokens + `.bp-grid` `.tech-label`
  `.sheet-corners` utilities + `intro-rise`/`intro-fade` keyframes.
- `src/components/reveal.tsx` — `Reveal` / `Stagger`+`staggerItem` / `SectionHeading` (reuse these).
- Routes: `/`, `/projects/[id]` (SSG), `/partners`.

## Known environment pitfalls (IMPORTANT — cost me time this session)
- **OneDrive + Turbopack**: the repo is under OneDrive, which serves a **stale dev cache** and
  causes HMR "hooks changed size / manifest ENOENT" errors after edits. **Never `rm -rf .next`
  while the dev server is running** — it corrupts the server and orphans the port-3000 process
  (then `preview_start` keeps "reusing" the broken one). Correct recovery: `preview_stop` →
  kill any process on port 3000 (`Get-NetTCPConnection -LocalPort 3000` → `Stop-Process`) →
  `rm -rf .next` → `preview_start`. After dependency changes, always restart clean.
- **Base UI buttons** use `render={<Link/>}` + `nativeButton={false}`, NOT Radix `asChild`.
- Verify the globe/intro with `preview_eval` DOM checks — full-screen video freezes
  `preview_screenshot`; pause/hide the video first, or check state via JS.

## Pending / next tasks (client to supply, or ready to build)
- **Real content** for placeholder sections (labelled "pending client confirmation" in UI):
  Services, Process, Testimonials. Team/Clients/Awards pages not built yet.
- **Full project list** — only Equinox + Aquila exist vs. the "40M sq ft" claim.
- **Partner "relationship since" dates** — omitted (not published); render automatically if added.
- **Brand fidelity** — awaiting vector logo (`.svg`) + Untitled Sans web license (swap Inter in
  `layout.tsx`, one line). Logo PNG is low-res when scaled.
- **Contact form** is front-end only — needs a backend.
- Good parallel tasks for a coworker are listed in `HANDOVER.md` §6.

## Memory
Durable project facts are saved in Claude memory (`phoenix-design-direction`). The next session
will load them automatically; this file is the fuller narrative.
