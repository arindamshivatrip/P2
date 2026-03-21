import { BodyText } from "@/components/typography/body-text";
import { cn } from "@/lib/utils";

type ExperimentFieldNoteTileProps = {
  label: string;
  title: string;
  note: string;
  entries: Array<{ key: string; value: string }>;
  compact?: boolean;
};

export function ExperimentFieldNoteTile({
  label,
  title,
  note,
  entries,
  compact = false
}: ExperimentFieldNoteTileProps) {
  return (
    <article className={cn("rounded-[1rem] bg-surface p-5 shadow-card md:p-6", compact && "p-4 md:p-5")}>
      <p className="font-body text-[0.62rem] uppercase tracking-[0.13em] text-text-muted">{label}</p>
      <h3 className={cn("mt-4 font-display text-[2rem] leading-tight tracking-tight", compact && "text-[1.75rem]")}>
        {title}
      </h3>
      <BodyText tone="secondary" className={cn("mt-3 text-sm", compact && "text-[0.9rem]")}>
        {note}
      </BodyText>

      <dl className={cn("mt-5 space-y-3 border-t border-border/45 pt-4", compact && "mt-4")}>
        {entries.map((entry) => (
          <div key={entry.key} className="grid grid-cols-[7.5rem_1fr] gap-3">
            <dt className="font-body text-[0.62rem] uppercase tracking-[0.12em] text-text-muted">
              {entry.key}
            </dt>
            <dd className="font-body text-sm text-foreground/85">{entry.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
