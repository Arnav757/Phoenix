"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// Official construction reveal for a project page: the uploaded construction-
// simulation video plays once inside the blueprint frame, then cross-fades to
// the crisp final photograph. Keeps the previous flow (blueprint framing →
// "Constructing…" → "As built") and the same easing language as the site.
// Reduced motion / video error → the final photo is shown immediately.
export function ConstructionReveal({
  video,
  image,
  name,
}: {
  video: string;
  image: string;
  name: string;
}) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [built, setBuilt] = useState(false);

  useEffect(() => {
    if (reduce) {
      setBuilt(true);
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    const done = () => setBuilt(true);
    v.addEventListener("ended", done);
    v.addEventListener("error", done);
    const p = v.play();
    if (p) p.catch(done); // autoplay blocked → settle straight to the photo
    // safety: if the pipeline stalls, don't hang on the video forever
    const stall = setTimeout(() => {
      if (v.currentTime < 0.4) done();
    }, 6000);
    return () => {
      clearTimeout(stall);
      v.removeEventListener("ended", done);
      v.removeEventListener("error", done);
    };
  }, [reduce]);

  return (
    <div className="sheet-corners relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-card">
      <div className="bp-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />

      {/* construction simulation — muted, plays once, no controls */}
      {!reduce && (
        <video
          ref={videoRef}
          src={video}
          poster={image}
          muted
          playsInline
          preload="metadata"
          disablePictureInPicture
          controls={false}
          className="absolute inset-0 h-full w-full object-cover"
          aria-label={`${name} construction simulation`}
        />
      )}

      {/* final photograph develops over the simulation's last frame */}
      <AnimatePresence>
        {built && (
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, clipPath: "inset(100% 0 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
            transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={image}
              alt={name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* status readout — same treatment as before */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3">
        <span
          className={`block h-2 w-2 rounded-full ${
            built ? "bg-primary" : "animate-pulse bg-primary/70"
          }`}
          aria-hidden
        />
        <span className="tech-label rounded-full border border-border bg-background/80 px-3 py-1.5 text-primary backdrop-blur-sm">
          {built ? "As built" : "Constructing…"}
        </span>
      </div>
    </div>
  );
}
