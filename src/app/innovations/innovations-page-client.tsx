"use client";

import { ArrowUpDown, DoorOpen, Leaf, Radar, Recycle, ShieldCheck, Timer, Waypoints } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Reveal, SectionHeading, Stagger, staggerItem } from "@/components/reveal";
import { motion } from "motion/react";
import { ElevatorDiagram } from "./elevator-diagram";
import {
  ecoBuildings,
  innovationsIntro,
  siteMonitoring,
  steelConstruction,
  verticalTransport,
} from "@/lib/innovations";

const dcsIcons = [DoorOpen, Timer, Waypoints];

// INNOVATIONS — same architectural-blueprint presentation board as the rest
// of the site. Content sourced from phoenixindia.net/Innovations — see
// src/lib/innovations.ts. Site monitoring, steel construction, and
// eco-friendly buildings use real photography; DCS (vertical transport) had
// only a small stock icon on the source site, so it gets a purpose-built
// animated elevator/shaft diagram instead (see elevator-diagram.tsx) —
// the car travels between floors on its own, and hovering/focusing a
// benefit highlights the specific detail it's describing.
export function InnovationsPageClient() {
  return (
    <>
      <Navbar visible />

      <div
        className="bp-grid pointer-events-none fixed inset-0 -z-10 opacity-[0.35]"
        aria-hidden
      />

      <main className="pb-28 pt-28 md:pt-32">
        <header className="mx-auto w-[92vw] max-w-[1720px]">
          <SectionHeading kicker={innovationsIntro.kicker} title={innovationsIntro.title} />
          <Reveal delay={0.1}>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {innovationsIntro.summary}
            </p>
          </Reveal>
        </header>

        {/* Site monitoring — drones / AI / 3D scanning */}
        <FeatureSection
          icon={Radar}
          eyebrow={siteMonitoring.eyebrow}
          title={siteMonitoring.title}
          description={siteMonitoring.description}
          photo={siteMonitoring.photo}
          photoAlt="Drone used for aerial site monitoring"
        >
          <Stagger className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {siteMonitoring.uses.map((use) => (
              <motion.div
                key={use}
                variants={staggerItem}
                className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground"
              >
                {use}
              </motion.div>
            ))}
          </Stagger>
        </FeatureSection>

        {/* Recyclable steel construction */}
        <FeatureSection
          icon={Recycle}
          eyebrow={steelConstruction.eyebrow}
          title={steelConstruction.title}
          description={steelConstruction.description}
          photo={steelConstruction.photo}
          photoAlt="Steel structure under construction"
          reverse
        >
          <Reveal delay={0.15} className="mt-8 flex items-center gap-6">
            <div>
              <p className="tech-label text-muted-foreground/70">From</p>
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {steelConstruction.stat.from}
              </p>
            </div>
            <span className="tech-label text-primary" aria-hidden>
              →
            </span>
            <div>
              <p className="tech-label text-muted-foreground/70">To</p>
              <p className="text-3xl font-semibold tracking-tight text-primary">
                {steelConstruction.stat.to}
              </p>
            </div>
          </Reveal>
        </FeatureSection>

        {/* Destination Control System */}
        <FeatureSection
          icon={ArrowUpDown}
          eyebrow={verticalTransport.eyebrow}
          title={verticalTransport.title}
          description={verticalTransport.description}
          reverse
          visual={
            <ElevatorDiagram
              benefits={verticalTransport.benefits.map((label, i) => ({ label, icon: dcsIcons[i] }))}
            />
          }
        />

        {/* Eco-friendly buildings */}
        <FeatureSection
          icon={Leaf}
          eyebrow={ecoBuildings.eyebrow}
          title={ecoBuildings.title}
          description={ecoBuildings.description}
          photo={ecoBuildings.photo}
          photoAlt="Green building facade with planted balconies"
        >
          <BulletList items={ecoBuildings.pillars} />
        </FeatureSection>

        <footer className="mx-auto mt-24 w-[92vw] max-w-[1720px] border-t border-border pt-8 text-center">
          <p className="tech-label flex items-center justify-center gap-2 text-muted-foreground/70">
            <ShieldCheck size={14} aria-hidden />
            Innovation across every stage — planning to delivery
          </p>
        </footer>
      </main>
    </>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <Stagger className="mt-6 space-y-3">
      {items.map((item) => (
        <motion.div key={item} variants={staggerItem} className="flex items-start gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
          <p className="text-sm leading-relaxed text-foreground">{item}</p>
        </motion.div>
      ))}
    </Stagger>
  );
}

function FeatureSection({
  icon: Icon,
  eyebrow,
  title,
  description,
  photo,
  photoAlt,
  visual,
  reverse,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>;
  eyebrow: string;
  title: string;
  description: string;
  photo?: string;
  photoAlt?: string;
  /** Interactive diagram to show instead of a photo (e.g. HubDiagram). */
  visual?: React.ReactNode;
  reverse?: boolean;
  children?: React.ReactNode;
}) {
  const hasVisual = Boolean(photo || visual);

  const textBlock = (
    <div>
      <Reveal>
        <div className="flex items-center gap-2 text-primary">
          <Icon size={16} aria-hidden />
          <p className="tech-label">{eyebrow}</p>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
      </Reveal>
      <Reveal delay={0.14}>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </Reveal>
      {children}
    </div>
  );

  const visualBlock = photo ? (
    <Reveal delay={0.1}>
      <div
        className="relative overflow-hidden rounded-lg border border-border"
        style={{ aspectRatio: "4 / 3" }}
      >
        <img
          src={photo}
          alt={photoAlt || ""}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    </Reveal>
  ) : (
    visual
  );

  return (
    <section className="mx-auto mt-24 w-[92vw] max-w-[1720px]">
      <div
        className={`grid grid-cols-1 items-center gap-10 lg:gap-16 ${
          hasVisual ? "lg:grid-cols-2" : ""
        }`}
      >
        {reverse && hasVisual ? (
          <>
            {visualBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {visualBlock}
          </>
        )}
      </div>
    </section>
  );
}
