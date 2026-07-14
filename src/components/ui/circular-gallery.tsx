"use client";

import React, { useEffect, useRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Define the type for a single gallery item. `photo.url` is optional —
// items without one render a brand-gradient placeholder instead of a
// broken image (used for real people whose photo hasn't been supplied yet).
export interface GalleryItem {
  common: string;
  binomial: string;
  photo: {
    url?: string;
    text: string;
    pos?: string;
    by?: string;
  };
}

// Brand-palette gradients — reused as the placeholder tile when an item has
// no photo (Phoenix secondary colors, same set used elsewhere on the site).
const GRADIENTS = [
  "linear-gradient(160deg, var(--primary), var(--brand-sky))",
  "linear-gradient(160deg, var(--brand-sky), var(--brand-cream))",
  "linear-gradient(160deg, var(--brand-yellow), var(--brand-cream))",
  "linear-gradient(160deg, var(--brand-green), var(--brand-sky))",
  "linear-gradient(160deg, var(--brand-purple), var(--primary))",
  "linear-gradient(160deg, var(--eng-red), var(--brand-yellow))",
];

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  /** Controls how far the items are from the center. */
  radius?: number;
  /** Degrees per second of continuous auto-rotation. */
  autoRotateSpeed?: number;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 600, autoRotateSpeed = 28, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const rotationRef = useRef(0);
    const rafRef = useRef<number | null>(null);
    const lastTRef = useRef<number | null>(null);
    const hoveredRef = useRef(false);
    const reducedRef = useRef(false);

    // Continuous, time-delta-driven auto-rotation — frame-rate independent
    // (so speed is consistent regardless of display refresh rate), paused on
    // hover so a visitor can actually read a card, and skipped entirely
    // under prefers-reduced-motion, matching every other motion primitive on
    // this site (see reveal.tsx, page-transition.tsx).
    useEffect(() => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      reducedRef.current = mq.matches;
      const onChange = (e: MediaQueryListEvent) => (reducedRef.current = e.matches);
      mq.addEventListener("change", onChange);

      const anglePerItem = 360 / items.length;

      const applyTransforms = () => {
        const rotation = rotationRef.current;
        if (stageRef.current) {
          stageRef.current.style.transform = `rotateY(${rotation}deg)`;
        }
        cardRefs.current.forEach((el, i) => {
          if (!el) return;
          const itemAngle = i * anglePerItem;
          const relativeAngle = (itemAngle + (rotation % 360) + 360) % 360;
          const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
          const opacity = Math.max(0.3, 1 - normalizedAngle / 180);
          el.style.opacity = String(opacity);
        });
      };

      const tick = (t: number) => {
        const last = lastTRef.current ?? t;
        const dt = Math.min((t - last) / 1000, 1 / 30);
        lastTRef.current = t;

        if (!hoveredRef.current && !reducedRef.current) {
          rotationRef.current += autoRotateSpeed * dt;
          applyTransforms();
        }
        rafRef.current = requestAnimationFrame(tick);
      };

      applyTransforms();
      rafRef.current = requestAnimationFrame(tick);

      return () => {
        mq.removeEventListener("change", onChange);
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      };
    }, [items.length, autoRotateSpeed]);

    const anglePerItem = 360 / items.length;

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        role="region"
        aria-label="Circular gallery"
        className={cn("relative w-full h-full flex items-center justify-center", className)}
        style={{ perspective: "2000px" }}
        onMouseEnter={() => (hoveredRef.current = true)}
        onMouseLeave={() => (hoveredRef.current = false)}
        onFocus={() => (hoveredRef.current = true)}
        onBlur={() => (hoveredRef.current = false)}
        {...props}
      >
        <div ref={stageRef} className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            return (
              <div
                key={`${i}-${item.common}`}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                role="group"
                tabIndex={0}
                aria-label={item.common}
                className="absolute w-[240px] h-[320px]"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: "50%",
                  top: "50%",
                  marginLeft: "-120px",
                  marginTop: "-160px",
                  transition: "opacity 0.3s linear",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div className="relative w-full h-full rounded-lg shadow-2xl overflow-hidden border border-border bg-card/70 backdrop-blur-lg">
                  {item.photo.url ? (
                    <img
                      src={item.photo.url}
                      alt={item.photo.text}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ objectPosition: item.photo.pos || "center" }}
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center"
                      style={{
                        background: GRADIENTS[i % GRADIENTS.length],
                        color: "var(--primary-foreground)",
                      }}
                    >
                      <span className="tech-label" style={{ opacity: 0.85 }}>
                        Photo pending
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <h2 className="text-lg font-semibold">{item.common}</h2>
                    <p className="tech-label mt-1 opacity-85">{item.binomial}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = "CircularGallery";

export { CircularGallery };
