"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Navbar } from "@/components/navbar";
import { Reveal, SectionHeading, Stagger, staggerItem } from "@/components/reveal";
import { Input } from "@/components/ui/input";
import { PartnerGlobe } from "./partner-globe";
import { PartnerPanel } from "./partner-panel";
import {
  CATEGORIES,
  PARTNERS,
  REGIONS,
  countryCount,
  countryList,
  partnerCount,
  type Partner,
  type PartnerCategory,
  type Region,
} from "@/lib/partners";

type SortKey = "featured" | "name" | "category" | "country";

// OUR PARTNERS — global engineering ecosystem. Fully data-driven from
// src/lib/partners.ts. Selection is layered: transient hover (chip) previews
// a partner; a click locks it. Everything (globe, legend, directory, panel)
// reads one shared state so all surfaces stay in sync.
export function PartnersPageClient() {
  const [lockedId, setLockedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null); // globe chip hover
  const [rowHoverId, setRowHoverId] = useState<string | null>(null); // directory hover
  const [featuredId, setFeaturedId] = useState<string | null>(null); // idle spotlight
  const [hoverCategory, setHoverCategory] = useState<PartnerCategory | null>(null);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
  const [country, setCountry] = useState<string>("all");
  const [category, setCategory] = useState<PartnerCategory | "all">("all");
  const [sort, setSort] = useState<SortKey>("featured");

  // transient hover previews; a click locks the selection
  const effectiveId = hoverId ?? lockedId;
  const selected: Partner | null =
    PARTNERS.find((p) => p.id === effectiveId) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = PARTNERS.filter((p) => {
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
    const by: Record<SortKey, (a: Partner, b: Partner) => number> = {
      featured: (a, b) => Number(!!b.featured) - Number(!!a.featured) || a.name.localeCompare(b.name),
      name: (a, b) => a.name.localeCompare(b.name),
      category: (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
      country: (a, b) => a.hq.country.localeCompare(b.hq.country) || a.name.localeCompare(b.name),
    };
    return [...list].sort(by[sort]);
  }, [query, region, country, category, sort]);

  const visibleIds = useMemo(() => new Set(filtered.map((p) => p.id)), [filtered]);

  // globe highlight = category-legend hover ∪ directory-row hover
  const highlightIds = useMemo(() => {
    const set = new Set<string>();
    if (rowHoverId) set.add(rowHoverId);
    if (hoverCategory)
      for (const p of PARTNERS) if (p.category === hoverCategory) set.add(p.id);
    return set;
  }, [rowHoverId, hoverCategory]);

  const featured = PARTNERS.find((p) => p.id === featuredId) ?? null;

  const selectRow = (id: string) => {
    setLockedId(id);
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const search = (value: string) => {
    setQuery(value);
    const q = value.trim().toLowerCase();
    if (q.length >= 2) {
      const hit = PARTNERS.find((p) => p.name.toLowerCase().includes(q));
      if (hit) setLockedId(hit.id);
    }
  };

  return (
    <>
      <Navbar visible />

      {/* full-page blueprint presentation board */}
      <div
        className="bp-grid pointer-events-none fixed inset-0 -z-10 opacity-[0.5]"
        style={{
          maskImage:
            "radial-gradient(120% 90% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(120% 90% at 50% 0%, black 40%, transparent 100%)",
        }}
        aria-hidden
      />

      <main className="mx-auto max-w-7xl px-6 pb-28 pt-28 md:pt-32">
        {/* HERO */}
        <header className="max-w-3xl">
          <Reveal>
            <span className="tech-label text-primary">
              Global network · {partnerCount} partners · {countryCount} countries
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
        </header>

        {/* GLOBE STAGE: legend | globe | panel */}
        <section
          className="relative mt-16 grid items-start gap-10 lg:grid-cols-[210px_minmax(0,1fr)_340px]"
          aria-label="Partner network globe"
        >
          {/* LEFT LEGEND */}
          <Reveal className="order-2 lg:order-1">
            <div className="lg:sticky lg:top-28">
              <p className="tech-label text-primary">Global network</p>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <span className="block size-2 rotate-45 bg-primary shadow-[0_0_0_2px_white]" />
                  Headquarters
                </li>
                <li className="flex items-center gap-3">
                  <span className="block size-2 rounded-full border-[1.5px] border-primary bg-white" />
                  Regional office
                </li>
                <li className="flex items-center gap-3">
                  <svg width="26" height="6" aria-hidden>
                    <line
                      x1="0"
                      y1="3"
                      x2="26"
                      y2="3"
                      stroke="var(--eng-red)"
                      strokeWidth="1.5"
                      strokeDasharray="2 3"
                    />
                  </svg>
                  Active network
                </li>
              </ul>

              <p className="tech-label mt-8 text-primary">Partner categories</p>
              <ul className="mt-4 space-y-1">
                {CATEGORIES.map((c) => (
                  <li key={c}>
                    <button
                      onMouseEnter={() => setHoverCategory(c)}
                      onMouseLeave={() => setHoverCategory(null)}
                      onFocus={() => setHoverCategory(c)}
                      onBlur={() => setHoverCategory(null)}
                      onClick={() => setCategory(category === c ? "all" : c)}
                      aria-pressed={category === c}
                      className={`w-full rounded-md px-2.5 py-1.5 text-left text-sm transition-colors duration-300 ${
                        category === c
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* GLOBE */}
          <Reveal className="order-1 mx-auto w-full max-w-[760px] lg:order-2" delay={0.1}>
            <div className="sheet-corners relative rounded-lg border border-border bg-gradient-to-b from-card to-transparent p-4 md:p-6">
              <PartnerGlobe
                partners={PARTNERS}
                selectedId={effectiveId}
                visibleIds={visibleIds}
                highlightIds={highlightIds}
                onSelect={(id) => setLockedId(id)}
                onHoverChange={setHoverId}
                onFeature={setFeaturedId}
              />

              {/* featured-partner caption (idle spotlight) */}
              <AnimatePresence>
                {featured && !effectiveId && (
                  <motion.div
                    key={featured.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-white/90 px-4 py-2 shadow-[0_2px_14px_rgba(15,40,90,0.10)] backdrop-blur-sm"
                  >
                    <Image
                      src={featured.logo}
                      alt=""
                      width={72}
                      height={22}
                      className="h-4 w-auto max-w-[76px] object-contain"
                    />
                    <span className="tech-label text-muted-foreground">
                      {featured.hq.city}, {featured.hq.country}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="tech-label mt-3 text-center text-muted-foreground/70">
              Drag to rotate — markers are partner headquarters, not project
              locations
            </p>
          </Reveal>

          {/* RIGHT PANEL */}
          <div className="order-3">
            <div className="lg:sticky lg:top-28">
              <PartnerPanel partner={selected} onClose={() => setLockedId(null)} />
            </div>
          </div>
        </section>

        {/* DIRECTORY */}
        <section className="mt-28" aria-label="Partner directory">
          <SectionHeading kicker="Directory" title="Meet the network" />

          {/* search + filters + sort */}
          <div className="flex flex-wrap items-center gap-3">
            <Input
              value={query}
              onChange={(e) => search(e.target.value)}
              placeholder="Search partners, cities, countries…"
              aria-label="Search partners"
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
              options={["all", ...countryList]}
            />
            <FilterSelect
              label="Category"
              value={category}
              onChange={(v) => setCategory(v as PartnerCategory | "all")}
              options={["all", ...CATEGORIES]}
            />
            <div className="ml-auto flex items-center gap-2">
              <span className="tech-label text-muted-foreground/70">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sort partners"
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
              No partners match — try clearing a filter.
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
                  <Image
                    src={p.logo}
                    alt=""
                    width={96}
                    height={30}
                    loading="lazy"
                    className="h-6 w-auto max-w-[104px] object-contain"
                  />
                  <span className="font-medium text-foreground">{p.name}</span>
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
        </section>

        <footer className="mt-24 border-t border-border pt-8 text-center">
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
