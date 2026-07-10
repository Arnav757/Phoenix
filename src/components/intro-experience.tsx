"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useReducedMotion } from "motion/react";
import { DraftingMarks } from "./drafting-marks";

// Cinematic homepage entry — an architectural presentation unveiling itself,
// not a loading screen. A fixed overlay above the site, never part of the
// scroll flow:
//
// 1. ENTRY: minimal — blueprint background, a large centered Phoenix logo,
//    faint static drafting marks, a quiet "click anywhere" cue. No nav, no
//    autoplay, no copy. The visitor is standing in front of the drawing.
// 2. On click (or Enter/Space) anywhere on screen: the blueprint intensifies,
//    drafting marks (guide lines, dimension ticks, coordinate/survey points,
//    construction circles) draw themselves in over ~1.6s while the logo
//    holds perfectly still at center.
// 3. The blueprint dissolves into the uploaded construction-simulation video
//    for the session's featured project, playing once at its own pace.
// 4. On the video's natural end, it blends into the finished project
//    photograph (clip-path reveal, same "as built" language used on project
//    pages).
// 5. The logo — never recolored, distorted, rotated or morphed, only ever
//    translated/uniformly scaled — animates from its large centered position
//    into its exact home in the navigation bar (measured live from the real
//    navbar element), while the rest of the overlay dissolves.
// 6. The navbar fades in at the same position the intro logo just vacated;
//    the homepage is fully interactive.
//
// The ~1.5–2s cinematic beats in the brief govern the two blueprint/logo
// choreography passages that bookend the video (steps 2 and 5) — the
// uploaded construction videos themselves run their own real length (the
// Aquila/Equinox clips are ~10–15s) and are never cut short.
//
// Hardening (carried over from the previous intro): completion never
// depends solely on a GSAP callback or a video's `ended` event — a hard
// fallback timer guarantees the site can never stay locked. Reduced motion
// skips straight to the site. "Skip" is always available, understated.
const WINDUP_MS = 1600; // blueprint intensifies + drafting draws in
const CLOSE_MS = 1500; // logo FLIP + overlay dissolve
const STALL_MS = 8000; // safety: don't trust a video that never gets going

export function IntroExperience({
  onComplete,
  onStart,
  project,
  navLogoRef,
}: {
  onComplete: () => void;
  onStart?: () => void;
  project: { name: string; video: string; image: string };
  /** the real navbar logo's wrapper — the intro reads its live rect for the hand-off */
  navLogoRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const reduce = useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef<SVGSVGElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<HTMLDivElement>(null);

  const doneRef = useRef(false);
  const completedRef = useRef(false);
  const startedRef = useRef(false);
  const finishRef = useRef<(instant?: boolean) => void>(() => {});
  const startRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (reduce) {
      if (!doneRef.current) {
        doneRef.current = true;
        onComplete();
      }
      return;
    }

    const video = videoRef.current;
    const root = rootRef.current;
    if (!video || !root) return;

    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    window.scrollTo(0, 0);

    let stallTimer: ReturnType<typeof setTimeout> | undefined;

    const complete = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      video.removeAttribute("src");
      video.load();
      onComplete();
    };

    // measure the real navbar logo and FLIP the intro logo onto it, then
    // dissolve the rest of the overlay. Falls back to a plain fade in place
    // if the navbar logo can't be measured for any reason.
    const closeToNav = (instant: boolean) => {
      const logo = logoWrapRef.current;
      const target = navLogoRef?.current;
      const tl = gsap.timeline({ onComplete: complete });
      const flipMs = instant ? 260 : 700;
      const restMs = instant ? 220 : 600;
      const crossMs = instant ? 220 : 480;

      if (logo && target) {
        const from = logo.getBoundingClientRect();
        const to = target.getBoundingClientRect();
        const scale = to.width / from.width;
        const dx = to.left + to.width / 2 - (from.left + from.width / 2);
        const dy = to.top + to.height / 2 - (from.top + from.height / 2);
        tl.to(
          logo,
          { x: dx, y: dy, scale, duration: flipMs / 1000, ease: "power3.inOut" },
          0
        );
      }

      tl.to(
        [gridRef.current, draftRef.current, photoRef.current, scrimRef.current, cornersRef.current],
        { opacity: 0, duration: restMs / 1000, ease: "power2.inOut" },
        0
      );
      // the logo itself crossfades out right as it lands, timed to match the
      // real navbar's own fade-in duration so the hand-off reads continuous
      tl.to(
        logo,
        { opacity: 0, duration: crossMs / 1000, ease: "power1.out" },
        instant ? flipMs / 1000 : (flipMs - 120) / 1000
      );
    };

    const finish = (instant = false) => {
      if (doneRef.current) return;
      doneRef.current = true;
      clearTimeout(stallTimer);
      video.pause();
      gsap.killTweensOf([gridRef.current, draftRef.current, logoWrapRef.current, photoRef.current, scrimRef.current, cueRef.current]);
      closeToNav(instant);
      // hard fallback — guarantee the site unlocks no matter what
      const maxMs = (instant ? 260 : 700) + (instant ? 220 : 600) + 700;
      setTimeout(complete, maxMs);
    };
    finishRef.current = finish;

    const strokes = draftRef.current?.querySelectorAll<SVGGeometryElement>("[data-draft-line]");
    strokes?.forEach((el) => {
      const len = el.getTotalLength();
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
    });

    const onVideoEnded = () => {
      // blend from the simulation into the finished photograph
      gsap.to(photoRef.current, { opacity: 1, duration: 1.4, ease: "power2.inOut" });
      window.setTimeout(() => finish(false), 1700);
    };
    const onVideoError = () => finish(false);

    const beginPlayback = () => {
      if (startedRef.current || doneRef.current) return;
      startedRef.current = true;
      onStart?.();

      gsap.to(cueRef.current, { opacity: 0, duration: 0.35, ease: "power1.out" });

      const windup = gsap.timeline();
      // 1) blueprint intensifies, drafting marks draw themselves in
      windup.to(gridRef.current, { opacity: 1, duration: WINDUP_MS / 1000 / 2, ease: "power2.out" }, 0);
      const draftLines = draftRef.current?.querySelectorAll<SVGElement>("[data-draft]");
      if (draftLines?.length) {
        windup.to(draftLines, { opacity: 1, duration: 0.55, stagger: 0.045, ease: "power2.out" }, 0.1);
      }
      if (strokes?.length) {
        windup.to(strokes, { strokeDashoffset: 0, duration: 0.75, stagger: 0.06, ease: "power3.out" }, 0.15);
      }
      windup.to(scrimRef.current, { opacity: 1, duration: 0.6, ease: "power2.out" }, WINDUP_MS / 1000 - 0.5);

      // 2) video starts muted underneath, then crossfades in as the
      //    blueprint recedes to a faint frame around the footage
      const p = video.play();
      if (p) p.catch(() => finish(false));
      windup.to(video, { opacity: 1, duration: 0.7, ease: "power2.inOut" }, WINDUP_MS / 1000 - 0.6);
      windup.to(gridRef.current, { opacity: 0.35, duration: 0.7, ease: "power2.inOut" }, WINDUP_MS / 1000 - 0.6);
      windup.to(draftRef.current, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, WINDUP_MS / 1000 - 0.5);

      stallTimer = setTimeout(() => {
        if (video.currentTime < 0.4) finish(false);
      }, STALL_MS);
    };
    startRef.current = beginPlayback;

    video.addEventListener("ended", onVideoEnded);
    video.addEventListener("error", onVideoError);

    const onKey = (e: KeyboardEvent) => {
      if ([" ", "Enter"].includes(e.key)) {
        e.preventDefault();
        beginPlayback();
      }
      if (e.key === "Escape") finish(true);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(stallTimer);
      video.removeEventListener("ended", onVideoEnded);
      video.removeEventListener("error", onVideoError);
      window.removeEventListener("keydown", onKey);
      gsap.killTweensOf([gridRef.current, draftRef.current, logoWrapRef.current, photoRef.current, scrimRef.current, cueRef.current, video]);
      html.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, onComplete, onStart, navLogoRef]);

  // preload quietly whenever the featured project (video) is set/changes —
  // decoupled from the setup effect above so a project swap (the random
  // pick lands a moment after mount) never tears down and rebinds the
  // whole intro, it just kicks off loading the right file.
  useEffect(() => {
    videoRef.current?.load();
  }, [project.video]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[60] overflow-hidden bg-background"
      aria-label="Introduction"
      onClick={() => startRef.current()}
    >
      {/* blueprint presentation sheet */}
      <div className="bp-grid absolute inset-0 opacity-[0.35]" aria-hidden />
      <div
        ref={gridRef}
        className="bp-grid absolute inset-0 opacity-0"
        style={{
          maskImage: "radial-gradient(65% 60% at 50% 50%, black 0%, transparent 88%)",
          WebkitMaskImage: "radial-gradient(65% 60% at 50% 50%, black 0%, transparent 88%)",
        }}
        aria-hidden
      />
      <div ref={cornersRef} aria-hidden>
        <span className="absolute left-5 top-5 h-4 w-4 border-l border-t border-primary/45" />
        <span className="absolute bottom-5 right-5 h-4 w-4 border-b border-r border-primary/45" />
      </div>

      {/* drafting marks — draw in on click, recede once the film takes over */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <DraftingMarks
          ref={draftRef}
          className="h-[68vmin] w-[68vmin] max-h-[560px] max-w-[560px] opacity-0"
        />
      </div>

      {/* construction simulation — muted, silent until clicked, plays once */}
      <video
        ref={videoRef}
        src={project.video}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
        className="absolute inset-0 h-full w-full object-cover opacity-0"
        aria-label={`${project.name} construction simulation`}
      />
      {/* legibility scrim while the film plays */}
      <div
        ref={scrimRef}
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[oklch(0.2_0.04_260)]/45 via-transparent to-[oklch(0.2_0.04_260)]/20 opacity-0"
        aria-hidden
      />
      {/* finished photograph — blends in as the simulation ends */}
      <div ref={photoRef} className="absolute inset-0 opacity-0" aria-hidden>
        <Image src={project.image} alt="" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.2_0.04_260)]/35 to-transparent" />
      </div>

      {/* the logo — perfectly centered, fades in only, never distorted or
          rotated; this exact element FLIPs into the navbar at the close */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          ref={logoWrapRef}
          className="relative opacity-0"
          style={{ animation: "intro-fade 1s ease-out 0.15s forwards" }}
        >
          <Image
            src="/phoenix/images/phoenix_logo.png"
            alt="Phoenix Group"
            width={280}
            height={94}
            className="h-20 w-auto md:h-24"
            priority
          />
        </div>
      </div>

      {/* click-anywhere cue */}
      <div
        ref={cueRef}
        className="pointer-events-none absolute inset-x-0 bottom-14 flex flex-col items-center gap-3 opacity-0"
        style={{ animation: "intro-fade 1s ease-out 0.9s forwards" }}
      >
        <span className="relative flex h-9 w-9 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full border border-primary/50" />
          <span className="absolute inset-2 rounded-full border border-primary/60" />
        </span>
        <span className="tech-label text-muted-foreground">Click anywhere</span>
      </div>

      {/* understated escape hatch — never trap the visitor */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          finishRef.current(true);
        }}
        className="tech-label absolute right-6 top-6 z-10 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
        style={{ animation: "intro-fade 1s ease-out 0.9s forwards", opacity: 0 }}
      >
        Skip
      </button>
    </div>
  );
}
