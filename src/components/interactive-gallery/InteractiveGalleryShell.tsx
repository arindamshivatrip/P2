"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { HandCursorOverlay } from "@/components/interactive-gallery/HandCursorOverlay";
import { HandTrackingControls } from "@/components/interactive-gallery/HandTrackingControls";
import { InteractiveScene } from "@/components/interactive-gallery/InteractiveScene";
import { TrackingStatusPanel } from "@/components/interactive-gallery/TrackingStatusPanel";
import { WebcamBackground } from "@/components/interactive-gallery/WebcamBackground";
import { useHandTracking } from "@/hooks/useHandTracking";
import { useProjectSelection } from "@/hooks/useProjectSelection";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { useTwoHandGestureController } from "@/hooks/useTwoHandGestureController";
import {
  getDefaultQuality,
  QUALITY_SETTINGS,
  type GalleryQuality
} from "@/lib/interactive-gallery/performance";
import type { GalleryProject } from "@/lib/interactive-gallery/projectAdapter";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type InteractiveGalleryShellProps = {
  projects: GalleryProject[];
};

export function InteractiveGalleryShell({ projects }: InteractiveGalleryShellProps) {
  const reducedMotion = useReducedMotionSafe();
  const router = useRouter();
  const [quality, setQuality] = useState<GalleryQuality>("medium");
  const qualitySettings = QUALITY_SETTINGS[quality];
  const handTracking = useHandTracking({ settings: qualitySettings });
  const [pointerManipulating, setPointerManipulating] = useState(false);
  const [cardTransform, setCardTransform] = useState({
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: 1
  });
  const selection = useProjectSelection(projects);
  const gestures = useTwoHandGestureController({
    hands: handTracking.hands,
    hoveredSlug: selection.hoveredSlug,
    selectedSlug: selection.selectedSlug,
    enabled: handTracking.isActive && !reducedMotion
  });

  useEffect(() => {
    setQuality(getDefaultQuality());
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && selection.selectedProject) {
        const active = document.activeElement;
        if (active instanceof HTMLButtonElement || active instanceof HTMLAnchorElement) {
          return;
        }
        router.push(selection.selectedProject.href);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router, selection.selectedProject]);

  return (
    <main className="bg-background py-section">
      <HandCursorOverlay
        hands={handTracking.hands}
        enabled={handTracking.isActive && !reducedMotion}
      />

      <Container size="wide">
        <motion.header
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-8 border-b border-border/70 pb-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end"
        >
          <motion.div variants={fadeUp}>
            <p className="text-xs uppercase text-text-muted">Experiment / Interactive Project Shelf</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl leading-none text-foreground md:text-7xl">
              Spatial glass project gallery
            </h1>
          </motion.div>
          <motion.p variants={fadeUp} className="max-w-xl text-base leading-7 text-text-secondary">
            A restrained 3D project shelf with real glass-like card objects, pointer manipulation,
            and optional two-hand camera interaction.
          </motion.p>
        </motion.header>

        <div className="mt-8">
          <HandTrackingControls
            isActive={handTracking.isActive}
            isLoading={handTracking.isLoading}
            message={handTracking.message}
            handCount={handTracking.hands.length}
            engagedHands={gestures.engagedHands}
            quality={quality}
            reducedMotion={reducedMotion}
            onQualityChange={setQuality}
            onStart={handTracking.start}
            onStop={handTracking.stop}
          />
        </div>

        <section
          className="relative mt-8 h-[640px] overflow-hidden rounded-[1.25rem] border border-border/70 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.42),rgba(236,234,225,0.54)_46%,rgba(245,244,237,0.84))] shadow-card dark:bg-[radial-gradient(circle_at_50%_30%,rgba(23,43,54,0.58),rgba(15,17,19,0.9)_62%)]"
          aria-label="Three dimensional interactive project gallery"
        >
          <WebcamBackground
            videoRef={handTracking.videoRef}
            active={handTracking.isActive}
            visible={handTracking.videoReady}
            blur={qualitySettings.blur}
          />
          <div className="absolute inset-0 z-10">
            <InteractiveScene
              projects={projects}
              selectedSlug={selection.selectedSlug}
              hoveredSlug={selection.hoveredSlug}
              reducedMotion={reducedMotion}
              activeGestureSlug={gestures.activeSlug}
              gestureTransform={gestures.transform}
              qualitySettings={qualitySettings}
              onSelect={selection.setSelectedSlug}
              onHover={selection.setHoveredSlug}
              onPointerManipulating={setPointerManipulating}
              onRotationChange={(rotation) =>
                setCardTransform((current) => ({
                  ...current,
                  rotation
                }))
              }
              onTransformChange={setCardTransform}
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-36 bg-gradient-to-t from-background/72 to-transparent" />
          <TrackingStatusPanel
            hands={handTracking.hands}
            selectedProject={selection.selectedProject}
            transform={gestures.transform}
            pointerActive={pointerManipulating}
            cameraActive={handTracking.isActive}
            videoVisible={handTracking.isActive && handTracking.videoReady}
            quality={quality}
            settings={qualitySettings}
            cameraResolution={handTracking.cameraResolution}
            detectionFps={handTracking.lastDetectionFps}
            objectTransform={cardTransform}
          />
          {selection.selectedProject && (
            <Link
              href={selection.selectedProject.href}
              className="absolute right-4 top-4 z-30 rounded-button border border-accent bg-accent px-4 py-2 text-sm text-foreground shadow-card transition hover:-translate-y-0.5 hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              Open project
            </Link>
          )}
          <div className="absolute bottom-4 left-1/2 z-30 w-[min(46rem,calc(100%-2rem))] -translate-x-1/2 rounded-full border border-border/70 bg-background/62 px-4 py-2 text-center text-xs text-text-muted shadow-card backdrop-blur-md">
            Select from the lower shelf. Drag the main card to move and rotate; use Shift-drag or the wheel for depth. Double click resets. Enter opens the selected project.
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-card border border-border/70 bg-surface/60 p-4 shadow-card backdrop-blur-md">
            <p className="text-xs uppercase text-text-muted">Keyboard access</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {projects.map((project) => (
                <button
                  key={project.slug}
                  type="button"
                  onClick={() => selection.setSelectedSlug(project.slug)}
                  className={cn(
                    "rounded-[0.7rem] border border-border/70 bg-background/40 px-3 py-2 text-left text-sm text-text-secondary transition hover:border-accent/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                    selection.selectedSlug === project.slug && "border-accent/70 text-foreground"
                  )}
                >
                  {project.title}
                </button>
              ))}
            </div>
          </div>

          <article className="rounded-card border border-border/70 bg-surface/68 p-5 shadow-card backdrop-blur-md">
            {selection.selectedProject ? (
              <>
                <p className="text-xs uppercase text-text-muted">
                  {selection.selectedProject.category} / {selection.selectedProject.year}
                </p>
                <h2 className="mt-2 font-display text-3xl text-foreground">
                  {selection.selectedProject.title}
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-text-secondary">
                  {selection.selectedProject.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {selection.selectedProject.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-border/80 px-3 py-1 text-xs text-text-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={selection.selectedProject.href}
                  className="mt-5 inline-flex rounded-button border border-accent bg-accent px-4 py-2 text-sm text-foreground transition hover:-translate-y-0.5 hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                >
                  Open case study
                </Link>
              </>
            ) : (
              <p className="text-sm text-text-secondary">Select a project to inspect it.</p>
            )}
          </article>
        </section>
      </Container>
    </main>
  );
}
