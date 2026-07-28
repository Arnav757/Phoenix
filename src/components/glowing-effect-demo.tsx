"use client";

import { Building2, Leaf, ShieldCheck, Sparkles, Users } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

// Demo/reference usage of GlowingEffect, restyled to the Phoenix design
// system: tech-label eyebrows, sheet-corners, brand blue as the anchor glow
// color (see glowing-effect.tsx's --gradient) instead of the generic
// Aceternity pink/orange palette. Swap the five items below for real
// content wherever this grid gets used.
export function GlowingEffectDemo() {
  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<Building2 className="h-4 w-4" />}
        title="Two decades of steady delivery"
        description="Disciplined execution and a public schedule, project after project."
      />
      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<Leaf className="h-4 w-4" />}
        title="Precertified green from day one"
        description="IGBC sustainability constraints held inside the design brief, not bolted on at the end."
      />
      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={<ShieldCheck className="h-4 w-4" />}
        title="Independently audited quality"
        description="Material testing and third-party inspection at every milestone."
      />
      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        icon={<Sparkles className="h-4 w-4" />}
        title="Innovation across every stage"
        description="Drones, AI site monitoring and recyclable steel construction."
      />
      <GridItem
        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
        icon={<Users className="h-4 w-4" />}
        title="A lasting impact beyond the skyline"
        description="Phoenix Foundation's CSR initiatives across health, environment and community."
      />
    </ul>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="sheet-corners relative h-full rounded-sm border-[0.75px] border-border p-2 md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-sm border-[0.75px] border-border bg-card p-6 shadow-sm md:p-6">
          <div className="bp-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-primary/30 bg-background p-2 text-primary">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold leading-[1.375rem] tracking-tight text-balance text-foreground md:text-2xl md:leading-[1.875rem]">
                {title}
              </h3>
              <p className="text-sm leading-[1.125rem] text-muted-foreground md:text-base md:leading-[1.375rem]">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
