import { BodyText } from "@/components/typography/body-text";
import { cn } from "@/lib/utils";

type ExperimentMemoTileProps = {
  label: string;
  title: string;
  note: string;
  bullets?: string[];
  compact?: boolean;
};

export function ExperimentMemoTile({
  label,
  title,
  note,
  bullets = [],
  compact = false
}: ExperimentMemoTileProps) {
  return (
    <article className={cn("rounded-[1rem] bg-surface p-5 shadow-card md:p-6", compact && "p-4 md:p-5")}>
      <p className="font-body text-[0.62rem] uppercase tracking-[0.13em] text-text-muted">{label}</p>
      <h3 className={cn("mt-4 font-display text-[2rem] leading-tight tracking-tight", compact && "text-[1.75rem]")}>
        {title}
      </h3>
      <BodyText tone="secondary" className={cn("mt-3 text-sm", compact && "text-[0.9rem]")}>
        {note}
      </BodyText>

      {bullets.length > 0 ? (
        <ul className="mt-4 space-y-2 border-t border-border/45 pt-4">
          {bullets.map((item) => (
            <li key={item} className="font-body text-sm text-foreground/85">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
