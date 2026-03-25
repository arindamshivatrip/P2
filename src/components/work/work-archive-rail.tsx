"use client";

import type { Project } from "@/types/project";
import { ProjectTileRail } from "@/components/work/project-tile-rail";
import { HorizontalRail } from "@/components/ui/horizontal-rail";

type ArchiveItem = {
  project: Project;
  hasCoverAsset: boolean;
};

type WorkArchiveRailProps = {
  items: ArchiveItem[];
};

export function WorkArchiveRail({ items }: WorkArchiveRailProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 border-t border-border/60 pt-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">Project Archive</h2>
      </div>

      <HorizontalRail id="selected-archive-rail" railLabel="archive">
        {items.map(({ project, hasCoverAsset }) => (
          <ProjectTileRail
            key={project.id}
            project={project}
            hasCoverAsset={hasCoverAsset}
          />
        ))}
      </HorizontalRail>
    </div>
  );
}
