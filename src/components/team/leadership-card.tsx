"use client";

import { useCallback, useRef } from "react";
import { UserRound } from "lucide-react";
import { useReducedMotion } from "motion/react";
import type { TeamMember } from "@/lib/team";

// Leadership card — tilt-on-hover portrait card with a cursor-follow
// spotlight. Interaction pattern (rAF-throttled direct ref.style mutation
// on pointermove, no React state) mirrors the cursor-parallax already used
// in partners-page-client.tsx, rather than introducing a new technique.
// Colors are brand tokens only — blue for the active seat, cream/yellow for
// the emeritus seat (a "present vs. heritage" distinction using only the
// existing secondary palette, no new hex values).
export function LeadershipCard({
  member,
  variant,
}: {
  member: TeamMember;
  variant: "active" | "emeritus";
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  const gradient =
    variant === "active"
      ? "linear-gradient(160deg, var(--primary), var(--brand-sky))"
      : "linear-gradient(160deg, var(--brand-yellow), var(--brand-cream))";
  const accentClass = variant === "active" ? "text-primary" : "text-foreground";
  const dividerColor = variant === "active" ? "var(--primary)" : "var(--brand-yellow)";
  const badgeLabel = variant === "active" ? "Active" : "Emeritus";

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduceMotion) return;
      const card = cardRef.current;
      const inner = innerRef.current;
      const spotlight = spotlightRef.current;
      if (!card || !inner) return;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotateX = (0.5 - py) * 10;
        const rotateY = (px - 0.5) * 10;

        inner.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        if (spotlight) {
          spotlight.style.setProperty("--x", `${px * 100}%`);
          spotlight.style.setProperty("--y", `${py * 100}%`);
          spotlight.style.opacity = "1";
        }
      });
    },
    [reduceMotion]
  );

  const onLeave = useCallback(() => {
    if (innerRef.current) {
      innerRef.current.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
    }
    if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
  }, []);

  return (
    <div
      ref={cardRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ perspective: "1200px" }}
      className="relative"
    >
      <div
        ref={innerRef}
        className="relative rounded-lg overflow-hidden border border-border bg-card shadow-[0_2px_14px_rgba(15,40,90,0.08)] transition-transform duration-500 ease-out"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* portrait area — photo sourced from phoenixindia.net when
            available; falls back to a brand-gradient placeholder otherwise */}
        <div
          className="relative overflow-hidden"
          style={{ background: gradient, height: "clamp(240px, 28vw, 280px)" }}
        >
          <div
            ref={spotlightRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300"
            style={{
              background:
                "radial-gradient(280px circle at var(--x, 50%) var(--y, 50%), rgb(255 255 255 / 0.25), rgb(255 255 255 / 0.05) 40%, transparent 70%)",
            }}
          />
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-primary-foreground">
              <UserRound className="size-10 opacity-70" strokeWidth={1.5} aria-hidden />
              <span className="tech-label opacity-80">Photo pending</span>
            </div>
          )}
          <span
            className={`tech-label absolute top-4 right-4 z-10 rounded-full border border-border bg-card/90 px-3 py-1 backdrop-blur-sm ${accentClass}`}
          >
            {badgeLabel}
          </span>
        </div>

        {/* content panel */}
        <div className="relative px-6 py-5">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">{member.name}</h3>
          <p className={`tech-label mt-1 ${accentClass}`}>{member.role}</p>

          <div
            className="my-3 h-px w-full"
            style={{ background: `linear-gradient(90deg, transparent, ${dividerColor}, transparent)` }}
            aria-hidden
          />

          <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
        </div>
      </div>
    </div>
  );
}
