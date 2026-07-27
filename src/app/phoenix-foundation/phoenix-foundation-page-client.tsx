"use client";

import { useRef, useState } from "react";
import {
  Award,
  Droplet,
  Eye,
  Flag,
  Flame,
  HeartHandshake,
  Palette,
  Pause,
  Play,
  Trees,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Reveal, SectionHeading, Stagger, staggerItem } from "@/components/reveal";
import { motion } from "motion/react";
import {
  accolades,
  foundationIntro,
  initiatives,
  type Initiative,
} from "@/lib/phoenix-foundation";

const initiativeIcons = [
  HeartHandshake,
  Palette,
  Flag,
  Users,
  Trees,
  Trees,
  HeartHandshake,
  Eye,
  Droplet,
];

// PHOENIX FOUNDATION — same architectural-blueprint presentation board as the
// rest of the site. Content sourced from phoenixindia.net/phoenix-foundation
// and phoenixindia.net/csr-projects (all 9 initiatives + 6 CSR accolades) —
// see src/lib/phoenix-foundation.ts. The CSR film and every initiative /
// award photo are self-hosted (public/phoenix/foundation/). Sankara Eye
// Hospital had no source photo, so it renders icon-only like the others
// that lack one, rather than a fabricated image.
export function PhoenixFoundationPageClient() {
  return (
    <>
      <Navbar visible />

      <div
        className="bp-grid pointer-events-none fixed inset-0 -z-10 opacity-[0.35]"
        aria-hidden
      />

      <main className="pb-28 pt-28 md:pt-32">
        <header className="mx-auto w-[92vw] max-w-[1720px]">
          <SectionHeading kicker={foundationIntro.kicker} title={foundationIntro.title} />
          <Stagger className="max-w-2xl space-y-4">
            {foundationIntro.paragraphs.map((p) => (
              <motion.p
                key={p}
                variants={staggerItem}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                {p}
              </motion.p>
            ))}
          </Stagger>
        </header>

        <CsrFilm />

        <section className="mx-auto mt-28 w-[92vw] max-w-[1720px]">
          <Reveal>
            <p className="tech-label text-primary">Our Initiatives</p>
          </Reveal>
        </section>

        {initiatives.map((initiative, i) => (
          <InitiativeSection
            key={initiative.title}
            initiative={initiative}
            icon={initiativeIcons[i]}
            reverse={i % 2 === 1}
          />
        ))}

        <AccoladesGrid />

        <footer className="mx-auto mt-24 w-[92vw] max-w-[1720px] border-t border-border pt-8 text-center">
          <p className="tech-label flex items-center justify-center gap-2 text-muted-foreground/70">
            <Award size={14} aria-hidden />
            Building a lasting impact beyond the skyline
          </p>
        </footer>
      </main>
    </>
  );
}

function CsrFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section className="mx-auto mt-16 w-[92vw] max-w-[1720px]">
      <Reveal delay={0.1}>
        <div className="flex items-center gap-2 text-primary">
          <Play size={16} aria-hidden />
          <p className="tech-label">{foundationIntro.film.label}</p>
        </div>
        <div
          className="relative mt-4 overflow-hidden rounded-lg border border-border bg-black"
          style={{ aspectRatio: "21 / 9" }}
        >
          <video
            ref={videoRef}
            src={foundationIntro.film.src}
            muted={muted}
            playsInline
            loop
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onClick={toggle}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause CSR film" : "Play CSR film"}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              {playing ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              {muted ? <VolumeX size={16} aria-hidden /> : <Volume2 size={16} aria-hidden />}
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function InitiativeSection({
  initiative,
  icon: Icon,
  reverse,
}: {
  initiative: Initiative;
  icon: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>;
  reverse: boolean;
}) {
  const textBlock = (
    <div>
      <Reveal>
        <div className="flex items-center gap-2 text-primary">
          <Icon size={16} aria-hidden />
          <p className="tech-label">{initiative.eyebrow}</p>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {initiative.title}
        </h2>
      </Reveal>
      <Reveal delay={0.14}>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          {initiative.description}
        </p>
      </Reveal>
    </div>
  );

  const visualBlock = initiative.photo ? (
    <Reveal delay={0.1}>
      <div
        className="relative overflow-hidden rounded-lg border border-border"
        style={{ aspectRatio: "4 / 3" }}
      >
        <img
          src={initiative.photo}
          alt={initiative.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    </Reveal>
  ) : (
    <Reveal delay={0.1}>
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-lg border border-border bg-card"
        style={{ aspectRatio: "4 / 3" }}
      >
        <Icon size={64} className="text-primary/25" aria-hidden />
      </div>
    </Reveal>
  );

  return (
    <section className="mx-auto mt-16 w-[92vw] max-w-[1720px]">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {reverse ? (
          <>
            {visualBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {visualBlock}
          </>
        )}
      </div>
    </section>
  );
}

function AccoladesGrid() {
  return (
    <section className="mx-auto mt-28 w-[92vw] max-w-[1720px]">
      <Reveal>
        <div className="flex items-center gap-2 text-primary">
          <Award size={16} aria-hidden />
          <p className="tech-label">Our CSR Accolades</p>
        </div>
      </Reveal>
      <Stagger className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {accolades.map((a) => (
          <motion.div
            key={a.title}
            variants={staggerItem}
            className="overflow-hidden rounded-lg border border-border bg-card"
          >
            <div
              className="relative overflow-hidden border-b border-border"
              style={{ aspectRatio: "4 / 3" }}
            >
              <img
                src={a.photo}
                alt={a.title}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="p-5">
              <h3 className="text-sm font-semibold leading-snug text-foreground">{a.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                {a.description}
              </p>
            </div>
          </motion.div>
        ))}
      </Stagger>
    </section>
  );
}
