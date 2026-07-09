"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { Reveal, SectionHeading, Stagger, staggerItem } from "@/components/reveal";
import { certifications, foundation, stats } from "@/lib/content";

// Stats grow like survey measurements: number counts up while a scale bar
// extends beneath it.
function Stat({
  value,
  suffix,
  label,
  format,
  delay,
}: {
  value: number;
  suffix?: string;
  label: string;
  format?: "year";
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(format === "year" ? 1960 : 0);
  const spring = useSpring(mv, { duration: 1.8, bounce: 0 });
  const [display, setDisplay] = useState(format === "year" ? "1960" : "0");

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, mv, value]);

  useEffect(() => {
    if (reduce) {
      setDisplay(String(value));
      return;
    }
    return spring.on("change", (v) => setDisplay(String(Math.round(v))));
  }, [spring, reduce, value]);

  return (
    <div ref={ref} className="relative p-8">
      <p className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
        {display}
        {suffix && <span className="text-primary">{suffix}</span>}
      </p>
      {/* survey scale bar */}
      <motion.div
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.6, delay, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 flex h-2 origin-left items-end gap-[3px]"
        aria-hidden
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className={`w-px bg-primary/70 ${i % 6 === 0 ? "h-2" : "h-1"}`}
          />
        ))}
      </motion.div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-7xl px-6 py-28 md:py-36">
      <SectionHeading kicker="05 — Experience" title="Built on a track record" />

      <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className="bg-card">
            <Stat {...s} delay={i * 0.12} />
          </div>
        ))}
      </div>

      {/* certifications */}
      <div className="mt-20 grid gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <h3 className="text-2xl font-semibold text-foreground">
              Certified green, from the first drawing
            </h3>
          </Reveal>
          <Stagger className="mt-8 space-y-4">
            {certifications.map((c) => (
              <motion.div
                key={c.name}
                variants={staggerItem}
                className="flex items-center gap-4 rounded-md border border-border bg-card p-5"
              >
                <span
                  className="block h-2.5 w-2.5 rotate-45 border border-primary bg-primary/30"
                  aria-hidden
                />
                <div>
                  <p className="font-medium text-foreground">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.body}</p>
                </div>
              </motion.div>
            ))}
          </Stagger>
        </div>

        {/* foundation */}
        <div>
          <Reveal>
            <h3 className="text-2xl font-semibold text-foreground">
              Phoenix Foundation
            </h3>
            <p className="mt-4 text-muted-foreground">{foundation.intro}</p>
          </Reveal>
          <Stagger className="mt-8 grid grid-cols-2 gap-4">
            {foundation.initiatives.map((f) => (
              <motion.div
                key={f.title}
                variants={staggerItem}
                className="rounded-md border border-border bg-card p-5"
              >
                <Image
                  src={f.icon}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
                <p className="mt-3 font-medium text-foreground">{f.title}</p>
                <p className="text-sm text-muted-foreground">{f.detail}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
