"use client";

import { Reveal, SectionHeading } from "@/components/reveal";
import { company } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Contact() {
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
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Input placeholder="Name*" required aria-label="Name" />
              <Input
                placeholder="Email*"
                type="email"
                required
                aria-label="Email"
              />
            </div>
            <Input placeholder="Phone* (+91)" type="tel" aria-label="Phone" />
            <Textarea
              placeholder="Enquiry details"
              rows={5}
              aria-label="Enquiry details"
            />
            <Button type="submit" size="lg" className="w-full rounded-full">
              Submit Enquiry
            </Button>
            <p className="tech-label text-center text-muted-foreground/60">
              Demo form — not wired to a backend yet
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
