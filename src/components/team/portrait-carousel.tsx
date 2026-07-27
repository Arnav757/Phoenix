"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { UserRound } from "lucide-react";
import type { TeamMember } from "@/lib/team";

const ROTATE_MS = 8000;

// Editorial full-bleed portrait carousel. No cards, no modal — clicking
// "View Leadership Story" keeps the portrait exactly as it is (still the
// visual anchor) while a glass panel slides in beside it with a sequenced
// reveal (name → designation → divider → quote → biography), and
// Previous/Next live inside the panel so browsing never closes it. Only
// opacity/transform/filter are animated (GPU-friendly, 60fps); Framer
// Motion's `layout` prop handles the reflow via transforms rather than
// tweening width/height.
//
// Visual/backdrop styling (glass, halo, grid) is applied inline rather than
// via custom CSS classes or Tailwind arbitrary values — this project has a
// reproducible cascade bug where those silently fail to apply; inline
// styles always win. Only @keyframes (unaffected) live in globals.css.
export function PortraitCarousel({ members }: { members: TeamMember[] }) {
  const count = members.length;
  const [index, setIndex] = useState(0);
  const [bioOpen, setBioOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);
  const reduceMotion = useReducedMotion();
  const regionRef = useRef<HTMLDivElement>(null);

  const rafRef = useRef<number | null>(null);
  const lastTRef = useRef<number | null>(null);
  const accRef = useRef(0);

  const wrap = useCallback((i: number) => ((i % count) + count) % count, [count]);

  const goTo = useCallback(
    (i: number) => {
      setIndex(wrap(i));
      accRef.current = 0;
      setProgress(0);
      setPulseKey((k) => k + 1);
    },
    [wrap]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Auto-rotate + progress fill. Paused on hover or while the biography panel is open.
  useEffect(() => {
    if (reduceMotion || count <= 1) return;
    const paused = hovering || bioOpen;

    const tick = (t: number) => {
      const last = lastTRef.current ?? t;
      const dt = t - last;
      lastTRef.current = t;
      if (!paused) {
        accRef.current += dt;
        setProgress(Math.min(1, accRef.current / ROTATE_MS));
        if (accRef.current >= ROTATE_MS) {
          accRef.current = 0;
          setPulseKey((k) => k + 1);
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
  }, [hovering, bioOpen, reduceMotion, count, wrap]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "Enter" || e.key === " ") {
        if (!bioOpen) {
          e.preventDefault();
          setBioOpen(true);
        }
      } else if (e.key === "Escape") {
        setBioOpen(false);
      }
    },
    [prev, next, bioOpen]
  );

  if (count === 0) return null;

  const active = members[index];
  const leftMember = members[wrap(index - 1)];
  const rightMember = members[wrap(index + 1)];
  const hasBio = active.bio.trim().length > 0;

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Leadership"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="relative outline-none"
      style={{ minHeight: "78vh" }}
    >
      {/* backdrop: slow radial drift + faint architectural lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          opacity: 0.035,
          backgroundImage:
            "linear-gradient(rgb(0 120 243 / 0.5) 1px, transparent 1px), linear-gradient(90deg, rgb(0 120 243 / 0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          animation: reduceMotion ? undefined : "portrait-bg-drift 60s linear infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          opacity: 0.04,
          background: "radial-gradient(50% 40% at 50% 40%, rgb(0 120 243 / 0.5), transparent 70%)",
          animation: reduceMotion ? undefined : "portrait-glow-drift 22s ease-in-out infinite",
        }}
      />

      {/* brief blueprint wireframe pulse on transition */}
      {!reduceMotion && (
        <motion.svg
          key={pulseKey}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10"
          width="640"
          height="640"
          viewBox="0 0 640 640"
          style={{ transform: "translate(-50%, -50%)", animation: "wireframe-pulse 0.9s ease-out forwards" }}
        >
          <circle cx="320" cy="320" r="200" fill="none" stroke="var(--primary)" strokeWidth="0.75" opacity="0.5" />
          <circle cx="320" cy="320" r="260" fill="none" stroke="var(--primary)" strokeWidth="0.5" opacity="0.35" />
          <line x1="320" y1="20" x2="320" y2="620" stroke="var(--primary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="20" y1="320" x2="620" y2="320" stroke="var(--primary)" strokeWidth="0.5" opacity="0.3" />
        </motion.svg>
      )}

      <motion.div
        layout
        className="flex flex-col items-center justify-center gap-8 md:flex-row md:items-stretch md:gap-10"
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {!bioOpen && <SidePortrait member={leftMember} onSelect={prev} side="left" />}

        <motion.div
          layout
          className="relative flex flex-col items-center"
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "min(80vw, 380px)" }}
        >
          {/* soft Phoenix-blue halo behind the portrait — retained while open */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[30%] -z-10"
            style={{
              width: "120%",
              height: "70%",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(closest-side, rgb(0 120 243 / 0.16), transparent 75%)",
              filter: "blur(4px)",
            }}
          />

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={active.id}
              initial={reduceMotion ? false : { opacity: 0, x: 40, scale: 0.96, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -40, scale: 0.96, filter: "blur(6px)" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex w-full flex-col items-center"
            >
              <div className="relative" style={{ height: "62vh", minHeight: 360, maxHeight: 620, width: "100%" }}>
                {active.photoCutout ? (
                  <img
                    src={active.photoCutout}
                    alt={active.name}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "bottom",
                      animation: reduceMotion
                        ? undefined
                        : "portrait-zoom 9s cubic-bezier(0.22,1,0.36,1) forwards, portrait-float 6s ease-in-out infinite alternate 2s",
                    }}
                  />
                ) : (
                  <PlaceholderSilhouette large />
                )}
                {/* grounding shadow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute bottom-2 left-1/2"
                  style={{
                    width: "55%",
                    height: 22,
                    transform: "translateX(-50%)",
                    background: "radial-gradient(closest-side, rgb(15 40 90 / 0.22), transparent 75%)",
                  }}
                />
              </div>

              {/* name/role/quote/CTA under the portrait — hidden once the
                  panel takes over showing this same information */}
              <AnimatePresence>
                {!bioOpen && (
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="mt-6 text-center"
                  >
                    <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                      {active.name}
                    </h3>
                    <p className="tech-label mt-1.5 text-primary">{active.role}</p>

                    {active.quote && (
                      <p className="mx-auto mt-4 max-w-sm text-[15px] italic leading-relaxed text-muted-foreground">
                        “{active.quote}”
                      </p>
                    )}

                    {hasBio ? (
                      <button
                        type="button"
                        onClick={() => setBioOpen(true)}
                        aria-expanded={false}
                        className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
                      >
                        View Leadership Story
                        <span
                          aria-hidden
                          className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
                        >
                          →
                        </span>
                      </button>
                    ) : (
                      <p className="tech-label mt-5 text-muted-foreground/60">Biography pending</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {!bioOpen && <SidePortrait member={rightMember} onSelect={next} side="right" />}

        <AnimatePresence mode="wait">
          {bioOpen && (
            <BiographyPanel
              key={active.id}
              member={active}
              onCollapse={() => setBioOpen(false)}
              onPrev={prev}
              onNext={next}
              reduceMotion={!!reduceMotion}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* progress indicator — hidden while the panel has focus */}
      {count > 1 && !reduceMotion && !bioOpen && (
        <div
          className="mx-auto mt-10 overflow-hidden rounded-full bg-border"
          style={{ height: 2, width: 160 }}
          aria-hidden
        >
          <div className="h-full rounded-full bg-primary" style={{ width: `${progress * 100}%` }} />
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {active.name}, {active.role}
        {bioOpen ? " — biography expanded" : ""}
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Side portrait — dimmed, scaled down, blurred, click to bring to center
// -----------------------------------------------------------------------------

function SidePortrait({
  member,
  side,
  onSelect,
}: {
  member: TeamMember;
  side: "left" | "right";
  onSelect: () => void;
}) {
  return (
    <motion.button
      layout
      type="button"
      onClick={onSelect}
      aria-label={`Show ${member.name}`}
      className="hidden shrink-0 md:block"
      initial={false}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        width: "min(22vw, 220px)",
        height: "min(50vh, 340px)",
        position: "relative",
        opacity: 0.4,
        transform: `scale(0.9) translateX(${side === "left" ? "10%" : "-10%"})`,
        filter: "blur(1.5px)",
        transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1), filter 0.7s ease",
      }}
      onFocus={(e) => {
        e.currentTarget.style.opacity = "0.7";
        e.currentTarget.style.filter = "blur(0px)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.opacity = "0.4";
        e.currentTarget.style.filter = "blur(1.5px)";
      }}
    >
      {member.photoCutout ? (
        <img
          src={member.photoCutout}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "bottom",
          }}
        />
      ) : (
        <PlaceholderSilhouette />
      )}
    </motion.button>
  );
}

// Elegant "no photo yet" silhouette — abstract line-art, no boxed text.
function PlaceholderSilhouette({ large }: { large?: boolean }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-end gap-3 pb-6 text-muted-foreground/40"
      aria-hidden
    >
      <UserRound size={large ? 96 : 56} strokeWidth={0.75} />
      {large && (
        <div className="text-center">
          <p className="tech-label opacity-70">Leadership Profile</p>
          <p className="tech-label mt-0.5 opacity-40">Portrait coming soon</p>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Biography panel — floating glass, grows from the layout rather than
// popping over it. Sequenced reveal: name → designation → divider → quote →
// biography, ~80ms cadence, ~800ms total. Prev/Next re-key this component so
// the same reveal replays for each director without leaving the panel.
// -----------------------------------------------------------------------------

function BiographyPanel({
  member,
  onCollapse,
  onPrev,
  onNext,
  reduceMotion,
}: {
  member: TeamMember;
  onCollapse: () => void;
  onPrev: () => void;
  onNext: () => void;
  reduceMotion: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape collapses; focus moves into the panel when it mounts so keyboard
  // users land somewhere meaningful rather than losing their place.
  useEffect(() => {
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCollapse();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCollapse]);

  const stagger = {
    hidden: { opacity: 0, y: 12 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.15 + i * 0.09, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  return (
    <motion.div
      ref={panelRef}
      layout
      tabIndex={-1}
      role="region"
      aria-label={`${member.name} biography`}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 48, scale: 0.97, filter: "blur(4px)" }}
      animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 24, scale: 0.98, filter: "blur(3px)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full outline-none"
      style={{
        maxWidth: 560,
        borderRadius: 26,
        background: "rgb(255 255 255 / 0.6)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        border: "1px solid rgb(255 255 255 / 0.7)",
        boxShadow: "0 24px 70px rgb(15 40 90 / 0.12), inset 0 1px 0 0 rgb(255 255 255 / 0.6)",
        padding: "2.5rem",
      }}
    >
      <motion.p custom={0} variants={stagger} initial="hidden" animate="show" className="tech-label text-primary">
        {member.role}
      </motion.p>
      <motion.h3
        custom={1}
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mt-2 text-3xl font-semibold tracking-tight text-foreground"
      >
        {member.name}
      </motion.h3>

      <motion.div
        custom={2}
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mt-6 h-px bg-primary/40"
        style={{ transformOrigin: "left" }}
        aria-hidden
      />

      {member.quote && (
        <motion.blockquote
          custom={3}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mt-6 border-l-2 pl-4 text-[17px] italic leading-relaxed text-muted-foreground"
          style={{ borderColor: "var(--primary)", maxWidth: 480 }}
        >
          “{member.quote}”
        </motion.blockquote>
      )}

      <motion.div custom={4} variants={stagger} initial="hidden" animate="show" className="mt-6">
        {member.bio.trim() ? (
          <p
            className="text-muted-foreground"
            style={{ maxWidth: 500, fontSize: 18, lineHeight: 1.75 }}
          >
            {member.bio}
          </p>
        ) : (
          <p className="tech-label text-muted-foreground/60">Biography pending client confirmation.</p>
        )}
      </motion.div>

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onPrev}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            ← Previous Director
          </button>
          <button
            type="button"
            onClick={onNext}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Next Director →
          </button>
        </div>
        <button
          type="button"
          onClick={onCollapse}
          aria-expanded={true}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          Collapse Biography
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5"
          >
            ↑
          </span>
        </button>
      </div>
    </motion.div>
  );
}
