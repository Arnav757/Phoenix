# Session Handover — Phoenix Group Website

> For **Claude in the next session** (and the user). Read this first, then `HANDOVER.md`
> (developer/coworker onboarding) and `design-references.md` (visual direction).
> Last updated: 2026-07-13.

## What this is
A premium marketing site for **Phoenix Group**, a Hyderabad construction developer. Built as a
**testing model** to show stakeholders. Next.js 16 (App Router) + TS, Tailwind v4 (CSS-first in
`globals.css`), shadcn/Nova on Base UI, `motion` + GSAP, cobe (globe). White + architectural-blue
theme, blueprint motifs. Everything is data-driven.

## Current state — what's DONE (all `npm run build` green, `tsc --noEmit` clean)

### Homepage entry (rebuilt into a cinematic architectural unveiling)
- **Entry screen** (`intro-experience.tsx`): minimal — blueprint background, large centered
  Phoenix logo, faint corner ticks, a quiet "Click anywhere" cue with a pulsing ring reticle,
  understated Skip button. No nav visible, no autoplay, no marketing copy.
- **On click**: Scene 01 — drafting marks (guide lines, dimension ticks, coordinate/survey
  crosshairs, construction circles from `drafting-marks.tsx`) stroke-draw themselves in over
  ~1.6s; the logo fades out to make room for the animation.
- **Scenes 02-05** = the **swappable animation slot**. A component that implements
  `IntroSceneProps` (`{ active: boolean, onComplete: () => void, className? }`) drops in here.
  Two options exist in the repo today:
  - **`intro-scenes/hero-video.tsx`** — currently active. Plays the 30s stitched hero
    cinematic (`public/phoenix/videos/hero-opening.mp4`, 1280×720@24fps, H.264 CRF 18).
    Three shots concatenated + cleaned: an AI-tool sparkle watermark was removed with
    ffmpeg's `delogo` filter (55×55 at x=1135, y=575); shot 3 arrived with a video-player
    overlay (progress bar, timecodes, play button) — top 24 + bottom 56 pixels cropped
    uniformly across all three shots so there's no jump at concat boundaries.
    Source clips kept locally in `hero video opening/` (git-ignored).
  - **`intro-scenes/architectural-phoenix.tsx`** — reference implementation of the interface.
    Original abstract SVG bird: curved spine + fanned steel ribs + triangular glass panels +
    small chevron head, ~5s GSAP timeline (stroke-draw → panels fade in → very slow wing
    spread → dissolve via drifting rib-tip particles). Kept in the repo as a reference for
    when the final commissioned animation replaces the video later.
- **Scene 06** — the large centered logo FLIPs to the navbar's exact position (measured live
  from the real navbar element via `getBoundingClientRect()`); overlay dissolves; navbar
  fades in. Logo artwork itself is never recolored, distorted, rotated or morphed — only
  translated and uniformly scaled.
- **Intro state machine** (`home-shell.tsx`): `NOT_STARTED → PLAYING → COMPLETED`. A
  **module-scoped `introCompleted` flag** persists across client navigation and only resets on
  a full refresh. Home→Partners→Home never replays; hard refresh does.
- **Hardening**: completion NEVER depends solely on a GSAP callback or a video `ended` event —
  a hard `setTimeout` fallback guarantees the site unlocks. Skip runs the same veil/fade
  language as a natural finish, just compressed, so it reads as instant. Reduced motion skips
  straight to the site.

### Our Network page (`/partners` — Partners + Clients unified)
- Old `/partners` is now Partners + Clients on one page via a segmented toggle.
- **Monumental unboxed globe** (`network-globe.tsx`), sized to `min(90vw, 86vh, 1150px)`,
  sits directly on a full-page blueprint background — no card/border.
- **Three-column stage** on desktop: legend + filters + network-stats left, globe center,
  Network Profile right; stacks vertically on mobile. Nothing overlaps the globe.
- **Click-only interaction**: hover no longer selects or rotates anything. Click a logo to
  lock it, click again to deselect, click anywhere outside the globe/panel to close.
- **Phoenix Hyderabad hub**: every collaboration route animates HQ → Hyderabad. Routes stay
  subtly visible at all times; 1–2 ambient bright pulses continuously travel toward Hyderabad
  on their own 2–3s cadence, pausing while a real selection is active.
- **Data**: `src/lib/partners.ts` (18 partners) + `src/lib/clients.ts` (~50 clients, names only —
  no client logos yet) + `src/lib/network-types.ts` (shared types).
- Client heading/intro sourced from phoenixindia.net/clients — factual, not invented.

### Homepage layout (curated architectural presentation)
- **Navbar** (`navbar.tsx`): container extended to **92vw** (`max-w-[1720px]`), logo hugs the
  left edge, CTA hugs the right, nav links centered. Subtle glass at top of page
  (`bg-background/25` + `backdrop-blur-sm`), transitions to slightly more opaque
  (`/70` + `backdrop-blur-md`) after scroll — the blueprint background is visible through it.
- **About / "Who we are"** (`sections/about.tsx`): full-bleed 92vw grid, display-scale
  headline (`clamp(3.75rem, 11vw, 10.5rem)` → 168px on 1600 wide), copy broken into two
  labeled content blocks (A · Craft, B · Collaboration), a metrics band surfacing the
  existing `stats` data (2001 / 40 mil sq ft / 40% / 20+ years), and ultra-low-opacity
  architectural annotations (N-01, LEVEL 20, R 0.5 m, 01.02 // FOUNDATION, drafting ticks,
  section marks) scattered around the periphery.

### Page transition system (`page-transition.tsx`)
- Not a loading screen. Intercepts left-click, same-tab, same-origin, different-route
  anchor clicks. Freezes and softly blurs the current page (3.5px), brings in an opaque
  blueprint overlay with the centered Phoenix logo (fade only), draws in drafting elements
  around it, swaps the destination route underneath once the overlay fully covers the
  screen, then dissolves. ~1.1–1.4s total.
- Same-page hash links (e.g. `/#contact` from `/`), modifier-clicks, new-tab links, and
  downloads fall through to native behavior untouched.
- Respects `prefers-reduced-motion` (skips overlay entirely).
- Note: the overlay uses hand-built corner ticks, not the shared `.sheet-corners` utility —
  that utility's own `position: relative` wins the CSS cascade at equal specificity and
  would break the overlay's `position: fixed`.

### Project pages (`/projects/equinox`, `/projects/aquila`)
- `construction-reveal.tsx` plays the uploaded construction-sim video once inside the
  blueprint frame ("Constructing…" → "As built"), then clip-reveals the final photo.
  Unchanged this session.

## Where things live (edit DATA, not components, to add content)
- `src/lib/content.ts` — company, stats, services, process, projects (image/video/specs),
  certifications, foundation, testimonials, sections.
- `src/lib/partners.ts` + `src/lib/clients.ts` + `src/lib/network-types.ts` — Our Network data.
- `src/app/globals.css` — **design source of truth**: theme tokens + `.bp-grid` `.tech-label`
  `.sheet-corners` utilities + `intro-rise`/`intro-fade` keyframes. **Never hardcode hex** —
  use the CSS variable tokens.
- `src/components/reveal.tsx` — `Reveal` / `Stagger` + `staggerItem` / `SectionHeading` — reuse
  these for scroll-in animation.
- `src/components/drafting-marks.tsx` — shared SVG (guide lines, dimension ticks, coordinate
  crosshairs, construction circles) used by both the intro and the page transition; elements
  are tagged `data-draft` (fades) and `data-draft-line` (stroke-drawn via dashoffset) for
  imperative GSAP animation.
- Routes: `/`, `/projects/[id]` (SSG), `/partners`.

## Known environment pitfalls (IMPORTANT — cost me time this session)
- **OneDrive + Turbopack**: the repo lives under OneDrive, which sometimes serves a stale
  Turbopack dev cache — "hooks changed size / manifest ENOENT" errors after edits, or an
  earlier fixed bug appearing to still be present. **Recovery**: `preview_stop` → kill any
  process on port 3000 (`Get-NetTCPConnection -LocalPort 3000 | Stop-Process`) →
  `rm -rf .next` → `preview_start`. **Never `rm -rf .next` while the dev server is running**
  — it can corrupt the server. After dependency changes, always restart clean.
- **Base UI buttons** use `render={<Link/>}` + `nativeButton={false}`, NOT Radix `asChild`.
- **Automation browser tab is `document.hidden = true`** — CSS animations and CSS
  transitions pause (their `currentTime` stays 0), programmatic `window.scrollTo(y)` doesn't
  actually scroll, and screenshot capture sometimes hangs on animated content. GSAP-driven
  animations still run (throttled) via rAF; JS event dispatch and state changes work fine.
  When automation says a CSS keyframe is "stuck at 0", that's the harness, not the code.
  Verify by (a) trusting typecheck + build if the code path is a standard pattern used
  elsewhere, or (b) asking the user to eyeball it in a real focused browser tab.
- **Verify intro/globe with `preview_eval` DOM checks** — full-screen video freezes
  `preview_screenshot`; pause/hide the video first, or check state via JS.
- **Hydration mismatch** — `home-shell.tsx` initially picked a random featured project via
  `Math.random()` during render, which ran differently on server vs. client. Fixed to defer
  the roll to a post-mount effect. If you add anything project-list-based to the intro,
  don't `Math.random()` during render — do it in `useEffect`.

## Modularity contract for the intro's animation slot
The current cinematic (`hero-video.tsx`) is a placeholder. When the final commissioned
animation is delivered, only that one file needs replacing:
- **Interface**: `IntroSceneProps` = `{ active: boolean, onComplete: () => void, className? }`.
- **Contract**: when `active` becomes true, start playing; call `onComplete` when done (or on
  error / stall — never leave the intro trapped).
- **Format**: Lottie, transparent WebM, MP4, PNG sequence, or Three.js scene — anything that
  fits the interface. Currently `<HeroVideo>` at line 249 of `intro-experience.tsx`.
- **Do not** touch the surrounding GSAP timeline, navigation reveal, state machine, or the
  Scene 06 FLIP-to-navbar — those are handled at the intro's outer level.

## Pending / next tasks (client to supply, or ready to build)
- **Intro length**: the current stitched video is 30s. Total intro is ~32s from click to
  navbar (1.5s drafting + 30s video + 0.7s FLIP). Might feel long — user can decide whether
  to trim clips, speed up the tail, or add a mid-video Skip prompt.
- **Real content** for placeholder sections labelled "pending client confirmation" in UI:
  Services, Process, Testimonials. Team/Awards pages not built yet (coworker candidate work).
- **Client logos** — none yet, tab shows names only. Drop into `public/phoenix/clients/`
  when supplied, then set the `logo` field in `src/lib/clients.ts` entries.
- **Full project list** — only Equinox + Aquila exist vs. the "40M sq ft" claim.
- **Partner "relationship since" dates** — omitted (not published); render automatically if
  added to `src/lib/partners.ts`.
- **Brand fidelity** — awaiting vector logo (`.svg`) + Untitled Sans web license (swap Inter
  in `layout.tsx`, one line). Logo PNG is low-res when scaled.
- **Contact form** is front-end only — needs a backend.
- Good parallel tasks for a coworker are listed in `HANDOVER.md` §6 and `COWORKER-HANDOVER.md`.

## Recent commit history (most-recent first, this session's work)
- `ac7d397` Replace intro's SVG bird with the stitched hero-opening cinematic
- `8826de3` Rebuild the homepage opening as a cinematic architectural unveiling
- `5820d2b` Add architectural page transition system
- `0f7bd41` Update coworker handover with end-of-day Our Network status
- `877d2d6` Switch Our Network to click-only selection, fix Clients-mode content
- `320429a` Cap globe size to viewport height so it stays fully visible
- `b6a34e6` Make Our Network page monumental, fix Skip-intro lockup bug
- `a4f5f0b` Merge Partners + Clients into one Our Network page, immerse the globe
- `9c16a7b` Add coworker handover for parallel page split
- `e59d5a4` Initial commit

## Memory
Durable project facts are saved in Claude memory (`phoenix-design-direction`). The next
session will load them automatically; this file is the fuller narrative.
