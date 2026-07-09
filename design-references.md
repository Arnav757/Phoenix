# Design References (analyzed 2026-07-07)

Goal: awwwards-level polish (user linked awwwards.com/websites as the quality bar).

## 1. modusprojects.nl — MODUS Projects (real-estate finishing/afbouw)
**Overall**: Premium, warm, editorial. Dark charcoal (#3a373b-ish) + warm peach/apricot accent (#f5a173-ish) + cream.
**Typography**: Tall condensed serif-ish display caps for headlines ("ANDERS DENKEN, SLIMMER REALISEREN."), clean grotesque for body.
**Layout/sections**:
- Fixed pill-shaped translucent (blurred) header: left nav links, center logo, right accent CTA button + hamburger.
- Hero: full-bleed video of building at sunset, huge white display headline, scroll cue arrow.
- Scroll-driven hero: video scales/zooms while scrolling (scroll-jacked storytelling).
- Dark section: service list rows (SANITAIR / TEGELS / KEUKENS / VLOEREN) with small thumbnail + "+" button per row; left column heading with text-reveal-on-scroll (words fade in as you scroll).
- 3 numbered value cards (01/02/03) in alternating colors (charcoal / grey / peach) with decorative vertical-bar/arc graphics.
- Projects carousel: center-focused large card with side cards peeking (SILO AMERIKA), headline "PROJECTEN WAAR WIJ TROTS OP ZIJN." with two-tone word coloring animating in.
- Checklist section (checkmarks with divider lines) + image.
- CTA finale: floating small images around centered headline (repeats hero slogan), accent button, founders avatars + "We gaan graag in gesprek".
**Animations**: scroll-video scrub/zoom, per-word text reveal tied to scroll, sticky sections, carousel, subtle parallax floating images, arrows/hover states. Feels GSAP ScrollTrigger-like.

## 2. business.nrg.com/campaigns/build-your-data-center — NRG (B2B energy campaign)
**Overall**: Dark plum/near-black (#2a2028-ish) immersive one-pager, WebGL/3D heavy, corporate-cinematic.
**Entry**: Splash gate with logo + yellow rounded "Enter Site" button (site treats itself as an "experience").
**Typography**: Large friendly grotesque (looks like a rounded modern sans), white on dark; green "Menu" pill top-right; small side labels ("Explore Our Build Process").
**Structure** (from fetch): Hero "Data Drives Our World." → BYOP concept intro → "Start Building With Us" with five phases navigated by scroll (Phase 1..5 storytelling).
**Animations**: heavy scroll-jacked WebGL scenes (renderer literally chokes automation tools), text fades in staged sequence, phase-based scroll storytelling. Note: this is the "wow but heavy" end of the spectrum — replicate the *feel* with lighter techniques (canvas/video + motion) rather than full WebGL.

## 3. units.gr — Units (student housing, Greece)
**Overall**: Playful neo-brutalist/pop. Cream/beige background (#f2e8e0-ish) + saturated primaries: cobalt blue, red, orange, yellow, green, purple. Big personality.
**Typography**: Ultra-chunky black display sans for wordmark/headlines ("units." with house-shaped period), letter-spaced small caps for taglines.
**Layout/sections**:
- Preloader: house icon cycling through brand colors, then wordmark letters stagger-reveal, tagline types out letter-by-letter ("UNIQUE STUDENT HOMES").
- Left sidebar nav: numbered colored cards (01 Student Homes / 02 Our way of living / 03 Community / 04 Contact) + "Book your Unit" button + language toggle + socials.
- Bento-ish content cards: photos with rounded corners, solid color cards with pill category tags ("Community"), CTA buttons.
- "What defines us" full-width color band → three blue cards with pixel-art icons (smiley/bolt/heart on grid paper) — For People / By Design / With Care.
- Full-width black pill CTA "Our way of living ↗".
- Instagram horizontal marquee of photo cards.
- Newsletter row: red pill "Join our newsletter" + yellow pill email input + black arrow square.
- Footer: giant wordmark sitting on drafting-grid background with scattered colored squares; copyright + policy pills.
**Animations**: preloader sequence, staggered reveals, marquee scroll, hover lifts, color-block transitions. Rounded-rect pill language everywhere.

## Synthesis for our sample model
Common DNA across references:
- Bold oversized display typography as the primary design element; short punchy copy.
- Scroll-driven storytelling: reveals, pinned sections, video/imagery that responds to scroll.
- Strong single accent color against a restrained base (dark or cream).
- Pill-shaped UI elements (buttons, headers, tags); rounded corners on cards/images.
- Preloader/entry moment that sets the tone.
- Numbered sections/process phases as a narrative device.
- Marquee strips, carousels, floating imagery, founders/social proof near the CTA.
Tech mapping: Next.js + Tailwind + shadcn/ui base, `motion` (framer-motion) for reveals/marquees/parallax; scroll-scrub via `useScroll`/`useTransform`; avoid heavy WebGL — use video/canvas + transforms for the cinematic feel.
