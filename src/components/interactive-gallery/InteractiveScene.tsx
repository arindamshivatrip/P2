"use client";

import { Environment, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { ProjectCard3D } from "@/components/interactive-gallery/ProjectCard3D";
import type { SpatialGestureTransform } from "@/lib/interactive-gallery/gestureMath";
import type { GalleryQualitySettings } from "@/lib/interactive-gallery/performance";
import type { GalleryProject } from "@/lib/interactive-gallery/projectAdapter";

type InteractiveSceneProps = {
  projects: GalleryProject[];
  selectedSlug: string | null;
  hoveredSlug: string | null;
  reducedMotion: boolean;
  activeGestureSlug: string | null;
  gestureTransform: SpatialGestureTransform | null;
  qualitySettings: GalleryQualitySettings;
  onSelect: (slug: string) => void;
  onHover: (slug: string | null) => void;
  onPointerManipulating: (active: boolean) => void;
  onRotationChange: (rotation: [number, number, number]) => void;
  onTransformChange: (transform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
  }) => void;
};

export function InteractiveScene({
  projects,
  selectedSlug,
  hoveredSlug,
  reducedMotion,
  activeGestureSlug,
  gestureTransform,
  qualitySettings,
  onSelect,
  onHover,
  onPointerManipulating,
  onRotationChange,
  onTransformChange
}: InteractiveSceneProps) {
  const selectedProject = projects.find((project) => project.slug === selectedSlug) ?? projects[0] ?? null;
  const shelfLayout = useMemo(() => {
    const count = Math.max(projects.length, 1);
    const spacing = 0.62;
    const start = -((count - 1) * spacing) / 2;

    return projects.map((project, index) => ({
      project,
      position: [start + index * spacing, -1.64, -0.08] as [number, number, number],
      rotation: [-0.18, (index - (count - 1) / 2) * -0.045, 0] as [number, number, number]
    }));
  }, [projects]);

  return (
    <Canvas
      shadows={qualitySettings.shadows}
      dpr={qualitySettings.dpr}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      className="h-full w-full"
      style={{ background: "transparent" }}
    >
      <PerspectiveCamera makeDefault position={[0, 0.06, 5.9]} fov={34} />
      <ambientLight intensity={1.18} />
      <directionalLight
        position={[2.8, 4.4, 4.8]}
        intensity={1.75}
        castShadow={qualitySettings.shadows}
        shadow-mapSize-width={qualitySettings.shadows ? 1024 : 256}
        shadow-mapSize-height={qualitySettings.shadows ? 1024 : 256}
      />
      <pointLight position={[-3.5, -1.6, 3.4]} intensity={0.86} color="#ff9932" />
      <pointLight position={[3.4, 1.6, 2.2]} intensity={0.38} color="#ffffff" />
      <Suspense fallback={null}>
        {qualitySettings.transmission && <Environment preset="apartment" environmentIntensity={0.42} />}
        {selectedProject && (
          <ProjectCard3D
            key={`main-${selectedProject.slug}`}
            project={selectedProject}
            homePosition={[0, 0.26, 0.02]}
            homeRotation={[0.02, 0, 0]}
            variant="main"
            selected
            hovered={hoveredSlug === selectedProject.slug}
            reducedMotion={reducedMotion}
            gestureTransform={activeGestureSlug === selectedProject.slug ? gestureTransform : null}
            qualitySettings={qualitySettings}
            onSelect={onSelect}
            onHover={onHover}
            onManipulating={onPointerManipulating}
            onRotationChange={onRotationChange}
            onTransformChange={onTransformChange}
          />
        )}
        {shelfLayout.map(({ project, position, rotation }) => (
          <ProjectCard3D
            key={`shelf-${project.slug}`}
            project={project}
            homePosition={position}
            homeRotation={rotation}
            variant="shelf"
            selected={selectedSlug === project.slug}
            hovered={hoveredSlug === project.slug}
            reducedMotion={reducedMotion}
            gestureTransform={null}
            qualitySettings={qualitySettings}
            onSelect={onSelect}
            onHover={onHover}
          />
        ))}
      </Suspense>
    </Canvas>
  );
}
