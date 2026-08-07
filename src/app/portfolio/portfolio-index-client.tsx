"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/reveal";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import type { Project, ProjectStatus } from "@/lib/projects";

const copy: Record<ProjectStatus, { kicker: string; title: string; lede: string }> = {
  upcoming: {
    kicker: "Portfolio — Upcoming",
    title: "Upcoming developments",
    lede: "Projects currently under development across Hyderabad.",
  },
  completed: {
    kicker: "Portfolio — Completed",
    title: "Completed developments",
    lede: "Projects successfully delivered and handed over.",
  },
};

// Same architectural-board presentation as the homepage Portfolio teaser
// (components/sections/portfolio.tsx) — a dominant image plate with a
// blueprint veil that wipes away on scroll, beside a numbered copy column
// with a factsheet. Kept identical here so the full index and the
// homepage preview read as the same drawing set.
function ProjectBoard({
  project,
  index,
  flip,
  status,
}: {
  project: Project;
  index: number;
  flip: boolean;
  status: ProjectStatus;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const parallax = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const num = String(index + 1).padStart(2, "0");
  const district = project.location.split(",")[0];
  const statusLabel = status === "completed" ? "Completed" : project.timeline ?? "Upcoming";

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-14"
    >
      {/* image plate — the architecture dominates the board */}
      <Reveal className={`relative lg:col-span-8 ${flip ? "lg:order-2" : ""}`}>
        <Link
          href={`/portfolio/${status}/${project.slug}`}
          aria-label={`Open ${project.title} project details`}
          className="sheet-corners group/card relative block overflow-hidden border border-border transition-colors duration-500 hover:border-primary/60"
        >
          <GlowingEffect spread={40} glow disabled={false} proximity={72} inactiveZone={0.01} borderWidth={2} />
          <motion.div
            style={reduce ? undefined : { y: parallax }}
            className="relative aspect-[16/10] scale-110"
          >
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 62vw, 92vw"
              className="object-cover"
            />
            {/* blueprint veil that wipes away on scroll into view */}
            <motion.div
              initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 0 0)" }}
              whileInView={
                reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }
              }
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
              className="bp-grid absolute inset-0 bg-background/85 backdrop-saturate-0"
              aria-hidden
            >
              <div className="absolute inset-6 border border-dashed border-primary/40" />
              <span className="tech-label absolute bottom-8 left-8 text-primary">
                DWG {project.slug.toUpperCase()} — {statusLabel}
              </span>
            </motion.div>
            {/* hover cue */}
            <span className="tech-label absolute bottom-5 right-5 rounded-full border border-primary/50 bg-background/80 px-4 py-2 text-primary opacity-0 backdrop-blur-sm transition-all duration-300 group-hover/card:opacity-100">
              View project ↗
            </span>
          </motion.div>
        </Link>
      </Reveal>

      {/* copy column — index numeral, name, register lines, factsheet */}
      <div className={`lg:col-span-4 ${flip ? "lg:order-1" : ""}`}>
        <Reveal>
          <span
            className="pointer-events-none block select-none font-semibold leading-none text-muted-foreground/15"
            style={{ fontSize: "clamp(4rem, 8vw, 8rem)" }}
            aria-hidden
          >
            {num}
          </span>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            {project.title}
          </h3>
          <div className="mt-5 space-y-1.5">
            <p className="tech-label text-primary">{statusLabel}</p>
            <p className="tech-label text-muted-foreground">
              {project.location}
            </p>
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
      </div>

      {/* margin annotations — drafting marks in the surrounding whitespace */}
      <div
        className="pointer-events-none absolute inset-0 hidden text-muted-foreground/25 md:block"
        aria-hidden
      >
        <span
          className={`tech-label absolute -top-10 ${flip ? "left-0" : "right-0"}`}
        >
          DWG {project.slug.toUpperCase()} — {district}
        </span>
        <span
          className={`tech-label absolute -bottom-12 ${flip ? "right-0" : "left-0"}`}
        >
          Scale 1:200
        </span>
      </div>
    </div>
  );
}

export function PortfolioIndexClient({
  status,
  projects,
}: {
  status: ProjectStatus;
  projects: Project[];
}) {
  const { kicker, title, lede } = copy[status];

  return (
    <>
      <Navbar visible />
      <div className="bp-grid pointer-events-none fixed inset-0 -z-10 opacity-[0.35]" aria-hidden />

      <main className="pb-28 pt-28 md:pt-32">
        <header className="mx-auto w-[92vw] max-w-[1720px]">
          <Reveal>
            <div className="flex items-baseline justify-between">
              <Link
                href="/portfolio"
                className="tech-label text-muted-foreground transition-colors hover:text-primary"
              >
                ← Portfolio
              </Link>
              <span className="tech-label text-muted-foreground/50">{kicker}</span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1
              className="mt-6 font-semibold tracking-tight text-foreground"
              style={{ fontSize: "clamp(2.75rem, 6vw, 5.5rem)", lineHeight: 1.02, textWrap: "balance" }}
            >
              {title}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{lede}</p>
          </Reveal>
        </header>

        <div className="mx-auto mt-24 w-[92vw] max-w-[1720px] space-y-32 md:mt-32 md:space-y-44">
          {projects.map((p, i) => (
            <ProjectBoard key={p.slug} project={p} index={i} flip={i % 2 === 1} status={status} />
          ))}
        </div>
      </main>
    </>
  );
}
