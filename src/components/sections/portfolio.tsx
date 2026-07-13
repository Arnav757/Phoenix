"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Reveal, SectionHeading } from "@/components/reveal";
import { projects } from "@/lib/content";

// Portfolio — each project presented as a full-width architectural board:
// a dominant 16/10 image plate (blueprint veil wipes away into the real
// photograph, subtle scroll parallax underneath) beside a narrow ruled
// copy column with a factsheet. The second board mirrors the first so the
// sheet set reads as facing pages.
function ProjectBoard({
  project,
  index,
  flip,
}: {
  project: (typeof projects)[number];
  index: number;
  flip: boolean;
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
  const floors = project.specs.find((s) => s.label === "Floors")?.value;

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-14"
    >
      {/* image plate — the architecture dominates the board */}
      <Reveal className={`relative lg:col-span-8 ${flip ? "lg:order-2" : ""}`}>
        <Link
          href={`/projects/${project.id}`}
          aria-label={`Open ${project.name} project details`}
          className="sheet-corners group/card relative block overflow-hidden border border-border transition-colors duration-500 hover:border-primary/60"
        >
          <motion.div
            style={reduce ? undefined : { y: parallax }}
            className="relative aspect-[16/10] scale-110"
          >
            <Image
              src={project.image}
              alt={project.name}
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
                DWG {project.id.toUpperCase()} — {project.status}
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
            {project.name}
          </h3>
          <div className="mt-5 space-y-1.5">
            <p className="tech-label text-primary">{project.status}</p>
            <p className="tech-label text-muted-foreground">
              {project.location}
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <dl className="mt-10 border-b border-border">
            {project.specs.map((s) => (
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
      </div>

      {/* margin annotations — drafting marks in the surrounding whitespace */}
      <div
        className="pointer-events-none absolute inset-0 hidden text-muted-foreground/25 md:block"
        aria-hidden
      >
        <span
          className={`tech-label absolute -top-10 ${flip ? "left-0" : "right-0"}`}
        >
          DWG {project.id.toUpperCase()} — {district}
        </span>
        <span
          className={`tech-label absolute -bottom-12 ${flip ? "right-0" : "left-0"}`}
        >
          ELEV +{floors ?? "000"} · Scale 1:200
        </span>
      </div>
    </div>
  );
}

export function Portfolio() {
  return (
    <section
      id="portfolio"
      className="relative mx-auto w-[92vw] max-w-[1720px] py-28 md:py-40"
    >
      <SectionHeading
        kicker="03 — Portfolio"
        title="Projects we build"
        sheet="Sheet 03/07"
      />
      <div className="space-y-32 md:space-y-44">
        {projects.map((p, i) => (
          <ProjectBoard key={p.id} project={p} index={i} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
