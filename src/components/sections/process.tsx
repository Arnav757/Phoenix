"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Reveal, SectionHeading } from "@/components/reveal";
import { process } from "@/lib/content";

// Sheet 04 — the construction sequence plotted as a schedule of works.
// A static guide line and a primary line whose scaleY tracks scroll, like
// a pen tracing the programme. The left rail carries a standing statement
// so the board's full width reads as composed rather than hollow.
export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.7", "end 0.65"],
  });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <section id="process" className="relative border-y border-border bg-card/40">
      <div
        className="bp-grid pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
      />
      <div className="relative mx-auto w-[92vw] max-w-[1720px] py-28 md:py-40">
        <SectionHeading
          kicker="04 — Process"
          title="How we work"
          sheet="Sheet 04/07"
        />

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Left rail — standing statement that anchors the board's width.
              Sticky on large screens so it holds position while the
              schedule plots itself on the right. */}
          <div className="self-start lg:sticky lg:top-32 lg:col-span-4">
            <Reveal>
              <div>
                <span className="tech-label text-primary">Sequence P1 — P5</span>
                <p className="mt-5 max-w-sm text-lg leading-relaxed text-muted-foreground">
                  Every project runs the same disciplined sequence — from
                  feasibility to handover, without exception.
                </p>
                <div
                  className="mt-10 hidden items-center gap-3 text-muted-foreground/40 md:flex"
                  aria-hidden
                >
                  <span className="block h-2 w-2 rotate-45 border border-current" />
                  <span className="tech-label">Plot · schedule of works</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right — the scroll-plotted timeline */}
          <div className="lg:col-span-8">
            <ol ref={ref} className="relative ml-3">
              {/* static guide + progress line */}
              <span
                className="absolute left-0 top-0 h-full w-px bg-border"
                aria-hidden
              />
              <motion.span
                style={{ scaleY: line }}
                className="absolute left-0 top-0 h-full w-px origin-top bg-primary"
                aria-hidden
              />
              {process.map((step, i) => (
                <li
                  key={step.num}
                  className="relative pb-16 pl-10 last:pb-0 md:pb-20 md:pl-14"
                >
                  <Reveal delay={i * 0.05}>
                    <span
                      className="absolute -left-[5px] top-2 block h-[11px] w-[11px] rotate-45 border border-primary bg-background"
                      aria-hidden
                    />
                    <div className="flex items-baseline gap-4 md:gap-6">
                      <span className="tech-label text-primary">{step.num}</span>
                      <h3 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ol>
            <p className="tech-label mt-12 text-muted-foreground/60">
              Draft process copy — pending client confirmation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
