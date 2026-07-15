"use client";

import { Navbar } from "@/components/navbar";
import { Reveal, SectionHeading } from "@/components/reveal";
import { DIRECTORS, TEAM_MEMBERS, teamIntro } from "@/lib/team";
import { PortraitCarousel } from "./portrait-carousel";

const LEADERSHIP = [...TEAM_MEMBERS, ...DIRECTORS];

// OUR TEAM — editorial full-bleed portrait carousel (see portrait-carousel.tsx).
// Executive Leadership + Board of Directors are one continuous roster here;
// bios/photos for the two executives come from phoenixindia.net (background
// removed for the cut-out presentation — see src/lib/team.ts), directors are
// placeholders pending client confirmation.
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

        {LEADERSHIP.length === 0 ? (
          <p className="mx-auto mt-16 w-[92vw] max-w-[1720px] rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Leadership roster pending client confirmation.
          </p>
        ) : (
          <div className="mt-16">
            <PortraitCarousel members={LEADERSHIP} />
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
