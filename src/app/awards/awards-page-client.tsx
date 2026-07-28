"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Navbar } from "@/components/navbar";
import { Reveal, SectionHeading } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel";
import { CircularGallery, type GalleryItem } from "@/components/ui/circular-gallery";
import { awardsPage, certifications, company } from "@/lib/content";

// Awards & Certifications — sheet 08 of the drawing set. Elevated pass:
// atlas tiles behave as premium cards with click-to-preview; certifications
// are a click-to-expand accordion (single-open); a shared document modal
// handles previews; the quality section reads as editorial rather than a
// spec list; a new download centre precedes the CTA. Everything else
// keeps the presentation-board language established across the homepage.

// ─────────────────────────────────────────────────────────────────────
// Shared document viewer — used by the atlas tiles and download cards.
// A single instance mounted at page level; state lifted so escape/back
// behaviour and the "close previously open" contract are enforced.
// ─────────────────────────────────────────────────────────────────────
type DocumentPreview = {
  id: string;
  kind: "atlas" | "certification";
  index: string; // A.01 / C.02 / etc.
  title: string;
  authority?: string;
  meta?: string;
  imageUrl?: string;
  downloadUrl?: string;
};

function DocumentModal({
  doc,
  onClose,
}: {
  doc: DocumentPreview | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!doc) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [doc, onClose]);

  return (
    <AnimatePresence>
      {doc && (
        <motion.div
          key="modal"
          role="dialog"
          aria-modal="true"
          aria-label={doc.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
          className="fixed inset-0 flex items-center justify-center bg-background/85 p-6 backdrop-blur-md md:p-16"
          style={{ zIndex: 80 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
            onClick={(e) => e.stopPropagation()}
            className="sheet-corners relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-sm border border-primary/40 bg-card shadow-[0_20px_80px_-30px_rgba(0,120,243,0.35)] md:flex-row"
            style={{ maxHeight: "85vh" }}
          >
            {/* Left / top: image or blueprint plate */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-background p-6 md:p-10">
              <div className="bp-grid absolute inset-0 opacity-30" aria-hidden />
              {doc.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={doc.imageUrl}
                  alt=""
                  className="relative max-h-[70vh] max-w-full rounded-sm border border-border object-contain"
                  aria-hidden
                />
              ) : (
                <div className="relative flex h-full min-h-[240px] w-full max-w-md flex-col items-center justify-center gap-4 text-muted-foreground">
                  <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden>
                    <rect x="10" y="6" width="36" height="44" fill="none" stroke="currentColor" strokeWidth="1" />
                    <line x1="16" y1="16" x2="40" y2="16" stroke="currentColor" strokeWidth="0.6" />
                    <line x1="16" y1="22" x2="40" y2="22" stroke="currentColor" strokeWidth="0.6" />
                    <line x1="16" y1="28" x2="34" y2="28" stroke="currentColor" strokeWidth="0.6" />
                    <circle cx="28" cy="40" r="4" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  </svg>
                  <span className="tech-label">Document held in secure archive</span>
                </div>
              )}
              <span
                className="tech-label pointer-events-none absolute left-6 top-6 text-primary/70"
                aria-hidden
              >
                {doc.index}
              </span>
            </div>

            {/* Right / bottom: metadata + actions */}
            <div className="relative flex w-full flex-col justify-between border-t border-border p-8 md:w-[360px] md:border-l md:border-t-0 md:p-10">
              <div>
                <span className="tech-label text-primary">
                  {doc.kind === "atlas" ? "Award plate" : "Certification"}
                </span>
                <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-3xl">
                  {doc.title}
                </h3>
                {doc.authority ? (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {doc.authority}
                  </p>
                ) : null}
                <dl className="mt-10 space-y-3 text-sm">
                  {doc.meta ? (
                    <div className="flex items-baseline justify-between border-t border-border pt-3">
                      <dt className="tech-label text-muted-foreground/70">
                        Status
                      </dt>
                      <dd className="text-foreground">{doc.meta}</dd>
                    </div>
                  ) : null}
                  <div className="flex items-baseline justify-between border-t border-border pt-3">
                    <dt className="tech-label text-muted-foreground/70">
                      Format
                    </dt>
                    <dd className="text-foreground">
                      {doc.imageUrl ? "Image plate" : "PDF · on request"}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-border pt-3">
                    <dt className="tech-label text-muted-foreground/70">
                      Reference
                    </dt>
                    <dd className="text-foreground">{doc.index}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-10 flex flex-col gap-3">
                {doc.downloadUrl ? (
                  <Button
                    render={
                      <a
                        href={doc.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        download
                      />
                    }
                    nativeButton={false}
                    className="w-full rounded-full"
                  >
                    Download
                  </Button>
                ) : (
                  <Button
                    render={
                      <a
                        href={`mailto:${company.email}?subject=${encodeURIComponent(
                          `Request ${doc.title}`
                        )}`}
                      />
                    }
                    nativeButton={false}
                    className="w-full rounded-full"
                  >
                    Request document
                  </Button>
                )}
                <button
                  onClick={onClose}
                  className="tech-label rounded-full border border-border bg-transparent px-5 py-2.5 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  Close
                </button>
              </div>

              {/* corner drafting ticks */}
              <span
                className="pointer-events-none absolute right-6 top-6 text-muted-foreground/40"
                aria-hidden
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <line x1="9" y1="0" x2="9" y2="18" stroke="currentColor" strokeWidth="0.6" />
                  <line x1="0" y1="9" x2="18" y2="9" stroke="currentColor" strokeWidth="0.6" />
                  <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="0.6" fill="none" />
                </svg>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Award atlas tile — a premium card. Hover surfaces a caption band and
// lifts the border to primary; tap/click opens the document modal.
// ─────────────────────────────────────────────────────────────────────
function AwardTile({
  index,
  url,
  onOpen,
}: {
  index: string;
  url: string;
  onOpen: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={`Open award plate ${index}`}
      className="group sheet-corners relative aspect-square w-full overflow-hidden rounded-sm border border-border bg-card text-left transition-[border-color,box-shadow] duration-300 hover:border-primary/60 hover:shadow-[0_8px_24px_-12px_rgba(0,120,243,0.25),0_0_0_1px_var(--color-primary)/20]"
      whileHover={reduce ? undefined : { y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <GlowingEffect spread={30} glow disabled={false} proximity={48} inactiveZone={0.01} borderWidth={2} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        aria-hidden
      />
      {/* Blueprint edge glow: a hairline that inks in on hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-primary/0 transition-[box-shadow,ring] duration-500 group-hover:ring-primary/50"
      />
      {/* Caption band — slides up on hover / focus. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between border-t border-primary/40 bg-background/85 px-3 py-2 backdrop-blur-sm transition-transform duration-500 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0"
      >
        <span className="tech-label text-primary">{index}</span>
        <span className="tech-label text-muted-foreground/70">
          Recognition plate ↗
        </span>
      </span>
      {/* Index numeral, quietly present in the corner at rest. */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-2 top-2 rounded-full border border-primary/30 bg-background/70 px-2 py-0.5 text-[10px] tracking-[0.22em] text-muted-foreground opacity-70 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0"
      >
        {index}
      </span>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Certification accordion row — single-open contract enforced by lifting
// the "open" id to the section. Row expands with height + opacity to
// avoid clipping and to keep the drafting rules aligned.
// ─────────────────────────────────────────────────────────────────────
function CertificationRow({
  index,
  cert,
  kicker,
  isOpen,
  onToggle,
  onPreview,
}: {
  index: string;
  cert: { name: string; body: string };
  kicker: string;
  isOpen: boolean;
  onToggle: () => void;
  onPreview: () => void;
}) {
  return (
    <li className="border-b border-border">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`cert-panel-${index}`}
        onClick={onToggle}
        className="group flex w-full items-baseline gap-6 py-8 text-left transition-colors hover:bg-secondary/30 md:gap-10 md:py-12"
      >
        <span className="tech-label w-14 flex-shrink-0 text-primary">
          {index}
        </span>
        <div className="flex-1">
          <span className="tech-label text-primary/70">{kicker}</span>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {cert.name}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            {cert.body}
          </p>
        </div>
        <span
          className="tech-label flex flex-shrink-0 items-center gap-3 text-muted-foreground transition-colors group-hover:text-primary"
          aria-hidden
        >
          <span className="hidden md:inline">
            {isOpen ? "Collapse" : "Expand"}
          </span>
          <motion.svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" strokeWidth="1.2" />
            <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.2" />
          </motion.svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`cert-panel-${index}`}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
                opacity: { duration: 0.35, delay: 0.1 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.4, ease: [0.65, 0, 0.35, 1] as const },
                opacity: { duration: 0.2 },
              },
            }}
            className="overflow-hidden"
          >
            <div className="grid gap-10 pb-12 md:grid-cols-12 md:gap-14 md:pb-14">
              {/* Certificate plate — blueprint drawing rather than a fake preview. */}
              <div className="sheet-corners relative aspect-[4/3] overflow-hidden rounded-sm border border-primary/30 bg-card md:col-span-7">
                <div className="bp-grid absolute inset-0 opacity-40" aria-hidden />
                <div className="relative flex h-full flex-col justify-between p-8 md:p-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="tech-label text-primary">{kicker}</span>
                      <p className="mt-2 max-w-xs text-xl font-semibold leading-tight text-foreground md:text-2xl">
                        {cert.name}
                      </p>
                    </div>
                    <span className="tech-label text-muted-foreground/70">
                      {index}
                    </span>
                  </div>
                  <div>
                    <div className="mb-4 h-px w-24 bg-primary/50" aria-hidden />
                    <p className="tech-label text-muted-foreground/80">
                      Issuing body
                    </p>
                    <p className="mt-1 text-base font-medium text-foreground md:text-lg">
                      {cert.body}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details column */}
              <div className="md:col-span-5">
                <p className="text-base leading-relaxed text-muted-foreground">
                  Precertification held from the concept phase and audited by
                  the issuing body. A signed copy of the certification
                  document is available on request.
                </p>
                <dl className="mt-8 border-t border-border">
                  <div className="flex items-baseline justify-between border-b border-border py-3">
                    <dt className="tech-label text-muted-foreground/70">
                      Status
                    </dt>
                    <dd className="text-sm text-foreground">Held current</dd>
                  </div>
                  <div className="flex items-baseline justify-between border-b border-border py-3">
                    <dt className="tech-label text-muted-foreground/70">
                      Format
                    </dt>
                    <dd className="text-sm text-foreground">PDF · on request</dd>
                  </div>
                  <div className="flex items-baseline justify-between border-b border-border py-3">
                    <dt className="tech-label text-muted-foreground/70">
                      Reference
                    </dt>
                    <dd className="text-sm text-foreground">{index}</dd>
                  </div>
                </dl>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    onClick={onPreview}
                    nativeButton
                    className="rounded-full"
                  >
                    Preview
                  </Button>
                  <Button
                    render={
                      <a
                        href={`mailto:${company.email}?subject=${encodeURIComponent(
                          `Request ${cert.name} certificate`
                        )}`}
                      />
                    }
                    nativeButton={false}
                    className="rounded-full border border-border bg-transparent text-foreground hover:bg-secondary"
                  >
                    Request document
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Page-level supporting data — derived, not fabricated.
// CircularGallery is shared with the Team page; its schema uses
// `common` (primary heading) + `binomial` (subtext) + optional photo.
// For certifications we skip photo → the component falls back to a
// brand-gradient tile, which is what we want architecturally.
// ─────────────────────────────────────────────────────────────────────
const kickerFor = (body: string) =>
  body.includes("Green") ? "IGBC" : body.includes("Industry") ? "CII" : "Cert";

const certGalleryItems: GalleryItem[] = certifications.map((c) => ({
  common: c.name,
  binomial: c.body,
  photo: {
    text: `${kickerFor(c.body)} certification plate`,
  },
}));

// ─────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────
export function AwardsPageClient() {
  const [openCert, setOpenCert] = useState<string | null>(null);
  const [doc, setDoc] = useState<DocumentPreview | null>(null);

  const openAtlasTile = useCallback((i: number) => {
    const idx = `A.${String(i + 1).padStart(2, "0")}`;
    setDoc({
      id: `atlas-${i}`,
      kind: "atlas",
      index: idx,
      title: `Recognition plate ${idx}`,
      authority: "Phoenix Group award archive",
      meta: "On record",
      imageUrl: awardsPage.awardsAtlas.urls[i],
    });
  }, []);

  const openCertPreview = useCallback((i: number) => {
    const c = certifications[i]!;
    const idx = `C.${String(i + 1).padStart(2, "0")}`;
    setDoc({
      id: `cert-${i}`,
      kind: "certification",
      index: idx,
      title: c.name,
      authority: c.body,
      meta: "Held current · Rev A",
    });
  }, []);

  const closeModal = useCallback(() => setDoc(null), []);
  const toggleCert = useCallback(
    (id: string) => setOpenCert((prev) => (prev === id ? null : id)),
    []
  );

  return (
    <>
      <Navbar visible />
      <main className="pt-24 md:pt-28">
        {/* ═══════════════ 08.01 · HERO ═══════════════ */}
        <section className="relative overflow-hidden">
          <div className="bp-grid absolute inset-0 opacity-40" aria-hidden />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              maskImage:
                "radial-gradient(70% 60% at 50% 45%, black 0%, transparent 85%)",
              WebkitMaskImage:
                "radial-gradient(70% 60% at 50% 45%, black 0%, transparent 85%)",
              backgroundImage:
                "repeating-linear-gradient(0deg, rgb(0 120 243 / 8%) 0 1px, transparent 1px 120px), repeating-linear-gradient(90deg, rgb(0 120 243 / 8%) 0 1px, transparent 1px 120px)",
            }}
          />
          <div className="relative mx-auto w-[92vw] max-w-[1720px] py-32 md:py-48">
            <Reveal>
              <div className="flex items-baseline justify-between">
                <div className="flex items-center gap-4">
                  <span className="tech-label text-primary">
                    {awardsPage.hero.kicker}
                  </span>
                  <motion.span
                    className="h-px w-24 origin-left bg-primary/40"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
                    aria-hidden
                  />
                </div>
                <span
                  className="tech-label hidden text-muted-foreground/40 md:inline"
                  aria-hidden
                >
                  N — 08 · Sheet 08/08
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1
                className="mt-10 font-semibold tracking-tight text-foreground"
                style={{
                  fontSize: "clamp(3.25rem, 10vw, 10rem)",
                  lineHeight: 0.92,
                  textWrap: "balance",
                }}
              >
                Awards &
                <br />
                certifications
              </h1>
            </Reveal>

            <div
              className="mt-10 flex items-center gap-3 text-muted-foreground/40"
              aria-hidden
            >
              <span className="tech-label">08.01 // Recognition</span>
              <motion.span
                className="h-px flex-1 origin-left bg-current"
                style={{ maxWidth: "min(38vw, 620px)" }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: "easeOut", delay: 0.3 }}
              />
              <span className="tech-label">est. 2001</span>
            </div>

            {/* Editorial lede — folds the old introduction into the hero */}
            <div className="mt-20 grid gap-10 md:grid-cols-12 md:gap-16">
              <div className="md:col-span-8">
                <Reveal delay={0.18}>
                  <p
                    className="text-2xl leading-[1.25] text-foreground md:text-4xl"
                    style={{ textWrap: "balance" }}
                  >
                    Two decades of steady delivery in Hyderabad, precertified
                    green from the first drawing, and recognised across the
                    industry.
                  </p>
                </Reveal>
              </div>
              <div className="md:col-span-4 md:pt-3">
                <Reveal delay={0.28}>
                  <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-base">
                    Held to the standards of an engineering firm — disciplined
                    execution, transparent process, precertified sustainability
                    from day one. What follows is the drawing set: the
                    recognition we&apos;ve earned, the certifications we hold,
                    and the quality regime that underwrites both.
                  </p>
                </Reveal>
              </div>
            </div>

            {/* margin annotations */}
            <div
              className="pointer-events-none absolute inset-0 hidden text-muted-foreground/25 md:block"
              aria-hidden
            >
              <span className="tech-label absolute right-0 top-56 origin-right rotate-90">
                Series R — Recognition
              </span>
              <span className="tech-label absolute bottom-8 left-0">
                Drawing · REC / 08 · Rev A
              </span>
              <span className="tech-label absolute bottom-8 right-0">
                Section 08.00
              </span>
            </div>
          </div>
        </section>

        {/* ═══════════════ 08.02 · AWARDS ═══════════════ */}
        <section
          id="awards"
          className="relative border-y border-border bg-card/40"
        >
          <div className="bp-grid absolute inset-0 opacity-30" aria-hidden />
          <div className="relative mx-auto w-[92vw] max-w-[1720px] py-28 md:py-40">
            <SectionHeading
              kicker="08.02 — Awards"
              title="A record of recognition"
              sheet="Sheet 08/08"
            />

            {/* Credibility ribbon */}
            <Reveal>
              <div className="mb-20 grid border-y border-border py-8 sm:grid-cols-3">
                <div>
                  <p className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                    {awardsPage.awardsAtlas.total}
                  </p>
                  <p className="tech-label mt-2 text-muted-foreground">
                    Industry awards on record
                  </p>
                </div>
                <div className="mt-8 sm:mt-0">
                  <p className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                    20<span className="text-primary"> years</span>
                  </p>
                  <p className="tech-label mt-2 text-muted-foreground">
                    Of continuous recognition
                  </p>
                </div>
                <div className="mt-8 sm:mt-0">
                  <p className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                    40<span className="text-primary"> mil sq ft</span>
                  </p>
                  <p className="tech-label mt-2 text-muted-foreground">
                    Delivered under the same discipline
                  </p>
                </div>
              </div>
            </Reveal>

            {/* 3D carousel — award atlas ring (20 legible faces) */}
            <Reveal delay={0.05}>
              <ThreeDPhotoCarousel
                images={awardsPage.awardsAtlas.urls.slice(0, 20)}
                caption={awardsPage.awardsAtlas.caption}
              />
            </Reveal>

            {/* Full atlas — 64 clickable award tiles */}
            <div className="mt-28 border-t border-border pt-12">
              <div className="mb-10 flex items-baseline justify-between">
                <span className="tech-label text-primary">
                  A.01 — Full atlas
                </span>
                <span
                  className="tech-label hidden text-muted-foreground/50 md:inline"
                  aria-hidden
                >
                  {awardsPage.awardsAtlas.total} plates · Scale 1:1
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-5 md:grid-cols-6 lg:grid-cols-8">
                {awardsPage.awardsAtlas.urls.map((url, i) => (
                  <AwardTile
                    key={url}
                    index={`A.${String(i + 1).padStart(2, "0")}`}
                    url={url}
                    onOpen={() => openAtlasTile(i)}
                  />
                ))}
              </div>
              <p className="tech-label mt-10 text-muted-foreground/60">
                Tap a plate to view · detailed award-by-award attribution pending client consolidation
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════ 08.03 · CERTIFICATIONS ═══════════════ */}
        <section
          id="certifications"
          className="relative mx-auto w-[92vw] max-w-[1720px] py-28 md:py-40"
        >
          <SectionHeading
            kicker="08.03 — Certifications"
            title="Held to standard, on the drawing"
            sheet="Sheet 08/08"
          />

          <div className="grid gap-16 lg:grid-cols-12">
            {/* Left rail — supporting turntable + intro */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
              <Reveal>
                <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
                  Precertified green from the first drawing, audited by the
                  bodies that set the standard. Tap a row to expand its plate
                  and request a signed copy.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mt-10">
                  <CircularGallery items={certGalleryItems} radius={320} />
                </div>
                <p className="tech-label mt-4 text-center text-muted-foreground/60">
                  Auto-rotating — pauses off-screen
                </p>
              </Reveal>
            </div>

            {/* Right — expandable ledger */}
            <div className="lg:col-span-7">
              <Reveal delay={0.15}>
                <ul className="border-t border-border">
                  {certifications.map((c, i) => {
                    const idx = `C.${String(i + 1).padStart(2, "0")}`;
                    return (
                      <CertificationRow
                        key={c.name}
                        index={idx}
                        cert={c}
                        kicker={kickerFor(c.body)}
                        isOpen={openCert === idx}
                        onToggle={() => toggleCert(idx)}
                        onPreview={() => openCertPreview(i)}
                      />
                    );
                  })}
                </ul>
              </Reveal>
              <p className="tech-label mt-8 text-muted-foreground/60">
                Only one row opens at a time — click again to collapse
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════ 08.04 · QUALITY STANDARDS ═══════════════ */}
        <section
          id="quality"
          className="relative border-y border-border bg-card/40"
        >
          <div className="bp-grid absolute inset-0 opacity-30" aria-hidden />
          <div className="relative mx-auto w-[92vw] max-w-[1720px] py-28 md:py-40">
            <SectionHeading
              kicker="08.04 — Quality standards"
              title="Engineered to standard, verified in evidence"
              sheet="Sheet 08/08"
            />

            {/* Editorial pull-quote */}
            <Reveal>
              <div className="mb-16 grid gap-6 md:mb-24 md:grid-cols-12 md:gap-14">
                <p
                  className="text-3xl font-semibold leading-[1.15] tracking-tight text-foreground md:col-span-9 md:text-5xl"
                  style={{ textWrap: "balance" }}
                >
                  <span className="text-primary">Every project</span> runs the
                  same disciplined sequence — from feasibility to handover,
                  precertified green, independently audited, and delivered
                  against a public schedule.
                </p>
                <div className="border-l border-primary/40 pl-5 md:col-span-3 md:mt-2">
                  <span className="tech-label text-primary/80">
                    Sequence Q1 — Q4
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    The four disciplines below aren&apos;t stages — they run in
                    parallel across the life of every project.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Quality pillars — each with a small engineering diagram */}
            <ol className="border-t border-border">
              {awardsPage.quality.pillars.map((p, i) => (
                <li key={p.num} className="border-b border-border">
                  <Reveal delay={i * 0.05}>
                    <div className="grid gap-8 py-12 md:grid-cols-12 md:gap-10 md:py-16">
                      <div className="md:col-span-2">
                        <span className="tech-label text-primary">{p.num}</span>
                      </div>
                      <div className="md:col-span-6">
                        <h3 className="text-2xl font-semibold tracking-tight text-foreground md:text-4xl">
                          {p.title}
                        </h3>
                        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                          {p.body}
                        </p>
                      </div>
                      <div className="md:col-span-4 md:justify-self-end">
                        <QualityDiagram index={i} />
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ═══════════════ 08.05 · DOWNLOADS ═══════════════ */}
        <section
          id="downloads"
          className="relative mx-auto w-[92vw] max-w-[1720px] py-28 md:py-40"
        >
          <SectionHeading
            kicker="08.05 — Download centre"
            title="Documents on record"
            sheet="Sheet 08/08"
          />

          <Reveal>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Signed copies of every certification we hold are kept in a
              secure archive and released on request. Preview any plate below
              and request a copy — we&apos;ll respond within one business day.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-6 md:mt-24 md:grid-cols-2 lg:grid-cols-3">
            {certifications.map((c, i) => {
              const idx = `D.${String(i + 1).padStart(2, "0")}`;
              return (
                <Reveal key={c.name} delay={i * 0.05}>
                  <article className="sheet-corners group relative flex h-full flex-col justify-between overflow-hidden rounded-sm border border-border bg-card p-8 transition-[border-color,box-shadow] duration-500 hover:border-primary/60 hover:shadow-[0_12px_32px_-18px_rgba(0,120,243,0.30)]">
                    {/* faint blueprint page inside the card */}
                    <div
                      className="bp-grid pointer-events-none absolute inset-0 opacity-25"
                      aria-hidden
                    />
                    <div className="relative">
                      <div className="flex items-baseline justify-between">
                        <span className="tech-label text-primary">
                          {kickerFor(c.body)}
                        </span>
                        <span className="tech-label text-muted-foreground/60">
                          {idx}
                        </span>
                      </div>
                      <h3 className="mt-8 text-2xl font-semibold leading-tight tracking-tight text-foreground">
                        {c.name}
                      </h3>
                      <p className="mt-3 text-sm text-muted-foreground">
                        {c.body}
                      </p>
                    </div>
                    <dl className="relative mt-10 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-5 text-xs">
                      <div>
                        <dt className="tech-label text-muted-foreground/70">
                          Format
                        </dt>
                        <dd className="mt-1 text-foreground">PDF</dd>
                      </div>
                      <div>
                        <dt className="tech-label text-muted-foreground/70">
                          Size
                        </dt>
                        <dd className="mt-1 text-foreground">Est. 1.2 MB</dd>
                      </div>
                      <div>
                        <dt className="tech-label text-muted-foreground/70">
                          Updated
                        </dt>
                        <dd className="mt-1 text-foreground">Rev A</dd>
                      </div>
                      <div>
                        <dt className="tech-label text-muted-foreground/70">
                          Access
                        </dt>
                        <dd className="mt-1 text-foreground">On request</dd>
                      </div>
                    </dl>
                    <div className="relative mt-8 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openCertPreview(i)}
                        className="tech-label rounded-full border border-border bg-transparent px-5 py-2.5 text-foreground transition-colors hover:border-primary/50 hover:bg-secondary/40"
                      >
                        Preview
                      </button>
                      <Button
                        render={
                          <a
                            href={`mailto:${company.email}?subject=${encodeURIComponent(
                              `Request ${c.name} certificate`
                            )}`}
                          />
                        }
                        nativeButton={false}
                        className="rounded-full"
                      >
                        Request
                      </Button>
                    </div>
                    {/* hover-illuminated bottom rule */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-700 ease-out group-hover:scale-x-100"
                    />
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ═══════════════ 08.06 · CTA ═══════════════ */}
        <section className="relative overflow-hidden border-t border-border bg-card/40">
          <div className="bp-grid absolute inset-0 opacity-30" aria-hidden />
          <div className="relative mx-auto w-[92vw] max-w-[1720px] py-28 md:py-40">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-7">
                <Reveal>
                  <span className="tech-label text-primary">
                    08.06 — Enquiry
                  </span>
                </Reveal>
                <Reveal delay={0.08}>
                  <h2
                    className="mt-8 font-semibold leading-[1.02] tracking-tight text-foreground"
                    style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
                  >
                    See the full record.
                  </h2>
                </Reveal>
              </div>
              <div className="md:col-span-5 md:pt-12">
                <Reveal delay={0.1}>
                  <p className="max-w-md text-lg text-muted-foreground">
                    Request the complete award record, individual certification
                    copies or a walk through our quality regime. We respond
                    within one business day.
                  </p>
                  <div className="mt-10 flex flex-wrap items-center gap-4">
                    <Button
                      render={<Link href="/#contact" />}
                      nativeButton={false}
                      size="lg"
                      className="rounded-full px-7"
                    >
                      Request the record
                    </Button>
                    <a
                      href={`mailto:${company.email}?subject=Awards%20%26%20Certifications`}
                      className="tech-label text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                    >
                      Or email us directly ↗
                    </a>
                  </div>
                </Reveal>
              </div>
            </div>

            <p className="tech-label mt-24 text-center text-muted-foreground/50">
              Drawing set 01—08 · Rev A · Section 08.06
            </p>
          </div>
        </section>
      </main>

      <DocumentModal doc={doc} onClose={closeModal} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Small engineering diagrams for each quality pillar — drafting SVGs
// (elevation ticks, section mark, contour, checkmark) at low opacity so
// they read as annotations, not decoration.
// ─────────────────────────────────────────────────────────────────────
function QualityDiagram({ index }: { index: number }) {
  const common =
    "h-32 w-full max-w-[220px] text-primary/40 md:h-40 md:max-w-[260px]";
  if (index === 0) {
    // Elevation stack — Q1 Engineering standards
    return (
      <svg viewBox="0 0 200 160" className={common} aria-hidden>
        <line x1="20" y1="140" x2="180" y2="140" stroke="currentColor" strokeWidth="0.8" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect
              x={30 + i * 8}
              y={140 - (i + 1) * 24}
              width={140 - i * 16}
              height={20}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
            />
            <text
              x={180}
              y={140 - (i + 1) * 24 + 12}
              fontSize="7"
              fill="currentColor"
              fontFamily="monospace"
              letterSpacing="1"
            >
              L{i + 1}
            </text>
          </g>
        ))}
        <text x={20} y={155} fontSize="6" fill="currentColor" fontFamily="monospace" letterSpacing="1.5">
          ELEVATION · SCALE 1:200
        </text>
      </svg>
    );
  }
  if (index === 1) {
    // Grid + probes — Q2 Construction quality
    return (
      <svg viewBox="0 0 200 160" className={common} aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`v${i}`} x1={30 + i * 30} y1={30} x2={30 + i * 30} y2={130} stroke="currentColor" strokeWidth="0.5" />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <line key={`h${i}`} x1={30} y1={30 + i * 30} x2={150} y2={30 + i * 30} stroke="currentColor" strokeWidth="0.5" />
        ))}
        {[
          [60, 60], [120, 60], [90, 90], [60, 120], [120, 120],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={3} fill="none" stroke="currentColor" strokeWidth="0.9" />
            <circle cx={cx} cy={cy} r={1} fill="currentColor" />
          </g>
        ))}
        <text x={30} y={148} fontSize="6" fill="currentColor" fontFamily="monospace" letterSpacing="1.5">
          TEST GRID · 5 PROBES
        </text>
      </svg>
    );
  }
  if (index === 2) {
    // Contour — Q3 Green compliance
    return (
      <svg viewBox="0 0 200 160" className={common} aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M20 ${120 - i * 12} Q60 ${100 - i * 12} 100 ${115 - i * 12} T180 ${105 - i * 12}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={i === 2 ? 1 : 0.5}
          />
        ))}
        <text x={20} y={148} fontSize="6" fill="currentColor" fontFamily="monospace" letterSpacing="1.5">
          IGBC CONTOUR · REV A
        </text>
      </svg>
    );
  }
  // Q4 — signature block
  return (
    <svg viewBox="0 0 200 160" className={common} aria-hidden>
      <rect x="20" y="30" width="160" height="100" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <line x1="30" y1="60" x2="170" y2="60" stroke="currentColor" strokeWidth="0.5" />
      <line x1="30" y1="80" x2="170" y2="80" stroke="currentColor" strokeWidth="0.5" />
      <line x1="30" y1="100" x2="170" y2="100" stroke="currentColor" strokeWidth="0.5" />
      <path d="M35 115 L50 125 L75 100" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <text x={35} y={54} fontSize="6" fill="currentColor" fontFamily="monospace" letterSpacing="1.5">CERTIFIED</text>
      <text x={35} y={74} fontSize="6" fill="currentColor" fontFamily="monospace" letterSpacing="1.5">REVIEWED</text>
      <text x={35} y={94} fontSize="6" fill="currentColor" fontFamily="monospace" letterSpacing="1.5">RELEASED</text>
      <text x={20} y={148} fontSize="6" fill="currentColor" fontFamily="monospace" letterSpacing="1.5">
        BLOCK · CII 04/A
      </text>
    </svg>
  );
}
