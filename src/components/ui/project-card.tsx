import { BodyText } from "@/components/typography/body-text";
import { ProjectCardVisual } from "@/components/ui/project-card-visual";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  title: string;
  summary: string;
  tags: string[];
  tone?: "featured" | "supportingA" | "supportingB";
  interactive?: boolean;
  visualClassName?: string;
  visualVideoSrc?: string;
  visualVideoTitle?: string;
  className?: string;
};

const toneStyles = {
  featured: "bg-surface shadow-card",
  supportingA: "bg-surface shadow-card",
  supportingB: "bg-surface/95 shadow-card"
} as const;

export function ProjectCard({
  title,
  summary,
  tags,
  tone = "supportingA",
  interactive = false,
  visualClassName,
  visualVideoSrc,
  visualVideoTitle,
  className
}: ProjectCardProps) {
  return (
    <article
      className={cn(
        "group rounded-card p-4 transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-card-hover",
        interactive && "cursor-pointer focus-within:ring-2 focus-within:ring-accent/40",
        toneStyles[tone],
        className
      )}
    >
      <ProjectCardVisual
        className={visualClassName}
        videoSrc={visualVideoSrc}
        videoTitle={visualVideoTitle}
      />
      <h3 className="mt-4 font-display text-2xl tracking-tight">{title}</h3>
      <BodyText tone="secondary" className="mt-3">
        {summary}
      </BodyText>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="font-body text-[0.68rem] uppercase tracking-[0.14em] text-text-muted">
          {tags.join(" · ")}
        </p>
        {interactive ? (
          <span className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.12em] text-text-muted">
            <span>Open details</span>
            <span aria-hidden="true">+</span>
          </span>
        ) : null}
      </div>
    </article>
  );
}
