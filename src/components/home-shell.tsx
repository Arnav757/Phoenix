"use client";

import { useCallback, useState } from "react";
import { IntroExperience } from "@/components/intro-experience";
import { Navbar } from "@/components/navbar";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { Portfolio } from "@/components/sections/portfolio";
import { Process } from "@/components/sections/process";
import { Experience } from "@/components/sections/experience";
import { Testimonials } from "@/components/sections/testimonials";
import { Contact } from "@/components/sections/contact";

// Intro playback state.
type IntroState = "NOT_STARTED" | "PLAYING" | "COMPLETED";

// Module-scoped flag: it lives as long as the JS bundle is loaded, so it
// PERSISTS across client-side navigation (Home → Partners → Home) and only
// RESETS on a full page load / hard refresh. This is what stops the intro
// from replaying whenever the homepage remounts during routing.
let introCompleted = false;

// Orchestrates the one-time intro → main-site hand-off. The intro is an
// overlay above the site; when it completes it fades out to reveal the site
// beneath and the navbar animates in. Only a refresh or the logo/replay
// action can start it again — scrolling and navigation never do.
export function HomeShell() {
  const [state, setState] = useState<IntroState>(
    introCompleted ? "COMPLETED" : "NOT_STARTED"
  );

  const startIntro = useCallback(() => {
    setState((s) => (s === "NOT_STARTED" ? "PLAYING" : s));
  }, []);

  const finishIntro = useCallback(() => {
    introCompleted = true;
    setState("COMPLETED");
  }, []);

  const replayIntro = useCallback(() => {
    introCompleted = false;
    window.scrollTo({ top: 0, behavior: "instant" });
    setState("NOT_STARTED");
  }, []);

  const done = state === "COMPLETED";

  return (
    <>
      {!done && (
        <IntroExperience onStart={startIntro} onComplete={finishIntro} />
      )}

      <Navbar visible={done} onLogoClick={replayIntro} />

      <main id="home">
        <About />
        <Services />
        <Portfolio />
        <Process />
        <Experience />
        <Testimonials />
        <Contact />
      </main>
    </>
  );
}
