"use client";

import { Navbar } from "@/components/navbar";
import { Reveal, SectionHeading, Stagger, staggerItem } from "@/components/reveal";
import { motion } from "motion/react";
import { DIRECTORS, TEAM_MEMBERS, teamIntro } from "@/lib/team";
import { CircularGallery, type GalleryItem } from "@/components/ui/circular-gallery";

const directorGalleryItems: GalleryItem[] = DIRECTORS.map((member) => ({
  common: member.name,
  binomial: member.role,
  photo: { url: member.photo, text: member.name },
}));

// OUR TEAM — same architectural-blueprint presentation board as the rest of
// the site (bp-grid backdrop, tech-label annotations, sheet-corners cards).
// Roster + bios sourced from phoenixindia.net — see src/lib/team.ts. No
// headshots exist on the current site, so each card shows a placeholder
// portrait slot until photos are supplied.
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

          <Stagger className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {TEAM_MEMBERS.map((member) => (
              <motion.div
                key={member.id}
                variants={staggerItem}
                className="sheet-corners flex gap-6 rounded-lg border border-border bg-card p-8"
              >
                <div
                  className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-dashed border-primary/40 bg-primary/5 text-center text-muted-foreground/60"
                  aria-hidden
                >
                  <span className="tech-label">Photo pending</span>
                </div>
                <div>
                  <p className="text-xl font-semibold text-foreground">
                    {member.name}
                  </p>
                  <p className="tech-label mt-1 text-primary">{member.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </Stagger>
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
