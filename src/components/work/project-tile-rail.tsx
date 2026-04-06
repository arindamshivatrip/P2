import Link from "next/link";
import { BodyText } from "@/components/typography/body-text";
import { getProjectCoverSrc, getProjectDestinationHref } from "@/data/projects";
import { getFallbackCoverImage } from "@/components/work/tile-media";
import type { Project } from "@/types/project";

type ProjectTileRailProps = {
  project: Project;
  hasCoverAsset: boolean;
};

export function ProjectTileRail({ project, hasCoverAsset }: ProjectTileRailProps) {
  const cover = getProjectCoverSrc(project);
  const hasRealCover = hasCoverAsset && !cover.includes("placeholder");
  const fallbackCover = getFallbackCoverImage(project, "standard");
  const statusLabel = project.status;

  return (
    <Link
      href={getProjectDestinationHref(project)}
      className="group block h-[31rem] w-[18.25rem] shrink-0 snap-start rounded-[1rem] bg-surface p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(38,31,24,0.11)] sm:w-[19rem] md:w-[19.5rem]"
    >
      <article className="flex h-full flex-col">
        <div
          className="h-[12.25rem] rounded-[0.75rem] bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.01]"
          style={{
            backgroundImage: hasRealCover
              ? `linear-gradient(rgba(16,16,16,.12), rgba(16,16,16,.14)), url(${cover})`
              : fallbackCover
          }}
          aria-hidden="true"
        />

        <div className="mt-4 min-h-[0.95rem] flex items-center gap-3 font-body text-[0.66rem] uppercase tracking-[0.12em] text-text-muted">
          <span className="truncate">{statusLabel}</span>
          <span>{project.meta.year}</span>
        </div>

        <h3 className="mt-2 min-h-[4.4rem] overflow-hidden font-display text-[1.9rem] leading-tight tracking-tight [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
          {project.title}
        </h3>

        <BodyText
          tone="secondary"
          className="mt-3 min-h-[3.9rem] overflow-hidden text-sm [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]"
        >
          {project.oneLiner}
        </BodyText>

        <div className="mt-4 min-h-[1.75rem] flex flex-wrap gap-2">
          {project.tech.slice(0, 2).map((item) => (
            <span
              key={item}
              className="max-w-[7.8rem] truncate rounded-full bg-background/70 px-2 py-1 font-body text-[0.62rem] uppercase tracking-[0.1em] text-text-muted"
            >
              {item}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
