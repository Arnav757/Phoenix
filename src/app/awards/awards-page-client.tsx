"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Navbar } from "@/components/navbar";
import { Reveal, SectionHeading } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel";
import { CircularGallery, type GalleryItem } from "@/components/ui/circular-gallery";
import { awardsPage, certifications, company } from "@/lib/content";

// Awards & Certifications — sheet 08 of the drawing set. Continues the
// architectural presentation-board language established across the
// homepage: 92vw board container, display-scale headings via
// SectionHeading, ruled ledgers instead of card grids, sparse blueprint
// annotations, restrained motion.

const certGalleryItems: GalleryItem[] = certifications.map((c) => ({
  kicker:
    c.body.includes("Green") ? "IGBC" :
    c.body.includes("Industry") ? "CII" : "Cert",
  title: c.name,
  authority: c.body,
  meta: "Rev A · Held current",
}));

export function AwardsPageClient() {
  return (
    <>
      <Navbar visible />
      <main className="pt-24 md:pt-28">
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative overflow-hidden">
          <div className="bp-grid absolute inset-0 opacity-40" aria-hidden />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              maskImage:
                "radial-gradient(70% 60% at 50% 45%, black 0%, transparent 85%)",
              WebkitMaskImage:
                "radial-gradient(70% 60% at 50% 45%, black 0%, transparent 85%)",
              backgroundImage:
                "repeating-linear-gradient(0deg, rgb(0 120 243 / 8%) 0 1px, transparent 1px 120px), repeating-linear-gradient(90deg, rgb(0 120 243 / 8%) 0 1px, transparent 1px 120px)",
            }}
          />
          <div className="relative mx-auto w-[92vw] max-w-[1720px] py-32 md:py-44">
            <Reveal>
              <div className="flex items-baseline justify-between">
                <div className="flex items-center gap-4">
                  <span className="tech-label text-primary">
                    {awardsPage.hero.kicker}
                  </span>
                  <motion.span
                    className="h-px w-24 origin-left bg-primary/40"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
                    aria-hidden
                  />
                </div>
                <span
                  className="tech-label hidden text-muted-foreground/40 md:inline"
                  aria-hidden
                >
                  N — 08 · Sheet 08/08
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1
                className="mt-8 font-semibold tracking-tight text-foreground"
                style={{
                  fontSize: "clamp(3.25rem, 10vw, 9.5rem)",
                  lineHeight: 0.94,
                  textWrap: "balance",
                }}
              >
                Awards &
                <br />
                certifications
              </h1>
            </Reveal>

            <div
              className="mt-8 flex items-center gap-3 text-muted-foreground/40"
              aria-hidden
            >
              <span className="tech-label">08.01 // Recognition</span>
              <motion.span
                className="h-px flex-1 origin-left bg-current"
                style={{ maxWidth: "min(38vw, 620px)" }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: "easeOut", delay: 0.3 }}
              />
              <span className="tech-label">est. 2001</span>
            </div>

            <Reveal delay={0.18}>
              <p className="mt-16 max-w-2xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
                {awardsPage.hero.lede}
              </p>
            </Reveal>

            {/* margin annotations */}
            <div
              className="pointer-events-none absolute inset-0 hidden text-muted-foreground/25 md:block"
              aria-hidden
            >
              <span className="tech-label absolute right-0 top-56 origin-right rotate-90">
                Series R — Recognition
              </span>
              <span className="tech-label absolute bottom-8 left-0">
                Drawing · REC / 08 · Rev A
              </span>
              <span className="tech-label absolute bottom-8 right-0">
                Section 08.00
              </span>
            </div>
          </div>
        </section>

        {/* ═══════════════ INTRODUCTION ═══════════════ */}
        <section className="relative mx-auto w-[92vw] max-w-[1720px] py-28 md:py-40">
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4">
              <Reveal>
                <span className="tech-label text-primary">
                  08.02 — Introduction
                </span>
                <div
                  className="mt-3 h-px w-24 bg-primary/40"
                  aria-hidden
                />
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <Reveal>
                <h2 className="text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
                  {awardsPage.introduction.heading}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-8 text-lg leading-relaxed text-muted-foreground md:text-xl">
                  {awardsPage.introduction.body}
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══════════════ AWARDS ═══════════════ */}
        <section
          id="awards"
          className="relative border-y border-border bg-card/40"
        >
          <div className="bp-grid absolute inset-0 opacity-30" aria-hidden />
          <div className="relative mx-auto w-[92vw] max-w-[1720px] py-28 md:py-40">
            <SectionHeading
              kicker="08.03 — Awards"
              title="A record of recognition"
              sheet="Sheet 08/08"
            />

            {/* Credibility ribbon — the abstract fact, not invented specifics. */}
            <div className="mb-16 grid border-y border-border py-8 sm:grid-cols-3">
              <div>
                <p className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  {awardsPage.awardsAtlas.total}
                </p>
                <p className="tech-label mt-2 text-muted-foreground">
                  Industry awards on record
                </p>
              </div>
              <div className="mt-8 sm:mt-0">
                <p className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  20<span className="text-primary"> years</span>
                </p>
                <p className="tech-label mt-2 text-muted-foreground">
                  Of continuous recognition
                </p>
              </div>
              <div className="mt-8 sm:mt-0">
                <p className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  40<span className="text-primary"> mil sq ft</span>
                </p>
                <p className="tech-label mt-2 text-muted-foreground">
                  Delivered under the same discipline
                </p>
              </div>
            </div>

            {/* 3D carousel — award atlas. The 3D ring reads best with ~20
                faces at the current cylinder width; the full 64-image set
                lives below as a static grid so nothing is hidden. */}
            <Reveal delay={0.05}>
              <ThreeDPhotoCarousel
                images={awardsPage.awardsAtlas.urls.slice(0, 20)}
                caption={awardsPage.awardsAtlas.caption}
              />
            </Reveal>

            {/* Full atlas — every award image, so the record itself is
                visible rather than only the ring subset. Restrained
                spec-sheet grid, no boxes, hairline separators via gap. */}
            <div className="mt-24 border-t border-border pt-10">
              <div className="mb-8 flex items-baseline justify-between">
                <span className="tech-label text-primary">
                  A.01 — Full atlas
                </span>
                <span
                  className="tech-label hidden text-muted-foreground/50 md:inline"
                  aria-hidden
                >
                  {awardsPage.awardsAtlas.total} plates · Scale 1:1
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {awardsPage.awardsAtlas.urls.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt=""
                    loading="lazy"
                    className="aspect-square w-full rounded-sm border border-border bg-card object-cover transition-colors duration-300 hover:border-primary/60"
                    aria-hidden
                  />
                ))}
              </div>
            </div>

            <p className="tech-label mt-10 text-muted-foreground/60">
              Award atlas — detailed title/year attribution pending client consolidation
            </p>
          </div>
        </section>

        {/* ═══════════════ CERTIFICATIONS ═══════════════ */}
        <section
          id="certifications"
          className="relative mx-auto w-[92vw] max-w-[1720px] py-28 md:py-40"
        >
          <SectionHeading
            kicker="08.04 — Certifications"
            title="Held to standard, on the drawing"
          />

          <div className="grid gap-14 lg:grid-cols-12">
            {/* Certification schedule — the authoritative ledger */}
            <div className="lg:col-span-5">
              <Reveal>
                <p className="max-w-md text-lg text-muted-foreground">
                  Precertified green from the first drawing, audited by the
                  bodies that set the standard.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <dl className="mt-12 border-t border-border">
                  {certifications.map((c, i) => (
                    <div
                      key={c.name}
                      className="border-b border-border py-6"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="block h-2 w-2 rotate-45 border border-primary bg-primary/40"
                          aria-hidden
                        />
                        <span className="tech-label text-primary">
                          C.{String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="mt-3 text-lg font-medium text-foreground">
                        {c.name}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {c.body}
                      </p>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            {/* Certification wall — architectural turntable */}
            <div className="lg:col-span-7">
              <Reveal delay={0.15}>
                <CircularGallery items={certGalleryItems} radius={380} />
              </Reveal>
              <p className="tech-label mt-4 text-center text-muted-foreground/60">
                Auto-rotating — pauses off-screen
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════ QUALITY & COMPLIANCE ═══════════════ */}
        <section
          id="quality"
          className="relative border-y border-border bg-card/40"
        >
          <div className="bp-grid absolute inset-0 opacity-30" aria-hidden />
          <div className="relative mx-auto w-[92vw] max-w-[1720px] py-28 md:py-40">
            <SectionHeading
              kicker="08.05 — Quality & compliance"
              title={awardsPage.quality.heading}
            />

            <div className="grid gap-14 lg:grid-cols-12">
              <div className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
                <Reveal>
                  <span className="tech-label text-primary">
                    Sequence Q1 — Q4
                  </span>
                  <p className="mt-4 max-w-sm text-lg leading-relaxed text-muted-foreground">
                    {awardsPage.quality.body}
                  </p>
                  {/* small drafting mark */}
                  <svg
                    className="mt-8 text-muted-foreground/40"
                    width="34"
                    height="34"
                    viewBox="0 0 34 34"
                    aria-hidden
                  >
                    <line x1="17" y1="0" x2="17" y2="34" stroke="currentColor" strokeWidth="0.8" />
                    <line x1="0" y1="17" x2="34" y2="17" stroke="currentColor" strokeWidth="0.8" />
                    <circle cx="17" cy="17" r="6" stroke="currentColor" strokeWidth="0.8" fill="none" />
                    <circle cx="17" cy="17" r="1.5" fill="currentColor" />
                  </svg>
                </Reveal>
              </div>

              <div className="lg:col-span-8">
                <ol className="border-t border-border">
                  {awardsPage.quality.pillars.map((p, i) => (
                    <li key={p.num} className="border-b border-border">
                      <Reveal delay={i * 0.05}>
                        <div className="grid gap-4 py-10 md:grid-cols-12 md:items-baseline md:gap-8 md:py-14">
                          <span className="tech-label text-primary md:col-span-1">
                            {p.num}
                          </span>
                          <h3 className="text-2xl font-semibold tracking-tight text-foreground md:col-span-5 md:text-3xl">
                            {p.title}
                          </h3>
                          <p className="text-base leading-relaxed text-muted-foreground md:col-span-6">
                            {p.body}
                          </p>
                        </div>
                      </Reveal>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ CTA ═══════════════ */}
        <section className="mx-auto w-[92vw] max-w-[1720px] py-28 md:py-36">
          <div className="grid gap-10 border-t border-border pt-16 md:grid-cols-12 md:pt-24">
            <div className="md:col-span-6">
              <Reveal>
                <span className="tech-label text-primary">08.06 — Enquiry</span>
                <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl">
                  Ready to see the schedule?
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-6 md:pt-10">
              <Reveal delay={0.1}>
                <p className="max-w-md text-lg text-muted-foreground">
                  Request the full award record, individual certification
                  copies or a walk through our quality regime.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button
                    render={<Link href="/#contact" />}
                    nativeButton={false}
                    size="lg"
                    className="rounded-full px-7"
                  >
                    Request the record
                  </Button>
                  <a
                    href={`mailto:${company.email}?subject=Awards%20%26%20Certifications`}
                    className="tech-label text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                  >
                    Or email us directly ↗
                  </a>
                </div>
              </Reveal>
            </div>
          </div>

          <p className="tech-label mt-24 text-center text-muted-foreground/50">
            Drawing set 01—08 · Rev A · Section 08.06
          </p>
        </section>
      </main>
    </>
  );
}
