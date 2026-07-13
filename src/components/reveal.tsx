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

// Board-style section heading: kicker + drafting rule on the left, an
// optional sheet annotation on the right, and a display-scale title. Every
// homepage section shares this language so the page reads as a numbered
// set of presentation boards rather than a stack of widgets.
export function SectionHeading({
  kicker,
  title,
  sheet,
  id,
}: {
  kicker: string;
  title: string;
  /** drafting-style sheet reference, e.g. "Sheet 02/07" — decorative */
  sheet?: string;
  id?: string;
}) {
  return (
    <div className="mb-16 md:mb-24">
      <Reveal>
        <div className="flex items-baseline justify-between">
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
          {sheet ? (
            <span
              className="tech-label hidden text-muted-foreground/40 md:inline"
              aria-hidden
            >
              {sheet}
            </span>
          ) : null}
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          id={id}
          className="mt-6 font-semibold tracking-tight text-foreground"
          style={{
            fontSize: "clamp(2.5rem, 5.5vw, 5rem)",
            lineHeight: 1.02,
            textWrap: "balance",
          }}
        >
          {title}
        </h2>
      </Reveal>
    </div>
  );
}
