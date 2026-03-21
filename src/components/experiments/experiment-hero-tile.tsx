import { BodyText } from "@/components/typography/body-text";
import { getProjectCoverSrc } from "@/data/projects";
import { getFallbackCoverImage } from "@/components/work/tile-media";
import type { Project } from "@/types/project";

type ExperimentHeroTileProps = {
  project: Project;
  hasCoverAsset: boolean;
};

export function ExperimentHeroTile({ project, hasCoverAsset }: ExperimentHeroTileProps) {
  const cover = getProjectCoverSrc(project);
  const fallbackCover = getFallbackCoverImage(project, "flagship");
  const hasRealCover = hasCoverAsset && !cover.includes("placeholder");
  const outputNote = project.highlights?.[1] ?? project.highlights?.[0] ?? project.summary;

  return (
    <article className="group h-full rounded-[1rem] bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(38,31,24,0.13)] md:p-6">
      <div className="flex items-center justify-between font-body text-[0.64rem] uppercase tracking-[0.13em] text-text-muted">
        <span>{project.status}</span>
        <span>{project.meta.year}</span>
      </div>

      <div
        className="relative mt-4 min-h-[220px] overflow-hidden rounded-[0.85rem] bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.01] md:min-h-[320px]"
        style={{
          backgroundImage: hasRealCover
            ? `linear-gradient(rgba(16,16,16,.16), rgba(16,16,16,.2)), url(${cover})`
            : fallbackCover
        }}
        aria-hidden="true"
      />

      <h2 className="mt-5 font-display text-4xl leading-tight tracking-tight md:text-[2.7rem]">
        {project.title}
      </h2>

      <BodyText tone="secondary" className="mt-3 max-w-3xl">
        {project.oneLiner}
      </BodyText>

      <div className="mt-6 grid gap-4 border-t border-border/50 pt-4 md:grid-cols-2">
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

      <div className="mt-5 flex flex-wrap gap-2">
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
  );
}
