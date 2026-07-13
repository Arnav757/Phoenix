"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal, SectionHeading } from "@/components/reveal";
import { testimonials } from "@/lib/content";

// Testimonials as a drawing-sheet quotation set: the rotating quote sits
// directly on the board between two hairline drafting rules instead of
// inside a card. A monumental opening quotation mark occupies the left
// margin at near-invisible opacity, and pagination is a row of drafting
// index ticks (numeral + rule) rather than pill buttons. The 6s rotation
// and crossfade mechanism from the previous version is kept unchanged.
export function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      6000
    );
    return () => clearInterval(t);
  }, []);

  const current = testimonials[index];

  return (
    <section
      id="testimonials"
      className="relative border-y border-border bg-card/40"
    >
      <div className="bp-grid absolute inset-0 opacity-30" aria-hidden />
      <div className="relative mx-auto w-[92vw] max-w-[1720px] py-28 md:py-40">
        <SectionHeading
          kicker="06 — Testimonials"
          title="Proof of delivery"
          sheet="Sheet 06/07"
        />

        {/* The quotation set — a ruled band, not a card. Hairline rules
            above and below frame the rotating area like drafting lines. */}
        <Reveal>
          <div className="border-y border-border">
            <div className="grid gap-6 py-12 md:grid-cols-12 md:gap-10 md:py-16">
              {/* Monumental opening quotation mark in the left margin —
                  decorative drafting furniture, invisible to screen
                  readers and hidden on mobile. */}
              <div className="relative hidden md:col-span-2 md:block" aria-hidden>
                <span
                  className="absolute -top-8 left-0 select-none font-semibold leading-none text-muted-foreground/10"
                  style={{ fontSize: "clamp(9rem, 13vw, 16rem)" }}
                >
                  “
                </span>
              </div>

              {/* Rotating quote — min-height reserves space for the tallest
                  quote at display scale so rotation never shifts layout. */}
              <div className="min-h-[260px] md:col-span-10 md:min-h-[300px] lg:col-span-9">
                <AnimatePresence mode="wait">
                  <motion.figure
                    key={index}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <blockquote className="text-2xl font-medium leading-snug tracking-tight text-foreground md:text-4xl">
                      “{current.quote}”
                    </blockquote>
                    <figcaption className="mt-8 flex items-center gap-3">
                      <span className="h-px w-10 bg-primary/60" aria-hidden />
                      <span className="tech-label text-foreground/80">
                        {current.author}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        · {current.org}
                      </span>
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Index ticks + drafting note beneath the lower rule. */}
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-end gap-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className="group flex flex-col items-start gap-2"
              >
                <span
                  className={`tech-label transition-colors duration-300 ${
                    i === index
                      ? "text-primary"
                      : "text-muted-foreground/40 group-hover:text-muted-foreground/70"
                  }`}
                >
                  0{i + 1}
                </span>
                <span
                  className={`block h-px w-10 origin-left transition-all duration-300 ${
                    i === index
                      ? "scale-x-100 bg-primary"
                      : "scale-x-50 bg-border group-hover:scale-x-75 group-hover:bg-primary/40"
                  }`}
                  aria-hidden
                />
              </button>
            ))}
          </div>
          <p className="tech-label text-muted-foreground/60">
            Draft testimonials — pending client approval
          </p>
        </div>

        {/* Sparse margin annotations — drafting language in the whitespace,
            never spoken by assistive tech. */}
        <div
          className="pointer-events-none absolute inset-0 hidden text-muted-foreground/25 md:block"
          aria-hidden
        >
          <span className="tech-label absolute right-0 top-1/2 origin-right rotate-90">
            T — 06
          </span>
          <span className="tech-label absolute bottom-10 left-0">
            Record · TST / 06 · Rev 01
          </span>
        </div>
      </div>
    </section>
  );
}
