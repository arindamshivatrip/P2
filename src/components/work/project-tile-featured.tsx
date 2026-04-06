import Link from "next/link";
import { BodyText } from "@/components/typography/body-text";
import { getProjectCoverSrc, getProjectDestinationHref } from "@/data/projects";
import type { Project } from "@/types/project";
import { getFallbackCoverImage } from "@/components/work/tile-media";

type ProjectTileFeaturedProps = {
  project: Project;
  hasCoverAsset?: boolean;
};

export function ProjectTileFeatured({ project, hasCoverAsset = false }: ProjectTileFeaturedProps) {
  const cover = getProjectCoverSrc(project);
  const fallbackCover = getFallbackCoverImage(project, "flagship");
  const hasRealCover = hasCoverAsset && !cover.includes("placeholder");
  const hasVideo = Boolean(project.video?.src);
  const useWidescreenMediaFrame = project.tileMediaAspect === "widescreen-16-9";
  const mediaFrameClassName = useWidescreenMediaFrame
    ? "relative aspect-[16/9] overflow-hidden rounded-[0.8rem] bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.01]"
    : "relative min-h-[250px] overflow-hidden rounded-[0.8rem] bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.01] md:min-h-[320px]";
  const statusLabel = project.status;

  return (
    <Link
      href={getProjectDestinationHref(project)}
      className="group block h-full rounded-[1rem] bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(38,31,24,0.14),0_4px_10px_rgba(38,31,24,0.06)]"
    >
      <article className="flex h-full flex-col p-5 md:p-6">
        <div
          className={mediaFrameClassName}
          style={{
            backgroundImage: !hasVideo && hasRealCover
              ? `linear-gradient(rgba(16,16,16,.18), rgba(16,16,16,.2)), url(${cover})`
              : !hasVideo
                ? fallbackCover
                : undefined
          }}
          aria-hidden="true"
        >
          {hasVideo ? (
            <>
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={project.video?.src}
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                preload="metadata"
                tabIndex={-1}
                title={project.video?.title}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/35" />
            </>
          ) : null}
        </div>
        <div className="mt-5 flex items-center gap-4 font-body text-[0.68rem] uppercase tracking-[0.12em] text-text-muted">
          <span>{statusLabel}</span>
          <span>{project.meta.year}</span>
        </div>
        <h3 className="mt-3 font-display text-4xl leading-tight tracking-tight">
          {project.title}
        </h3>
        <BodyText tone="secondary" className="mt-4 max-w-2xl">
          {project.oneLiner}
        </BodyText>
        <div className="mt-6 grid gap-2 border-t border-border/50 pt-4 font-body text-xs uppercase tracking-[0.12em] text-text-muted md:grid-cols-3">
          <span>{project.role}</span>
          <span>{project.meta.org ?? "Independent"}</span>
          <span>{project.contributionTag ?? "Project"}</span>
        </div>
      </article>
    </Link>
  );
}
