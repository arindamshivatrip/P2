import { BodyText } from "@/components/typography/body-text";
import { getExperimentMetaLine } from "@/components/experiments/experiment-meta";
import type { Project } from "@/types/project";

type ExperimentNoteTileProps = {
  project: Project;
};

export function ExperimentNoteTile({ project }: ExperimentNoteTileProps) {
  const learned = project.highlights?.[0] ?? project.summary;
  const outcome = project.highlights?.[1] ?? project.oneLiner;
  const interactionFocus = project.categories[0] ?? "Interaction";
  const toolsUsed = project.tech.slice(0, 3).join(" · ");
  const metaLine = getExperimentMetaLine(project);

  return (
    <article className="h-full rounded-[1rem] bg-surface p-5 shadow-card md:p-6">
      <p className="font-body text-[0.64rem] uppercase tracking-[0.13em] text-text-muted">{metaLine}</p>

      <h3 className="mt-4 font-display text-4xl leading-tight tracking-tight">{project.title}</h3>

      <div className="mt-5 rounded-[0.75rem] bg-background/70 p-4">
        <dl className="space-y-3">
          <div className="grid grid-cols-[7.25rem_1fr] gap-3">
            <dt className="font-body text-[0.62rem] uppercase tracking-[0.12em] text-text-muted">
              Tools Used
            </dt>
            <dd className="font-body text-sm text-foreground/85">{toolsUsed}</dd>
          </div>
          <div className="grid grid-cols-[7.25rem_1fr] gap-3">
            <dt className="font-body text-[0.62rem] uppercase tracking-[0.12em] text-text-muted">
              Interaction
            </dt>
            <dd className="font-body text-sm text-foreground/85">{interactionFocus}</dd>
          </div>
          <div className="grid grid-cols-[7.25rem_1fr] gap-3">
            <dt className="font-body text-[0.62rem] uppercase tracking-[0.12em] text-text-muted">
              Outcome
            </dt>
            <dd className="font-body text-sm text-foreground/85">{outcome}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-5">
        <p className="font-body text-[0.62rem] uppercase tracking-[0.12em] text-accent">Learned</p>
        <BodyText tone="secondary" className="mt-2 text-sm">
          {learned}
        </BodyText>
      </div>
    </article>
  );
}
