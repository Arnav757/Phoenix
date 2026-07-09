"use client";

import { motion } from "motion/react";
import type { projects } from "@/lib/content";
import { Button } from "@/components/ui/button";

// Details stagger in while the construction animation runs alongside.
export function ProjectDetails({
  project,
}: {
  project: (typeof projects)[number];
}) {
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.35, delayChildren: 0.4 }}
    >
      <motion.p variants={item} className="tech-label text-primary">
        {project.status} · {project.location}
      </motion.p>
      <motion.h1
        variants={item}
        className="mt-4 text-4xl font-semibold tracking-tight text-foreground md:text-6xl"
      >
        {project.name}
      </motion.h1>
      <motion.p
        variants={item}
        className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
      >
        {project.description}
      </motion.p>

      <motion.dl
        variants={item}
        className={`mt-10 grid gap-px overflow-hidden rounded-md border border-border bg-border ${
          project.specs.length > 3 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-3"
        }`}
      >
        {project.specs.map((s) => (
          <div key={s.label} className="bg-card p-5">
            <dt className="tech-label text-muted-foreground">{s.label}</dt>
            <dd className="mt-2 text-lg font-semibold text-foreground">
              {s.value}
            </dd>
          </div>
        ))}
      </motion.dl>

      <motion.div variants={item} className="mt-10 flex items-center gap-4">
        <Button
          render={<a href="/#contact" />}
          nativeButton={false}
          size="lg"
          className="rounded-full px-7"
        >
          Enquire about this project
        </Button>
        <span className="tech-label text-muted-foreground/60">
          Sheet {project.id.toUpperCase()} · Rev A
        </span>
      </motion.div>
    </motion.div>
  );
}
