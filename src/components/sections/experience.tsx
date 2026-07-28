"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Reveal, SectionHeading, Stagger, staggerItem } from "@/components/reveal";
import { certifications, foundation, stats } from "@/lib/content";

// Sheet 05 — Experience. About already carries the four figures as a large
// factsheet band, so here they appear once more only as a slim credibility
// ribbon (static, understated), followed by a two-board composition:
// certifications as a ruled specification list, and the Phoenix Foundation
// initiatives as a two-column schedule. No card boxes, no counters —
// hairline rules and type do the work.
export function Experience() {
  return (
    <section
      id="experience"
      className="relative mx-auto w-[92vw] max-w-[1720px] py-28 md:py-40"
    >
      <SectionHeading
        kicker="05 — Experience"
        title="Built on a track record"
        sheet="Sheet 05/07"
      />

      {/* Credibility ribbon — the four figures inline on one ruled strip. */}
      <Reveal>
        <div className="border-y border-border py-6 md:py-8">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-10">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="tech-label order-2 mt-2 text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="order-1 flex items-baseline gap-1">
                  <span className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                    {s.value}
                  </span>
                  {"suffix" in s && s.suffix ? (
                    <span className="text-base font-medium text-primary">
                      {s.suffix}
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      {/* Two-board composition — certifications spec list + foundation schedule. */}
      <div className="mt-20 grid gap-14 md:mt-28 lg:grid-cols-12">
        {/* Board A — certifications as a ruled specification list. */}
        <div className="lg:col-span-5">
          <Reveal>
            <h3 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Certified green, from the first drawing
            </h3>
          </Reveal>
          <Stagger className="mt-8 md:mt-10">
            {certifications.map((c) => (
              <motion.div
                key={c.name}
                variants={staggerItem}
                className="flex items-start gap-4 border-t border-border py-5 last:border-b"
              >
                <span
                  className="mt-1.5 block h-2 w-2 shrink-0 rotate-45 border border-primary bg-primary/30"
                  aria-hidden
                />
                <div>
                  <p className="font-medium text-foreground">{c.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
                </div>
              </motion.div>
            ))}
          </Stagger>
        </div>

        {/* Board B — Phoenix Foundation as a two-column schedule. */}
        <div className="lg:col-span-7">
          <Reveal>
            <h3 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Phoenix Foundation
            </h3>
            <p className="mt-4 max-w-lg text-muted-foreground">
              {foundation.intro}
            </p>
          </Reveal>
          <Stagger className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 md:mt-10">
            {foundation.initiatives.map((f) => (
              <motion.div
                key={f.title}
                variants={staggerItem}
                className="border-t border-border pt-6"
              >
                <Image
                  src={f.icon}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
                <p className="mt-4 font-medium text-foreground">{f.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{f.detail}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </div>

      {/* Sparse drafting annotations in the surrounding whitespace. */}
      <div
        className="pointer-events-none absolute inset-0 hidden text-muted-foreground/25 md:block"
        aria-hidden
      >
        <span className="tech-label absolute right-0 top-1/2 origin-right rotate-90">
          IGBC · CII
        </span>
        <span className="tech-label absolute bottom-10 left-0">
          Drawing · EXP / 05 · Rev 01
        </span>
      </div>
    </section>
  );
}
