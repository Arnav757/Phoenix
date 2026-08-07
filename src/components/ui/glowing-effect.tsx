"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { animate } from "motion/react";

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}
const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = "default",
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = true,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current) return;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          const { left, top, width, height } = element.getBoundingClientRect();
          const mouseX = e?.x ?? lastPosition.current.x;
          const mouseY = e?.y ?? lastPosition.current.y;

          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY };
          }

          const center = [left + width * 0.5, top + height * 0.5];
          const distanceFromCenter = Math.hypot(
            mouseX - center[0],
            mouseY - center[1]
          );
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

          // Opacity is set as a real inline style on a real DOM node here
          // (not via a Tailwind arbitrary-value/property class reading a
          // --active custom property on the ::after pseudo-element) —
          // confirmed the class-based approach silently fails to apply in
          // this project's build regardless of syntax. A small floor keeps
          // the glow perceptible at rest instead of purely hover-gated.
          const setOpacity = (active: boolean) => {
            if (glowRef.current) {
              glowRef.current.style.opacity = active ? "1" : "0.12";
            }
          };

          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty("--active", "0");
            setOpacity(false);
            return;
          }

          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity;

          element.style.setProperty("--active", isActive ? "1" : "0");
          setOpacity(isActive);

          if (!isActive) return;

          const currentAngle =
            parseFloat(element.style.getPropertyValue("--start")) || 0;
          let targetAngle =
            (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
              Math.PI +
            90;

          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
          const newAngle = currentAngle + angleDiff;

          animate(currentAngle, newAngle, {
            duration: movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
              element.style.setProperty("--start", String(value));
            },
          });
        });
      },
      [inactiveZone, proximity, movementDuration]
    );

    // Every instance of this component (there are 5-10+ per index/grid
    // page) independently listened to window scroll + document pointermove
    // unconditionally, each doing a getBoundingClientRect() (forced
    // synchronous layout) per event regardless of whether it was anywhere
    // near the viewport — on pages with many cards (e.g. the 10-card
    // Completed Projects grid) that's many forced layouts on every single
    // scroll tick, which reads as scroll lag/jank. Gate both listeners
    // behind an IntersectionObserver so only cards actually on/near
    // screen do any work; off-screen ones stay fully idle.
    const isNearViewportRef = useRef(false);

    useEffect(() => {
      if (disabled || !containerRef.current) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          isNearViewportRef.current = entry.isIntersecting;
        },
        { rootMargin: "200px" }
      );
      observer.observe(containerRef.current);

      return () => observer.disconnect();
    }, [disabled]);

    // Lenis (this site's smooth-scroll) keeps firing native "scroll"
    // events on nearly every animation frame for over a second after each
    // scroll gesture as it eases to a stop — so even gated to near-
    // viewport cards, this was still doing a layout read up to ~60
    // times/sec per visible card while a scroll settles. The glow's
    // proximity effect doesn't need that precision; throttling it to
    // ~12/sec is imperceptible here but cuts the work by ~5x.
    const lastScrollUpdateRef = useRef(0);
    const SCROLL_THROTTLE_MS = 80;

    useEffect(() => {
      if (disabled) return;

      const handleScroll = () => {
        if (!isNearViewportRef.current) return;
        const now = performance.now();
        if (now - lastScrollUpdateRef.current < SCROLL_THROTTLE_MS) return;
        lastScrollUpdateRef.current = now;
        handleMove();
      };
      const handlePointerMove = (e: PointerEvent) => {
        if (isNearViewportRef.current) handleMove(e);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      document.body.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener("scroll", handleScroll);
        document.body.removeEventListener("pointermove", handlePointerMove);
      };
    }, [handleMove, disabled]);

    return (
      <>
        <div
          className={cn(
            "pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity",
            glow && "opacity-100",
            variant === "white" && "border-white",
            disabled && "!block"
          )}
        />
        <div
          ref={containerRef}
          style={
            {
              "--blur": `${blur}px`,
              "--spread": spread,
              "--start": "0",
              "--active": "0",
              "--glowingeffect-border-width": `${borderWidth}px`,
              "--repeating-conic-gradient-times": "5",
              // Brand guideline: Phoenix blue only, no secondary palette —
              // a solid-color glow rather than the multi-hue Aceternity
              // default, so it reads as "Phoenix" and nothing else.
              "--gradient":
                variant === "white"
                  ? `repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  var(--black),
                  var(--black) calc(25% / var(--repeating-conic-gradient-times))
                )`
                  : `radial-gradient(circle, #0078f3 10%, #0078f300 20%),
                repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  #0078f3 0%,
                  #3d94f5 calc(25% / var(--repeating-conic-gradient-times)),
                  #0078f3 calc(50% / var(--repeating-conic-gradient-times)),
                  #0059bf calc(75% / var(--repeating-conic-gradient-times)),
                  #0078f3 calc(100% / var(--repeating-conic-gradient-times))
                )`,
            } as React.CSSProperties
          }
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",
            glow && "opacity-100",
            blur > 0 && "blur-[var(--blur)] ",
            className,
            disabled && "!hidden"
          )}
        >
          <div
            ref={glowRef}
            // Opacity here is a real inline style (see setOpacity in
            // handleMove above), not a Tailwind class reading --active —
            // every class-based attempt (opacity-[var(--active)] shorthand,
            // the equivalent [opacity:...] arbitrary-property form, even a
            // plain .glow::after rule in globals.css) silently failed to
            // apply in this project's build. Setting opacity on this real
            // parent node also dims its ::after pseudo-element with it.
            style={{ opacity: 0.12, transition: "opacity 300ms ease" }}
            className={cn(
              "glow",
              "rounded-[inherit]",
              'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
              "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
              "after:[background:var(--gradient)] after:[background-attachment:fixed]",
              "after:[mask-clip:padding-box,border-box]",
              "after:[mask-composite:intersect]",
              "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"
            )}
          />
        </div>
      </>
    );
  }
);

GlowingEffect.displayName = "GlowingEffect";

export { GlowingEffect };
