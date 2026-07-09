"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Reveal, SectionHeading } from "@/components/reveal";
import { process } from "@/lib/content";

// Vertical timeline: a plotted line progresses as the visitor scrolls,
// like a pen tracing a construction schedule.
export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.7", "end 0.65"],
  });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <section id="process" className="relative border-y border-border bg-card/40">
      <div className="relative mx-auto max-w-7xl px-6 py-28 md:py-36">
        <SectionHeading kicker="04 — Process" title="How we work" />
        <ol ref={ref} className="relative ml-3 max-w-3xl">
          {/* static guide + progress line */}
          <span className="absolute left-0 top-0 h-full w-px bg-border" aria-hidden />
          <motion.span
            style={{ scaleY: line }}
            className="absolute left-0 top-0 h-full w-px origin-top bg-primary"
            aria-hidden
          />
          {process.map((step, i) => (
            <li key={step.num} className="relative pb-14 pl-10 last:pb-0">
              <Reveal delay={i * 0.05}>
                <span
                  className="absolute -left-[5px] top-1.5 block h-[11px] w-[11px] rotate-45 border border-primary bg-background"
                  aria-hidden
                />
                <div className="flex items-baseline gap-4">
                  <span className="tech-label text-primary">{step.num}</span>
                  <h3 className="text-xl font-semibold text-foreground md:text-2xl">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-3 max-w-xl text-muted-foreground">
                  {step.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
        <p className="tech-label mt-10 text-muted-foreground/60">
          Draft process copy — pending client confirmation
        </p>
      </div>
    </section>
  );
}
