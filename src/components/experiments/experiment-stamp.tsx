import { cn } from "@/lib/utils";

type ExperimentStampProps = {
  label: string;
  className?: string;
};

// A small rotated status stamp — the one badge each experiment tile is allowed.
export function ExperimentStamp({ label, className }: ExperimentStampProps) {
  return (
    <span
      className={cn(
        "inline-block -rotate-2 rounded-[0.3rem] border border-accent/65 px-2 py-0.5 font-body text-label-xs uppercase text-accent",
        className
      )}
    >
      {label}
    </span>
  );
}
