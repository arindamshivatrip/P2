import { BodyText } from "@/components/typography/body-text";

type ExperimentProgressTileProps = {
  total: number;
  inProgress: number;
  prototypes: number;
};

export function ExperimentProgressTile({
  total,
  inProgress,
  prototypes
}: ExperimentProgressTileProps) {
  const completion = total === 0 ? 0 : Math.round(((total - inProgress) / total) * 100);

  return (
    <article className="rounded-[1rem] bg-surface p-5 shadow-card md:p-6">
      <p className="font-body text-[0.62rem] uppercase tracking-[0.13em] text-text-muted">
        Prototype Status
      </p>
      <h3 className="mt-4 font-display text-4xl leading-tight tracking-tight">{completion}%</h3>
      <BodyText tone="secondary" className="mt-3 text-sm">
        {total - inProgress} of {total} experiments currently in active build mode.
      </BodyText>

      <div className="mt-6 h-1.5 rounded-full bg-background/85">
        <div className="h-full rounded-full bg-accent/90" style={{ width: `${completion}%` }} />
      </div>

      <div className="mt-5 flex items-center justify-between font-body text-xs text-text-secondary">
        <span>In Progress: {inProgress}</span>
        <span>Prototype: {prototypes}</span>
      </div>
    </article>
  );
}
