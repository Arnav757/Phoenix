"use client";

import { SectionHeading, Stagger, staggerItem } from "@/components/reveal";
import { services } from "@/lib/content";
import { motion } from "motion/react";

export function Services() {
  return (
    <section id="services" className="relative border-y border-border bg-card/40">
      <div className="bp-grid absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6 py-28 md:py-36">
        <SectionHeading kicker="02 — Capabilities" title="What we do" />
        <Stagger className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4" gap={0.1}>
          {services.map((s) => (
            <motion.article
              key={s.num}
              variants={staggerItem}
              className="group relative bg-card p-8 transition-colors duration-300 hover:bg-secondary"
            >
              <span className="tech-label text-primary">{s.num}</span>
              <h3 className="mt-6 text-xl font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
              <span
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-x-100"
                aria-hidden
              />
            </motion.article>
          ))}
        </Stagger>
        <p className="tech-label mt-6 text-muted-foreground/60">
          Draft capability copy — pending client confirmation
        </p>
      </div>
    </section>
  );
}
