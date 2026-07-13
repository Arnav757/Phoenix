# Deployment — Phoenix Group Website

> Ship-first playbook. This session prepared the repo; the user connects
> Vercel and runs one SQL statement to finish the deploy.

## What was done this session

- **Phase 1 — Audit**
  - `tsc --noEmit`: clean.
  - `next build`: clean, `/`, `/partners`, `/projects/[id]` prerendered static.
  - `eslint`: 1 real bug fixed (project detail page's `<a href="/#contact">` →
    `<Link>` so client-side navigation and the page-transition overlay keep
    working). Remaining lint reports are React 19 canary strictness
    (`react-hooks/refs`, `set-state-in-effect`) — patterns that compile and
    run correctly. See "Recommended follow-ups" below.
- **Phase 2 — Perf**
  - Bundle already reasonable (GSAP + cobe are only imported inside the
    scenes that use them; homepage is SSG). No hot-path regression.
  - `next/image` in use, `formats: ['image/avif','image/webp']` set.
  - Long-cache headers on `/phoenix/*` and `/_next/static/*` (1 year, immutable).
  - Fuller bundle-analyzer pass and `dynamic()` imports for the globe are
    listed as follow-ups.
- **Phase 5 — Env**
  - `.env.local` written (git-ignored — verified via `git check-ignore`).
  - `.env.example` committed with the four env-var names.
- **Phase 6/7 — Vercel + Security**
  - `next.config.ts` rewritten:
    - `reactStrictMode`, `compress`, `poweredByHeader: false`,
      `productionBrowserSourceMaps: false`.
    - `images.remotePatterns` allows `https://<supabase>.supabase.co/storage/v1/object/public/**`.
    - Headers: CSP, HSTS (2y, `preload`), `X-Frame-Options: DENY`,
      `X-Content-Type-Options: nosniff`, `Referrer-Policy:
      strict-origin-when-cross-origin`, `Permissions-Policy` locking down
      camera/mic/geolocation/FLoC.
  - CSP verified live: `default-src 'self'; script-src 'self' 'unsafe-inline'
    'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:
    blob: https:; media-src 'self' blob:; font-src 'self' data:; connect-src
    'self' https://<project>.supabase.co https://*.supabase.co
    wss://*.supabase.co; frame-ancestors 'none'; base-uri 'self';
    form-action 'self'; object-src 'none'`.
  - CSP note: `'unsafe-inline' 'unsafe-eval'` are required by Next 16 +
    Turbopack. Moving to a nonce-based CSP is a follow-up hardening pass
    (needs middleware to stamp a per-request nonce onto inline scripts).
- **Supabase scaffold**
  - `@supabase/supabase-js` + `server-only` installed.
  - `src/lib/supabase/client.ts` — browser client, publishable key,
    throws at import if env vars are missing.
  - `src/lib/supabase/server.ts` — server-only client, service_role key,
    guarded by the `server-only` import (build error if any `"use client"`
    file imports it).
  - `supabase/migrations/001_contact_submissions.sql` — table + RLS.
- **Contact form wired**
  - `src/app/api/contact/route.ts` — Node runtime, force-dynamic. Validates
    name/email/phone/message with fixed length caps, checks the honeypot
    (`website` field), captures IP + user-agent, inserts via service_role,
    returns a generic error on failure so DB internals never leak.
  - `src/components/sections/contact.tsx` — real `onSubmit`, submitting /
    success / error states, `aria-live` status region, hidden honeypot,
    disabled inputs while submitting.
  - Verified in-browser: `POST /api/contact` with bad JSON → 400 with
    `{error: "Invalid JSON"}`; with valid shape → 500 (until the SQL below
    runs) and the server log confirms it's the "table not found" case, not
    a code bug.

## What YOU need to do to finish the deploy

### 1. Run the SQL migration (2 minutes)

Open <https://supabase.com/dashboard/project/melwdzrrivovglefooxo/sql/new>
and paste the full contents of
[`supabase/migrations/001_contact_submissions.sql`](supabase/migrations/001_contact_submissions.sql).
Click "Run". You should see "Success. No rows returned".

Verify: same dashboard → "Table Editor" → `contact_submissions` should now
exist with 9 columns (`id`, `created_at`, `name`, `email`, `phone`,
`message`, `source`, `user_agent`, `ip`, `status`) and RLS enabled.

### 2. Commit and push to GitHub

```bash
git add -A
git status                      # review what's staged
git commit -m "Production deployment prep"
git push origin master
```

`.env.local` is git-ignored — confirm it does NOT appear in `git status`.

### 3. Connect the repo to Vercel

1. <https://vercel.com/new>
2. Import your GitHub repo.
3. **Framework Preset**: Next.js (auto-detected).
4. **Root Directory**: leave blank (repo root).
5. **Build & Output Settings**: leave everything at defaults.
6. **Environment Variables** — add all four, all scopes
   (Production + Preview + Development):

   | Name | Value | Scope |
   | ---- | ----- | ----- |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://melwdzrrivovglefooxo.supabase.co` | All |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_...` (same as `.env.local`) | All |
   | `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_...` (same as `.env.local`) | All |
   | `CONTACT_TO_EMAIL` | (leave blank for now) | All |

   ⚠ `SUPABASE_SERVICE_ROLE_KEY` must NOT have the `NEXT_PUBLIC_` prefix —
   that prefix is what tells Next.js "expose to the browser". The service
   key must stay server-side.

7. Click **Deploy**. First build takes ~2 minutes.
8. You get a URL like `phoenix-website-<hash>.vercel.app`. Rename the
   project in Vercel → Settings → General → "Project Name" if you want a
   cleaner subdomain.

### 4. Smoke-test the deployed site

Test on the vercel.app URL:

- [ ] Homepage intro plays (click, drafting marks, video, logo fade in on
      white, FLIP to navbar).
- [ ] `/partners` — segmented Partners/Clients toggle works; globe renders;
      click a logo → route pulses to Hyderabad.
- [ ] `/projects/equinox` and `/projects/aquila` — construction reveal video
      plays; "Enquire" button navigates back to `/#contact` through the
      page-transition overlay.
- [ ] Contact form (`/#contact`) — submit a real entry, confirm success
      message, then check Supabase Table Editor → new row.
- [ ] `/nonexistent` → 404 page.
- [ ] Mobile: same walkthrough at 375px viewport.
- [ ] DevTools → Network → response headers on any page show CSP + HSTS.

## Environment variables (canonical list)

| Var | Where it lives | Purpose |
| --- | -------------- | ------- |
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local`, Vercel (all scopes) | Supabase project URL. Public. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local`, Vercel (all scopes) | Browser client. Public. Access gated by RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local`, Vercel (all scopes, no `NEXT_PUBLIC_`) | Server-only. Bypasses RLS. **Never** log or expose. |
| `CONTACT_TO_EMAIL` | `.env.local`, Vercel (all scopes) | Future notification target. Empty for now. |

## Supabase schema (as of this session)

| Table | Columns | RLS |
| ----- | ------- | --- |
| `public.contact_submissions` | `id`, `created_at`, `name`, `email`, `phone`, `message`, `source`, `user_agent`, `ip`, `status` | Enabled. `anon` / `authenticated` have all privileges revoked. Only `service_role` (via `/api/contact`) can insert. |

Storage buckets: none created yet. When you move project/partner/client
images to Supabase Storage, create a public bucket (e.g. `assets`) and rely
on the `images.remotePatterns` entry already in `next.config.ts`.

## Recommended follow-ups

Sorted by return-on-effort:

1. **Content migration to Supabase** (Phases 3/4/9 — deferred from this
   session). Move `src/lib/content.ts`, `partners.ts`, `clients.ts` into
   Supabase tables (`projects`, `partners`, `clients`, `services`, `stats`,
   `timeline`, `awards`, `sections`). Add SSG revalidation. Enables a future
   admin dashboard without code changes.
2. **Email notification on new contact submission**. Cheapest option: a
   Supabase Database Webhook → Resend or Postmark. `CONTACT_TO_EMAIL` is
   already wired through env for this.
3. **Nonce-based CSP**. Add middleware that stamps a per-request nonce,
   drop `'unsafe-inline'` and `'unsafe-eval'` from `script-src`.
4. **Rate-limit `/api/contact`**. Currently unlimited. Upstash Redis via
   `@vercel/kv` is the standard fit — 5 posts / IP / hour is plenty.
5. **Bundle analysis + `dynamic()` imports**. Wrap `<NetworkGlobe/>` and the
   GSAP-heavy intro in `next/dynamic` with `ssr: false` to shed cobe/GSAP
   from the entry chunk.
6. **Lint cleanup**. Refactor the React 19 canary complaints
   (`react-hooks/refs`, `set-state-in-effect`) — either move ref
   reassignments into `useEffect`, or accept the current pattern and add
   scoped `eslint-disable` comments with the rationale.
7. **404 page polish**. The current `/_not-found` route uses the default
   Next.js 404 — brand it with the blueprint background.
8. **Real vector logo + Untitled Sans license** (already tracked in the
   session handover). Drops the PNG-scale-blur.
9. **Contact form** — add a completion phone-number check for India
   (10 digits or `+91`), server-side.
10. **Sitemap + robots.txt**. Add `src/app/sitemap.ts` and `robots.ts`
    once real content lives in Supabase.

## Files added / changed this session

- `.env.local` (git-ignored, not committed)
- `.env.example`
- `next.config.ts` — was one-line stub; now full security + image config
- `package.json` — added `@supabase/supabase-js`, `server-only`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/app/api/contact/route.ts`
- `src/components/sections/contact.tsx` — real submit handler
- `src/app/projects/[id]/project-details.tsx` — `<a>` → `<Link>`
- `src/components/intro-experience.tsx` — logo fade-out fix from earlier turn
- `supabase/migrations/001_contact_submissions.sql`
- `public/phoenix/videos/hero-opening.mp4` — re-encoded intro from earlier turn
- `DEPLOYMENT.md` — this file
