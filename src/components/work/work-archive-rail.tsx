"use client";

import { useRef } from "react";
import type { Project } from "@/types/project";
import { ProjectTileRail } from "@/components/work/project-tile-rail";

type ArchiveItem = {
  project: Project;
  hasCoverAsset: boolean;
};

type WorkArchiveRailProps = {
  items: ArchiveItem[];
};

export function WorkArchiveRail({ items }: WorkArchiveRailProps) {
  const railRef = useRef<HTMLDivElement | null>(null);

  if (items.length === 0) {
    return null;
  }

  const scrollRail = (direction: "left" | "right") => {
    const node = railRef.current;
    if (!node) {
      return;
    }

    const amount = Math.max(320, Math.round(node.clientWidth * 0.72));
    node.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth"
    });
  };

  return (
    <div className="mt-10 border-t border-border/60 pt-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">Selected Archive</h2>
      </div>

      <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-2 md:grid-cols-[3.25rem_minmax(0,1fr)_3.25rem] md:gap-3">
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => scrollRail("left")}
            aria-label="Scroll archive left"
            aria-controls="selected-archive-rail"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/45 bg-surface/96 text-foreground/70 shadow-[0_8px_18px_rgba(28,23,19,0.08)] transition-colors hover:border-accent/30 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 md:h-10 md:w-10"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-4 w-4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.5 3.5 5 8l4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="relative min-w-0 overflow-hidden">
          <div
            id="selected-archive-rail"
            ref={railRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-3 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] md:px-3 [&::-webkit-scrollbar]:hidden"
            style={{ scrollPaddingLeft: "0.75rem", scrollPaddingRight: "0.75rem" }}
          >
            {items.map(({ project, hasCoverAsset }) => (
              <ProjectTileRail
                key={project.id}
                project={project}
                hasCoverAsset={hasCoverAsset}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => scrollRail("right")}
            aria-label="Scroll archive right"
            aria-controls="selected-archive-rail"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/45 bg-surface/96 text-foreground/70 shadow-[0_8px_18px_rgba(28,23,19,0.08)] transition-colors hover:border-accent/30 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 md:h-10 md:w-10"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-4 w-4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.5 3.5 11 8l-4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
