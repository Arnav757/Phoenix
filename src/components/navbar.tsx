"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMotionValueEvent, useScroll } from "motion/react";
import { sections } from "@/lib/content";
import { Button } from "@/components/ui/button";

// Hidden during the intro; fades into place once the intro completes, then
// stays sticky for the rest of the site. Deliberately opacity-only (no
// translate) while hidden — the intro's entry logo FLIP-animates to this
// exact element's on-screen rect, which only holds true if the rect never
// moves between the hidden and visible states.
export function Navbar({
  visible,
  onLogoClick,
  logoRef,
}: {
  visible: boolean;
  onLogoClick?: () => void;
  /** ref to the logo wrapper — the intro reads its rect for the logo hand-off */
  logoRef?: React.Ref<HTMLDivElement>;
}) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <header
      style={{ transition: "opacity 0.5s cubic-bezier(0.22,1,0.36,1)", opacity: visible ? 1 : 0 }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        visible ? "" : "pointer-events-none"
      } ${
        scrolled
          ? "bg-background/70 backdrop-blur-md border-b border-border/60"
          : "bg-background/25 backdrop-blur-sm border-b border-transparent"
      }`}
      aria-hidden={!visible}
    >
      <nav className="mx-auto flex w-[92vw] max-w-[1720px] items-center justify-between py-4">
        {/* Logo: on the homepage it replays the intro; elsewhere it is a
            client-side link home (no full reload, so the intro never replays). */}
        {onLogoClick ? (
          <button
            type="button"
            onClick={onLogoClick}
            aria-label="Phoenix Group — replay introduction"
          >
            <div ref={logoRef}>
              <Image
                src="/phoenix/images/phoenix_logo.png"
                alt="Phoenix Group"
                width={120}
                height={40}
                className="h-9 w-auto"
                priority
              />
            </div>
          </button>
        ) : (
          <Link href="/" aria-label="Phoenix Group — home">
            <div ref={logoRef}>
              <Image
                src="/phoenix/images/phoenix_logo.png"
                alt="Phoenix Group"
                width={120}
                height={40}
                className="h-9 w-auto"
                priority
              />
            </div>
          </Link>
        )}
        <div className="hidden items-center gap-7 lg:flex">
          {[
            ...sections.slice(1, 6).map((s) => ({ href: `/#${s.id}`, label: s.label })),
            { href: "/partners", label: "Partners" },
            { href: "/team", label: "Team" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
        <Button
          render={<Link href="/#contact" />}
          nativeButton={false}
          size="sm"
          className="rounded-full px-5"
        >
          Let&apos;s Connect
        </Button>
      </nav>
    </header>
  );
}
