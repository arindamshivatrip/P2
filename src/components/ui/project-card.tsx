import { BodyText } from "@/components/typography/body-text";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  title: string;
  summary: string;
  tags: string[];
  tone?: "featured" | "supportingA" | "supportingB";
  interactive?: boolean;
  visualClassName?: string;
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
  className
}: ProjectCardProps) {
  return (
    <article
      className={cn(
        "group rounded-card p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(38,31,24,0.14),0_4px_10px_rgba(38,31,24,0.06)]",
        interactive && "cursor-pointer focus-within:ring-2 focus-within:ring-accent/40",
        toneStyles[tone],
        className
      )}
    >
      <div
        className={cn(
          "rounded-[0.75rem] bg-background/55 transition-transform duration-300 group-hover:scale-[1.015]",
          visualClassName
        )}
      />
      <h3 className="mt-4 font-display text-2xl tracking-tight">{title}</h3>
      <BodyText tone="secondary" className="mt-3">
        {summary}
      </BodyText>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-background/65 px-2.5 py-1 font-body text-[0.68rem] uppercase tracking-[0.12em] text-text-secondary"
          >
            {tag}
          </span>
        ))}
      </div>
      {interactive ? (
        <div className="mt-4 inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.12em] text-text-muted">
          <span>Open details</span>
          <span aria-hidden="true">+</span>
        </div>
      ) : null}
    </article>
  );
}
