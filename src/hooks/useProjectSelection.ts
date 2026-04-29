"use client";

import { useEffect, useState } from "react";
import type { GalleryProject } from "@/lib/interactive-gallery/projectAdapter";

export function useProjectSelection(projects: GalleryProject[]) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(projects[0]?.slug ?? null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedSlug(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const selectedProject =
    projects.find((project) => project.slug === selectedSlug) ?? projects[0] ?? null;

  return {
    selectedSlug,
    hoveredSlug,
    selectedProject,
    setSelectedSlug,
    setHoveredSlug
  };
}

