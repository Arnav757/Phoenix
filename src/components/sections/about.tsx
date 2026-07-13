"use client";

import { Reveal } from "@/components/reveal";
import { company, stats } from "@/lib/content";
import { motion } from "motion/react";

// "Who we are" — the site's opening statement, presented as an architectural
// exhibition board. Massive display headline, three deliberately smaller
// content blocks (so no single paragraph dominates), a metrics band that
// surfaces the existing stats data, and ultra-low-opacity blueprint
// annotations scattered in the surrounding whitespace (N-01, LEVEL 01,
// 01.02 // FOUNDATION, drafting ticks) so the empty space itself reads as
// part of the drawing rather than dead margin.
//
// Every annotation is aria-hidden — decorative only, never spoken by
// assistive tech. Real content stays in the copy.
export function About() {
  return (
    <section
      id="about"
      className="relative mx-auto w-[92vw] max-w-[1720px] py-28 md:py-40"
    >
      {/* Kicker row — section number + a coordinate readout in the far right */}
      <Reveal>
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-4">
            <span className="tech-label text-primary">01 — Company overview</span>
            <motion.span
              className="h-px w-24 origin-left bg-primary/40"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
              aria-hidden
            />
          </div>
          <span
            className="tech-label hidden text-muted-foreground/40 md:inline"
            aria-hidden
          >
            N — 01 · Sheet 01/07
          </span>
        </div>
      </Reveal>

      {/* Display headline — the dominant visual idea of this "board". */}
      <Reveal delay={0.08}>
        <h2
          className="mt-10 font-semibold tracking-tight text-foreground"
          style={{
            fontSize: "clamp(3.75rem, 11vw, 10.5rem)",
            lineHeight: 0.95,
            textWrap: "balance",
          }}
        >
          Who we are
        </h2>
      </Reveal>

      {/* Sub-headline dimension: a drafting-style measurement rule beneath
          the headline, so the type sits inside real architectural chrome. */}
      <div
        className="mt-6 flex items-center gap-3 text-muted-foreground/40"
        aria-hidden
      >
        <span className="tech-label">01.02 // Foundation</span>
        <motion.span
          className="h-px flex-1 origin-left bg-current"
          style={{ maxWidth: "min(38vw, 620px)" }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.3 }}
        />
        <span className="tech-label">est. 2001</span>
      </div>

      {/* Two-column body — the intro sentence gets its own weight on the
          left; the supporting details break into smaller blocks on the
          right so no single paragraph carries the whole idea. */}
      <div className="mt-20 grid gap-12 md:mt-28 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-7">
          <Reveal delay={0.05}>
            <p className="text-3xl font-medium leading-tight text-foreground md:text-4xl lg:text-5xl">
              {company.intro}
            </p>
          </Reveal>
        </div>

        <div className="md:col-span-5 md:pt-6">
          <div className="space-y-8">
            <Reveal delay={0.1}>
              <div className="border-l border-primary/50 pl-5">
                <span className="tech-label text-primary/80">A · Craft</span>
                <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                  {company.about1}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="border-l border-primary/50 pl-5">
                <span className="tech-label text-primary/80">B · Collaboration</span>
                <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                  {company.about2}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex items-center gap-3 pt-2">
                <span className="h-px w-10 bg-primary/60" aria-hidden />
                <span className="tech-label text-primary">
                  Trusted by enterprises. Built for decades.
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Metrics band — the existing stats data, presented as a factsheet
          strip rather than centered marketing numbers. */}
      <div
        className="relative mt-24 border-t border-border/70 pt-10 md:mt-32 md:pt-14"
        aria-label="Phoenix Group by the numbers"
      >
        <div
          className="absolute -top-3 left-0 flex items-center gap-2 text-muted-foreground/45"
          aria-hidden
        >
          <span className="block h-2 w-2 rotate-45 bg-primary/60 shadow-[0_0_0_2px_var(--background)]" />
          <span className="tech-label">Key figures</span>
        </div>
        <span
          className="absolute -top-3 right-0 hidden text-muted-foreground/40 md:inline"
          aria-hidden
        >
          <span className="tech-label">SCALE 1:1</span>
        </span>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-10">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={0.05 + i * 0.05}>
              <div>
                <dt className="tech-label text-muted-foreground/70">
                  0{i + 1}
                </dt>
                <dd className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                    {s.format === "year" ? s.value : s.value}
                  </span>
                  {"suffix" in s && s.suffix ? (
                    <span className="text-lg font-medium text-primary/80">
                      {s.suffix}
                    </span>
                  ) : null}
                </dd>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>

      {/* Very-low-opacity architectural annotations scattered in the
          surrounding whitespace — drafting language that makes the margins
          part of the drawing without competing with the copy. */}
      <div
        className="pointer-events-none absolute inset-0 hidden text-muted-foreground/25 md:block"
        aria-hidden
      >
        <span className="tech-label absolute right-0 top-40 rotate-90 origin-right">
          A — A′
        </span>
        <span className="tech-label absolute left-0 top-1/2 -rotate-90 origin-left">
          Level 20 // R 0.5 m
        </span>
        <span className="tech-label absolute bottom-8 left-0">
          Drawing · WHO / 01 · Rev 02
        </span>
        <span className="tech-label absolute bottom-8 right-0">
          Section 01.02
        </span>
        <svg
          className="absolute -left-2 top-24"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <line x1="9" y1="0" x2="9" y2="18" stroke="currentColor" strokeWidth="0.8" />
          <line x1="0" y1="9" x2="18" y2="9" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="0.8" fill="none" />
        </svg>
      </div>
    </section>
  );
}
