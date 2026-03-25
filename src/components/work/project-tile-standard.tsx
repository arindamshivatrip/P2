import Link from "next/link";
import { BodyText } from "@/components/typography/body-text";
import { getProjectCoverSrc } from "@/data/projects";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";
import { getFallbackCoverImage } from "@/components/work/tile-media";

type ProjectTileStandardProps = {
  project: Project;
  compact?: boolean;
  assertive?: boolean;
  hasCoverAsset?: boolean;
};

export function ProjectTileStandard({
  project,
  compact = false,
  assertive = false,
  hasCoverAsset = false
}: ProjectTileStandardProps) {
  const cover = getProjectCoverSrc(project);
  const fallbackCover = getFallbackCoverImage(project, "standard");
  const hasRealCover = hasCoverAsset && !cover.includes("placeholder");
  const statusLabel = project.status;

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block h-full rounded-[1rem] bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(38,31,24,0.12),0_4px_10px_rgba(38,31,24,0.06)] md:p-6"
    >
      <article className="flex h-full flex-col">
        {!compact ? (
          <div
            className={cn(
              "relative overflow-hidden rounded-[0.8rem] bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.01]",
              assertive ? "min-h-[220px] md:min-h-[250px]" : "min-h-[170px]"
            )}
            style={{
              backgroundImage: hasRealCover
                ? `linear-gradient(rgba(17,17,17,.12), rgba(17,17,17,.14)), url(${cover})`
                : fallbackCover
            }}
            aria-hidden="true"
          >
            {assertive ? (
              <span className="absolute bottom-3 left-3 font-body text-[0.62rem] uppercase tracking-[0.13em] text-[#f5f4ed]/85">
                XR / Interaction
              </span>
            ) : null}
          </div>
        ) : null}
        <h3
          className={cn(
            "font-display leading-tight tracking-tight",
            assertive ? "text-[2.7rem]" : "text-4xl",
            !compact ? "mt-5" : ""
          )}
        >
          {project.title}
        </h3>
        <BodyText tone="secondary" className="mt-4">
          {project.oneLiner}
        </BodyText>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 font-body text-[0.68rem] uppercase tracking-[0.12em] text-text-muted">
          <span>{statusLabel}</span>
          <span>{project.meta.year}</span>
          <span>{project.contributionTag ?? project.entryType}</span>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tech.slice(0, 3).map((item) => (
            <span
              key={item}
              className="rounded-full bg-background/70 px-2 py-1 font-body text-[0.66rem] uppercase tracking-[0.1em] text-text-muted"
            >
              {item}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
