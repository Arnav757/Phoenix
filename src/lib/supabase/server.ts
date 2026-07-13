import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client. Uses the service_role key, which bypasses
// Row Level Security. Only import this file from Route Handlers, Server
// Components, or Server Actions — the `server-only` package throws at
// build time if any client bundle tries to import it.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
      "Set both in .env.local (and in Vercel Environment Variables for production)."
  );
}

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
