"use client";

import React, { useEffect, useRef, useState, type HTMLAttributes } from "react";

// Adapted circular gallery — turned from a scroll-hijack ring into a slow
// architectural turntable so it doesn't fight the site's normal scroll.
// The original hijacked window scroll on a 500vh container; here it just
// auto-rotates when in view and respects prefers-reduced-motion by pausing.

const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(" ");

export interface GalleryItem {
  /** Small mono kicker, e.g. "IGBC" */
  kicker?: string;
  /** Certification / award name — becomes the tile heading */
  title: string;
  /** Issuing authority / awarding body */
  authority: string;
  /** Optional validity or year note */
  meta?: string;
  /** Optional image URL — if omitted, the tile renders as a drafting card */
  image?: string;
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  /** Ring radius in px. Auto-shrinks on narrow viewports. */
  radius?: number;
  /** Auto-rotate degrees per frame. 0 disables. */
  autoRotateSpeed?: number;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  function CircularGallery(
    { items, className, radius = 460, autoRotateSpeed = 0.05, ...props },
    ref
  ) {
    const [rotation, setRotation] = useState(0);
    const [paused, setPaused] = useState(false);
    const [effectiveRadius, setEffectiveRadius] = useState(radius);
    const [prefersReduced, setPrefersReduced] = useState(false);
    const animationFrameRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Reduced-motion opt-in and responsive radius.
    useEffect(() => {
      const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
      const setRM = () => setPrefersReduced(rm.matches);
      setRM();
      rm.addEventListener("change", setRM);

      const sizeToViewport = () => {
        const w = window.innerWidth;
        if (w < 640) setEffectiveRadius(Math.min(radius, 220));
        else if (w < 1024) setEffectiveRadius(Math.min(radius, 340));
        else setEffectiveRadius(radius);
      };
      sizeToViewport();
      window.addEventListener("resize", sizeToViewport);
      return () => {
        rm.removeEventListener("change", setRM);
        window.removeEventListener("resize", sizeToViewport);
      };
    }, [radius]);

    // Pause when the gallery scrolls out of view so we don't burn cycles.
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => setPaused(!entries[0]?.isIntersecting),
        { rootMargin: "80px" }
      );
      io.observe(el);
      return () => io.disconnect();
    }, []);

    // Auto-rotation loop.
    useEffect(() => {
      if (prefersReduced || paused || autoRotateSpeed === 0) return;
      const tick = () => {
        setRotation((r) => r + autoRotateSpeed);
        animationFrameRef.current = requestAnimationFrame(tick);
      };
      animationFrameRef.current = requestAnimationFrame(tick);
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }, [autoRotateSpeed, paused, prefersReduced]);

    const anglePerItem = 360 / Math.max(items.length, 1);

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.RefObject<HTMLDivElement | null>).current = node;
        }}
        role="region"
        aria-label="Certifications carousel"
        className={cn(
          "relative flex h-[500px] w-full items-center justify-center overflow-hidden md:h-[560px]",
          className
        )}
        style={{ perspective: "2000px" }}
        {...props}
      >
        <div
          className="relative h-full w-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: "preserve-3d",
            transition: prefersReduced ? "transform 0.6s ease-out" : undefined,
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const relative = ((itemAngle + rotation) % 360 + 360) % 360;
            const normalized = Math.abs(relative > 180 ? 360 - relative : relative);
            const opacity = Math.max(0.28, 1 - normalized / 180);

            return (
              <article
                key={`${item.title}-${i}`}
                role="group"
                aria-label={item.title}
                className="sheet-corners absolute h-[280px] w-[230px] overflow-hidden rounded-sm border border-border bg-card/80 backdrop-blur-sm md:h-[320px] md:w-[260px]"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${effectiveRadius}px)`,
                  left: "50%",
                  top: "50%",
                  marginLeft: "-130px",
                  marginTop: "-160px",
                  opacity,
                  transition: "opacity 0.3s linear",
                }}
              >
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-60"
                    aria-hidden
                  />
                ) : (
                  <div
                    className="bp-grid absolute inset-0 opacity-40"
                    aria-hidden
                  />
                )}
                <div className="relative flex h-full flex-col justify-end p-5">
                  {item.kicker ? (
                    <span className="tech-label text-primary">{item.kicker}</span>
                  ) : null}
                  <h3 className="mt-2 text-lg font-semibold leading-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {item.authority}
                  </p>
                  {item.meta ? (
                    <p className="tech-label mt-3 text-muted-foreground/70">
                      {item.meta}
                    </p>
                  ) : null}
                </div>
                {/* corner rules to keep the drafting-sheet language */}
                <span
                  className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-primary/50"
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-primary/50"
                  aria-hidden
                />
              </article>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = "CircularGallery";

export { CircularGallery };
