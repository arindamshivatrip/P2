import Link from "next/link";
import { BodyText } from "@/components/typography/body-text";
import type { Project } from "@/types/project";

type ProjectTileResearchProps = {
  project: Project;
};

export function ProjectTileResearch({ project }: ProjectTileResearchProps) {
  const participantsMetric = project.metrics?.find((metric) =>
    metric.label.toLowerCase().includes("participant")
  );
  const statusLabel = project.status;
  const outcomeMetric = project.metrics?.find((metric) =>
    metric.label.toLowerCase().includes("result") ||
    metric.label.toLowerCase().includes("outcome")
  );

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block h-full rounded-[1rem] bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-1 md:p-6"
    >
      <article className="flex h-full flex-col">
        <div className="flex items-center gap-4 font-body text-[0.68rem] uppercase tracking-[0.12em] text-text-muted">
          <span>{statusLabel}</span>
          <span>{project.meta.year}</span>
        </div>
        <h3 className="mt-4 font-display text-4xl leading-tight tracking-tight">{project.title}</h3>
        <BodyText tone="secondary" className="mt-4">
          {project.oneLiner}
        </BodyText>
        <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-border/60 pt-4">
          <div>
            <dt className="font-body text-[0.68rem] uppercase tracking-[0.12em] text-text-muted">
              Methodology
            </dt>
            <dd className="mt-1 font-body text-sm text-foreground">
              {project.metaStrip?.focusValue?.[0] ?? "Mixed-methods"}
            </dd>
          </div>
          <div>
            <dt className="font-body text-[0.68rem] uppercase tracking-[0.12em] text-text-muted">
              Participants
            </dt>
            <dd className="mt-1 font-body text-sm text-foreground">
              {participantsMetric?.value ?? "n/a"}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="font-body text-[0.68rem] uppercase tracking-[0.12em] text-text-muted">
              Outcome
            </dt>
            <dd className="mt-1 font-body text-sm text-foreground">
              {outcomeMetric?.value ?? project.status}
            </dd>
          </div>
        </dl>
      </article>
    </Link>
  );
}
