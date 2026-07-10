"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { useReducedMotion } from "motion/react";
import { DraftingMarks } from "./drafting-marks";

// Architectural page transition — not a loading screen. On internal
// navigation: freeze + softly blur the current page, bring in a blueprint
// overlay with the centered (untouched, never-animated) Phoenix logo, draw
// in drafting elements around it — guide lines, dimension ticks, coordinate
// markers, construction circles — swap the route underneath once the
// overlay fully covers the screen, then dissolve. ~1.1s total, within the
// 0.8-1.5s brief. Reduced motion: navigation happens natively, no overlay.
//
// Scope: intercepts left-click, same-tab, same-origin <a> navigations to a
// different route. Same-page hash links (e.g. "/#contact" from "/") and
// modifier-clicks/new-tab/download links are left to the browser untouched.
export function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef<SVGSVGElement>(null);

  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const pendingHref = useRef<string | null>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    if (reduce) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === pathnameRef.current) return; // same route — let the browser handle hash scroll etc.

      if (runningRef.current) {
        e.preventDefault(); // swallow re-clicks mid-transition rather than stacking timelines
        return;
      }

      e.preventDefault();
      pendingHref.current = url.pathname + url.search + url.hash;
      runTransition();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [reduce]);

  const runTransition = () => {
    const content = contentRef.current;
    const overlay = overlayRef.current;
    const grid = gridRef.current;
    const logo = logoRef.current;
    if (!content || !overlay || !grid || !logo) return;
    runningRef.current = true;

    const draftLines = draftRef.current?.querySelectorAll<SVGElement>("[data-draft]");
    const strokes = draftRef.current?.querySelectorAll<SVGGeometryElement>("[data-draft-line]");
    strokes?.forEach((el) => {
      const len = el.getTotalLength();
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
    });
    if (draftLines?.length) gsap.set(draftLines, { opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        runningRef.current = false;
      },
    });

    // 1) freeze + softly blur the current page
    tl.to(content, { filter: "blur(3.5px)", opacity: 0.92, duration: 0.32, ease: "power2.inOut" }, 0);

    // 2) the blueprint overlay covers the screen, the grid brightens, the
    //    logo is revealed (fade only — the artwork itself never animates)
    tl.set(overlay, { pointerEvents: "auto" }, 0);
    tl.to(overlay, { opacity: 1, duration: 0.34, ease: "power2.inOut" }, 0.02);
    tl.to(grid, { opacity: 1, duration: 0.42, ease: "power2.out" }, 0.06);
    tl.to(logo, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0.16);

    // navigate once the overlay fully covers the page — static pages mount
    // beneath it essentially instantly
    tl.call(
      () => {
        if (pendingHref.current) router.push(pendingHref.current);
      },
      undefined,
      0.38
    );

    // 3) drafting elements draw in around the logo — guide lines, dimension
    //    ticks and coordinate markers fade, construction circles trace out
    if (draftLines?.length) {
      tl.to(draftLines, { opacity: 1, duration: 0.5, stagger: 0.035, ease: "power2.out" }, 0.32);
    }
    if (strokes?.length) {
      tl.to(strokes, { strokeDashoffset: 0, duration: 0.65, stagger: 0.05, ease: "power3.out" }, 0.34);
    }

    // hold briefly at peak, then dissolve — drafting + overlay fade, the
    // page beneath (now the destination) unfreezes
    tl.to(content, { filter: "blur(0px)", opacity: 1, duration: 0.42, ease: "power2.inOut" }, 0.86);
    tl.to([grid, logo, draftRef.current], { opacity: 0, duration: 0.36, ease: "power2.inOut" }, 0.9);
    tl.to(overlay, { opacity: 0, duration: 0.38, ease: "power2.inOut" }, 0.94);
    tl.set(overlay, { pointerEvents: "none" });
  };

  return (
    <>
      <div ref={contentRef} className="flex min-h-full flex-1 flex-col">
        {children}
      </div>

      {/* architectural transition overlay — not a loading screen. Note: corner
          ticks are hand-built here rather than the shared `.sheet-corners`
          utility, since that class's own `position: relative` would win the
          cascade over Tailwind's `fixed` at equal specificity and break the
          overlay's positioning. */}
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-[95] flex items-center justify-center opacity-0"
        aria-hidden
      >
        <div className="absolute inset-0 bg-background" />
        <span className="absolute left-4 top-4 h-3.5 w-3.5 border-l border-t border-primary/55" />
        <span className="absolute bottom-4 right-4 h-3.5 w-3.5 border-b border-r border-primary/55" />
        <div
          ref={gridRef}
          className="bp-grid absolute inset-0 opacity-0"
          style={{
            maskImage:
              "radial-gradient(60% 55% at 50% 50%, black 0%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(60% 55% at 50% 50%, black 0%, transparent 85%)",
          }}
        />

        <DraftingMarks
          ref={draftRef}
          className="pointer-events-none absolute h-[62vmin] w-[62vmin] max-h-[440px] max-w-[440px]"
        />

        <div ref={logoRef} className="relative opacity-0">
          <Image
            src="/phoenix/images/phoenix_logo.png"
            alt="Phoenix Group"
            width={132}
            height={44}
            className="h-11 w-auto"
            priority
          />
        </div>
      </div>
    </>
  );
}
