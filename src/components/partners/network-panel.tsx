"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { NetworkEntity } from "@/lib/network-types";

// Right-side information panel (desktop) / bottom sheet (mobile), styled as
// an architectural project-information sheet: title block, ruled data rows,
// sheet-corner ticks. Shared by both the Partners and Clients tabs — the
// title block and empty state read "network"/entityLabel so they're correct
// on either tab. Empty state invites exploration.
export function NetworkPanel({
  entity,
  entityLabel,
  onClose,
}: {
  entity: NetworkEntity | null;
  /** "Partner" or "Client" — drives the title block + empty-state copy */
  entityLabel: string;
  onClose: () => void;
}) {
  return (
    <div
      aria-live="polite"
      className={
        entity
          ? "fixed inset-x-0 bottom-0 z-40 lg:static lg:z-auto"
          : "block"
      }
    >
      <AnimatePresence mode="wait">
        {entity ? (
          <motion.article
            key={entity.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="sheet-corners overflow-hidden rounded-t-lg border border-border bg-white/95 shadow-[0_-8px_30px_rgba(15,40,90,0.12)] backdrop-blur-md lg:rounded-lg lg:bg-card lg:shadow-[0_8px_30px_rgba(15,40,90,0.14)]"
            role="dialog"
            aria-label={`${entity.name} details`}
          >
            {/* title block */}
            <div className="flex items-start justify-between gap-4 border-b border-border bg-secondary/40 px-5 py-4">
              <div>
                <span className="tech-label text-primary">
                  {entityLabel} profile · {entity.id.toUpperCase()}
                </span>
                <h3 className="mt-1.5 text-lg font-semibold leading-tight text-foreground">
                  {entity.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label={`Close ${entityLabel.toLowerCase()} details`}
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <span aria-hidden className="text-lg leading-none">
                  ×
                </span>
              </button>
            </div>

            <div className="px-5 py-4">
              {entity.logo ? (
                <Image
                  src={entity.logo}
                  alt={`${entity.name} logo`}
                  width={140}
                  height={44}
                  className="h-8 w-auto max-w-[160px] object-contain"
                />
              ) : null}

              {/* ruled data rows — tighter than before, more info per screen */}
              <dl className={`text-sm ${entity.logo ? "mt-4" : ""}`}>
                <Row label="Category" value={entity.category} />
                <Row
                  label="Headquarters"
                  value={`${entity.hq.city}, ${entity.hq.country}`}
                />
                <Row label="Operates in" value={entity.countries.join(" · ")} />
                {entity.offices?.length ? (
                  <Row
                    label="Regional offices"
                    value={entity.offices.map((o) => o.city).join(" · ")}
                  />
                ) : null}
                {entity.since ? (
                  <Row label={`${entityLabel} since`} value={String(entity.since)} />
                ) : null}
              </dl>

              <p className="mt-4 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
                {entity.summary}
              </p>

              {entity.website && (
                <a
                  href={entity.website}
                  target="_blank"
                  rel="noreferrer"
                  className="tech-label mt-4 inline-flex items-center gap-2 text-primary underline-offset-4 hover:underline"
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
            className="sheet-corners rounded-lg border border-dashed border-border bg-white/85 p-5 backdrop-blur-sm"
          >
            <p className="tech-label text-primary">Global engineering ecosystem</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Select a mark on the globe to explore our worldwide network. Every
              route converges on Hyderabad — where our projects are built.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 border-b border-border/60 py-1.5 last:border-0">
      <dt className="w-28 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
