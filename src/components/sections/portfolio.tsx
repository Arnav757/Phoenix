"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Reveal, SectionHeading } from "@/components/reveal";
import { projects } from "@/lib/content";

// Each project reveals from a blueprint wireframe into real photography.
function ProjectCard({
  project,
  flip,
}: {
  project: (typeof projects)[number];
  flip: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const parallax = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <div
      ref={ref}
      className={`grid items-center gap-10 lg:grid-cols-2 ${
        flip ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      {/* image plate: blueprint state -> photo; glows + links to detail page */}
      <Reveal className="relative">
        <Link
          href={`/projects/${project.id}`}
          aria-label={`Open ${project.name} project details`}
          className="sheet-corners group/card relative block overflow-hidden rounded-lg border border-border transition-all duration-500 hover:border-primary/60 hover:shadow-[0_0_0_1px_oklch(0.52_0.2_260/40%),0_0_40px_oklch(0.52_0.2_260/25%),0_0_90px_oklch(0.52_0.2_260/15%)]"
        >
          <motion.div
            style={reduce ? undefined : { y: parallax }}
            className="relative aspect-[4/3] scale-110"
          >
            <Image
              src={project.image}
              alt={project.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
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

      {/* copy */}
      <div>
        <Reveal>
          <span className="tech-label text-primary">{project.status}</span>
          <h3 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">
            {project.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{project.location}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <dl
            className={`mt-8 grid gap-px overflow-hidden rounded-md border border-border bg-border ${
              project.specs.length > 3 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-3"
            }`}
          >
            {project.specs.map((s) => (
              <div key={s.label} className="bg-card p-4">
                <dt className="tech-label text-muted-foreground">{s.label}</dt>
                <dd className="mt-2 font-semibold text-foreground">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </div>
  );
}

export function Portfolio() {
  return (
    <section id="portfolio" className="mx-auto max-w-7xl px-6 py-28 md:py-36">
      <SectionHeading kicker="03 — Portfolio" title="Projects we build" />
      <div className="space-y-28 md:space-y-36">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
