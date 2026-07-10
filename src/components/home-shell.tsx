"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IntroExperience } from "@/components/intro-experience";
import { Navbar } from "@/components/navbar";
import { projects } from "@/lib/content";
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

// Featured project for this session's cinematic entry — chosen once, from
// whichever projects have both a construction video and a finished photo,
// so new projects added to content.ts are picked up automatically with no
// code change. Stays fixed for the session (module lifetime), same as
// introCompleted above.
//
// The pick itself must happen client-side only, after mount: Math.random()
// during render would run once on the server and again on the client's
// hydration pass, landing on two different projects and triggering a
// hydration mismatch (the video's `src` wouldn't match what the server sent).
// projects[0] is the deterministic placeholder both passes render identically;
// the real pick swaps in a moment later, well before the visitor can click.
let featuredProject: (typeof projects)[number] | null = null;
function rollFeaturedProject() {
  const eligible = projects.filter((p) => p.video && p.image);
  const pool = eligible.length ? eligible : projects;
  featuredProject = pool[Math.floor(Math.random() * pool.length)];
  return featuredProject;
}

// Orchestrates the one-time cinematic intro → main-site hand-off. The intro
// is an overlay above the site; on completion the logo hands off into the
// navbar's exact position and the navbar fades in. Only a refresh or the
// logo/replay action can start it again — scrolling and navigation never do.
export function HomeShell() {
  const [state, setState] = useState<IntroState>(
    introCompleted ? "COMPLETED" : "NOT_STARTED"
  );
  const [project, setProject] = useState(featuredProject ?? projects[0]);
  const navLogoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!featuredProject) setProject(rollFeaturedProject());
  }, []);

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
        <IntroExperience
          project={project}
          navLogoRef={navLogoRef}
          onStart={startIntro}
          onComplete={finishIntro}
        />
      )}

      <Navbar visible={done} onLogoClick={replayIntro} logoRef={navLogoRef} />

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
