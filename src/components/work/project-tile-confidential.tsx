import Link from "next/link";
import { BodyText } from "@/components/typography/body-text";
import type { Project } from "@/types/project";

type ProjectTileConfidentialProps = {
  project: Project;
};

export function ProjectTileConfidential({ project }: ProjectTileConfidentialProps) {
  const statusLabel = "Selected Details";

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block h-full rounded-[1rem] bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(38,31,24,0.12)] md:p-6"
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
        <div className="mt-6 grid grid-cols-2 gap-3">
          {project.metrics?.slice(0, 2).map((metric) => (
            <div key={metric.label} className="rounded-[0.75rem] bg-background/70 p-3">
              <p className="font-display text-xl text-accent">{metric.value}</p>
              <p className="mt-1 font-body text-[0.68rem] uppercase tracking-[0.12em] text-text-muted">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
        <span className="mt-auto pt-6 font-body text-xs uppercase tracking-[0.12em] text-text-muted">
          {project.meta.org ?? "Confidential client context"}
        </span>
      </article>
    </Link>
  );
}
