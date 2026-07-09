"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useReducedMotion } from "motion/react";
import { company } from "@/lib/content";

// One-time cinematic intro (single-scroll variant).
//
// A fixed overlay above the site — never part of the scroll flow.
// 1. Landing: static first frame, headline, branding, scroll cue. Nav hidden.
// 2. First downward scroll (or tap / key / click) starts the video, which
//    plays ONCE at film pace; further scroll input is ignored during playback.
// 3. On end: GSAP closes a white veil and fades the overlay, revealing the
//    site beneath; onComplete hands control to the main website.
//
// Safety: video error, blocked autoplay, or a stalled pipeline all finish
// the intro instead of trapping the user. "Skip intro" is always available.
// Reduced motion skips straight to the site.
//
// Hardening: onComplete (the state flip that unmounts this overlay, reveals
// the navbar and restores scrolling) must never depend solely on a GSAP
// timeline's onComplete callback — if that timeline is ever delayed or
// dropped (backgrounded tab, a slow device, an unrelated GSAP error), the
// site would stay locked forever. A hard fallback timer guarantees
// completion fires regardless. Skip runs the same veil/fade language as a
// natural finish, just compressed, so it reads as instant.
const FINISH_DURATION = { veil: 0.9, gap: 0.15, fade: 0.8 }; // natural end-of-video
const SKIP_DURATION = { veil: 0.22, gap: 0.04, fade: 0.26 }; // "Skip intro"
export function IntroExperience({
  onComplete,
  onStart,
  videoSrc = "/phoenix/videos/hero-scrub.mp4",
}: {
  onComplete: () => void;
  onStart?: () => void;
  videoSrc?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const doneRef = useRef(false); // finish() has been entered (guards re-entry)
  const completedRef = useRef(false); // onComplete has actually fired (guards double-fire)
  const playingRef = useRef(false);
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

    // freeze the page behind the overlay
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    window.scrollTo(0, 0);

    video.load();

    let stallTimer: ReturnType<typeof setTimeout> | undefined;

    // Fires the state hand-off exactly once, however it gets triggered
    // (GSAP's onComplete, or the hard fallback timer below).
    const complete = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      // release the decoder — the overlay is fully hidden by this point
      video.removeAttribute("src");
      video.load();
      onComplete();
    };

    const finish = (instant = false) => {
      if (doneRef.current) return;
      doneRef.current = true;
      clearTimeout(stallTimer);
      video.pause();
      // stop every running intro animation before starting the exit — no
      // stacked/competing tweens on the same targets.
      gsap.killTweensOf([veilRef.current, root, copyRef.current, cueRef.current]);

      const d = instant ? SKIP_DURATION : FINISH_DURATION;
      // GSAP hand-off: veil closes over the final frame, then the whole
      // overlay fades out to reveal the site already in place beneath.
      // Skip runs the identical language, just compressed, so it still
      // reads as a transition rather than a hard cut.
      gsap
        .timeline({ onComplete: complete })
        .to(veilRef.current, { opacity: 1, duration: d.veil, ease: "power2.inOut" })
        .to(root, { opacity: 0, duration: d.fade, ease: "power2.inOut" }, `+=${d.gap}`);

      // Hard fallback: guarantee the site unlocks even if the GSAP timeline
      // above never fires (dropped rAF frames, a backgrounded tab, etc.).
      // Never leave scrolling locked or the overlay intercepting clicks.
      const maxMs = (d.veil + d.gap + d.fade) * 1000 + 600;
      setTimeout(complete, maxMs);
    };
    finishRef.current = finish;

    const startPlayback = () => {
      if (playingRef.current || doneRef.current) return;
      playingRef.current = true;
      onStart?.(); // NOT_STARTED → PLAYING
      // copy and cue retire as the film begins
      gsap.to(copyRef.current, {
        opacity: 0,
        y: -40,
        duration: 1.4,
        ease: "power2.out",
      });
      gsap.to(cueRef.current, { opacity: 0, duration: 0.5, ease: "power1.out" });
      const p = video.play();
      if (p) p.catch(() => finish()); // autoplay refused → enter the site instead
      // stalled media pipeline → don't trap the user
      stallTimer = setTimeout(() => {
        if (video.currentTime < 0.5) finish();
      }, 6000);
    };
    startRef.current = startPlayback;

    const onEnded = () => finish();
    const onError = () => finish();
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);

    // --- input: first downward gesture starts the film; everything else is
    // swallowed so scrolling can't interrupt or skip the playback ---
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) startPlayback();
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (touchY - e.touches[0].clientY > 12) startPlayback();
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
        startPlayback();
      }
      if (e.key === "Escape") finish(true);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(stallTimer);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      gsap.killTweensOf([veilRef.current, root, copyRef.current, cueRef.current]);
      html.style.overflow = prevOverflow;
    };
  }, [reduce, onComplete, onStart]);

  const words = company.tagline.split(" ");

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[60] overflow-hidden bg-[oklch(0.2_0.04_260)]"
      aria-label="Introduction"
      onClick={() => startRef.current()}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        preload="auto"
        muted
        playsInline
        disablePictureInPicture
        controls={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* readability scrim */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[oklch(0.25_0.06_260)]/55 via-[oklch(0.25_0.06_260)]/25 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[oklch(0.25_0.06_260)]/35 to-transparent" />

      {/* branding */}
      <div className="absolute left-6 top-5 z-10">
        <Image
          src="/phoenix/images/phoenix_logo.png"
          alt="Phoenix Group"
          width={120}
          height={40}
          className="h-9 w-auto brightness-0 invert"
          priority
        />
      </div>
      <button
        ref={skipRef}
        onClick={(e) => {
          e.stopPropagation();
          finishRef.current(true);
        }}
        className="tech-label absolute right-6 top-6 z-10 rounded-full border border-white/40 px-4 py-2 text-white/80 transition-colors hover:border-white hover:text-white"
      >
        Skip intro →
      </button>

      {/* first-frame copy */}
      <div ref={copyRef} className="relative z-10 h-full">
        <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-6">
          <p
            className="tech-label text-white/85 opacity-0"
            style={{ animation: "intro-fade 1.2s ease-out 0.7s forwards" }}
          >
            Phoenix Group · Hyderabad · est. 2001
          </p>
          <h1 className="mt-6 max-w-5xl text-5xl font-semibold leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_16px_rgba(10,30,70,0.35)] md:text-7xl lg:text-8xl">
            {words.map((w, i) => (
              <span
                key={i}
                className="mr-[0.26em] inline-block overflow-hidden pb-1 align-top last:mr-0"
              >
                <span
                  className="inline-block translate-y-[110%]"
                  style={{
                    animation: `intro-rise 1.3s cubic-bezier(0.22,1,0.36,1) ${
                      0.9 + i * 0.16
                    }s forwards`,
                  }}
                >
                  {w}
                </span>
              </span>
            ))}
          </h1>
          <p
            className="mt-8 max-w-xl text-lg text-white/90 opacity-0"
            style={{ animation: "intro-fade 1.2s ease-out 2.1s forwards" }}
          >
            {company.intro}
          </p>
        </div>
      </div>

      {/* call to action: first scroll begins the film */}
      <div
        ref={cueRef}
        className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3 opacity-0"
        style={{ animation: "intro-fade 1.2s ease-out 2.6s forwards" }}
      >
        <span className="tech-label text-white/85">
          Scroll to begin the story
        </span>
        <span className="block h-10 w-6 animate-bounce rounded-full border border-white/70 bg-white/10 backdrop-blur-sm">
          <span className="mx-auto mt-2 block h-2 w-px bg-white" />
        </span>
      </div>

      {/* closing veil — morphs the intro into the website */}
      <div
        ref={veilRef}
        className="pointer-events-none absolute inset-0 z-20 bg-background opacity-0"
        aria-hidden
      />
    </div>
  );
}
