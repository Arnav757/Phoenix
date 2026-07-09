"use client";

import { Reveal, SectionHeading, Stagger, staggerItem } from "@/components/reveal";
import { company } from "@/lib/content";
import { motion } from "motion/react";

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-28 md:py-36">
      <SectionHeading kicker="01 — Company Overview" title="Who we are" />
      <div className="grid gap-12 md:grid-cols-2">
        <Reveal>
          <p className="text-2xl font-medium leading-snug text-foreground md:text-3xl">
            {company.intro}
          </p>
        </Reveal>
        <Stagger className="space-y-6 text-lg text-muted-foreground">
          <motion.p variants={staggerItem}>{company.about1}</motion.p>
          <motion.p variants={staggerItem}>{company.about2}</motion.p>
          <motion.div variants={staggerItem} className="flex items-center gap-3 pt-2">
            <span className="h-px w-10 bg-primary/60" aria-hidden />
            <span className="tech-label text-primary">
              Trusted by enterprises. Built for decades.
            </span>
          </motion.div>
        </Stagger>
      </div>
    </section>
  );
}
