"use client";

import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

// Adapted for the Phoenix design system:
//   * imports resolved to `motion/react` (the project uses `motion` v12,
//     never `framer-motion` directly — the API surface is identical).
//   * hard-coded Radix `bg-mauve-dark-2` replaced with theme tokens.
//   * accepts an `images` prop so the atlas is owned by the caller.
//   * a small `caption` prop displays under the cylinder as a drafting note.
//   * respects `prefers-reduced-motion` — flattens to a single non-rotating
//     3D face row so the section never spins for users who opted out.

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type UseMediaQueryOptions = {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === "undefined";

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = (q: string): boolean => {
    if (IS_SERVER) return defaultValue;
    return window.matchMedia(q).matches;
  };

  const [matches, setMatches] = useState<boolean>(() =>
    initializeWithValue ? getMatches(query) : defaultValue
  );

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);
    const handleChange = () => setMatches(matchMedia.matches);
    handleChange();
    matchMedia.addEventListener("change", handleChange);
    return () => matchMedia.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

// Client-side viewport reads (matchMedia / window.innerWidth / a resize
// effect) proved unreliable for driving this sizing in this environment —
// state set from an effect after mount wasn't reflected in the next
// paint here. Plain CSS clamp() doesn't have that problem: the browser
// resolves it directly with no JS round-trip, so responsive sizing goes
// through a CSS custom property instead of React state.
const CONTAINER_HEIGHT_CSS = "clamp(240px, 31vw, 410px)";
// Geometry (cylinder width / radius / perspective) needs real numbers for
// the 3D transform math, so it's pinned to a single reference size — the
// value a full-width desktop viewport resolves to. Smaller viewports get a
// visually smaller carousel via the CSS clamp() above (pure CSS, resolved
// by the browser with no JS round-trip) wrapped in overflow-hidden, which
// crops the ring rather than resizing the geometry — still reads as a big,
// legible front card at every size.
const REFERENCE_FACE_SIZE = 310;

// Degrees per second for the idle auto-rotate — slow enough to read as
// ambient motion, not a spinner. Paused while the user is dragging or has
// a face open in the modal.
const AUTO_ROTATE_DEG_PER_SEC = 6;

const duration = 0.15;
const transition = {
  duration,
  ease: [0.32, 0.72, 0, 1] as const,
  filter: "blur(4px)",
};
const transitionOverlay = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1] as const,
};

type CarouselProps = {
  handleClick: (imgUrl: string) => void;
  controls: ReturnType<typeof useAnimation>;
  cards: string[];
  isCarouselActive: boolean;
};

const Carousel = memo(function Carousel({
  handleClick,
  controls,
  cards,
  isCarouselActive,
}: CarouselProps) {
  const faceCount = cards.length;
  // Each face's on-screen size is the circle's circumference split evenly
  // across faces (faceWidth = cylinderWidth / faceCount) — so to make the
  // photos themselves bigger (not just the empty space around them), the
  // fix is to grow cylinderWidth directly. Geometry is pinned to
  // REFERENCE_FACE_SIZE and the outer wrapper's CSS clamp() (see
  // CONTAINER_HEIGHT_CSS above) shrinks the whole carousel visually on
  // narrow screens instead — reliable pure-CSS responsiveness beats a JS
  // viewport read here.
  const cylinderWidth = REFERENCE_FACE_SIZE * faceCount;
  const faceWidth = REFERENCE_FACE_SIZE;
  const radius = cylinderWidth / (2 * Math.PI);
  // Perspective controls how dramatically the front face is enlarged by
  // 3D foreshortening vs. the sides — keep the same radius:perspective
  // ratio the design shipped with (~0.29) so the front card doesn't look
  // over-warped.
  const perspective = radius * 3.5;
  const rotation = useMotionValue(0);
  const transform = useTransform(
    rotation,
    (value) => `rotate3d(0, 1, 0, ${value}deg)`
  );

  // Slow idle auto-rotate — paused while dragging or while a face is open
  // in the modal (isCarouselActive is false in that case).
  const isDraggingRef = useRef(false);
  useAnimationFrame((_, delta) => {
    if (isCarouselActive && !isDraggingRef.current) {
      rotation.set(rotation.get() + (AUTO_ROTATE_DEG_PER_SEC * delta) / 1000);
    }
  });

  return (
    <div
      className="flex h-full items-center justify-center"
      style={{
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      <motion.div
        drag={isCarouselActive ? "x" : false}
        className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
        style={{
          transform,
          rotateY: rotation,
          width: cylinderWidth,
          transformStyle: "preserve-3d",
        }}
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDrag={(_, info) =>
          isCarouselActive && rotation.set(rotation.get() + info.offset.x * 0.05)
        }
        onDragEnd={(_, info) => {
          isDraggingRef.current = false;
          isCarouselActive &&
            controls.start({
              rotateY: rotation.get() + info.velocity.x * 0.05,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 30,
                mass: 0.1,
              },
            });
        }}
        animate={controls}
      >
        {cards.map((imgUrl, i) => (
          <motion.div
            key={`face-${i}`}
            className="absolute flex h-full origin-center items-center justify-center p-2"
            style={{
              width: `${faceWidth}px`,
              transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`,
            }}
            onClick={() => handleClick(imgUrl)}
          >
            <motion.img
              src={imgUrl}
              alt=""
              loading="lazy"
              decoding="async"
              layoutId={`img-${imgUrl}`}
              className="pointer-events-none aspect-square w-full rounded-sm border border-primary/20 bg-card object-cover shadow-[0_1px_0_0_var(--color-primary)_inset]"
              initial={{ filter: "blur(4px)" }}
              layout="position"
              animate={{ filter: "blur(0px)" }}
              transition={transition}
              draggable={false}
              // decorative — the caller supplies context outside the cylinder
              aria-hidden
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
});

export function ThreeDPhotoCarousel({
  images,
  caption,
  className,
}: {
  images: string[];
  caption?: string;
  className?: string;
}) {
  const [activeImg, setActiveImg] = useState<string | null>(null);
  const [isCarouselActive, setIsCarouselActive] = useState(true);
  const controls = useAnimation();
  const reduce = useReducedMotion();
  const cards = useMemo(() => images, [images]);

  const handleClick = (imgUrl: string) => {
    setActiveImg(imgUrl);
    setIsCarouselActive(false);
    controls.stop();
  };

  const handleClose = () => {
    setActiveImg(null);
    setIsCarouselActive(true);
  };

  if (reduce) {
    // Static fallback: horizontal ruled strip, no 3D, no rotation.
    return (
      <div className={className}>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {cards.slice(0, 12).map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              className="aspect-square w-full rounded-sm border border-primary/20 bg-card object-cover"
              aria-hidden
            />
          ))}
        </div>
        {caption ? (
          <p className="mt-6 text-sm text-muted-foreground">{caption}</p>
        ) : null}
      </div>
    );
  }

  return (
    <motion.div layout className={className}>
      <AnimatePresence mode="sync">
        {activeImg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            layoutId={`img-container-${activeImg}`}
            layout="position"
            onClick={handleClose}
            className="sheet-corners fixed inset-0 z-50 m-5 flex items-center justify-center rounded-lg border border-primary/40 bg-background/95 backdrop-blur-md md:m-24 lg:mx-[19rem]"
            style={{ willChange: "opacity" }}
            transition={transitionOverlay}
          >
            <motion.img
              layoutId={`img-${activeImg}`}
              src={activeImg}
              alt=""
              className="max-h-[80vh] max-w-full rounded-sm border border-primary/30 shadow-[0_20px_80px_-30px_rgba(0,120,243,0.35)]"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.5,
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1] as const,
              }}
              style={{ willChange: "transform" }}
            />
            <span
              className="tech-label pointer-events-none absolute bottom-6 right-8 text-muted-foreground/60"
              aria-hidden
            >
              Click to close
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className="relative w-full overflow-hidden"
        style={{ height: CONTAINER_HEIGHT_CSS }}
      >
        <Carousel
          handleClick={handleClick}
          controls={controls}
          cards={cards}
          isCarouselActive={isCarouselActive}
        />
      </div>
      {caption ? (
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {caption}
        </p>
      ) : null}
    </motion.div>
  );
}
