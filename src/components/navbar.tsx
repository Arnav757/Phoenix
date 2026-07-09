"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { sections } from "@/lib/content";
import { Button } from "@/components/ui/button";

// Hidden during the intro; fades and slides into place once the intro
// completes, then stays sticky for the rest of the site.
export function Navbar({
  visible,
  onLogoClick,
}: {
  visible: boolean;
  onLogoClick?: () => void;
}) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <motion.header
      initial={false}
      animate={
        visible
          ? { y: 0, opacity: 1 }
          : { y: -72, opacity: 0 }
      }
      transition={{ duration: 0.9, delay: visible ? 0.45 : 0, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        visible ? "" : "pointer-events-none"
      } ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
      aria-hidden={!visible}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo: on the homepage it replays the intro; elsewhere it is a
            client-side link home (no full reload, so the intro never replays). */}
        {onLogoClick ? (
          <button
            type="button"
            onClick={onLogoClick}
            aria-label="Phoenix Group — replay introduction"
          >
            <Image
              src="/phoenix/images/phoenix_logo.png"
              alt="Phoenix Group"
              width={120}
              height={40}
              className="h-9 w-auto"
              priority
            />
          </button>
        ) : (
          <Link href="/" aria-label="Phoenix Group — home">
            <Image
              src="/phoenix/images/phoenix_logo.png"
              alt="Phoenix Group"
              width={120}
              height={40}
              className="h-9 w-auto"
              priority
            />
          </Link>
        )}
        <div className="hidden items-center gap-7 lg:flex">
          {[
            ...sections.slice(1, 6).map((s) => ({ href: `/#${s.id}`, label: s.label })),
            { href: "/partners", label: "Partners" },
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
    </motion.header>
  );
}
