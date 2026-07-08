import Link from "next/link";
import { ExperimentStamp } from "@/components/experiments/experiment-stamp";
import { cn } from "@/lib/utils";

export type LabItem = {
  id: string;
  href: string;
  title: string;
  oneLiner: string;
  metaLine: string;
  stamp: string;
  tech: string[];
  cover?: string;
};

// Paper tints — cream, warm manila, cool blue-gray. More color than /work, still ours.
const paperTints = ["bg-background", "bg-[#eee5d3]", "bg-[#e4e9ed]"];

type ExperimentCardProps = {
  item: LabItem;
  tint?: number;
  featured?: boolean;
  onLinkFocus?: () => void;
  className?: string;
};

export function ExperimentCard({
  item,
  tint = 0,
  featured = false,
  onLinkFocus,
  className
}: ExperimentCardProps) {
  return (
    <article
      className={cn(
        "rounded-[0.85rem] border border-border/60 p-4 shadow-card",
        paperTints[tint % paperTints.length],
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-body text-label-xs uppercase text-text-muted">
          {item.metaLine}
        </p>
        <ExperimentStamp label={item.stamp} className="text-[0.55rem]" />
      </div>

      {featured && item.cover ? (
        <div
          className="mt-3 aspect-[16/9] overflow-hidden rounded-[0.6rem] bg-cover bg-center"
          style={{ backgroundImage: `url(${item.cover})` }}
          aria-hidden="true"
        />
      ) : null}

      <h3 className="mt-3 font-display text-2xl leading-tight tracking-tight">
        <Link
          href={item.href}
          draggable={false}
          className="transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          onFocus={onLinkFocus}
        >
          {item.title}
        </Link>
      </h3>

      <p className="mt-2 font-body text-sm leading-relaxed text-text-secondary">{item.oneLiner}</p>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <span className="font-body text-label-xs uppercase text-text-muted">
          {item.tech.join(" · ")}
        </span>
        <Link
          href={item.href}
          draggable={false}
          tabIndex={-1}
          aria-hidden="true"
          className="font-body text-label-lg uppercase text-accent transition-colors hover:text-foreground"
        >
          Open →
        </Link>
      </div>
    </article>
  );
}
