"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Navbar } from "@/components/navbar";
import { Reveal, Stagger, staggerItem } from "@/components/reveal";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import type { Project, ProjectStatus } from "@/lib/projects";

const copy: Record<ProjectStatus, { kicker: string; title: string; lede: string }> = {
  upcoming: {
    kicker: "Portfolio — Upcoming",
    title: "Upcoming developments",
    lede: "Projects currently under development across Hyderabad.",
  },
  completed: {
    kicker: "Portfolio — Completed",
    title: "Completed developments",
    lede: "Projects successfully delivered and handed over.",
  },
};

export function PortfolioIndexClient({
  status,
  projects,
}: {
  status: ProjectStatus;
  projects: Project[];
}) {
  const { kicker, title, lede } = copy[status];

  return (
    <>
      <Navbar visible />
      <div className="bp-grid pointer-events-none fixed inset-0 -z-10 opacity-[0.35]" aria-hidden />

      <main className="pb-28 pt-28 md:pt-32">
        <header className="mx-auto w-[92vw] max-w-[1720px]">
          <Reveal>
            <div className="flex items-baseline justify-between">
              <Link
                href="/portfolio"
                className="tech-label text-muted-foreground transition-colors hover:text-primary"
              >
                ← Portfolio
              </Link>
              <span className="tech-label text-muted-foreground/50">{kicker}</span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1
              className="mt-6 font-semibold tracking-tight text-foreground"
              style={{ fontSize: "clamp(2.75rem, 6vw, 5.5rem)", lineHeight: 1.02, textWrap: "balance" }}
            >
              {title}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{lede}</p>
          </Reveal>
        </header>

        <Stagger className="mx-auto mt-16 grid w-[92vw] max-w-[1720px] grid-cols-1 gap-8 md:mt-24 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <motion.div key={p.slug} variants={staggerItem}>
              <Link
                href={`/portfolio/${status}/${p.slug}`}
                className="group sheet-corners relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors duration-500 hover:border-primary/60"
              >
                <GlowingEffect spread={35} glow disabled={false} proximity={56} inactiveZone={0.01} borderWidth={2} />
                <div className="relative overflow-hidden border-b border-border" style={{ aspectRatio: "4 / 3" }}>
                  {/* next/image instead of a raw <img>: the source photos
                      are ~2200px wide but a grid card only ever displays
                      one at ~30-90vw — without responsive sizing the
                      browser was downloading and decoding the full-
                      resolution JPEG for every card, which is expensive
                      and was compounding into scroll jank as cards
                      lazy-loaded into view. */}
                  <Image
                    src={p.heroImage}
                    alt={p.title}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1280px) 30vw, (min-width: 768px) 44vw, 92vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="tech-label absolute left-3 top-3 rounded-full border border-primary/30 bg-background/75 px-3 py-1 text-muted-foreground backdrop-blur-sm">
                    {p.timeline ?? (status === "completed" ? "Completed" : "Upcoming")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-semibold leading-tight tracking-tight text-foreground">
                    {p.title}
                  </h3>
                  <p className="tech-label mt-2 text-muted-foreground/70">{p.location}</p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {p.overview}
                  </p>
                  <span className="tech-label mt-6 inline-flex items-center gap-2 text-primary">
                    View project
                    <ArrowUpRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </Stagger>
      </main>
    </>
  );
}
