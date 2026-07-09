"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Navbar } from "@/components/navbar";
import { Reveal, Stagger, staggerItem } from "@/components/reveal";
import { Input } from "@/components/ui/input";
import { NetworkGlobe } from "./network-globe";
import { NetworkPanel } from "./network-panel";
import type { NetworkEntity, Region } from "@/lib/network-types";
import {
  CATEGORIES,
  FEATURED_ORDER as PARTNER_FEATURED_ORDER,
  PARTNERS,
  REGIONS,
  countryList as partnerCountryList,
  partnerCount,
  countryCount,
} from "@/lib/partners";
import {
  CLIENT_CATEGORIES,
  CLIENTS,
  FEATURED_ORDER as CLIENT_FEATURED_ORDER,
  clientCountryList,
  clientCount,
  clientCountryCount,
} from "@/lib/clients";

type SortKey = "featured" | "name" | "category" | "country";
type Tab = "partners" | "clients";

const TABS: { key: Tab; label: string }[] = [
  { key: "partners", label: "Partners" },
  { key: "clients", label: "Clients" },
];

// OUR NETWORK — global ecosystem, Partners + Clients, one shared globe.
// Fully data-driven from src/lib/partners.ts + src/lib/clients.ts. Selection
// is layered: transient hover (chip) previews an entity; a click locks it.
// Everything (tab, globe, legend, directory, panel) reads one shared state
// so all surfaces stay in sync when switching tabs — no page reload.
export function PartnersPageClient() {
  const [tab, setTab] = useState<Tab>("partners");
  const [lockedId, setLockedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null); // globe chip hover
  const [rowHoverId, setRowHoverId] = useState<string | null>(null); // directory hover
  const [featuredId, setFeaturedId] = useState<string | null>(null); // idle spotlight
  const [hoverCategory, setHoverCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
  const [country, setCountry] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [dirOpen, setDirOpen] = useState(false);
  const [panelReady, setPanelReady] = useState(false); // gated until route+pulse finish
  const [focusLng, setFocusLng] = useState<number | null>(null); // category-cluster rotate request

  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const entities: NetworkEntity[] = tab === "partners" ? PARTNERS : CLIENTS;
  const categories: readonly string[] = tab === "partners" ? CATEGORIES : CLIENT_CATEGORIES;
  const featuredOrder = tab === "partners" ? PARTNER_FEATURED_ORDER : CLIENT_FEATURED_ORDER;
  const entityLabel = tab === "partners" ? "Partner" : "Client";
  const totalCount = tab === "partners" ? partnerCount : clientCount;
  const totalCountries = tab === "partners" ? countryCount : clientCountryCount;
  const countryOptions = tab === "partners" ? partnerCountryList : clientCountryList;

  // reset everything but the tab itself when switching tabs
  const selectTab = (next: Tab) => {
    if (next === tab) return;
    setTab(next);
    setLockedId(null);
    setHoverId(null);
    setRowHoverId(null);
    setFeaturedId(null);
    setHoverCategory(null);
    setQuery("");
    setRegion("all");
    setCountry("all");
    setCategory("all");
    setSort("featured");
    setPanelReady(false);
    setFocusLng(null);
  };

  // clicking a category (not hovering) filters AND rotates the globe toward
  // that cluster's center of gravity — hovering still just highlights
  const selectCategory = (c: string) => {
    const next = category === c ? "all" : c;
    setCategory(next);
    if (next === "all") {
      setFocusLng(null);
      return;
    }
    const matches = entities.filter((p) => p.category === next);
    if (!matches.length) return;
    // circular mean of longitudes so a cluster straddling the antimeridian
    // (e.g. Asia-Pacific) doesn't average to the wrong side of the globe
    const rad = Math.PI / 180;
    const sin = matches.reduce((s, p) => s + Math.sin(p.hq.lng * rad), 0);
    const cos = matches.reduce((s, p) => s + Math.cos(p.hq.lng * rad), 0);
    setFocusLng(Math.atan2(sin, cos) / rad);
  };

  // transient hover previews; a click locks the selection
  const effectiveId = hoverId ?? lockedId;
  const selected: NetworkEntity | null =
    entities.find((p) => p.id === effectiveId) ?? null;

  // reveal the panel only after the route has animated in and the hub has
  // pulsed — NetworkGlobe calls onRouteComplete once that finishes
  useEffect(() => {
    setPanelReady(false);
    if (revealTimer.current) clearTimeout(revealTimer.current);
    if (!effectiveId) return;
    // safety fallback in case the route never completes (e.g. entity off-screen)
    revealTimer.current = setTimeout(() => setPanelReady(true), 1400);
    return () => {
      if (revealTimer.current) clearTimeout(revealTimer.current);
    };
  }, [effectiveId]);

  const handleRouteComplete = (id: string) => {
    if (id === effectiveId) setPanelReady(true);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = entities.filter((p) => {
      if (region !== "all" && p.region !== region) return false;
      if (country !== "all" && !p.countries.includes(country)) return false;
      if (category !== "all" && p.category !== category) return false;
      if (
        q &&
        ![p.name, p.category, p.hq.city, p.hq.country, ...p.countries]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
    const by: Record<SortKey, (a: NetworkEntity, b: NetworkEntity) => number> = {
      featured: (a, b) => Number(!!b.featured) - Number(!!a.featured) || a.name.localeCompare(b.name),
      name: (a, b) => a.name.localeCompare(b.name),
      category: (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
      country: (a, b) => a.hq.country.localeCompare(b.hq.country) || a.name.localeCompare(b.name),
    };
    return [...list].sort(by[sort]);
  }, [entities, query, region, country, category, sort]);

  const visibleIds = useMemo(() => new Set(filtered.map((p) => p.id)), [filtered]);

  // globe highlight = category-legend hover ∪ directory-row hover ∪ an
  // active category filter — a selected category must stop the idle
  // spotlight and un-dim only its own companies, exactly like a hover does
  const highlightIds = useMemo(() => {
    const set = new Set<string>();
    if (rowHoverId) set.add(rowHoverId);
    const activeCategory = hoverCategory ?? (category !== "all" ? category : null);
    if (activeCategory)
      for (const p of entities) if (p.category === activeCategory) set.add(p.id);
    return set;
  }, [entities, rowHoverId, hoverCategory, category]);

  const featured = entities.find((p) => p.id === featuredId) ?? null;

  // decluttered = nothing focused/filtered/hovered — the globe caps how many
  // logo chips show at once. Any interaction (search, filter, hover, select)
  // immediately lifts the cap so the relevant companies surface in full.
  const declutter =
    !effectiveId &&
    highlightIds.size === 0 &&
    query.trim() === "" &&
    region === "all" &&
    country === "all" &&
    category === "all";

  const selectRow = (id: string) => {
    setLockedId(id);
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const search = (value: string) => {
    setQuery(value);
    const q = value.trim().toLowerCase();
    if (q.length >= 2) {
      const hit = entities.find((p) => p.name.toLowerCase().includes(q));
      if (hit) setLockedId(hit.id);
    }
  };

  const panelEntity = panelReady ? selected : null;

  // Subtle cursor parallax — background glow and globe drift independently,
  // a few px max (Apple-product-page restraint, not a gimmick). Applied via
  // direct transform mutation on refs rather than React state, mirroring
  // the perf-conscious pattern already used inside NetworkGlobe itself.
  const glowRef = useRef<HTMLDivElement>(null);
  const globeLayerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        if (glowRef.current)
          glowRef.current.style.transform = `translate3d(${nx * 18}px, ${ny * 14}px, 0)`;
        if (globeLayerRef.current)
          globeLayerRef.current.style.transform = `translate3d(${nx * -8}px, ${ny * -6}px, 0)`;
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  return (
    <>
      <Navbar visible />

      {/* full-page blueprint presentation board — one continuous architectural sheet.
          Visibility has hierarchy: strongest near the top where the globe sits,
          progressively softer further down, so the eye is drawn to the hero. */}
      <div
        className="bp-grid pointer-events-none fixed inset-0 -z-10 opacity-[0.5]"
        style={{
          maskImage:
            "radial-gradient(70% 60% at 50% 18%, black 35%, rgb(0 0 0 / 0.55) 65%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(70% 60% at 50% 18%, black 35%, rgb(0 0 0 / 0.55) 65%, transparent 100%)",
        }}
        aria-hidden
      />
      {/* soft atmospheric lighting behind the globe — the layer between the
          blueprint and the globe itself; drifts a touch on cursor move */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed inset-0 -z-10 will-change-transform"
        style={{
          background:
            "radial-gradient(42% 32% at 50% 26%, rgb(0 120 243 / 10%) 0%, rgb(0 120 243 / 4%) 55%, transparent 78%)",
        }}
        aria-hidden
      />

      <main className="pb-28 pt-28 md:pt-32">
        {/* HERO — nav → heading → description → toggle, reading order before the globe */}
        <header className="mx-auto max-w-3xl px-6">
          <Reveal>
            <span className="tech-label text-primary">
              Global network · {totalCount} {tab} · {totalCountries} countries
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-foreground md:text-7xl">
              Our Partners
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Behind every successful development is a network of trusted global
              partners. From steel manufacturers and façade specialists to
              engineering consultants and technology leaders, our collaborations
              bring world-class expertise to every project.
            </p>
          </Reveal>

          {/* segmented tab control — Partners / Clients, one shared globe */}
          <Reveal delay={0.22} className="mt-8">
            <div
              role="tablist"
              aria-label="Network view"
              className="inline-flex rounded-full border border-border bg-white/80 p-1 backdrop-blur-sm"
            >
              {TABS.map((t) => (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={tab === t.key}
                  onClick={() => selectTab(t.key)}
                  className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300 ${
                    tab === t.key ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === t.key && (
                    <motion.span
                      layoutId="network-tab-pill"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  <span className="relative z-10">{t.label}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </header>

        {/* GLOBE — the monumental centerpiece. No frame, no border, no card: it
            sits directly on the blueprint sheet, dominating ~88-94% of the page
            width. Materializes in (blur + scale) rather than a simple fade, so
            the entry reads as the Earth resolving into view. */}
        <motion.div
          className="relative mt-14 md:mt-16"
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            ref={globeLayerRef}
            className="relative mx-auto w-[94vw] max-w-[1180px] will-change-transform md:w-[90vw] md:max-w-[1900px]"
            aria-label={`${entityLabel} network globe`}
          >
            <NetworkGlobe
              entities={entities}
              selectedId={effectiveId}
              lockedId={lockedId}
              visibleIds={visibleIds}
              highlightIds={highlightIds}
              onSelect={(id) => setLockedId(id)}
              onHoverChange={setHoverId}
              onFeature={setFeaturedId}
              onRouteComplete={handleRouteComplete}
              featuredOrder={featuredOrder}
              focusLng={focusLng}
              declutter={declutter}
            />

            {/* featured-entity caption (idle spotlight) */}
            <AnimatePresence>
              {featured && !effectiveId && (
                <motion.div
                  key={featured.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-none absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-white/90 px-4 py-2 shadow-[0_2px_14px_rgba(15,40,90,0.10)] backdrop-blur-sm"
                >
                  {featured.logo ? (
                    <Image
                      src={featured.logo}
                      alt=""
                      width={72}
                      height={22}
                      className="h-4 w-auto max-w-[76px] object-contain"
                    />
                  ) : (
                    <span className="text-xs font-medium text-foreground">{featured.name}</span>
                  )}
                  <span className="tech-label text-muted-foreground">
                    {featured.hq.city}, {featured.hq.country}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* SUPPORTING INFORMATION — discovered after the globe, never overlapping it.
            Legend on the left, Network Profile on the right. */}
        <div className="mx-auto mt-14 grid max-w-7xl gap-8 px-6 md:mt-20 md:grid-cols-2">
          <Reveal>
            <div>
              <p className="tech-label text-primary">Global network</p>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2.5">
                  <span className="block size-2 rotate-45 bg-primary shadow-[0_0_0_2px_white]" />
                  Headquarters
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="block size-2 rounded-full border-[1.5px] border-primary bg-white" />
                  Regional office
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="relative flex size-2.5 items-center justify-center rounded-full border-2 border-primary bg-white" />
                  Phoenix Hyderabad
                </li>
                <li className="flex items-center gap-2.5">
                  <svg width="24" height="6" aria-hidden className="shrink-0">
                    <line
                      x1="0"
                      y1="3"
                      x2="24"
                      y2="3"
                      stroke="var(--eng-red)"
                      strokeWidth="1.6"
                      strokeDasharray="2 3"
                    />
                  </svg>
                  Active network
                </li>
              </ul>

              <p className="tech-label mt-6 text-primary">{entityLabel} categories</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <li key={c}>
                    <button
                      onMouseEnter={() => setHoverCategory(c)}
                      onMouseLeave={() => setHoverCategory(null)}
                      onFocus={() => setHoverCategory(c)}
                      onBlur={() => setHoverCategory(null)}
                      onClick={() => selectCategory(c)}
                      aria-pressed={category === c}
                      className={`rounded-full border px-3 py-1.5 text-xs transition-colors duration-300 ${
                        category === c
                          ? "border-primary bg-primary/10 font-medium text-primary"
                          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <NetworkPanel
              entity={panelEntity}
              entityLabel={entityLabel}
              onClose={() => setLockedId(null)}
            />
          </Reveal>
        </div>

        {/* DIRECTORY — secondary, collapsed by default */}
        <section className="mx-auto mt-16 max-w-7xl px-6" aria-label={`${entityLabel} directory`}>
          <button
            onClick={() => setDirOpen((v) => !v)}
            aria-expanded={dirOpen}
            className="flex w-full items-center justify-between gap-4 rounded-lg border border-border bg-card px-5 py-4 text-left transition-colors duration-300 hover:bg-primary/5"
          >
            <span>
              <span className="tech-label text-primary">Directory</span>
              <span className="ml-3 text-base font-medium text-foreground">
                Browse complete network
              </span>
            </span>
            <motion.span
              animate={{ rotate: dirOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="tech-label flex items-center gap-2 text-muted-foreground"
              aria-hidden
            >
              {dirOpen ? "Collapse" : "Expand"}
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {dirOpen && (
              <motion.div
                key="directory-body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-8">
                  {/* search + filters + sort */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Input
                      value={query}
                      onChange={(e) => search(e.target.value)}
                      placeholder={`Search ${tab}, cities, countries…`}
                      aria-label={`Search ${tab}`}
                      className="h-10 max-w-xs"
                    />
                    <FilterSelect
                      label="Region"
                      value={region}
                      onChange={(v) => setRegion(v as Region | "all")}
                      options={["all", ...REGIONS]}
                    />
                    <FilterSelect
                      label="Country"
                      value={country}
                      onChange={setCountry}
                      options={["all", ...countryOptions]}
                    />
                    <FilterSelect
                      label="Category"
                      value={category}
                      onChange={setCategory}
                      options={["all", ...categories]}
                    />
                    <div className="ml-auto flex items-center gap-2">
                      <span className="tech-label text-muted-foreground/70">Sort</span>
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortKey)}
                        aria-label={`Sort ${tab}`}
                        className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                      >
                        <option value="featured">Featured</option>
                        <option value="name">Name A–Z</option>
                        <option value="category">Category</option>
                        <option value="country">Country</option>
                      </select>
                    </div>
                  </div>

                  {/* rows */}
                  {filtered.length === 0 ? (
                    <p className="mt-10 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                      No {tab} match — try clearing a filter.
                    </p>
                  ) : (
                    <Stagger
                      className="mt-8 divide-y divide-border overflow-hidden rounded-lg border border-border"
                      gap={0.035}
                    >
                      {filtered.map((p) => (
                        <motion.button
                          key={p.id}
                          variants={staggerItem}
                          onClick={() => selectRow(p.id)}
                          onMouseEnter={() => setRowHoverId(p.id)}
                          onMouseLeave={() => setRowHoverId(null)}
                          aria-label={`View ${p.name} on the globe`}
                          className={`grid w-full grid-cols-[92px_1fr_auto] items-center gap-4 bg-card px-5 py-4 text-left transition-colors duration-300 hover:bg-primary/5 md:grid-cols-[120px_1.4fr_1fr_1fr_auto] ${
                            lockedId === p.id ? "bg-primary/5" : ""
                          }`}
                        >
                          {p.logo ? (
                            <Image
                              src={p.logo}
                              alt=""
                              width={96}
                              height={30}
                              loading="lazy"
                              className="h-6 w-auto max-w-[104px] object-contain"
                            />
                          ) : (
                            <span aria-hidden />
                          )}
                          <span className="truncate font-medium text-foreground">{p.name}</span>
                          <span className="hidden text-sm text-muted-foreground md:block">
                            {p.hq.city}, {p.hq.country}
                          </span>
                          <span className="hidden text-sm text-muted-foreground md:block">
                            {p.category}
                          </span>
                          {p.website ? (
                            <a
                              href={p.website}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="tech-label text-primary underline-offset-4 hover:underline"
                              aria-label={`${p.name} official website`}
                            >
                              Site ↗
                            </a>
                          ) : (
                            <span aria-hidden />
                          )}
                        </motion.button>
                      ))}
                    </Stagger>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <footer className="mx-auto mt-24 max-w-7xl border-t border-border px-6 pt-8 text-center">
          <p className="tech-label text-muted-foreground/70">
            Partner headquarters shown are approximate · Projects are built in
            Hyderabad
          </p>
        </footer>
      </main>
    </>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={`Filter by ${label.toLowerCase()}`}
      className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o === "all" ? `All ${label.toLowerCase()}s` : o}
        </option>
      ))}
    </select>
  );
}
