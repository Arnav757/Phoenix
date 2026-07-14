"use client";

import { Navbar } from "@/components/navbar";
import { Reveal, SectionHeading, Stagger, staggerItem } from "@/components/reveal";
import { motion } from "motion/react";
import { DIRECTORS, TEAM_MEMBERS, teamIntro } from "@/lib/team";
import { CircularGallery, type GalleryItem } from "@/components/ui/circular-gallery";
import { LeadershipCard } from "./leadership-card";

const directorGalleryItems: GalleryItem[] = DIRECTORS.map((member) => ({
  common: member.name,
  binomial: member.role,
  photo: { url: member.photo, text: member.name },
}));

// OUR TEAM — same architectural-blueprint presentation board as the rest of
// the site (bp-grid backdrop, tech-label annotations, sheet-corners cards).
// Roster + bios + photos sourced from phoenixindia.net — see src/lib/team.ts.
// Board of Directors roster (DIRECTORS) has no photos yet — those cards show
// a placeholder portrait slot until supplied.
export function TeamPageClient() {
  return (
    <>
      <Navbar visible />

      <div
        className="bp-grid pointer-events-none fixed inset-0 -z-10 opacity-[0.35]"
        aria-hidden
      />

      <main className="pb-28 pt-28 md:pt-32">
        <header className="mx-auto w-[92vw] max-w-[1720px]">
          <SectionHeading kicker={teamIntro.kicker} title={teamIntro.title} />
          <Reveal delay={0.1}>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {teamIntro.summary}
            </p>
          </Reveal>
        </header>

        <div className="mx-auto mt-16 w-[92vw] max-w-[1720px]">
          <Reveal>
            <p className="tech-label text-primary">Executive leadership</p>
          </Reveal>

          {TEAM_MEMBERS.length === 0 ? (
            <p className="mt-8 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Leadership roster pending client confirmation.
            </p>
          ) : (
            <Stagger className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12">
              {TEAM_MEMBERS.map((member) => (
                <motion.div key={member.id} variants={staggerItem}>
                  <LeadershipCard
                    member={member}
                    variant={member.role.toLowerCase().includes("emeritus") ? "emeritus" : "active"}
                  />
                </motion.div>
              ))}
            </Stagger>
          )}
        </div>

        {DIRECTORS.length > 0 && (
          <div className="mx-auto mt-24 w-[92vw] max-w-[1720px]">
            <Reveal>
              <p className="tech-label text-primary">Board of directors</p>
            </Reveal>
            <div className="mt-8 h-[65vh] min-h-[420px] overflow-hidden">
              <CircularGallery items={directorGalleryItems} radius={420} />
            </div>
          </div>
        )}

        <footer className="mx-auto mt-24 w-[92vw] max-w-[1720px] border-t border-border pt-8 text-center">
          <p className="tech-label text-muted-foreground/70">
            Headshots pending — awaiting supply from client
          </p>
        </footer>
      </main>
    </>
  );
}
