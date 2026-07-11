"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// ARCHITECTURAL PHOENIX — TEMPORARY DEVELOPMENT ANIMATION.
//
// Original abstract Phoenix silhouette drafted as a parametric steel-and-
// glass structure, not a realistic or fantasy bird. A curved spine anchors
// a fan of wing ribs; chord lines close the silhouette; thin triangular
// glass panels fill selected bays between ribs; a small chevron reads as
// the head. Everything is drawn from --primary (Phoenix blue) at varied
// opacities, so the palette follows the brand guidelines automatically.
//
// This whole component is a swappable slot in the intro's timeline: it
// takes `active` and calls `onComplete` when the sequence finishes.
// Replacing it later with a Lottie file, transparent WebM, PNG sequence
// or Three.js scene means implementing the same two-prop interface —
// nothing about the surrounding intro/nav/state code has to change.
//
// Choreography (~5s total, matches the brief's Scenes 02-05):
//   0.0-1.4s   Scene 02 — spine curve strokes in, then upper wing ribs
//              stagger-draw from the wing's root outward, followed by
//              lower wing ribs, tail ribs and the head chevron.
//   1.4-2.4s   Scene 03 — chord lines close the silhouette; glass panels
//              fade in between adjacent ribs.
//   2.4-3.6s   Scene 04 — a very slow, restrained wing spread: upper and
//              lower wing groups rotate a few degrees outward from the
//              body while the whole silhouette scales up ~2%.
//   3.6-4.9s   Scene 05 — glass panels fade, ribs reverse-draw (fade in
//              order of appearance) and small blueprint particles drift
//              outward from rib tips, dispersing.
export interface IntroSceneProps {
  /** flip to true to start the sequence — false means don't animate */
  active: boolean;
  /** fired once the sequence finishes (Scene 05 dispersal complete) */
  onComplete: () => void;
  className?: string;
}

const VB_W = 600;
const VB_H = 400;

// --- Geometry ---------------------------------------------------------
// Coordinates are hand-tuned to read as a bird silhouette while staying
// deliberately schematic. Every geometry piece lives in these arrays so
// the choreography below can address them declaratively.

// Central spine — tail on the left, head on the right, gently curved.
const SPINE_D = "M 108 235 C 210 240 340 200 486 182";

// Upper-wing ribs (8) — each is a Bézier from a point on the spine
// arcing up to a point on the wing's leading edge.
const UPPER_RIBS: string[] = [
  "M 208 208 C 220 170 232 138 250 130",
  "M 226 210 C 246 156 274 108 298 100",
  "M 246 212 C 274 148 316 92 348 84",
  "M 268 212 C 302 138 358 76 396 72",
  "M 290 210 C 328 128 386 68 432 66",
  "M 314 206 C 354 118 410 62 470 60",
  "M 340 200 C 380 108 442 60 504 60",
  "M 366 194 C 402 100 470 58 520 58",
];

// Lower-wing ribs (4) — a smaller sweep beneath the body.
const LOWER_RIBS: string[] = [
  "M 252 224 C 236 258 214 282 200 296",
  "M 274 220 C 268 262 258 296 250 312",
  "M 296 216 C 300 264 302 302 306 320",
  "M 318 212 C 334 262 350 302 366 324",
];

// Tail ribs (3) — converging back-left of the body.
const TAIL_RIBS: string[] = [
  "M 118 232 C 92 240 72 246 54 252",
  "M 118 236 C 92 258 76 268 60 274",
  "M 116 240 C 96 274 84 286 70 292",
];

// Wing chord lines (leading edge above, trailing edge back)
const UPPER_CHORD = "M 208 208 C 300 96 420 56 520 58";
const UPPER_TRAILING = "M 250 130 C 300 108 380 78 468 70";
const LOWER_CHORD = "M 252 224 C 296 306 340 322 366 324";

// Head chevron
const HEAD = "M 486 176 L 518 172 L 486 190 Z";

// Glass panels — thin triangles between selected adjacent upper ribs.
// Each polygon is (rib N tip) → (rib N+1 tip) → (rib N+1 origin on spine)
// hand-picked from the ribs above.
const GLASS_PANELS: string[] = [
  "250,130 298,100 226,210",
  "298,100 348,84 246,212",
  "348,84 396,72 268,212",
  "396,72 432,66 290,210",
  "432,66 470,60 314,206",
  "470,60 504,60 340,200",
];

// Small circles at rib tips — become the drifting blueprint particles
// in Scene 05. Positions match the outermost point of every rib above.
const RIB_TIPS: Array<[number, number]> = [
  [250, 130],
  [298, 100],
  [348, 84],
  [396, 72],
  [432, 66],
  [470, 60],
  [504, 60],
  [520, 58],
  [200, 296],
  [250, 312],
  [306, 320],
  [366, 324],
  [54, 252],
  [60, 274],
  [70, 292],
];

// ----------------------------------------------------------------------

export function ArchitecturalPhoenix({ active, onComplete, className }: IntroSceneProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const upperWingRef = useRef<SVGGElement>(null);
  const lowerWingRef = useRef<SVGGElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const startedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active || startedRef.current) return;
    const svg = svgRef.current;
    if (!svg) return;
    startedRef.current = true;

    // set every stroke-path up for stroke-dashoffset drawing
    const strokes = Array.from(
      svg.querySelectorAll<SVGGeometryElement>("[data-phx-stroke]")
    );
    strokes.forEach((el) => {
      const len = el.getTotalLength();
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
    });
    const panels = svg.querySelectorAll<SVGPolygonElement>("[data-phx-panel]");
    gsap.set(panels, { opacity: 0 });
    const particles = svg.querySelectorAll<SVGCircleElement>("[data-phx-particle]");
    gsap.set(particles, { opacity: 0, x: 0, y: 0 });

    const spine = svg.querySelector<SVGPathElement>("[data-phx-spine]");
    const upperRibs = svg.querySelectorAll<SVGPathElement>("[data-phx-upper-rib]");
    const lowerRibs = svg.querySelectorAll<SVGPathElement>("[data-phx-lower-rib]");
    const tailRibs = svg.querySelectorAll<SVGPathElement>("[data-phx-tail-rib]");
    const chords = svg.querySelectorAll<SVGPathElement>("[data-phx-chord]");
    const head = svg.querySelector<SVGPathElement>("[data-phx-head]");

    const tl = gsap.timeline({
      onComplete: () => onCompleteRef.current?.(),
    });

    // Scene 02 — the drafting lines assemble the bird's outline.
    tl.to(spine, { strokeDashoffset: 0, duration: 0.55, ease: "power2.out" }, 0);
    tl.to(
      upperRibs,
      { strokeDashoffset: 0, duration: 0.7, stagger: 0.055, ease: "power2.out" },
      0.25
    );
    tl.to(
      lowerRibs,
      { strokeDashoffset: 0, duration: 0.65, stagger: 0.06, ease: "power2.out" },
      0.7
    );
    tl.to(
      tailRibs,
      { strokeDashoffset: 0, duration: 0.55, stagger: 0.05, ease: "power2.out" },
      1.0
    );
    tl.to(head, { strokeDashoffset: 0, duration: 0.45, ease: "power2.out" }, 1.15);

    // Scene 03 — chord lines close the silhouette, then glass panels fill.
    tl.to(
      chords,
      { strokeDashoffset: 0, duration: 0.8, stagger: 0.09, ease: "power2.out" },
      1.4
    );
    tl.to(
      panels,
      { opacity: 0.18, duration: 0.55, stagger: 0.06, ease: "power2.out" },
      1.9
    );

    // Scene 04 — very slow, restrained wing spread. Upper and lower
    // wing groups rotate a few degrees outward around the body's
    // anchor point; the whole silhouette scales up ~2%.
    tl.to(
      upperWingRef.current,
      { rotation: -2.5, transformOrigin: "270px 210px", duration: 1.1, ease: "power2.inOut" },
      2.5
    );
    tl.to(
      lowerWingRef.current,
      { rotation: 1.6, transformOrigin: "290px 220px", duration: 1.1, ease: "power2.inOut" },
      2.5
    );
    tl.to(
      bodyRef.current,
      { scale: 1.02, transformOrigin: "300px 200px", duration: 1.1, ease: "power2.inOut" },
      2.5
    );

    // Scene 05 — dissolve. Panels fade first, then ribs fade in the same
    // order they arrived; blueprint particles drift outward from rib tips.
    tl.to(panels, { opacity: 0, duration: 0.5, stagger: 0.025, ease: "power1.in" }, 3.6);
    tl.to(
      particles,
      {
        opacity: (i) => (0.65 - (i % 5) * 0.06),
        x: (i) => Math.cos(i * 0.7) * 40,
        y: (i) => Math.sin(i * 0.9) * 40 - 10,
        duration: 0.9,
        stagger: 0.02,
        ease: "power2.out",
      },
      3.7
    );
    tl.to(
      [...upperRibs, ...lowerRibs, ...tailRibs, spine, head, ...chords].filter(Boolean),
      { opacity: 0, duration: 0.55, stagger: 0.02, ease: "power1.inOut" },
      4.0
    );
    tl.to(
      particles,
      {
        opacity: 0,
        x: (i) => Math.cos(i * 0.7) * 90,
        y: (i) => Math.sin(i * 0.9) * 90 - 20,
        duration: 0.8,
        stagger: 0.02,
        ease: "power2.in",
      },
      4.4
    );

    return () => {
      tl.kill();
    };
  }, [active]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className={className}
      fill="none"
      aria-hidden
    >
      <g ref={bodyRef}>
        {/* spine */}
        <path
          data-phx-stroke
          data-phx-spine
          d={SPINE_D}
          stroke="var(--primary)"
          strokeOpacity="0.55"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* upper wing group — rotates in Scene 04 */}
        <g ref={upperWingRef}>
          {UPPER_RIBS.map((d, i) => (
            <path
              key={`u${i}`}
              data-phx-stroke
              data-phx-upper-rib
              d={d}
              stroke="var(--primary)"
              strokeOpacity="0.62"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          ))}
          <path
            data-phx-stroke
            data-phx-chord
            d={UPPER_CHORD}
            stroke="var(--primary)"
            strokeOpacity="0.7"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            data-phx-stroke
            data-phx-chord
            d={UPPER_TRAILING}
            stroke="var(--primary)"
            strokeOpacity="0.4"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="3 4"
          />
          {GLASS_PANELS.map((pts, i) => (
            <polygon
              key={`g${i}`}
              data-phx-panel
              points={pts}
              fill="var(--primary)"
              stroke="var(--primary)"
              strokeOpacity="0.25"
              strokeWidth="0.6"
            />
          ))}
        </g>

        {/* lower wing group — rotates opposite direction in Scene 04 */}
        <g ref={lowerWingRef}>
          {LOWER_RIBS.map((d, i) => (
            <path
              key={`l${i}`}
              data-phx-stroke
              data-phx-lower-rib
              d={d}
              stroke="var(--primary)"
              strokeOpacity="0.55"
              strokeWidth="1"
              strokeLinecap="round"
            />
          ))}
          <path
            data-phx-stroke
            data-phx-chord
            d={LOWER_CHORD}
            stroke="var(--primary)"
            strokeOpacity="0.5"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </g>

        {/* tail ribs — anchored to the body, no rotation */}
        {TAIL_RIBS.map((d, i) => (
          <path
            key={`t${i}`}
            data-phx-stroke
            data-phx-tail-rib
            d={d}
            stroke="var(--primary)"
            strokeOpacity="0.45"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        ))}

        {/* head chevron */}
        <path
          data-phx-stroke
          data-phx-head
          d={HEAD}
          stroke="var(--primary)"
          strokeOpacity="0.7"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* rib-tip particles — invisible until Scene 05 dispersal */}
        {RIB_TIPS.map(([cx, cy], i) => (
          <circle
            key={`p${i}`}
            data-phx-particle
            cx={cx}
            cy={cy}
            r={1.6}
            fill="var(--primary)"
          />
        ))}
      </g>
    </svg>
  );
}
