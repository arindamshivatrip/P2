"use client";

import { memo } from "react";
import type { GalleryProject } from "@/lib/interactive-gallery/projectAdapter";
import { cn } from "@/lib/utils";

type ProjectCardContentProps = {
  project: GalleryProject;
  active: boolean;
  compact?: boolean;
};

function ProjectCardContentComponent({ project, active, compact = false }: ProjectCardContentProps) {
  return (
    <div
      className={cn(
        "select-none rounded-[12px] border border-white/55 bg-[rgba(255,252,244,0.88)] text-left shadow-[0_14px_38px_rgba(31,31,31,0.1)] transition",
        compact ? "h-[82px] w-[128px] p-2" : "h-[150px] w-[230px] p-3",
        active && "border-accent/70 bg-[rgba(255,252,244,0.94)] shadow-[0_18px_46px_rgba(255,153,50,0.14)]"
      )}
    >
      <div className="flex items-start justify-between gap-3 text-[9px] uppercase tracking-[0.08em] text-text-muted">
        <span>{project.category}</span>
        <span>{project.year}</span>
      </div>
      <div className={cn("h-0.5 rounded-full bg-accent/80", compact ? "mt-1.5 w-8" : "mt-2.5 w-12")} />
      <h3 className={cn("font-display leading-[1.04] text-foreground", compact ? "mt-2 line-clamp-2 text-[11px]" : "mt-2.5 text-[17px]")}>
        {project.title}
      </h3>
      {!compact && <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-text-secondary">{project.subtitle}</p>}
      <div className={cn("flex flex-wrap gap-1.5", compact ? "mt-1.5" : "mt-2.5")}>
        <span className="rounded-full border border-border/70 bg-background/45 px-1.5 py-0.5 text-[9px] text-text-secondary">
          {project.status}
        </span>
        {!compact && project.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/60 bg-white/45 px-1.5 py-0.5 text-[9px] text-text-secondary"
          >
            {tag}
          </span>
        ))}
      </div>
      {!compact && (
        <div className="mt-2 text-[9px] uppercase tracking-[0.08em] text-accent">Open project below</div>
      )}
    </div>
  );
}

export const ProjectCardContent = memo(ProjectCardContentComponent);
