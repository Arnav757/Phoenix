import { createClient } from "@supabase/supabase-js";

// Browser-safe Supabase client. Uses the publishable ("anon") key, which is
// intentionally exposed to the client — access is governed by Row Level
// Security policies on the database side, not by hiding the key.
//
// Never import the service_role key here — it must stay server-only.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Copy .env.example to .env.local and fill in the Supabase credentials."
  );
}

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});
