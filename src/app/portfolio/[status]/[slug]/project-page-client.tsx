"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Navbar } from "@/components/navbar";
import { Reveal, Stagger, staggerItem } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { ConstructionReveal } from "@/components/construction-reveal";
import type { Project } from "@/lib/projects";

// Reusable project page template — every field is optional except the
// core identity (title/slug/status/location/overview/heroImage/specs), so
// a lightly-documented project (most of the upcoming collection right now)
// renders a clean, complete page, and a fully-documented one (Equinox,
// Aquila) picks up every extra section automatically. Add a project by
// adding data to src/lib/projects.ts — this file never needs to change.
export function ProjectPageClient({
  project,
  related,
}: {
  project: Project;
  related: Project[];
}) {
  const isUpcoming = project.status === "upcoming";

  return (
    <>
      <Navbar visible />
      <div className="bp-grid pointer-events-none fixed inset-0 -z-10 opacity-[0.35]" aria-hidden />

      <main className="pb-28 pt-28 md:pt-32">
        {/* ── Board — same architectural-board presentation as the
            Portfolio listings (image plate + numbered copy column +
            factsheet): a single, unflipped board sized for one project
            rather than a list. ──────────────────────────────────────── */}
        <section className="mx-auto w-[92vw] max-w-[1720px]">
          <Reveal>
            <Link
              href={`/portfolio/${project.status}`}
              className="tech-label text-muted-foreground transition-colors hover:text-primary"
            >
              ← {isUpcoming ? "Upcoming" : "Completed"} projects
            </Link>
          </Reveal>

          <div className="relative mt-8 grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-14">
            {/* image plate */}
            <Reveal className="relative lg:col-span-8">
              <div className="sheet-corners relative overflow-hidden border border-border" style={{ aspectRatio: "16 / 10" }}>
                <GlowingEffect spread={40} glow disabled={false} proximity={72} inactiveZone={0.01} borderWidth={2} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.heroImage}
                  alt={project.title}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </Reveal>

            {/* copy column — name, register lines, factsheet */}
            <div className="lg:col-span-4">
              <Reveal>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                  {project.title}
                </h1>
                <div className="mt-5 space-y-1.5">
                  <p className="tech-label text-primary">
                    {project.timeline ?? (isUpcoming ? "Upcoming" : "Completed")}
                  </p>
                  <p className="tech-label text-muted-foreground">{project.location}</p>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                  {project.overview}
                </p>
              </Reveal>
              {project.specifications.length > 0 && (
                <Reveal delay={0.18}>
                  <dl className="mt-10 border-b border-border">
                    {project.specifications.map((s) => (
                      <div
                        key={s.label}
                        className="flex items-baseline justify-between gap-6 border-t border-border py-3.5"
                      >
                        <dt className="tech-label text-muted-foreground">{s.label}</dt>
                        <dd className="font-semibold text-foreground">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              )}
              <Reveal delay={0.24}>
                <Button
                  render={<Link href="/#contact" />}
                  nativeButton={false}
                  size="lg"
                  className="mt-8 w-full rounded-full"
                >
                  Enquire about this project
                </Button>
              </Reveal>
            </div>

            {/* margin annotation */}
            <div
              className="pointer-events-none absolute inset-0 hidden text-muted-foreground/25 md:block"
              aria-hidden
            >
              <span className="tech-label absolute -top-10 right-0">
                DWG {project.slug.toUpperCase()} — {project.location.split(",")[0]}
              </span>
            </div>
          </div>
        </section>

        {/* ── Construction reveal (optional — projects with real
            construction-simulation footage) ──────────────────────── */}
        {project.heroVideo && (
          <section className="mx-auto mt-16 w-[92vw] max-w-[1720px] md:mt-24">
            <Reveal>
              <p className="tech-label text-primary">
                {isUpcoming ? "Under construction" : "As built"}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-6 max-w-2xl">
                <ConstructionReveal video={project.heroVideo} image={project.heroImage} name={project.title} />
              </div>
            </Reveal>
          </section>
        )}

        {/* ── Location ─────────────────────────────────────────────── */}
        <section className="mx-auto mt-20 w-[92vw] max-w-[1720px] md:mt-28">
          <Reveal>
            <p className="tech-label text-primary">Location</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {project.location}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="sheet-corners relative mt-6 overflow-hidden rounded-lg border border-border" style={{ aspectRatio: "21 / 9" }}>
              <iframe
                title={`${project.title} location`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(project.location + ", Hyderabad")}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                loading="lazy"
              />
            </div>
          </Reveal>
        </section>

        {/* ── Masterplan (optional) ───────────────────────────────── */}
        {project.masterplanImage && (
          <section className="mx-auto mt-20 w-[92vw] max-w-[1720px] md:mt-28">
            <Reveal>
              <p className="tech-label text-primary">Masterplan</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative mt-6 overflow-hidden rounded-lg border border-border" style={{ aspectRatio: "16 / 9" }}>
                <GlowingEffect spread={35} glow disabled={false} proximity={56} inactiveZone={0.01} borderWidth={2} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.masterplanImage}
                  alt={`${project.title} masterplan`}
                  loading="lazy"
                  decoding="async"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </Reveal>
          </section>
        )}

        {/* ── Gallery (optional) ──────────────────────────────────── */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="mx-auto mt-20 w-[92vw] max-w-[1720px] md:mt-28">
            <Reveal>
              <p className="tech-label text-primary">Gallery</p>
            </Reveal>
            <Stagger className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
              {project.gallery.map((src) => (
                <motion.div
                  key={src}
                  variants={staggerItem}
                  className="relative overflow-hidden rounded-lg border border-border"
                  style={{ aspectRatio: "4 / 3" }}
                >
                  <GlowingEffect spread={30} glow disabled={false} proximity={48} inactiveZone={0.01} borderWidth={2} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    aria-hidden
                  />
                </motion.div>
              ))}
            </Stagger>
          </section>
        )}

        {/* ── Amenities (optional) ────────────────────────────────── */}
        {project.amenities && project.amenities.length > 0 && (
          <section className="mx-auto mt-20 w-[92vw] max-w-[1720px] md:mt-28">
            <Reveal>
              <p className="tech-label text-primary">Amenities</p>
            </Reveal>
            <Stagger className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {project.amenities.map((a) => (
                <motion.div
                  key={a}
                  variants={staggerItem}
                  className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground"
                >
                  {a}
                </motion.div>
              ))}
            </Stagger>
          </section>
        )}

        {/* ── Floor plans (optional) ──────────────────────────────── */}
        {project.floorPlans && project.floorPlans.length > 0 && (
          <section className="mx-auto mt-20 w-[92vw] max-w-[1720px] md:mt-28">
            <Reveal>
              <p className="tech-label text-primary">Floor plans</p>
            </Reveal>
            <Stagger className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {project.floorPlans.map((fp) => (
                <motion.div
                  key={fp.label}
                  variants={staggerItem}
                  className="overflow-hidden rounded-lg border border-border bg-card"
                >
                  <div className="relative" style={{ aspectRatio: "4 / 3" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fp.image}
                      alt={fp.label}
                      loading="lazy"
                      decoding="async"
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <p className="p-4 text-sm font-medium text-foreground">{fp.label}</p>
                </motion.div>
              ))}
            </Stagger>
          </section>
        )}

        {/* ── Sustainability (optional) ───────────────────────────── */}
        {project.sustainability && (
          <section className="mx-auto mt-20 w-[92vw] max-w-[1720px] md:mt-28">
            <Reveal>
              <p className="tech-label text-primary">Sustainability</p>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {project.sustainability}
              </p>
            </Reveal>
          </section>
        )}

        {/* ── Construction progress (upcoming only, optional) ─────── */}
        {isUpcoming && project.constructionProgress && (
          <section className="mx-auto mt-20 w-[92vw] max-w-[1720px] md:mt-28">
            <Reveal>
              <p className="tech-label text-primary">Construction progress</p>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {project.constructionProgress}
              </p>
            </Reveal>
          </section>
        )}

        {/* ── Related projects ─────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mx-auto mt-24 w-[92vw] max-w-[1720px] border-t border-border pt-16 md:mt-32 md:pt-20">
            <Reveal>
              <p className="tech-label text-primary">Related projects</p>
            </Reveal>
            <Stagger className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <motion.div key={r.slug} variants={staggerItem}>
                  <Link
                    href={`/portfolio/${r.status}/${r.slug}`}
                    className="group sheet-corners relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors duration-500 hover:border-primary/60"
                  >
                    <GlowingEffect spread={30} glow disabled={false} proximity={48} inactiveZone={0.01} borderWidth={2} />
                    <div className="relative overflow-hidden border-b border-border" style={{ aspectRatio: "4 / 3" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={r.heroImage}
                        alt={r.title}
                        loading="lazy"
                        decoding="async"
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                        className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-foreground">{r.title}</h3>
                      <p className="tech-label mt-1 text-muted-foreground/70">{r.location}</p>
                      <span className="tech-label mt-4 inline-flex items-center gap-2 text-primary">
                        View project
                        <ArrowUpRight size={12} aria-hidden />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </Stagger>
          </section>
        )}

        {/* ── Contact CTA ──────────────────────────────────────────── */}
        <section className="mx-auto mt-24 w-[92vw] max-w-[1720px] border-t border-border pt-16 text-center md:mt-32 md:pt-20">
          <Reveal>
            <h2
              className="font-semibold tracking-tight text-foreground"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              Interested in {project.title}?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Talk to our team about availability, leasing and enquiries.
            </p>
            <Button
              render={<Link href="/#contact" />}
              nativeButton={false}
              size="lg"
              className="mt-8 rounded-full px-7"
            >
              Get in touch
            </Button>
          </Reveal>
        </section>
      </main>
    </>
  );
}
