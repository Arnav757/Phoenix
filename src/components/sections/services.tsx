"use client";

import { SectionHeading, Stagger, staggerItem } from "@/components/reveal";
import { services } from "@/lib/content";
import { motion } from "motion/react";

// "What we do" — presented as a specification schedule (drawing-index
// ledger) rather than a card grid. Each capability is one full-width ruled
// row: index number in the drafting margin, the discipline set large, and
// the specification note right-aligned like a schedule remark column.
// Hover feedback is a single primary hairline drawing across the row's
// base — no lifts, no shadows.
export function Services() {
  return (
    <section id="services" className="relative border-y border-border bg-card/40">
      <div className="bp-grid absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto w-[92vw] max-w-[1720px] py-28 md:py-40">
        <SectionHeading
          kicker="02 — Capabilities"
          title="What we do"
          sheet="Sheet 02/07"
        />

        {/* Schedule rows — a ruled ledger, one capability per line item. */}
        <Stagger gap={0.1}>
          {services.map((s) => (
            <motion.article
              key={s.num}
              variants={staggerItem}
              className="group relative grid grid-cols-12 items-baseline gap-x-6 gap-y-3 border-t border-border py-8 transition-colors duration-300 last:border-b hover:bg-secondary/40 md:py-12"
            >
              <span className="tech-label col-span-12 text-primary md:col-span-1">
                {s.num}
              </span>
              <h3 className="col-span-12 text-2xl font-semibold tracking-tight text-foreground md:col-span-6 md:text-4xl">
                {s.title}
              </h3>
              <p className="col-span-12 max-w-md text-base leading-relaxed text-muted-foreground md:col-span-5 md:justify-self-end">
                {s.description}
              </p>
              <span
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-x-100"
                aria-hidden
              />
            </motion.article>
          ))}
        </Stagger>

        <p className="tech-label mt-8 text-muted-foreground/60">
          Draft capability copy — pending client confirmation
        </p>

        {/* Margin annotation — drafting chrome only, never spoken. */}
        <span
          className="tech-label pointer-events-none absolute right-0 top-1/2 hidden origin-right rotate-90 text-muted-foreground/25 md:block"
          aria-hidden
        >
          Schedule A — Capabilities
        </span>
      </div>
    </section>
  );
}
