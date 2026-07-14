"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";

// Site-wide smooth scroll. Wraps native scroll (position: sticky, anchor
// links and scroll-to-element still work), driven by its own rAF loop.
// Skipped entirely under prefers-reduced-motion, matching every other
// motion primitive on this site (see reveal.tsx, page-transition.tsx).
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      anchors: true,
    });

    let raf = 0;
    function loop(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduce]);

  return <>{children}</>;
}
