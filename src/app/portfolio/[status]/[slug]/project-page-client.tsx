"use client";

import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { Navbar } from "@/components/navbar";
import { Reveal, Stagger, staggerItem } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { ConstructionReveal } from "@/components/construction-reveal";
import { company } from "@/lib/content";
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

      <main className="pb-28">
        {/* ── Fullscreen hero ─────────────────────────────────────── */}
        <section className="relative h-[92svh] min-h-[560px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.heroImage}
            alt={project.title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgb(0 0 0 / 0.75) 0%, rgb(0 0 0 / 0.1) 55%, transparent 80%)" }}
            aria-hidden
          />
          {/* Separate top-anchored darkening so the fixed navbar (which
              overlaps this hero) stays legible regardless of how bright
              the underlying image is — the bottom gradient above fades to
              fully transparent by the top, leaving nav text unprotected. */}
          <div
            className="absolute inset-x-0 top-0"
            style={{
              height: "clamp(160px, 20vw, 192px)",
              background: "linear-gradient(to bottom, rgb(0 0 0 / 0.6) 0%, transparent 100%)",
            }}
            aria-hidden
          />
          <div className="absolute inset-x-0 top-0 z-10 pt-24 md:pt-28">
            <div className="mx-auto flex w-[92vw] max-w-[1720px] items-baseline justify-between">
              <Link
                href={`/portfolio/${project.status}`}
                className="tech-label text-white/70 transition-colors hover:text-white"
              >
                ← {isUpcoming ? "Upcoming" : "Completed"} projects
              </Link>
              <span className="tech-label hidden text-white/50 md:inline">
                {company.name} / Portfolio
              </span>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 z-10 pb-14 md:pb-20">
            <div className="mx-auto w-[92vw] max-w-[1720px]">
              <Reveal>
                <span className="tech-label text-primary/90">
                  {project.timeline ?? (isUpcoming ? "Upcoming" : "Completed")}
                </span>
                <h1
                  className="mt-3 font-semibold tracking-tight text-white"
                  style={{ fontSize: "clamp(2.5rem, 7vw, 6.5rem)", lineHeight: 1.0, textWrap: "balance" }}
                >
                  {project.title}
                </h1>
                <p className="tech-label mt-4 flex items-center gap-2 text-white/70">
                  <MapPin size={13} aria-hidden />
                  {project.location}
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Overview ────────────────────────────────────────────── */}
        <section className="mx-auto mt-20 w-[92vw] max-w-[1720px] md:mt-28">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Reveal>
                <p className="max-w-2xl text-xl leading-relaxed text-foreground md:text-2xl" style={{ textWrap: "balance" }}>
                  {project.overview}
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-4">
              <Reveal delay={0.1}>
                <Button
                  render={<Link href="/#contact" />}
                  nativeButton={false}
                  size="lg"
                  className="w-full rounded-full sm:w-auto"
                >
                  Enquire about this project
                </Button>
              </Reveal>
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

        {/* ── Key facts / specifications ──────────────────────────── */}
        <section className="mx-auto mt-16 w-[92vw] max-w-[1720px] md:mt-24">
          <Reveal>
            <p className="tech-label text-primary">Project statistics</p>
          </Reveal>
          <Stagger
            className={`mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border ${
              project.specifications.length > 3 ? "md:grid-cols-4" : "md:grid-cols-3"
            }`}
          >
            {project.specifications.map((s) => (
              <motion.div key={s.label} variants={staggerItem} className="bg-card p-6">
                <dt className="tech-label text-muted-foreground">{s.label}</dt>
                <dd className="mt-2 text-xl font-semibold tracking-tight text-foreground">{s.value}</dd>
              </motion.div>
            ))}
          </Stagger>
        </section>

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
