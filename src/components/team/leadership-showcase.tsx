"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { TeamMember } from "@/lib/team";

const ROTATE_MS = 8000;
const TILT_MAX_DEG = 4;

// Applied inline rather than via a CSS class — a cascade quirk in this
// project intermittently drops custom classes/arbitrary Tailwind values
// (also seen with h-72/h-80 on leadership-card.tsx); inline styles always
// win regardless.
const GLASS_STYLE: React.CSSProperties = {
  background: "rgb(255 255 255 / 0.55)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgb(255 255 255 / 0.7)",
  boxShadow: "0 20px 60px rgb(15 40 90 / 0.10), inset 0 1px 0 0 rgb(255 255 255 / 0.6)",
};

// Center Stage Leadership Showcase — one fully-featured active card flanked
// by dimmed, blurred prev/next cards. Auto-rotates on an 8s cycle with a
// fill-progress indicator; pauses on hover or while a bio is expanded.
// Clicking a side card brings it to center; clicking the center card
// expands its biography. Keyboard: ←/→ to navigate, Enter/Space to
// expand/collapse the active card. All transform/opacity driven (GPU
// friendly), skips 3D tilt + auto-rotate under prefers-reduced-motion.
export function LeadershipShowcase({ members }: { members: TeamMember[] }) {
  const count = members.length;
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();

  const rafRef = useRef<number | null>(null);
  const lastTRef = useRef<number | null>(null);
  const accRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const wrap = useCallback((i: number) => ((i % count) + count) % count, [count]);

  const goTo = useCallback((i: number) => {
    setIndex((cur) => wrap(i));
    setExpanded(false);
    accRef.current = 0;
    setProgress(0);
  }, [wrap]);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Auto-rotate + progress fill. Paused while hovering or the active bio is
  // expanded ("no distracting movement" while someone's reading).
  useEffect(() => {
    if (reduceMotion || count <= 1) return;
    const paused = hovering || expanded;

    const tick = (t: number) => {
      const last = lastTRef.current ?? t;
      const dt = t - last;
      lastTRef.current = t;
      if (!paused) {
        accRef.current += dt;
        setProgress(Math.min(1, accRef.current / ROTATE_MS));
        if (accRef.current >= ROTATE_MS) {
          accRef.current = 0;
          setIndex((cur) => wrap(cur + 1));
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      lastTRef.current = null;
    };
  }, [hovering, expanded, reduceMotion, count, wrap]);

  // Keyboard nav on the showcase container.
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setExpanded((v) => !v);
      }
    },
    [prev, next]
  );

  if (count === 0) return null;

  const activeMember = members[index];
  const prevMember = members[wrap(index - 1)];
  const nextMember = members[wrap(index + 1)];

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Leadership showcase"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="relative outline-none"
    >
      {/* faint drifting backdrop — architectural, never distracting */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          opacity: 0.04,
          backgroundImage:
            "linear-gradient(rgb(0 120 243 / 0.5) 1px, transparent 1px), linear-gradient(90deg, rgb(0 120 243 / 0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          animation: reduceMotion ? undefined : "showcase-drift 40s linear infinite",
        }}
        aria-hidden
      />

      <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
        <SideCard member={prevMember} side="left" onSelect={prev} />

        <AnimatePresence mode="popLayout" initial={false}>
          <ActiveCard
            key={activeMember.id}
            member={activeMember}
            expanded={expanded}
            onToggleExpand={() => setExpanded((v) => !v)}
            reduceMotion={!!reduceMotion}
          />
        </AnimatePresence>

        <SideCard member={nextMember} side="right" onSelect={next} />
      </div>

      {/* progress indicator */}
      {count > 1 && !reduceMotion && (
        <div
          className="mx-auto mt-8 w-40 overflow-hidden rounded-full bg-border"
          style={{ height: "2px" }}
          aria-hidden
        >
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${progress * 100}%`, transition: hovering || expanded ? "none" : undefined }}
          />
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {activeMember.name}, {activeMember.role}
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Side card — dimmed, scaled down, slightly rotated, no bio, click to select
// -----------------------------------------------------------------------------

function SideCard({
  member,
  side,
  onSelect,
}: {
  member: TeamMember;
  side: "left" | "right";
  onSelect: () => void;
}) {
  const rotate = side === "left" ? 6 : -6;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Show ${member.name}`}
      className="hidden shrink-0 cursor-pointer md:block"
      style={{
        width: "clamp(140px, 14vw, 200px)",
        transform: `scale(0.8) rotateY(${rotate}deg)`,
        opacity: 0.4,
        filter: "blur(2px)",
        transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease, filter 0.6s ease",
        transformStyle: "preserve-3d",
      }}
      onFocus={(e) => {
        e.currentTarget.style.opacity = "0.65";
        e.currentTarget.style.filter = "blur(0px)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.opacity = "0.4";
        e.currentTarget.style.filter = "blur(2px)";
      }}
    >
      <PortraitTile member={member} />
    </button>
  );
}

// -----------------------------------------------------------------------------
// Active card — full detail, tilt-on-hover, sequenced content reveal
// -----------------------------------------------------------------------------

function ActiveCard({
  member,
  expanded,
  onToggleExpand,
  reduceMotion,
}: {
  member: TeamMember;
  expanded: boolean;
  onToggleExpand: () => void;
  reduceMotion: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const hasBio = member.bio.trim().length > 0;

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduceMotion) return;
      const card = cardRef.current;
      const inner = innerRef.current;
      if (!card || !inner) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotateX = (0.5 - py) * TILT_MAX_DEG;
        const rotateY = (px - 0.5) * TILT_MAX_DEG;
        inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    },
    [reduceMotion]
  );

  const onLeave = useCallback(() => {
    if (innerRef.current) innerRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
  }, []);

  const stagger = {
    hidden: { opacity: 0, y: 10 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.12 + i * 0.09, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.94, filter: "blur(6px)", rotateY: -8 }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)", rotateY: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.94, filter: "blur(6px)", rotateY: 8 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: "1200px", width: "min(88vw, 420px)" }}
      className="relative z-10 shrink-0"
    >
      <div
        ref={innerRef}
        className="relative overflow-hidden transition-transform duration-300 ease-out"
        style={{ ...GLASS_STYLE, borderRadius: 24, transformStyle: "preserve-3d" }}
      >
        {/* portrait — ~60% of card, radial light + vignette, slow zoom while active */}
        <div className="relative overflow-hidden" style={{ height: "clamp(280px, 30vw, 320px)" }}>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 20%, rgb(0 120 243 / 0.10), transparent 60%), linear-gradient(180deg, var(--muted), var(--secondary))",
            }}
            aria-hidden
          />
          {member.photo ? (
            <img
              key={member.id}
              src={member.photo}
              alt={member.name}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
                animation: reduceMotion ? undefined : "showcase-zoom 7s cubic-bezier(0.22,1,0.36,1) forwards",
              }}
            />
          ) : (
            <PlaceholderPortrait />
          )}
          {/* vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 55%, rgb(255 255 255 / 0.9) 96%), radial-gradient(120% 80% at 50% 100%, transparent 55%, rgb(15 40 90 / 0.10) 100%)",
            }}
            aria-hidden
          />
          <motion.span
            custom={0}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="tech-label absolute left-5 top-5 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-primary backdrop-blur-sm"
          >
            Active
          </motion.span>
        </div>

        {/* content */}
        <div className="relative -mt-8 rounded-t-[20px] bg-transparent px-7 pb-7 pt-2">
          <motion.h3
            custom={1}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground"
          >
            {member.name}
          </motion.h3>
          <motion.p
            custom={2}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="tech-label mt-1.5 text-primary"
          >
            {member.role}
          </motion.p>

          <motion.div
            custom={3}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="my-4 h-px w-12 bg-primary/50"
            aria-hidden
          />

          {member.quote && (
            <motion.p
              custom={4}
              variants={stagger}
              initial="hidden"
              animate="show"
              className="text-[15px] italic leading-relaxed text-muted-foreground"
            >
              “{member.quote}”
            </motion.p>
          )}

          {hasBio ? (
            <motion.div custom={5} variants={stagger} initial="hidden" animate="show" className="mt-4">
              <button
                type="button"
                onClick={onToggleExpand}
                aria-expanded={expanded}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors"
              >
                {expanded ? "Collapse" : "Read Biography"}
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                  style={{ display: "inline-block" }}
                >
                  {expanded ? "↑" : "→"}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-3 overflow-hidden text-sm leading-relaxed text-muted-foreground"
                  >
                    {member.bio}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.p
              custom={5}
              variants={stagger}
              initial="hidden"
              animate="show"
              className="tech-label mt-4 text-muted-foreground/60"
            >
              Biography pending
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// Portrait tile — shared by side cards
// -----------------------------------------------------------------------------

function PortraitTile({ member }: { member: TeamMember }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ ...GLASS_STYLE, borderRadius: 20, aspectRatio: "3 / 4" }}
    >
      {member.photo ? (
        <img
          src={member.photo}
          alt={member.name}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      ) : (
        <PlaceholderPortrait compact />
      )}
    </div>
  );
}

// Elegant "no photo yet" placeholder — abstract silhouette, no shouting text.
function PlaceholderPortrait({ compact }: { compact?: boolean }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground/50"
      style={{ background: "linear-gradient(180deg, var(--muted), var(--secondary))" }}
    >
      <svg
        width={compact ? 40 : 56}
        height={compact ? 40 : 56}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={0.9}
        aria-hidden
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </svg>
      {!compact && (
        <div className="text-center">
          <p className="tech-label opacity-80">Leadership Profile</p>
          <p className="tech-label mt-0.5 opacity-50">Portrait coming soon</p>
        </div>
      )}
    </div>
  );
}
