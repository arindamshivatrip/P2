import { BodyText } from "@/components/typography/body-text";
import type { Project } from "@/types/project";

type ExperimentNoteTileProps = {
  project: Project;
};

export function ExperimentNoteTile({ project }: ExperimentNoteTileProps) {
  const learned = project.highlights?.[0] ?? project.summary;
  const nextStep = project.highlights?.[1] ?? "Iterate interaction details and evaluate against user feedback.";
  const stackPreview = `// ${project.tech.slice(0, 2).join(" + ")}
// ${project.categories[0] ?? "Exploration"}
build("${project.slug}");`;

  return (
    <article className="h-full rounded-[1rem] bg-surface p-5 shadow-card md:p-6">
      <div className="flex items-center justify-between font-body text-[0.64rem] uppercase tracking-[0.13em] text-text-muted">
        <span>{project.status}</span>
        <span>{project.meta.year}</span>
      </div>

      <h3 className="mt-4 font-display text-4xl leading-tight tracking-tight">{project.title}</h3>

      <div className="mt-5 rounded-[0.75rem] bg-background/80 p-4">
        <div className="mb-3 flex items-center justify-between font-body text-[0.56rem] uppercase tracking-[0.12em] text-text-muted">
          <span>XR signal</span>
          <span>{project.tech[0] ?? "Unity"}</span>
        </div>
        <div className="h-1 rounded-full bg-border/55">
          <div className="h-full w-[68%] rounded-full bg-accent/85" />
        </div>
        <pre className="mt-3 whitespace-pre-wrap font-mono text-[0.68rem] leading-relaxed text-text-secondary">
          {stackPreview}
        </pre>
      </div>

      <div className="mt-5">
        <p className="font-body text-[0.62rem] uppercase tracking-[0.12em] text-accent">Learned</p>
        <BodyText tone="secondary" className="mt-2 text-sm">
          {learned}
        </BodyText>
      </div>

      <div className="mt-4 border-t border-border/45 pt-4">
        <p className="font-body text-[0.62rem] uppercase tracking-[0.12em] text-text-muted">Next</p>
        <BodyText className="mt-2 text-sm">{nextStep}</BodyText>
      </div>
    </article>
  );
}
