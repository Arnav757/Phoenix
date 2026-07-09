"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Shared scroll-reveal primitives — subtle, engineering-precise motion.

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  gap = 0.08,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ staggerChildren: gap }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function SectionHeading({
  kicker,
  title,
  id,
}: {
  kicker: string;
  title: string;
  id?: string;
}) {
  return (
    <div className="mb-12 md:mb-16">
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="tech-label text-primary">{kicker}</span>
          <motion.span
            className="h-px bg-primary/40 origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
            style={{ width: 96 }}
            aria-hidden
          />
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          id={id}
          className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-foreground"
        >
          {title}
        </h2>
      </Reveal>
    </div>
  );
}
