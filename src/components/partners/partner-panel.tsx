"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { Partner } from "@/lib/partners";

// Right-side information panel (desktop) / bottom sheet (mobile), styled as
// an architectural project-information sheet: title block, ruled data rows,
// sheet-corner ticks. Empty state invites exploration.
export function PartnerPanel({
  partner,
  onClose,
}: {
  partner: Partner | null;
  onClose: () => void;
}) {
  return (
    <div
      aria-live="polite"
      className={
        partner
          ? "fixed inset-x-0 bottom-0 z-40 lg:static lg:z-auto"
          : "hidden lg:block"
      }
    >
      <AnimatePresence mode="wait">
        {partner ? (
          <motion.article
            key={partner.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="sheet-corners overflow-hidden rounded-t-lg border border-border bg-white/95 shadow-[0_-8px_30px_rgba(15,40,90,0.12)] backdrop-blur-md lg:rounded-lg lg:bg-card lg:shadow-none"
            role="dialog"
            aria-label={`${partner.name} details`}
          >
            {/* title block */}
            <div className="flex items-start justify-between gap-4 border-b border-border bg-secondary/40 px-6 py-5">
              <div>
                <span className="tech-label text-primary">
                  Partner sheet · {partner.id.toUpperCase()}
                </span>
                <h3 className="mt-2 text-xl font-semibold leading-tight text-foreground">
                  {partner.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Close partner details"
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <span aria-hidden className="text-lg leading-none">
                  ×
                </span>
              </button>
            </div>

            <div className="px-6 py-5">
              <Image
                src={partner.logo}
                alt={`${partner.name} logo`}
                width={140}
                height={44}
                className="h-9 w-auto max-w-[160px] object-contain"
              />

              {/* ruled data rows */}
              <dl className="mt-5 text-sm">
                <Row label="Category" value={partner.category} />
                <Row
                  label="Headquarters"
                  value={`${partner.hq.city}, ${partner.hq.country}`}
                />
                <Row label="Operates in" value={partner.countries.join(" · ")} />
                {partner.offices?.length ? (
                  <Row
                    label="Regional offices"
                    value={partner.offices.map((o) => o.city).join(" · ")}
                  />
                ) : null}
                {partner.since ? (
                  <Row label="Partner since" value={String(partner.since)} />
                ) : null}
              </dl>

              <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
                {partner.summary}
              </p>

              {partner.website && (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noreferrer"
                  className="tech-label mt-5 inline-flex items-center gap-2 text-primary underline-offset-4 hover:underline"
                >
                  Official website ↗
                </a>
              )}
            </div>
          </motion.article>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="sheet-corners rounded-lg border border-dashed border-border p-6"
          >
            <p className="tech-label text-primary">Global engineering ecosystem</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Hover a partner to explore our worldwide collaboration network.
              Every marker is a partner headquarters — our projects themselves
              are built in Hyderabad.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 border-b border-border/60 py-2 last:border-0">
      <dt className="w-32 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
