"use client";

import { useState } from "react";
import { Reveal, SectionHeading } from "@/components/reveal";
import { company } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

export function Contact() {
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "submitting") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    // Honeypot — real browsers leave the hidden `website` field empty.
    const payload = {
      name: (data.get("name") ?? "").toString(),
      email: (data.get("email") ?? "").toString(),
      phone: (data.get("phone") ?? "").toString(),
      message: (data.get("message") ?? "").toString(),
      website: (data.get("website") ?? "").toString(),
    };

    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setState({
          kind: "error",
          message: body.error ?? "Could not submit. Please try again.",
        });
        return;
      }
      setState({ kind: "ok" });
      form.reset();
    } catch {
      setState({
        kind: "error",
        message: "Network error. Please try again.",
      });
    }
  }

  const submitting = state.kind === "submitting";

  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-28 md:py-36">
      <SectionHeading kicker="07 — Contact" title="Let's connect" />
      <div className="grid gap-14 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="max-w-md text-lg text-muted-foreground">
              Tell us about your requirement — enterprise campus, investment or
              partnership — and our team will get back to you.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <dl className="mt-10 space-y-6">
              <div>
                <dt className="tech-label text-primary">Visit</dt>
                <dd className="mt-2 max-w-sm text-lg font-medium text-foreground">
                  {company.address}
                </dd>
              </div>
              <div>
                <dt className="tech-label text-primary">Phone</dt>
                <dd className="mt-2 text-xl font-medium text-foreground">
                  {company.phone}
                </dd>
              </div>
              <div>
                <dt className="tech-label text-primary">Email</dt>
                <dd className="mt-2 text-xl font-medium text-foreground">
                  <a
                    href={`mailto:${company.email}`}
                    className="underline-offset-4 transition-colors hover:text-primary hover:underline"
                  >
                    {company.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="tech-label text-primary">Follow</dt>
                <dd className="mt-2 flex gap-5 text-sm text-muted-foreground">
                  <a
                    href={company.social.linkedin}
                    className="transition-colors hover:text-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn ↗
                  </a>
                  <a
                    href={company.social.facebook}
                    className="transition-colors hover:text-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Facebook ↗
                  </a>
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <form
            className="sheet-corners space-y-5 rounded-lg border border-border bg-card p-8 md:p-10"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Honeypot — hidden from users, visible to naive bots. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
            >
              <label>
                Website
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                name="name"
                placeholder="Name*"
                required
                aria-label="Name"
                autoComplete="name"
                disabled={submitting}
              />
              <Input
                name="email"
                placeholder="Email*"
                type="email"
                required
                aria-label="Email"
                autoComplete="email"
                disabled={submitting}
              />
            </div>
            <Input
              name="phone"
              placeholder="Phone (+91)"
              type="tel"
              aria-label="Phone"
              autoComplete="tel"
              disabled={submitting}
            />
            <Textarea
              name="message"
              placeholder="Enquiry details"
              rows={5}
              aria-label="Enquiry details"
              disabled={submitting}
            />
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full"
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit Enquiry"}
            </Button>

            {/* Reserve room so success/error text doesn't cause a layout jump. */}
            <p
              role="status"
              aria-live="polite"
              className="tech-label min-h-[1.25rem] text-center"
            >
              {state.kind === "ok" && (
                <span className="text-primary">
                  Thank you — we&apos;ll be in touch shortly.
                </span>
              )}
              {state.kind === "error" && (
                <span className="text-destructive">{state.message}</span>
              )}
              {state.kind === "idle" && (
                <span className="text-muted-foreground/60">
                  We respond within one business day.
                </span>
              )}
            </p>
          </form>
        </Reveal>
      </div>

      <footer className="mt-28 border-t border-border pt-8 text-sm text-muted-foreground">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {company.fullName}. All rights reserved.
          </p>
          <p className="tech-label">Sheet 01 of 01 · Rev A · Testing model</p>
        </div>
      </footer>
    </section>
  );
}
