"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import createGlobe from "cobe";
import type { NetworkEntity } from "@/lib/network-types";
import { HYDERABAD_HUB } from "@/lib/network-types";

// Light-theme interactive globe. cobe draws the sphere; every marker is a
// DOM element placed each frame by an orthographic projection synced to the
// globe's rotation, so hover/selection never triggers a React re-render.
//
//  • Headquarters  = partner/client chip (logo or name) + filled diamond at the true point
//  • Regional office = hollow ring dot (static — proves presence, no route)
//  • Hyderabad hub  = fixed badge; every collaboration route converges here
//  • Connections   = curved great-circle dotted routes, HQ → Hyderabad
//  • Idle          = slow rotation + a "featured" spotlight cycle (route + hub pulse)
//  • Collision      = chips are de-overlapped in screen space (2D spiral), with
//                     leader lines back to their true geographic point

const DEG = Math.PI / 180;
const THETA = 0.28; // fixed tilt, matches cobe config below
const IDLE_SPEED = 0.0016; // relaxed idle rotation
// cobe's texture longitude origin is 90° west of a plain sin/cos mapping —
// calibrated against the rendered map so chips sit on their real countries
const LNG_OFFSET = Math.PI / 2;
const RADIUS_SCALE = 0.985;

const FEATURED_IDLE_MS = 4500; // inactivity before the spotlight begins
const FEATURED_INTERVAL_MS = 9000; // time on each featured entity
const ROUTE_SAMPLES = 26; // points sampled along each great-circle route
const ROUTE_DRAW_MS = 900; // progressive route reveal duration
const HUB_PULSE_MS = 700; // hub pulse duration once a route arrives

const CHIP_HALF_W = 60;
const CHIP_H = 34;
const CHIP_GAP = 8;

type Vec = { x: number; y: number; z: number };

/** base unit vector at phi = 0 (before rotation/tilt) */
function baseVec(lat: number, lng: number): Vec {
  const la = lat * DEG;
  const a = lng * DEG + LNG_OFFSET;
  return {
    x: Math.cos(la) * Math.sin(a),
    y: Math.sin(la),
    z: Math.cos(la) * Math.cos(a),
  };
}

/** apply globe rotation (phi about Y) + camera tilt (theta about X) */
function orient(v: Vec, phi: number): Vec {
  const x = v.x * Math.cos(phi) + v.z * Math.sin(phi);
  const z = -v.x * Math.sin(phi) + v.z * Math.cos(phi);
  const y2 = v.y * Math.cos(THETA) - z * Math.sin(THETA);
  const z2 = v.y * Math.sin(THETA) + z * Math.cos(THETA);
  return { x, y: y2, z: z2 };
}

function project(lat: number, lng: number, phi: number): Vec {
  return orient(baseVec(lat, lng), phi);
}

/** spherical interpolation between two base unit vectors */
function slerp(a: Vec, b: Vec, t: number): Vec {
  let dot = a.x * b.x + a.y * b.y + a.z * b.z;
  dot = Math.min(1, Math.max(-1, dot));
  const om = Math.acos(dot);
  if (om < 1e-4) return a;
  const s = Math.sin(om);
  const k0 = Math.sin((1 - t) * om) / s;
  const k1 = Math.sin(t * om) / s;
  return {
    x: a.x * k0 + b.x * k1,
    y: a.y * k0 + b.y * k1,
    z: a.z * k0 + b.z * k1,
  };
}

/** phi that brings a longitude to front-center */
export function phiForLongitude(lng: number) {
  return -lng * DEG - LNG_OFFSET;
}

const DECLUTTER_MAX_CHIPS = 9; // logo chips shown at once when nothing is focused

export function NetworkGlobe({
  entities,
  selectedId,
  lockedId,
  visibleIds,
  highlightIds,
  onSelect,
  onHoverChange,
  onFeature,
  onRouteComplete,
  featuredOrder,
  focusLng,
  declutter = false,
  className,
}: {
  entities: NetworkEntity[];
  /** hover-merged id used for visual highlighting (null = none active) */
  selectedId: string | null;
  /** the actual locked (clicked) id — used only to decide click toggle-off, independent of hover */
  lockedId: string | null;
  /** entities passing current filters/search; others hidden */
  visibleIds: Set<string>;
  /** hover-highlight set (category/row hover); empty = no highlight */
  highlightIds: Set<string>;
  onSelect: (id: string | null) => void;
  onHoverChange?: (id: string | null) => void;
  /** fired as the idle spotlight moves between entities (id or null) */
  onFeature?: (id: string | null) => void;
  /** fired once a route (selection or featured) finishes drawing into Hyderabad */
  onRouteComplete?: (id: string) => void;
  /** curated storytelling order for the idle spotlight; falls back to entities.filter(featured) */
  featuredOrder?: string[];
  /** externally requested longitude to rotate toward (e.g. a category's cluster center) */
  focusLng?: number | null;
  /** when true and nothing is focused/filtered, cap simultaneous logo chips so the
   *  globe doesn't overcrowd — hovering, selecting or filtering always reveals the
   *  relevant chip regardless of this cap */
  declutter?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef(new Map<string, HTMLButtonElement>());
  const hqDotRefs = useRef(new Map<string, HTMLSpanElement>());
  const officeRefs = useRef(new Map<string, HTMLSpanElement>());
  const leaderSvgRef = useRef<SVGSVGElement>(null);
  const routeSvgRef = useRef<SVGSVGElement>(null);
  const pulseRef = useRef<HTMLSpanElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const hubPulseRef = useRef<HTMLSpanElement>(null);

  // interaction state lives in refs — read by the render loop each frame
  const stateRef = useRef({
    phi: phiForLongitude(78.5), // start with India (Hyderabad) front-center
    targetPhi: null as number | null,
    paused: false,
    dragging: false,
    dragStartX: 0,
    dragStartPhi: 0,
    lastInteraction: 0,
    featuredId: null as string | null,
    featuredSince: 0,
    routeStart: 0,
    routeFiredFor: null as string | null, // id we've already fired onRouteComplete for
    hubPulseUntil: 0,
  });
  const selectedRef = useRef<string | null>(null);
  const visibleRef = useRef(visibleIds);
  const highlightRef = useRef(highlightIds);
  const onFeatureRef = useRef(onFeature);
  onFeatureRef.current = onFeature;
  const onRouteCompleteRef = useRef(onRouteComplete);
  onRouteCompleteRef.current = onRouteComplete;

  const aimAt = (lng: number) => {
    const s = stateRef.current;
    const TWO_PI = 2 * Math.PI;
    const raw = phiForLongitude(lng) - s.phi;
    const diff = ((raw % TWO_PI) + TWO_PI) % TWO_PI;
    s.targetPhi = s.phi + (diff > Math.PI ? diff - TWO_PI : diff);
  };

  // keep refs in sync with props; aim the globe when selection changes
  useEffect(() => {
    selectedRef.current = selectedId;
    const s = stateRef.current;
    if (selectedId) {
      const p = entities.find((x) => x.id === selectedId);
      if (p) {
        s.paused = true;
        s.featuredId = null;
        s.routeStart = performance.now();
        s.routeFiredFor = null;
        s.lastInteraction = performance.now();
        aimAt(p.hq.lng);
      }
    } else {
      s.paused = false;
      s.targetPhi = null;
      s.lastInteraction = performance.now();
    }
  }, [selectedId, entities]);
  useEffect(() => {
    visibleRef.current = visibleIds;
  }, [visibleIds]);
  useEffect(() => {
    highlightRef.current = highlightIds;
  }, [highlightIds]);
  const declutterRef = useRef(declutter);
  declutterRef.current = declutter;

  // external focus request (e.g. a clicked category) rotates toward that
  // longitude without locking a selection — only while nothing is selected
  useEffect(() => {
    if (focusLng == null || selectedId) return;
    aimAt(focusLng);
    stateRef.current.lastInteraction = performance.now();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusLng]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let width = wrap.offsetWidth;
    const onResize = () => {
      width = wrap.offsetWidth;
    };
    window.addEventListener("resize", onResize);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // curated storytelling order wins when provided; otherwise fall back to
    // the featured flag, then to the full roster
    const byId = new Map(entities.map((p) => [p.id, p]));
    const curated = (featuredOrder ?? [])
      .map((id) => byId.get(id))
      .filter((p): p is NetworkEntity => !!p);
    const featuredPool = entities.filter((p) => p.featured);
    const pool = curated.length ? curated : featuredPool.length ? featuredPool : entities;
    let featuredIdx = 0;

    // pre-compute base vectors for HQs + offices (rotation-independent)
    const hqBase = new Map(entities.map((p) => [p.id, baseVec(p.hq.lat, p.hq.lng)]));
    const hubBase = baseVec(HYDERABAD_HUB.lat, HYDERABAD_HUB.lng);

    const setRoute = (key: string, d: string) => {
      const path = routeSvgRef.current?.querySelector<SVGPathElement>(
        `[data-route="${key}"]`
      );
      if (path) path.setAttribute("d", d);
    };

    const buildRoute = (from: Vec, to: Vec, phi: number, progress: number) => {
      const count = Math.max(2, Math.ceil(progress * ROUTE_SAMPLES));
      let d = "";
      let penDown = false;
      for (let i = 0; i < count; i++) {
        const t = i / (ROUTE_SAMPLES - 1);
        // lift the arc slightly off the surface for an airline-route feel
        const p = slerp(from, to, t);
        const lift = 1 + 0.06 * Math.sin(Math.PI * t);
        const v = orient(
          { x: p.x * lift, y: p.y * lift, z: p.z * lift },
          phi
        );
        if (v.z <= 0.02) {
          penDown = false;
          continue;
        }
        const sx = width / 2 + v.x * (width / 2) * RADIUS_SCALE;
        const sy = width / 2 - v.y * (width / 2) * RADIUS_SCALE;
        d += `${penDown ? "L" : "M"}${sx.toFixed(1)} ${sy.toFixed(1)} `;
        penDown = true;
      }
      return d;
    };

    const placeMarkers = (phi: number, now: number) => {
      const r = (width / 2) * RADIUS_SCALE;
      const cx = width / 2;
      const cy = width / 2;
      const s = stateRef.current;
      const sel = selectedRef.current;
      const vis = visibleRef.current;
      const hi = highlightRef.current;
      const feat = s.featuredId;

      // active highlight set (selection > hover/category > featured)
      const activeId = sel ?? (hi.size ? null : feat);
      // the one entity (if any) whose route is currently animating toward the hub
      const routedId = sel ?? feat;

      // 1) project all HQs, collect the ones that should show
      type Placed = {
        p: NetworkEntity;
        sx: number;
        sy: number;
        z: number;
        chipY: number;
      };
      const shownList: Placed[] = [];
      for (const p of entities) {
        const v = orient(hqBase.get(p.id)!, phi);
        const front = v.z > 0.06;
        const shown = front && vis.has(p.id);
        const chip = chipRefs.current.get(p.id);
        const dot = hqDotRefs.current.get(p.id);
        const sx = cx + v.x * r;
        const sy = cy - v.y * r;
        if (dot) {
          dot.style.transform = `translate(-50%,-50%) translate(${sx}px,${sy}px) rotate(45deg)`;
          dot.style.opacity = shown ? "1" : "0";
        }
        if (!chip) continue;
        if (!shown) {
          chip.style.opacity = "0";
          chip.style.pointerEvents = "none";
        } else {
          shownList.push({ p, sx, sy, z: v.z, chipY: sy });
        }
      }

      // 1b) decluttering — when nothing is focused/filtered/hovered, cap
      // simultaneous logo chips to the most relevant (featured + the
      // frontmost by depth) so the globe never overcrowds. The true-location
      // dots above are unaffected — geographic accuracy always stands, only
      // the logo labels are thinned. As the globe rotates, a different set
      // naturally becomes frontmost, so more of the roster surfaces over time.
      let chipList = shownList;
      if (declutterRef.current && shownList.length > DECLUTTER_MAX_CHIPS) {
        const byZ = [...shownList].sort((a, b) => b.z - a.z);
        const kept = new Set<string>();
        for (const item of byZ) {
          if (item.p.featured) kept.add(item.p.id); // featured entities always surface
        }
        for (const item of byZ) {
          if (kept.size >= DECLUTTER_MAX_CHIPS) break;
          kept.add(item.p.id);
        }
        chipList = shownList.filter((item) => kept.has(item.p.id));
        for (const item of shownList) {
          if (!kept.has(item.p.id)) {
            const chip = chipRefs.current.get(item.p.id);
            if (chip) {
              chip.style.opacity = "0";
              chip.style.pointerEvents = "none";
            }
          }
        }
      }

      // 2) de-overlap chips in screen space — Fermat-spiral offset (golden
      //    angle, radius ∝ √attempt) so density scales gracefully as the
      //    roster grows, with real, non-overlapping hit targets even in
      //    dense clusters (fully recomputed each frame from live projected
      //    positions, never hardcoded)
      const GOLDEN_ANGLE = 2.399963;
      chipList.sort((a, b) => a.sy - b.sy);
      const placed: (Placed & { chipX: number })[] = [];
      for (const raw of chipList) {
        const item = { ...raw, chipX: raw.sx };
        let y = item.sy;
        let x = item.sx;
        let attempt = 0;
        const collides = () =>
          placed.some(
            (q) =>
              Math.abs(x - q.chipX) < CHIP_HALF_W * 1.8 &&
              Math.abs(y - q.chipY) < CHIP_H + CHIP_GAP
          );
        while (collides() && attempt < 32) {
          attempt += 1;
          const angle = attempt * GOLDEN_ANGLE;
          const radius = Math.sqrt(attempt) * (CHIP_H * 0.9);
          x = item.sx + Math.cos(angle) * radius;
          y = item.sy + Math.sin(angle) * radius * 0.7;
        }
        item.chipY = Math.min(width - CHIP_H, Math.max(CHIP_H, y));
        item.chipX = Math.min(width - CHIP_HALF_W, Math.max(CHIP_HALF_W, x));
        placed.push(item);
      }

      // 3) write chip transforms + leader lines (true point → displaced chip)
      for (const item of placed) {
        const { p, sx, sy, z, chipX, chipY } = item;
        const chip = chipRefs.current.get(p.id)!;
        const isActive = activeId === p.id;
        const dimmed = activeId != null && !isActive;
        const scale = (0.82 + 0.3 * z) * (isActive ? 1.28 : 1);
        chip.style.transform = `translate(-50%,-50%) translate(${chipX}px,${chipY}px) scale(${scale})`;
        chip.style.opacity = dimmed ? "0.22" : "1";
        chip.style.pointerEvents = "auto";
        chip.style.zIndex = isActive ? "40" : String(12 + Math.round(z * 12));

        const leader = leaderSvgRef.current?.querySelector<SVGLineElement>(
          `[data-leader="${p.id}"]`
        );
        if (leader) {
          const displaced = Math.hypot(chipX - sx, chipY - sy) > 6;
          if (displaced && !dimmed) {
            leader.setAttribute("x1", String(sx));
            leader.setAttribute("y1", String(sy));
            leader.setAttribute("x2", String(chipX));
            leader.setAttribute("y2", String(chipY + CHIP_H / 2));
            leader.style.opacity = "0.45";
          } else {
            leader.style.opacity = "0";
          }
        }
      }

      // 4) regional office dots — static true-location markers, no route
      for (const p of entities) {
        const routed = routedId === p.id;
        p.offices?.forEach((o, i) => {
          const key = `${p.id}-${i}`;
          const dotEl = officeRefs.current.get(key);
          const ov = project(o.lat, o.lng, phi);
          const oFront = ov.z > 0.05;
          if (dotEl) {
            const osx = cx + ov.x * r;
            const osy = cy - ov.y * r;
            dotEl.style.transform = `translate(-50%,-50%) translate(${osx}px,${osy}px)`;
            dotEl.style.opacity = routed && oFront ? "1" : "0";
          }
        });
      }

      // 5) collaboration route — HQ of the selected/featured entity → Hyderabad hub
      const routeProgress = Math.min(1, (now - s.routeStart) / ROUTE_DRAW_MS);
      for (const p of entities) {
        const key = `${p.id}-hub`;
        const routed = routedId === p.id;
        const hqV = orient(hqBase.get(p.id)!, phi);
        if (routed && hqV.z > 0.02) {
          setRoute(key, buildRoute(hqBase.get(p.id)!, hubBase, phi, routeProgress));
        } else {
          setRoute(key, "");
        }
      }
      if (routedId && routeProgress >= 1 && s.routeFiredFor !== routedId) {
        s.routeFiredFor = routedId;
        s.hubPulseUntil = now + HUB_PULSE_MS;
        onRouteCompleteRef.current?.(routedId);
      }

      // 6) hub marker + pulse
      const hub = hubRef.current;
      if (hub) {
        const hv = orient(hubBase, phi);
        const hFront = hv.z > 0.02;
        hub.style.transform = `translate(-50%,-50%) translate(${cx + hv.x * r}px,${
          cy - hv.y * r
        }px)`;
        hub.style.opacity = hFront ? "1" : "0";
        const hubPulse = hubPulseRef.current;
        if (hubPulse) {
          const pulsing = hFront && now < s.hubPulseUntil;
          hubPulse.style.transform = hub.style.transform;
          hubPulse.style.opacity = pulsing ? "1" : "0";
        }
      }

      // 7) featured spotlight pulse (on the featured entity's chip, idle only)
      const pulse = pulseRef.current;
      if (pulse) {
        if (feat && !sel && hi.size === 0) {
          const fv = orient(hqBase.get(feat)!, phi);
          if (fv.z > 0.06) {
            pulse.style.transform = `translate(-50%,-50%) translate(${
              cx + fv.x * r
            }px,${cy - fv.y * r}px)`;
            pulse.style.opacity = "1";
          } else pulse.style.opacity = "0";
        } else pulse.style.opacity = "0";
      }
    };

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: stateRef.current.phi,
      theta: THETA,
      dark: 0, // light globe on the drawing-sheet white page
      diffuse: 1.2,
      mapSamples: 18000,
      mapBrightness: 4.2,
      baseColor: [0.82, 0.87, 0.95], // pale blueprint-blue landmass
      markerColor: [0 / 255, 120 / 255, 243 / 255],
      glowColor: [0.9, 0.94, 1],
      opacity: 0.92,
      markers: [],
    });

    stateRef.current.lastInteraction = performance.now();

    let rafId = 0;
    const loop = () => {
      const s = stateRef.current;
      const now = performance.now();

      // featured spotlight — only when fully idle (no selection/hover/drag)
      const idle =
        selectedRef.current == null &&
        highlightRef.current.size === 0 &&
        !s.dragging;
      if (idle && !reduce && now - s.lastInteraction > FEATURED_IDLE_MS) {
        if (s.featuredId == null || now - s.featuredSince > FEATURED_INTERVAL_MS) {
          const next = pool[featuredIdx % pool.length];
          featuredIdx += 1;
          s.featuredId = next.id;
          s.featuredSince = now;
          s.routeStart = now;
          s.routeFiredFor = null;
          aimAt(next.hq.lng);
          onFeatureRef.current?.(next.id);
        }
      } else if (s.featuredId && (!idle || reduce)) {
        s.featuredId = null;
        onFeatureRef.current?.(null);
      }

      if (s.targetPhi !== null) {
        s.phi += (s.targetPhi - s.phi) * 0.055; // elegant ease toward target
        if (Math.abs(s.targetPhi - s.phi) < 0.0015) s.targetPhi = null;
      } else if (!s.paused && !s.dragging && !reduce) {
        s.phi += IDLE_SPEED;
      }
      globe.update({ phi: s.phi, width: width * 2, height: width * 2 });
      placeMarkers(s.phi, now);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const bumpInteraction = () => {
      const s = stateRef.current;
      s.lastInteraction = performance.now();
      if (s.featuredId) {
        s.featuredId = null;
        onFeatureRef.current?.(null);
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      const s = stateRef.current;
      s.dragging = true;
      s.dragStartX = e.clientX;
      s.dragStartPhi = s.phi;
      s.targetPhi = null;
      canvas.style.cursor = "grabbing";
      bumpInteraction();
    };
    const onPointerMove = (e: PointerEvent) => {
      const s = stateRef.current;
      if (s.dragging) {
        s.phi = s.dragStartPhi + (e.clientX - s.dragStartX) / 220;
        s.lastInteraction = performance.now();
      }
    };
    const onPointerUp = () => {
      stateRef.current.dragging = false;
      stateRef.current.lastInteraction = performance.now();
      canvas.style.cursor = "grab";
    };
    const onWheel = () => bumpInteraction();
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      globe.destroy();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entities, featuredOrder]);

  return (
    <div
      ref={wrapRef}
      className={`relative aspect-square w-full select-none ${className ?? ""}`}
      role="group"
      aria-label="Interactive globe of our global network"
    >
      {/* soft atmospheric glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 46%, rgb(0 120 243 / 12%) 0%, rgb(0 120 243 / 5%) 55%, transparent 72%)",
          filter: "blur(6px)",
        }}
        aria-hidden
      />

      <canvas
        ref={canvasRef}
        className="relative h-full w-full cursor-grab [contain:layout_paint_size]"
        style={{ touchAction: "pan-y" }}
        aria-hidden
      />

      {/* curved great-circle routes (engineering red, drawn progressively) — all converge on Hyderabad */}
      <svg
        ref={routeSvgRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      >
        {entities.map((p) => (
          <path
            key={p.id}
            data-route={`${p.id}-hub`}
            fill="none"
            stroke="var(--eng-red)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="1.5 5"
          />
        ))}
      </svg>

      {/* leader lines from displaced logo chips back to their true point */}
      <svg
        ref={leaderSvgRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      >
        {entities.map((p) => (
          <line
            key={p.id}
            data-leader={p.id}
            stroke="var(--primary)"
            strokeWidth="1"
            strokeDasharray="2 3"
            className="opacity-0 transition-opacity duration-300"
          />
        ))}
      </svg>

      {/* featured spotlight pulse */}
      <span
        ref={pulseRef}
        className="pointer-events-none absolute left-0 top-0 z-[35] block h-4 w-4 rounded-full opacity-0"
        aria-hidden
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
        <span className="absolute inset-[3px] rounded-full bg-primary/70" />
      </span>

      {/* Phoenix Hyderabad hub — every collaboration route converges here */}
      <span
        ref={hubPulseRef}
        className="pointer-events-none absolute left-0 top-0 z-[34] block h-5 w-5 rounded-full opacity-0"
        aria-hidden
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[var(--eng-red)]/45" />
        <span className="absolute inset-[4px] rounded-full bg-[var(--eng-red)]/80" />
      </span>
      <div
        ref={hubRef}
        className="pointer-events-none absolute left-0 top-0 z-[36] flex flex-col items-center opacity-0"
        aria-hidden
      >
        {/* soft architectural halo — always-on, marks the network's destination */}
        <span
          className="absolute rounded-full"
          style={{
            width: 34,
            height: 34,
            transform: "translate(-50%,-50%)",
            left: "50%",
            top: "50%",
            background:
              "radial-gradient(circle, rgb(0 120 243 / 22%) 0%, rgb(0 120 243 / 6%) 55%, transparent 80%)",
          }}
        />
        <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white shadow-[0_0_0_3px_white,0_0_10px_2px_rgb(0_120_243/35%)]">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
        <span className="tech-label mt-1.5 whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 text-[9px] text-primary backdrop-blur-sm">
          Phoenix · Hyderabad
        </span>
      </div>

      {/* HQ true-location markers (filled diamonds) */}
      {entities.map((p) => (
        <span
          key={p.id}
          ref={(el) => {
            if (el) hqDotRefs.current.set(p.id, el);
            else hqDotRefs.current.delete(p.id);
          }}
          className="pointer-events-none absolute left-0 top-0 z-[11] block h-2 w-2 bg-primary opacity-0 shadow-[0_0_0_2px_white] transition-opacity duration-300"
          aria-hidden
        />
      ))}

      {/* HQ chips — logo when available, otherwise the company name */}
      {entities.map((p) => (
        <button
          key={p.id}
          ref={(el) => {
            if (el) chipRefs.current.set(p.id, el);
            else chipRefs.current.delete(p.id);
          }}
          onMouseEnter={() => onHoverChange?.(p.id)}
          onMouseLeave={() => onHoverChange?.(null)}
          onFocus={() => onSelect(p.id)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(lockedId === p.id ? null : p.id);
          }}
          aria-label={`${p.name} — headquarters in ${p.hq.city}, ${p.hq.country}`}
          className="absolute left-0 top-0 flex h-9 items-center rounded-full border border-border bg-white/95 px-2.5 shadow-[0_1px_8px_rgba(15,40,90,0.10)] backdrop-blur-sm transition-[opacity,box-shadow] duration-300 will-change-transform hover:border-primary/60 hover:shadow-[0_0_0_1px_rgb(0_120_243/35%),0_4px_18px_rgb(0_120_243/22%)] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          style={{ opacity: 0 }}
        >
          {p.logo ? (
            <Image
              src={p.logo}
              alt=""
              width={72}
              height={24}
              loading="lazy"
              className="h-5 w-auto max-w-[84px] object-contain"
            />
          ) : (
            <span className="max-w-[110px] truncate text-xs font-medium text-foreground">
              {p.name}
            </span>
          )}
        </button>
      ))}

      {/* regional office dots (smaller, hollow) */}
      {entities.flatMap(
        (p) =>
          p.offices?.map((o, i) => (
            <span
              key={`${p.id}-${i}`}
              ref={(el) => {
                if (el) officeRefs.current.set(`${p.id}-${i}`, el);
                else officeRefs.current.delete(`${p.id}-${i}`);
              }}
              className="pointer-events-none absolute left-0 top-0 z-[10] block h-2 w-2 rounded-full border-[1.5px] border-primary bg-white opacity-0 transition-opacity duration-300"
              title={`${o.city}, ${o.country}`}
              aria-hidden
            />
          )) ?? []
      )}
    </div>
  );
}
