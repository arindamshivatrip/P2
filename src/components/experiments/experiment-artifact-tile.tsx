import Link from "next/link";
import { BodyText } from "@/components/typography/body-text";
import { getProjectCoverSrc, getProjectDestinationHref } from "@/data/projects";
import { getFallbackCoverImage } from "@/components/work/tile-media";
import type { Project } from "@/types/project";
import { getExperimentMetaLine } from "@/components/experiments/experiment-meta";

type ExperimentArtifactTileProps = {
  project: Project;
  hasCoverAsset: boolean;
};

export function ExperimentArtifactTile({ project, hasCoverAsset }: ExperimentArtifactTileProps) {
  const cover = getProjectCoverSrc(project);
  const fallbackCover = getFallbackCoverImage(project, "standard");
  const hasRealCover = hasCoverAsset && !cover.includes("placeholder");
  const tested = project.highlights?.[0] ?? project.oneLiner;
  const caption = project.meta.org ?? "Independent";
  const metaLine = getExperimentMetaLine(project);

  return (
    <Link href={getProjectDestinationHref(project)} className="group block h-full">
      <article className="h-full rounded-[1rem] bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(38,31,24,0.12)] md:p-6">
        <p className="font-body text-[0.64rem] uppercase tracking-[0.13em] text-text-muted">{metaLine}</p>

        <h3 className="mt-4 font-display text-4xl leading-tight tracking-tight">{project.title}</h3>

        <div className="mt-4 rounded-[0.82rem] bg-background/86 p-3">
          <div
            className="relative min-h-[230px] overflow-hidden rounded-[0.7rem] bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.01] md:min-h-[280px]"
            style={{
              backgroundImage: hasRealCover
                ? `linear-gradient(rgba(16,16,16,.08), rgba(16,16,16,.12)), url(${cover})`
                : fallbackCover
            }}
            aria-hidden="true"
          />
          <p className="mt-3 font-body text-[0.6rem] uppercase tracking-[0.12em] text-text-muted">
            {caption}
          </p>
        </div>

        <p className="mt-5 font-body text-[0.62rem] uppercase tracking-[0.12em] text-accent">Tested</p>
        <BodyText tone="secondary" className="mt-2 text-sm">
          {tested}
        </BodyText>
      </article>
    </Link>
  );
}
