# Coworker Handover — Phoenix Group Website

> Welcome aboard. Read this file, then skim `HANDOVER.md` (full dev reference) and
> `design-references.md` (visual direction) before writing code. If you use Claude Code,
> `AGENTS.md`/`CLAUDE.md` auto-load the Next.js 16 breaking-changes warning for you.
>
> Updated end-of-day — Shayan's Our Network work is finished and sitting on `master`.

## What this is
A premium marketing site for **Phoenix Group**, a Hyderabad construction developer. Built as a
**testing model** to show stakeholders. Next.js 16 (App Router) + TS, Tailwind v4 (CSS-first in
`globals.css`), shadcn/Nova on Base UI, `motion` + GSAP, cobe (globe). White + architectural-blue
theme, blueprint motifs. **Everything is data-driven** — you add content by editing `src/lib/*.ts`
files, not by hand-writing markup with copy baked in.

## Where things stand right now
- **Shayan's side is done and merged into `master` directly** (no open branch to merge — see
  "Git workflow" below for why). The old `/partners` page is now **Our Network**: one page with a
  **Partners / Clients toggle**, a single shared interactive globe, and per-tab data, filters and
  a Network Profile panel.
- **Your page is still open** — pick one from §6 of `HANDOVER.md` (Team/Leadership, full Portfolio
  index, Awards & Certifications, etc.), tell Shayan which one, and build it under a **new route**
  (`src/app/<your-page>/`) with a **new data file** (`src/lib/<your-data>.ts`). That's guaranteed
  not to touch anything Shayan changed.

## Git workflow
This repo was initialized with git today (it wasn't one before); baseline is on `master`.
- A branch `shayan-partners-clients` was created this morning for Shayan's work, but in practice
  all of today's Our Network commits landed straight on `master` (solo work, no risk of collision
  at the time) — so that branch is stale/unused. Ignore it.
- **You:** branch off current `master` (it already has everything below) before starting:
  ```bash
  git checkout master
  git pull
  git checkout -b <yourname>-<page-name>
  ```
- Commit as you go on your branch. When you're done, push and merge (or open a PR) back into
  `master`. Since you're adding a new route + new data file, conflicts should be minimal to none.
- Before merging: `npx tsc --noEmit` and `npm run build` must both be clean on your branch.

## Current state — what's DONE and working (all verified in-browser, `npm run build` green)
- **Homepage** (`/`): one-time cinematic **intro overlay** (`intro-experience.tsx`), GSAP veil
  hand-off, navbar fade-in. Sections: About, Services, Portfolio, Process, Experience,
  Testimonials, Contact. **Skip intro was buggy (could lock scrolling) — fixed today**: the
  site's unlock no longer depends solely on a GSAP callback; there's a hard fallback timer so it
  can never get stuck, and Skip/Esc now run a fast version of the same exit instead of the full
  cinematic one.
- **Intro state machine** (`home-shell.tsx`): `NOT_STARTED → PLAYING → COMPLETED`, persists across
  client navigation, resets only on full refresh. All internal nav uses `next/link` so it never
  replays.
- **Project pages** (`/projects/equinox`, `/projects/aquila`): unchanged, still working.
- **Our Network page** (`/partners` — route kept, content is now Partners+Clients) — today's big
  build:
  - **Partners / Clients toggle** — one shared globe, switches data/filters/panel with no reload.
  - **Monumental, unboxed globe** — no card/border, sizes to `min(90vw, 86vh, 1150px)`, sits
    directly on a full-page blueprint background.
  - **Click-only interaction** — hover no longer selects or rotates anything (was feeling
    accidental); click a logo to lock it, click again to deselect, click outside to close.
  - **Phoenix Hyderabad hub** — every collaboration route animates HQ → Hyderabad. Routes stay
    subtly visible at all times, plus 1–2 ambient bright pulses continuously travel toward
    Hyderabad on their own so the network always feels alive, even at idle.
  - **Layout**: legend/categories/stats on the left, globe centered, Network Profile on the right
    (stacks vertically on mobile) — nothing overlaps the globe.
  - **Data**: `src/lib/partners.ts` (18 partners, unchanged) + new `src/lib/clients.ts` (~50
    clients from the client-supplied roster, names only — no client logos yet) +
    `src/lib/network-types.ts` (shared types both files build on).
  - Client heading/intro copy is sourced from phoenixindia.net/clients (their own quote + a
    factual sector summary), not invented.
- **Brand applied**: primary blue `#0078F3`, cream/secondary palette, `--eng-red` (brightened
  today for contrast), Inter (stand-in font), sentence-case tagline.

## Where things live (edit DATA, not components, to add content)
- `src/lib/content.ts` — company, stats, services, process, projects, certifications,
  foundation, testimonials, sections.
- `src/lib/partners.ts` / `src/lib/clients.ts` / `src/lib/network-types.ts` — Our Network data.
  Fully built out today — you shouldn't need to touch these for your page.
- `src/app/globals.css` — design source of truth: theme tokens + `.bp-grid` `.tech-label`
  `.sheet-corners` utilities + keyframes. **Never hardcode hex colors** — use the CSS variable
  tokens defined here.
- `src/components/reveal.tsx` — `Reveal` / `Stagger` + `staggerItem` / `SectionHeading` — reuse
  these for any new page's scroll-in animations instead of writing your own.
- Existing routes: `/`, `/projects/[id]` (SSG), `/partners` (Our Network).

## Conventions to follow for your new page
1. New route under `src/app/<page>/page.tsx`.
2. New data file under `src/lib/<page>.ts` — no hardcoded copy in components.
3. Build sections from `Reveal` / `SectionHeading` / `Stagger` (see any file in
   `src/components/sections/` for the pattern).
4. Colors via CSS variable tokens only; use `.sheet-corners` / `.bp-grid` / `.tech-label` where it
   fits the architectural-blueprint feel.
5. Buttons: shadcn/Nova on **Base UI** — links use `render={<Link/>}` + `nativeButton={false}`,
   **not** Radix `asChild`. See `src/components/ui/button.tsx`.
6. Motion: ease `[0.22, 1, 0.36, 1]`, reveals 0.6–0.9s, hovers 300ms, always honour
   `prefers-reduced-motion` (see `useReducedMotion()` usage in the intro/globe).
7. Placeholder copy: mark clearly (`[PLACEHOLDER]` comments + "pending client confirmation" label
   in the UI). **Don't invent facts** (dates, figures, certifications).
8. Before pushing: `npx tsc --noEmit` and `npm run build` must both be clean.

## Known environment pitfall (OneDrive)
The repo lives under OneDrive, which can serve a **stale Turbopack dev cache** — you may see
"hooks changed size" or manifest errors after edits. Fix: stop the dev server, `rm -rf .next`,
restart. **Never delete `.next` while the dev server is still running** — it can orphan the
port-3000 process.

## Questions / blockers
If anything above is unclear or you hit a data gap (missing content for your page), ping Shayan
before inventing placeholder facts — check `HANDOVER.md` §7 for what's already known to be
pending from the client.
