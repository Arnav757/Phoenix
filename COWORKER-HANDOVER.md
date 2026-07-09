# Coworker Handover — Phoenix Group Website

> Welcome aboard. Read this file, then skim `HANDOVER.md` (full dev reference) and
> `design-references.md` (visual direction) before writing code. If you use Claude Code,
> `AGENTS.md`/`CLAUDE.md` auto-load the Next.js 16 breaking-changes warning for you.

## What this is
A premium marketing site for **Phoenix Group**, a Hyderabad construction developer. Built as a
**testing model** to show stakeholders. Next.js 16 (App Router) + TS, Tailwind v4 (CSS-first in
`globals.css`), shadcn/Nova on Base UI, `motion` + GSAP, cobe (globe). White + architectural-blue
theme, blueprint motifs. **Everything is data-driven** — you add content by editing `src/lib/*.ts`
files, not by hand-writing markup with copy baked in.

## Today's split
- **Shayan** is working on the **Partners page** (`/partners`), which is being expanded to also
  cover **Clients** (so it becomes a combined Partners + Clients page). Don't touch
  `src/lib/partners.ts`, `src/components/partners/*`, or `src/app/partners/page.tsx` today —
  that's his in-flight work and will conflict.
- **You** — pick whichever page from §6 of `HANDOVER.md` (Team/Leadership, full Portfolio index,
  Awards & Certifications, etc.) makes sense to you and tell Shayan which one you're taking, so
  there's no overlap. Anything under a **new route** (`src/app/<your-page>/`) and **new data file**
  (`src/lib/<your-data>.ts`) is safe — it won't touch files Shayan is editing.

## Git workflow for today
This repo was just initialized with git (it wasn't one before). Baseline is committed on `master`.
- Shayan is working on branch `shayan-partners-clients`.
- **You:** pull the repo, create your own branch off `master` before starting, e.g.
  ```bash
  git checkout master
  git pull
  git checkout -b <yourname>-<page-name>
  ```
- Commit as you go on your branch. At end of day we'll both push, then merge both branches into
  `master` (via PR or a plain `git merge` — whichever is easier for our setup). Because we're
  touching different routes/data files, conflicts should be minimal to none.
- Before merging, each of us runs `npm run build` and `npx tsc --noEmit` clean on our own branch.

## Current state — what's DONE and working (all verified in-browser, `npm run build` green)
- **Homepage** (`/`): one-time cinematic **intro overlay** (`intro-experience.tsx`) plays the
  client video `public/phoenix/videos/hero-scrub.mp4` once on first scroll/gesture, GSAP veil
  hands off to the site, navbar fades in. Sections: About, Services, Portfolio, Process,
  Experience, Testimonials, Contact.
- **Intro state machine** (`home-shell.tsx`): `NOT_STARTED → PLAYING → COMPLETED`, persists across
  client navigation (module-scoped flag), resets only on full refresh. All internal nav uses
  `next/link` so it never replays. Skip button + Esc + reduced-motion bail-outs all work.
- **Project pages** (`/projects/equinox`, `/projects/aquila`): `construction-reveal.tsx` plays a
  construction-sim video once inside a blueprint frame, then clip-reveals the final photo.
- **Partners page** (`/partners`): interactive cobe globe, logos-as-markers, curved red routes,
  searchable/sortable directory. **Being extended today to add Clients** — expect this page's
  files to change under Shayan; don't build against its current shape assuming it's final.
- **Brand applied**: primary blue `#0078F3`, cream/secondary palette, `--eng-red #b0554b`, Inter
  (stand-in font), sentence-case tagline.
- **Latest assets in place**: final project photos, construction videos for Equinox + Aquila.

## Where things live (edit DATA, not components, to add content)
- `src/lib/content.ts` — company, stats, services, process, projects, certifications,
  foundation, testimonials, sections.
- `src/lib/partners.ts` — partner data (Shayan's file today — don't edit).
- `src/app/globals.css` — design source of truth: theme tokens + `.bp-grid` `.tech-label`
  `.sheet-corners` utilities + keyframes. **Never hardcode hex colors** — use the CSS variable
  tokens defined here.
- `src/components/reveal.tsx` — `Reveal` / `Stagger` + `staggerItem` / `SectionHeading` — reuse
  these for any new page's scroll-in animations instead of writing your own.
- Existing routes: `/`, `/projects/[id]` (SSG), `/partners`.

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
