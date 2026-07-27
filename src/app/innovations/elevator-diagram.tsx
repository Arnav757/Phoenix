"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/reveal";

export type ElevatorBenefit = {
  label: string;
  icon: LucideIcon;
};

const FLOOR_COUNT = 5;
const SHAFT_TOP = 24;
const SHAFT_BOTTOM = 296;
const SHAFT_LEFT = 96;
const SHAFT_RIGHT = 184;
const FLOOR_Y = Array.from({ length: FLOOR_COUNT }, (_, i) => SHAFT_TOP + (i * (SHAFT_BOTTOM - SHAFT_TOP)) / (FLOOR_COUNT - 1));

// Destination Control System diagram — an elevator shaft with a car that
// continuously travels between floors (representing well-regulated,
// destination-grouped traffic), plus a small waiting-group indicator at the
// ground floor. Hovering/focusing a benefit dims the shaft and highlights
// the detail it's describing — car motion for "wait times" and "natural
// flow", the ground-floor group for "crowded lobbies" — rather than a
// generic hub-and-spoke unrelated to what a DCS actually does.
export function ElevatorDiagram({ benefits }: { benefits: ElevatorBenefit[] }) {
  const [active, setActive] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  const highlightLobby = active === 0; // Avoid Crowded Lobbies and Elevators
  const highlightCar = active === 1 || active === 2; // Save on Wait Times / Natural Flow

  return (
    <Reveal delay={0.1}>
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-center">
        <svg viewBox="0 0 280 320" width={220} className="shrink-0" aria-hidden>
          {/* shaft */}
          <rect
            x={SHAFT_LEFT}
            y={SHAFT_TOP}
            width={SHAFT_RIGHT - SHAFT_LEFT}
            height={SHAFT_BOTTOM - SHAFT_TOP}
            rx={10}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1.5}
          />
          {/* floor lines + destination dots */}
          {FLOOR_Y.map((y, i) => (
            <line
              key={i}
              x1={SHAFT_LEFT}
              y1={y}
              x2={SHAFT_RIGHT}
              y2={y}
              stroke="var(--border)"
              strokeWidth={1}
              opacity={0.6}
            />
          ))}

          {/* ground-floor waiting group */}
          <g
            style={{ transition: "opacity 0.3s ease" }}
            opacity={highlightLobby ? 1 : 0.45}
          >
            {[0, 1, 2].map((i) => (
              <circle
                key={i}
                cx={SHAFT_LEFT - 22 + i * 12}
                cy={SHAFT_BOTTOM - 6}
                r={4}
                fill={highlightLobby ? "var(--primary)" : "var(--muted-foreground)"}
                style={{ transition: "fill 0.3s ease" }}
              />
            ))}
          </g>

          {/* elevator car — travels between floors continuously */}
          <motion.g
            initial={false}
            animate={
              reduceMotion
                ? { y: SHAFT_TOP }
                : { y: [SHAFT_BOTTOM - 44, SHAFT_TOP + 10, SHAFT_TOP + 120, SHAFT_BOTTOM - 44] }
            }
            transition={{ duration: 9, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
          >
            <rect
              x={SHAFT_LEFT + 8}
              y={0}
              width={SHAFT_RIGHT - SHAFT_LEFT - 16}
              height={40}
              rx={6}
              fill={highlightCar ? "var(--primary)" : "var(--card)"}
              fillOpacity={highlightCar ? 0.18 : 1}
              stroke="var(--primary)"
              strokeWidth={highlightCar ? 1.75 : 1.25}
              style={{ transition: "fill-opacity 0.3s ease, stroke-width 0.3s ease" }}
            />
            <circle cx={SHAFT_LEFT + 26} cy={20} r={3} fill="var(--primary)" />
            <circle cx={SHAFT_LEFT + 44} cy={20} r={3} fill="var(--primary)" />
          </motion.g>
        </svg>

        <div className="flex flex-col gap-3">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            const isActive = active === i;
            return (
              <button
                key={b.label}
                type="button"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                style={{
                  borderColor: isActive ? "var(--primary)" : "var(--border)",
                  background: isActive ? "rgb(0 120 243 / 0.05)" : "var(--card)",
                  transition: "border-color 0.25s ease, background 0.25s ease",
                }}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
                  style={{
                    borderColor: isActive ? "var(--primary)" : "var(--border)",
                    color: isActive ? "var(--primary)" : "var(--muted-foreground)",
                    transition: "border-color 0.25s ease, color 0.25s ease",
                  }}
                >
                  <Icon size={16} aria-hidden />
                </span>
                <span className="text-sm font-medium text-foreground">{b.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}
