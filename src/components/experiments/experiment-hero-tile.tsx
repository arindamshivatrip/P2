import Link from "next/link";
import { BodyText } from "@/components/typography/body-text";
import { getProjectCoverSrc, getProjectDestinationHref } from "@/data/projects";
import { getFallbackCoverImage } from "@/components/work/tile-media";
import type { Project } from "@/types/project";
import { getExperimentMetaLine } from "@/components/experiments/experiment-meta";

type ExperimentHeroTileProps = {
  project: Project;
  hasCoverAsset: boolean;
  hasVideoAsset?: boolean;
};

export function ExperimentHeroTile({
  project,
  hasCoverAsset,
  hasVideoAsset = false
}: ExperimentHeroTileProps) {
  const cover = getProjectCoverSrc(project);
  const fallbackCover = getFallbackCoverImage(project, "flagship");
  const hasVideoSource = Boolean(project.video?.src);
  const hasVideo = hasVideoSource && (hasVideoAsset || project.video?.src?.startsWith("/"));
  const hasRealCover = hasCoverAsset && !cover.includes("placeholder");
  const backgroundFallback = hasRealCover
    ? `linear-gradient(rgba(16,16,16,.16), rgba(16,16,16,.2)), url(${cover})`
    : fallbackCover;
  const useWidescreenMediaFrame = project.tileMediaAspect === "widescreen-16-9";
  const mediaFrameClassName = useWidescreenMediaFrame
    ? "relative mt-4 aspect-[16/9] overflow-hidden rounded-[0.85rem] bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.01]"
    : "relative mt-4 min-h-[220px] overflow-hidden rounded-[0.85rem] bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.01] md:min-h-[320px]";
  const titleTopSpacingClassName = useWidescreenMediaFrame ? "mt-4" : "mt-5";
  const subtitleTopSpacingClassName = useWidescreenMediaFrame ? "mt-2.5" : "mt-3";
  const infoBlockTopSpacingClassName = useWidescreenMediaFrame ? "mt-5" : "mt-6";
  const tagsTopSpacingClassName = useWidescreenMediaFrame ? "mt-4" : "mt-5";
  const outputNote = project.highlights?.[1] ?? project.highlights?.[0] ?? project.summary;
  const metaLine = getExperimentMetaLine(project);

  return (
    <Link href={getProjectDestinationHref(project)} className="group block h-full">
      <article className="h-full rounded-[1rem] bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(38,31,24,0.13)] md:p-6">
        <p className="font-body text-[0.64rem] uppercase tracking-[0.13em] text-text-muted">{metaLine}</p>

        <div
          className={mediaFrameClassName}
          style={{ backgroundImage: backgroundFallback }}
          aria-hidden="true"
        >
          {hasVideo ? (
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
          ) : null}
        </div>

        <h2
          className={`${titleTopSpacingClassName} font-display text-4xl leading-tight tracking-tight md:text-[2.7rem]`}
        >
          {project.title}
        </h2>

        <BodyText tone="secondary" className={`${subtitleTopSpacingClassName} max-w-3xl`}>
          {project.oneLiner}
        </BodyText>

        <div
          className={`${infoBlockTopSpacingClassName} grid gap-4 border-t border-border/50 pt-4 md:grid-cols-2`}
        >
          <div>
            <p className="font-body text-[0.62rem] uppercase tracking-[0.13em] text-accent">Field Note</p>
            <BodyText tone="secondary" className="mt-2 text-sm">
              {project.summary}
            </BodyText>
          </div>
          <div>
            <p className="font-body text-[0.62rem] uppercase tracking-[0.13em] text-text-muted">Output</p>
            <BodyText className="mt-2 text-sm">
              <span className="font-serif italic text-foreground/90">&ldquo;{outputNote}&rdquo;</span>
            </BodyText>
          </div>
        </div>

        <div className={`${tagsTopSpacingClassName} flex flex-wrap gap-2`}>
          {project.tech.slice(0, 3).map((item) => (
            <span
              key={item}
              className="rounded-full bg-background/75 px-2 py-1 font-body text-[0.62rem] uppercase tracking-[0.11em] text-text-muted"
            >
              {item}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
