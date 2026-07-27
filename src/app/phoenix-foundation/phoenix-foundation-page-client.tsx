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
    <section className="mx-auto mt-20 w-[92vw] max-w-[1720px]">
      <Reveal delay={0.1}>
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Play size={16} aria-hidden />
            <p className="tech-label">{foundationIntro.film.label}</p>
          </div>
          <span
            className="tech-label hidden text-muted-foreground/50 md:inline"
            aria-hidden
          >
            Sheet 07.01 // Motion
          </span>
        </div>
        <div
          className="sheet-corners group relative mt-4 overflow-hidden rounded-lg border border-primary/30 bg-black shadow-[0_20px_60px_-24px_rgba(0,120,243,0.35)]"
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
          {/* Vignette so the controls always read clearly over the footage */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgb(0 0 0 / 0.55) 0%, transparent 28%), linear-gradient(to bottom, rgb(0 0 0 / 0.35) 0%, transparent 22%)",
            }}
            aria-hidden
          />
          {/* Blueprint corner index, quiet at rest, matching the drawing-set language */}
          <span
            className="tech-label pointer-events-none absolute left-5 top-5 text-white/70"
            aria-hidden
          >
            07.01
          </span>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
            <div className="pointer-events-auto flex items-center gap-3">
              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? "Pause CSR film" : "Play CSR film"}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-sm transition-colors hover:border-primary/60 hover:bg-black/70"
              >
                {playing ? <Pause size={17} aria-hidden /> : <Play size={17} aria-hidden />}
              </button>
              <span className="tech-label hidden text-white/70 sm:inline">
                {playing ? "Now playing" : "Play the film"}
              </span>
            </div>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-sm transition-colors hover:border-primary/60 hover:bg-black/70"
            >
              {muted ? <VolumeX size={17} aria-hidden /> : <Volume2 size={17} aria-hidden />}
            </button>
          </div>
          {/* Hover-illuminated frame edge, consistent with the award-plate hover language */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-primary/0 transition-[box-shadow] duration-500 group-hover:ring-primary/40"
          />
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
      <div className="flex items-baseline justify-between">
        <Reveal>
          <div className="flex items-center gap-2 text-primary">
            <Award size={16} aria-hidden />
            <p className="tech-label">Our CSR Accolades</p>
          </div>
        </Reveal>
        <span
          className="tech-label hidden text-muted-foreground/50 md:inline"
          aria-hidden
        >
          {accolades.length} plates · Sheet 07/07
        </span>
      </div>
      <Reveal delay={0.06}>
        <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Recognised across the industry
        </h2>
      </Reveal>
      <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {accolades.map((a, i) => (
          <motion.div
            key={a.title}
            variants={staggerItem}
            className="group sheet-corners relative flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_16px_40px_-20px_rgba(0,120,243,0.35)]"
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
                className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
              {/* Blueprint edge glow + index numeral, matching the Awards-page atlas tiles */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-primary/0 transition-[box-shadow,ring] duration-500 group-hover:ring-primary/50"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute left-2 top-2 flex items-center gap-1.5 rounded-full border border-primary/30 bg-background/70 px-2 py-0.5 text-[10px] tracking-[0.22em] text-muted-foreground backdrop-blur-sm"
              >
                <Award size={10} aria-hidden />
                C.{String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="relative flex flex-1 flex-col p-5">
              <h3 className="text-sm font-semibold leading-snug text-foreground">{a.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                {a.description}
              </p>
              {/* Hover-illuminated bottom rule, matching the download-centre cards on Awards */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-5 bottom-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-700 ease-out group-hover:scale-x-100"
              />
            </div>
          </motion.div>
        ))}
      </Stagger>
    </section>
  );
}
