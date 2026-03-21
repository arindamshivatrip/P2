import type { Project } from "@/types/project";
import { ProjectTileConfidential } from "@/components/work/project-tile-confidential";
import { ProjectTileFeatured } from "@/components/work/project-tile-featured";
import { ProjectTileImmersive } from "@/components/work/project-tile-immersive";
import { ProjectTileResearch } from "@/components/work/project-tile-research";
import { ProjectTileStandard } from "@/components/work/project-tile-standard";

type ProjectTileVariant =
  | "featured"
  | "research"
  | "confidential"
  | "standard"
  | "assertive"
  | "immersive"
  | "utility";

type ProjectTileProps = {
  project: Project;
  variant: ProjectTileVariant;
  hasCoverAsset?: boolean;
};

export function ProjectTile({ project, variant, hasCoverAsset = false }: ProjectTileProps) {
  if (variant === "featured") {
    return <ProjectTileFeatured project={project} hasCoverAsset={hasCoverAsset} />;
  }

  if (variant === "research") {
    return <ProjectTileResearch project={project} />;
  }

  if (variant === "confidential") {
    return <ProjectTileConfidential project={project} />;
  }

  if (variant === "immersive") {
    return <ProjectTileImmersive project={project} hasCoverAsset={hasCoverAsset} />;
  }

  return (
    <ProjectTileStandard
      project={project}
      compact={variant === "utility"}
      assertive={variant === "assertive"}
      hasCoverAsset={hasCoverAsset}
    />
  );
}
