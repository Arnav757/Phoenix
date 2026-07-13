"use client";

import { useEffect, useRef } from "react";
import type { IntroSceneProps } from "./architectural-phoenix";

// HeroVideo — implements the IntroSceneProps interface (see
// architectural-phoenix.tsx). Currently the intro's chosen animation:
// a stitched three-shot cinematic that opens on a wireframe framework,
// resolves into a tower, then reveals the Phoenix silhouette in the sky.
//
// Preloads on mount so the moment `active` flips to true, playback starts
// immediately with no buffering delay. Fires onComplete when the video
// ends (or errors, or stalls) — never leaves the intro trapped.
//
// Muted + playsInline so autoplay is allowed on every mobile and desktop
// browser. No controls. Aspect: 1280×720 — displayed via object-cover, so
// the visible frame crops to fill whatever aspect the viewport is.
const STALL_MS = 6000;

export function HeroVideo({
  active,
  onComplete,
  className,
  src = "/phoenix/videos/hero-opening.mp4",
}: IntroSceneProps & { src?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // preload the file as soon as the component mounts, well before playback
  useEffect(() => {
    videoRef.current?.load();
  }, []);

  useEffect(() => {
    if (!active || startedRef.current) return;
    const v = videoRef.current;
    if (!v) return;
    startedRef.current = true;

    const done = () => onCompleteRef.current?.();
    v.addEventListener("ended", done, { once: true });
    v.addEventListener("error", done, { once: true });

    // stall safety — if the pipeline never gets going, don't trap the visitor
    const stall = setTimeout(() => {
      if (v.currentTime < 0.3) done();
    }, STALL_MS);

    const p = v.play();
    if (p) p.catch(done);

    return () => {
      clearTimeout(stall);
      v.removeEventListener("ended", done);
      v.removeEventListener("error", done);
    };
  }, [active]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      controls={false}
      className={className}
      aria-hidden
    />
  );
}
