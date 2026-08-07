"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/reveal";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { getProjectsByStatus } from "@/lib/projects";

// PORTFOLIO — a gateway, not a listing. Two large cinematic boards funnel
// visitors to /portfolio/upcoming and /portfolio/completed, where the
// actual project grids live. Deliberately no cards, no scroll-through here.
const gateways = [
  {
    href: "/portfolio/upcoming",
    label: "Upcoming Projects",
    kicker: "01 — Under development",
    description:
      "Developments currently under construction across Hyderabad — from SEZ campuses to commercial towers.",
    image: getProjectsByStatus("upcoming")[0]?.heroImage,
    count: getProjectsByStatus("upcoming").length,
  },
  {
    href: "/portfolio/completed",
    label: "Completed Projects",
    kicker: "02 — Delivered",
    description:
      "Developments successfully delivered and handed over — Grade-A campuses in active use across the city.",
    image: getProjectsByStatus("completed")[0]?.heroImage,
    count: getProjectsByStatus("completed").length,
  },
];

export function PortfolioGatewayClient() {
  return (
    <>
      <Navbar visible />
      <div className="bp-grid pointer-events-none fixed inset-0 -z-10 opacity-[0.35]" aria-hidden />

      <main className="pb-28 pt-28 md:pt-32">
        <header className="mx-auto w-[92vw] max-w-[1720px]">
          <Reveal>
            <p className="tech-label text-primary">Portfolio</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1
              className="mt-4 font-semibold tracking-tight text-foreground"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 1.02, textWrap: "balance" }}
            >
              Building tomorrow.
              <br />
              Delivering excellence.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Explore our developments — under construction and delivered.
            </p>
          </Reveal>
        </header>

        <div className="mx-auto mt-20 w-[92vw] max-w-[1720px] space-y-6 md:mt-28">
          {gateways.map((g, i) => (
            <Reveal key={g.href} delay={i * 0.08}>
              <Link
                href={g.href}
                className="group sheet-corners relative block overflow-hidden rounded-lg border border-border transition-colors duration-500 hover:border-primary/60"
              >
                <GlowingEffect spread={45} glow disabled={false} proximity={80} inactiveZone={0.01} borderWidth={2} />
                <div className="relative" style={{ aspectRatio: "21 / 9" }}>
                  {g.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={g.image}
                      alt=""
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      className="transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                      aria-hidden
                    />
                  ) : null}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgb(0 0 0 / 0.75) 0%, rgb(0 0 0 / 0.15) 55%, transparent 80%)",
                    }}
                    aria-hidden
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14">
                    <span className="tech-label text-primary/90">{g.kicker}</span>
                    <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
                      <h2
                        className="font-semibold tracking-tight text-white"
                        style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", lineHeight: 1.02 }}
                      >
                        {g.label}
                      </h2>
                      <motion.span
                        className="tech-label inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-white backdrop-blur-sm transition-colors duration-300 group-hover:border-primary/60 group-hover:bg-primary/20"
                      >
                        Browse projects
                        <ArrowUpRight size={14} aria-hidden />
                      </motion.span>
                    </div>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/75 md:text-base">
                      {g.description}
                    </p>
                    <span className="tech-label mt-6 text-white/50">
                      {g.count} {g.count === 1 ? "project" : "projects"}
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </main>
    </>
  );
}
