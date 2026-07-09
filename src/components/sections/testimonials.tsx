"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SectionHeading } from "@/components/reveal";
import { testimonials } from "@/lib/content";

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
      <div className="relative mx-auto max-w-5xl px-6 py-28 md:py-36">
        <SectionHeading kicker="06 — Testimonials" title="Proof of delivery" />
        <div className="sheet-corners min-h-[220px] rounded-lg border border-border bg-card/70 p-10 md:p-14">
          <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote className="text-xl font-medium leading-relaxed text-foreground md:text-2xl">
                “{current.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="h-px w-8 bg-primary/60" aria-hidden />
                <span className="text-sm text-muted-foreground">
                  {current.author} · {current.org}
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === index ? "w-10 bg-primary" : "w-4 bg-border hover:bg-primary/40"
                }`}
              />
            ))}
          </div>
          <p className="tech-label text-muted-foreground/60">
            Draft testimonials — pending client approval
          </p>
        </div>
      </div>
    </section>
  );
}
