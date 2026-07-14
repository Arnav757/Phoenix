"use client";

// Coverflow Carousel — adapted from an Originkit Framer component for the
// Phoenix site (plain React/Next, motion/react instead of framer-motion, no
// Framer canvas plumbing). The active item is a large landscape card centered
// in the stage; every other item is a thin flat slat, positioned by its
// wrapped relative offset from the active index so stepping is always a
// single-slat move and the loop is seamless.

import * as React from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import type { TeamMember } from "@/lib/team";

type Sizing = {
  restWidth: number;
  restHeight: number;
  activeWidth: number;
  activeHeight: number;
};

const RENDER_RANGE = 6; // max slats each side

// Brand-palette gradients (Phoenix secondary colors) — stand in for a photo
// until one is supplied for a given director.
const GRADIENTS = [
  "linear-gradient(160deg, var(--primary), var(--brand-sky))",
  "linear-gradient(160deg, var(--brand-sky), var(--brand-cream))",
  "linear-gradient(160deg, var(--brand-yellow), var(--brand-cream))",
  "linear-gradient(160deg, var(--brand-green), var(--brand-sky))",
  "linear-gradient(160deg, var(--brand-purple), var(--primary))",
  "linear-gradient(160deg, var(--eng-red), var(--brand-yellow))",
];

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

// Card `index`'s signed distance from centre at carousel position `pos`,
// wrapped into (-count/2, count/2]. The wrap discontinuity sits at the seam,
// where opacity is already 0, so the teleport is invisible and the loop is
// seamless and infinite.
function relOf(index: number, pos: number, count: number): number {
  let rel = (((index - pos) % count) + count) % count;
  if (rel > count / 2) rel -= count;
  return rel;
}

// Horizontal offset (px) from centre for a given signed distance `rel`.
function xForRel(rel: number, s: Sizing, gap: number): number {
  const ar = Math.abs(rel);
  const c1 = s.activeWidth / 2 + gap + s.restWidth / 2;
  const pitch = s.restWidth + gap;
  const mag = ar <= 1 ? ar * c1 : c1 + (ar - 1) * pitch;
  return (rel < 0 ? -1 : 1) * mag;
}

// 0 at centre (fully active size) → 1 once a full slot away (rest/slat size).
function blendForRel(rel: number): number {
  return Math.min(Math.abs(rel), 1);
}

// -----------------------------------------------------------------------------
// Card
// -----------------------------------------------------------------------------

function Card({
  member,
  index,
  pos,
  count,
  R,
  sizing,
  gap,
  radius,
  gradient,
  onSelect,
}: {
  member: TeamMember;
  index: number;
  pos: MotionValue<number>;
  count: number;
  R: number;
  sizing: Sizing;
  gap: number;
  radius: number;
  gradient: string;
  onSelect: ((index: number) => void) | undefined;
}) {
  const x = useTransform(pos, (p: number) => xForRel(relOf(index, p, count), sizing, gap));
  const opacity = useTransform(pos, (p: number) => {
    const ar = Math.abs(relOf(index, p, count));
    return ar <= R ? 1 : ar >= R + 1 ? 0 : 1 - (ar - R);
  });
  const zIndex = useTransform(pos, (p: number) =>
    Math.round(1000 - Math.abs(relOf(index, p, count)) * 100)
  );
  const width = useTransform(pos, (p: number) => {
    const a = blendForRel(relOf(index, p, count));
    return sizing.activeWidth + (sizing.restWidth - sizing.activeWidth) * a;
  });
  const height = useTransform(pos, (p: number) => {
    const a = blendForRel(relOf(index, p, count));
    return sizing.activeHeight + (sizing.restHeight - sizing.activeHeight) * a;
  });
  const borderRadius = useTransform(pos, (p: number) => {
    const a = blendForRel(relOf(index, p, count));
    const w = sizing.activeWidth + (sizing.restWidth - sizing.activeWidth) * a;
    const h = sizing.activeHeight + (sizing.restHeight - sizing.activeHeight) * a;
    return (Math.max(0, Math.min(20, radius)) / 20) * (Math.min(w, h) / 2);
  });
  const boxShadow = useTransform(pos, (p: number) =>
    Math.abs(relOf(index, p, count)) < 0.5
      ? "0 24px 60px rgb(15 40 90 / 0.20), inset 0 0 0 1px rgb(255 255 255 / 0.15)"
      : "0 12px 32px rgb(15 40 90 / 0.14), inset 0 0 0 1px rgb(255 255 255 / 0.1)"
  );

  return (
    <motion.div
      onClick={onSelect ? () => onSelect(index) : undefined}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        x,
        zIndex,
        opacity,
        cursor: onSelect ? "pointer" : "default",
      }}
    >
      <motion.div
        style={{
          x: "-50%",
          y: "-50%",
          width,
          height,
          borderRadius,
          overflow: "hidden",
          background: gradient,
          boxShadow,
        }}
      >
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              color: "var(--primary-foreground)",
              textAlign: "center",
              padding: 12,
            }}
          >
            <span className="tech-label" style={{ opacity: 0.85 }}>
              Photo pending
            </span>
            <span style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2 }}>
              {member.name}
            </span>
          </div>
        )}
      </motion.div>
      {/* caption — name + role beneath the card, visible at any slot size */}
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 10px)",
          left: "50%",
          transform: "translateX(-50%)",
          width: "max-content",
          maxWidth: 220,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <p className="text-sm font-medium text-foreground" style={{ margin: 0 }}>
          {member.name}
        </p>
        <p className="tech-label text-primary" style={{ margin: "2px 0 0" }}>
          {member.role}
        </p>
      </div>
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// ArrowButton
// -----------------------------------------------------------------------------

function ArrowButton({
  side,
  onClick,
  size,
}: {
  side: "left" | "right";
  onClick: () => void;
  size: number;
}) {
  const isLeft = side === "left";
  return (
    <button
      type="button"
      aria-label={isLeft ? "Previous director" : "Next director"}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        position: "absolute",
        top: "50%",
        [isLeft ? "left" : "right"]: 0,
        transform: "translateY(-50%)",
        width: size,
        height: size,
        borderRadius: "50%",
        border: "none",
        background: "var(--primary)",
        color: "var(--primary-foreground)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        padding: 0,
        zIndex: 2000,
        boxShadow: "0 6px 18px rgb(0 120 243 / 0.35)",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <svg
        width={size * 0.4}
        height={size * 0.4}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pointerEvents: "none" }}
      >
        {isLeft ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </button>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CoverflowCarousel({
  members,
  activeWidth = 460,
  activeHeight = 320,
  restWidth = 150,
  restHeight = 200,
  gap = 24,
  radius = 3,
  showArrows = true,
  arrowSize = 48,
  autoplay = true,
  autoplayDirection = "rightToLeft",
  moveDuration = 0.5,
  dwell = 2.4,
}: {
  members: TeamMember[];
  activeWidth?: number;
  activeHeight?: number;
  restWidth?: number;
  restHeight?: number;
  gap?: number;
  radius?: number;
  showArrows?: boolean;
  arrowSize?: number;
  autoplay?: boolean;
  autoplayDirection?: "leftToRight" | "rightToLeft";
  moveDuration?: number;
  dwell?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const count = Math.max(1, members.length);

  const sizing: Sizing = useMemo(
    () => ({ restWidth, restHeight, activeWidth, activeHeight }),
    [restWidth, restHeight, activeWidth, activeHeight]
  );

  // Keep the loop seam OUT of the visible window: cards fade to 0 before the
  // ±count/2 wrap point, so the teleport is never seen — infinite + seamless.
  const R = Math.max(1, Math.min(RENDER_RANGE, Math.floor(count / 2) - 1));

  // ---- Single rAF driver -------------------------------------------------
  const pos = useMotionValue(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTRef = useRef<number | null>(null);
  const autoplayingRef = useRef(false);
  const dirRef = useRef(1);
  const dwellAccRef = useRef(0);
  const moveDurRef = useRef(moveDuration);
  moveDurRef.current = moveDuration;
  const dwellRef = useRef(dwell);
  dwellRef.current = dwell;
  const reducedRef = useRef(prefersReducedMotion);
  reducedRef.current = prefersReducedMotion;

  const tick = useCallback(
    (t: number) => {
      const last = lastTRef.current ?? t;
      const dt = Math.min((t - last) / 1000, 1 / 30);
      lastTRef.current = t;

      const cur = pos.get();
      const diff = targetRef.current - cur;
      const dur = Math.max(0.08, moveDurRef.current);
      const step = (1 / dur) * dt;
      const arriving = reducedRef.current || Math.abs(diff) <= step;

      if (arriving) {
        pos.set(targetRef.current);
        if (autoplayingRef.current) {
          dwellAccRef.current += dt;
          if (dwellAccRef.current >= Math.max(0, dwellRef.current)) {
            dwellAccRef.current = 0;
            targetRef.current += dirRef.current;
          }
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        rafRef.current = null;
        lastTRef.current = null;
        return;
      }

      pos.set(cur + Math.sign(diff) * step);
      rafRef.current = requestAnimationFrame(tick);
    },
    [pos]
  );

  const ensureRunning = useCallback(() => {
    if (rafRef.current == null) {
      lastTRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  const goNext = useCallback(() => {
    targetRef.current += 1;
    ensureRunning();
  }, [ensureRunning]);
  const goPrev = useCallback(() => {
    targetRef.current -= 1;
    ensureRunning();
  }, [ensureRunning]);
  const goTo = useCallback(
    (index: number) => {
      const cur = targetRef.current;
      let d = index - cur;
      d = ((d % count) + count) % count;
      if (d > count / 2) d -= count;
      targetRef.current = cur + d;
      ensureRunning();
    },
    [ensureRunning, count]
  );

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  useEffect(() => {
    const on = autoplay && count > 1;
    autoplayingRef.current = on;
    if (on) {
      dirRef.current = autoplayDirection === "leftToRight" ? -1 : 1;
      dwellAccRef.current = 0;
      ensureRunning();
    }
    return () => {
      autoplayingRef.current = false;
    };
  }, [autoplay, autoplayDirection, count, ensureRunning]);

  const isHoveredRef = useRef(false);
  useEffect(() => {
    if (autoplay) return;
    const onKey = (e: KeyboardEvent) => {
      if (!isHoveredRef.current) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [autoplay, goPrev, goNext]);

  const selectable = !autoplay;
  const cards = members.map((member, i) => (
    <Card
      key={member.id}
      member={member}
      index={i}
      pos={pos}
      count={count}
      R={R}
      sizing={sizing}
      gap={gap}
      radius={radius}
      gradient={GRADIENTS[i % GRADIENTS.length]}
      onSelect={selectable ? goTo : undefined}
    />
  ));

  return (
    <div
      tabIndex={0}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      onFocus={() => {
        isHoveredRef.current = true;
      }}
      onBlur={() => {
        isHoveredRef.current = false;
      }}
      style={{
        position: "relative",
        width: "100%",
        height: activeHeight + 60,
        minHeight: 240,
        overflow: "hidden",
        userSelect: "none",
        touchAction: "pan-y",
        outline: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          isolation: "isolate",
          zIndex: 0,
        }}
      >
        {cards}
      </div>
      {showArrows && count > 1 && (
        <>
          <ArrowButton side="left" onClick={goPrev} size={arrowSize} />
          <ArrowButton side="right" onClick={goNext} size={arrowSize} />
        </>
      )}
    </div>
  );
}
