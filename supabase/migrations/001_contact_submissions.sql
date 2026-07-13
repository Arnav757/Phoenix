-- Phoenix Group — contact form submissions.
--
-- Runs once, in the Supabase SQL editor. Idempotent (IF NOT EXISTS everywhere)
-- so it's safe to re-run.
--
-- Security model:
--   * anon (browser) role is NEVER given INSERT/SELECT/UPDATE/DELETE.
--     The Next.js /api/contact Route Handler is the only writer,
--     using the service_role key which bypasses RLS.
--   * RLS is enabled with no policies granted to authenticated/anon —
--     so if the anon key ever leaks or the API route is bypassed,
--     the table is inaccessible.
--   * When an admin dashboard is added later, grant SELECT to a specific
--     "admin" role via a policy (see commented example at the bottom).

create table if not exists public.contact_submissions (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  email        text not null,
  phone        text,
  message      text,
  source       text not null default 'website',
  user_agent   text,
  ip           inet,
  -- lifecycle so the future admin dashboard can triage
  status       text not null default 'new'
               check (status in ('new','contacted','qualified','archived','spam'))
);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

alter table public.contact_submissions enable row level security;

-- Explicitly revoke access from the browser roles. service_role always
-- bypasses RLS, so the API route continues to work.
revoke all on public.contact_submissions from anon, authenticated;

-- Future: uncomment when an admin role exists.
-- create policy "admins read all"
--   on public.contact_submissions
--   for select
--   to authenticated
--   using (auth.jwt() ->> 'role' = 'admin');
