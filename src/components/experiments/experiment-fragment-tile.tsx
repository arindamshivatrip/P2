import { getProjectCoverSrc } from "@/data/projects";
import { getFallbackCoverImage } from "@/components/work/tile-media";
import type { Project } from "@/types/project";

type ExperimentFragmentTileProps = {
  project: Project;
  hasCoverAsset: boolean;
  tone?: "note" | "signal";
};

export function ExperimentFragmentTile({
  project,
  hasCoverAsset,
  tone = "note"
}: ExperimentFragmentTileProps) {
  const cover = getProjectCoverSrc(project);
  const fallbackCover = getFallbackCoverImage(project, "standard");
  const hasRealCover = hasCoverAsset && !cover.includes("placeholder");
  const fragmentLine = project.highlights?.[0] ?? project.oneLiner;

  return (
    <article className="group h-full rounded-[0.95rem] bg-surface p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(38,31,24,0.11)]">
      <div
        className="h-[8.5rem] rounded-[0.7rem] bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.01]"
        style={{
          backgroundImage: hasRealCover
            ? `linear-gradient(rgba(16,16,16,.1), rgba(16,16,16,.14)), url(${cover})`
            : fallbackCover
        }}
        aria-hidden="true"
      />
      <div className="mt-3 flex items-center justify-between font-body text-[0.6rem] uppercase tracking-[0.12em] text-text-muted">
        <span>{tone === "signal" ? "Signal" : "Fragment"}</span>
        <span>{project.meta.year}</span>
      </div>
      <h3 className="mt-2 font-display text-[1.9rem] leading-tight tracking-tight">{project.title}</h3>
      <p className="mt-2 font-body text-sm leading-relaxed text-text-secondary line-clamp-2">
        {fragmentLine}
      </p>
    </article>
  );
}
