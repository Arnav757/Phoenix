"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useReducedMotion } from "motion/react";
import { DraftingMarks } from "./drafting-marks";
import { HeroVideo } from "./intro-scenes/hero-video";

// Cinematic homepage entry — an architectural presentation unveiling itself,
// not a loading screen. A fixed overlay above the site, never part of the
// scroll flow:
//
// 1. ENTRY: minimal — blueprint background, a large centered Phoenix logo,
//    faint static drafting marks, a quiet "click anywhere" cue. No nav, no
//    autoplay, no copy. The visitor is standing in front of the drawing.
// 2. On click (or Enter/Space): drafting marks (guide lines, dimension
//    ticks, coordinate/survey points, construction circles) draw themselves
//    in over ~1.6s while the logo holds perfectly still at center. (Scene 01)
// 3. The <IntroScene/> slot runs its own sequence — currently the abstract
//    architectural Phoenix bird (Scenes 02-05). This slot is a swappable
//    component: replace it later with a Lottie file, transparent WebM, PNG
//    sequence or Three.js scene by implementing the same {active, onComplete}
//    interface (see intro-scenes/architectural-phoenix.tsx). Nothing else
//    about the intro/nav/state code has to change.
// 4. The logo — never recolored, distorted, rotated or morphed, only ever
//    translated/uniformly scaled — animates from its large centered position
//    into its exact home in the navigation bar (measured live from the real
//    navbar element), while the rest of the overlay dissolves. (Scene 06)
// 5. The navbar fades in at the same position the intro logo just vacated;
//    the homepage is fully interactive.
//
// Hardening (carried over from earlier iterations): completion never
// depends solely on a GSAP callback — a hard fallback timer guarantees the
// site can never stay locked. Reduced motion skips straight to the site.
// "Skip" is always available, understated.
const WINDUP_MS = 1600; // Scene 01 — drafting marks draw themselves in

export function IntroExperience({
  onComplete,
  onStart,
  navLogoRef,
}: {
  onComplete: () => void;
  onStart?: () => void;
  /** the real navbar logo's wrapper — the intro reads its live rect for the hand-off */
  navLogoRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const reduce = useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef<SVGSVGElement>(null);
  const birdWrapRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<HTMLDivElement>(null);

  const doneRef = useRef(false);
  const completedRef = useRef(false);
  const startedRef = useRef(false);
  const finishRef = useRef<(instant?: boolean) => void>(() => {});
  const startRef = useRef<() => void>(() => {});

  // false until the user clicks — this is what tells the bird scene to
  // start its own timeline. Kept as React state (not just a ref) so the
  // scene component's `active` prop re-renders it correctly.
  const [sceneActive, setSceneActive] = useState(false);

  useEffect(() => {
    if (reduce) {
      if (!doneRef.current) {
        doneRef.current = true;
        onComplete();
      }
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    window.scrollTo(0, 0);

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
        [gridRef.current, draftRef.current, birdWrapRef.current, cornersRef.current],
        { opacity: 0, duration: restMs / 1000, ease: "power2.inOut" },
        0
      );
      tl.to(
        logo,
        { opacity: 0, duration: crossMs / 1000, ease: "power1.out" },
        instant ? flipMs / 1000 : (flipMs - 120) / 1000
      );
    };

    const complete = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      onComplete();
    };

    const finish = (instant = false) => {
      if (doneRef.current) return;
      doneRef.current = true;
      gsap.killTweensOf([gridRef.current, draftRef.current, birdWrapRef.current, logoWrapRef.current, cueRef.current]);
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

    const beginPlayback = () => {
      if (startedRef.current || doneRef.current) return;
      startedRef.current = true;
      onStart?.();

      gsap.to(cueRef.current, { opacity: 0, duration: 0.35, ease: "power1.out" });
      // Logo fades out as the drawing takes over — the bird is Scene 02-05's
      // subject on its own; the logo reappears in Scene 05 as the bird
      // dissolves back into it, so the two never share the frame.
      // Clear the entry CSS animation first — its `forwards` fill-mode pins
      // opacity at 1 and would otherwise win over GSAP's inline tween.
      if (logoWrapRef.current) logoWrapRef.current.style.animation = "none";
      gsap.to(logoWrapRef.current, { opacity: 0, duration: 0.55, ease: "power1.inOut" });

      // Scene 01 — blueprint intensifies, drafting marks stroke-draw in.
      const windup = gsap.timeline();
      windup.to(gridRef.current, { opacity: 1, duration: WINDUP_MS / 1000 / 2, ease: "power2.out" }, 0);
      const draftLines = draftRef.current?.querySelectorAll<SVGElement>("[data-draft]");
      if (draftLines?.length) {
        windup.to(draftLines, { opacity: 1, duration: 0.55, stagger: 0.045, ease: "power2.out" }, 0.1);
      }
      if (strokes?.length) {
        windup.to(strokes, { strokeDashoffset: 0, duration: 0.75, stagger: 0.06, ease: "power3.out" }, 0.15);
      }

      // Kick off Scenes 02-05 — the scene component owns its own timing.
      windup.call(() => setSceneActive(true), undefined, WINDUP_MS / 1000 - 0.15);

      // As the bird takes over, the drafting overlay recedes to a faint
      // frame so the two scenes read as one continuous drawing.
      // Drafting marks fade fully as the video takes over — the video's
      // own blueprint-style opening would double up visually otherwise.
      windup.to(draftRef.current, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, WINDUP_MS / 1000 - 0.2);
    };
    startRef.current = beginPlayback;

    const onKey = (e: KeyboardEvent) => {
      if ([" ", "Enter"].includes(e.key)) {
        e.preventDefault();
        beginPlayback();
      }
      if (e.key === "Escape") finish(true);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      gsap.killTweensOf([gridRef.current, draftRef.current, birdWrapRef.current, logoWrapRef.current, cueRef.current]);
      html.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, onComplete, onStart, navLogoRef]);

  // Scene 05 handoff — once the bird sequence has finished dispersing, the
  // logo has already been sitting behind it at low opacity, so we brighten
  // it, then FLIP it into the navbar (Scene 06 = the same closeToNav path).
  const handleSceneComplete = () => {
    if (doneRef.current) return;
    gsap.to(logoWrapRef.current, { opacity: 1, duration: 0.6, ease: "power2.out" });
    // hold at peak for a beat, then hand off to the navbar
    window.setTimeout(() => finishRef.current(false), 600);
  };

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

      {/* Scene 01 — drafting marks. Draw in when the visitor clicks, then
          recede to a faint frame as the bird scene takes over. */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <DraftingMarks
          ref={draftRef}
          className="h-[68vmin] w-[68vmin] max-h-[560px] max-w-[560px] opacity-0"
        />
      </div>

      {/* Scenes 02-05 — the swappable animation slot. Currently a stitched
          three-shot cinematic (hero-opening.mp4). Any component that
          implements IntroSceneProps ({active, onComplete}) drops in here
          without touching intro/nav/state code. */}
      <div
        ref={birdWrapRef}
        className="pointer-events-none absolute inset-0"
      >
        <HeroVideo
          active={sceneActive}
          onComplete={handleSceneComplete}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Logo — perfectly centered, fades in with the entry screen; sits
          behind the bird at full opacity while Scene 05 dissolves the bird,
          then FLIPs into the navbar for Scene 06. */}
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
