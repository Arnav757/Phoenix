import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Simple, deliberate constraints. Every one of these is enforced at the
// edge before we touch the database — so garbage never lands in the table
// and downstream email/CRM integrations get clean rows.
const MAX_NAME = 120;
const MAX_EMAIL = 320;
const MAX_PHONE = 40;
const MAX_MESSAGE = 4000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  // Honeypot — legitimate browsers never fill this. Bots do.
  website?: unknown;
};

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot — pretend success so bots don't learn to bypass.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = str(body.name, MAX_NAME);
  const email = str(body.email, MAX_EMAIL);
  const phone = str(body.phone, MAX_PHONE);
  const message = str(body.message, MAX_MESSAGE);

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!EMAIL_RE.test(email))
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });

  // Best-effort client IP. On Vercel the leftmost x-forwarded-for entry is
  // the real client — subsequent entries are proxies.
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd ? fwd.split(",")[0]!.trim() : null;
  const userAgent = req.headers.get("user-agent") ?? null;

  const { error } = await supabaseAdmin.from("contact_submissions").insert({
    name,
    email,
    phone: phone || null,
    message: message || null,
    ip,
    user_agent: userAgent,
  });

  if (error) {
    // Log server-side; return a generic message so we never leak DB details.
    console.error("contact_submissions insert failed:", error.message);
    return NextResponse.json(
      { error: "Could not submit right now. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
