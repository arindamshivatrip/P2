import { cn } from "@/lib/utils";

export type ResonanceStep = "idle" | "permissions" | "calibrating" | "live";

const orderedSteps: ResonanceStep[] = ["idle", "permissions", "calibrating", "live"];

export function ResonanceStatusStep({ currentStep }: { currentStep: ResonanceStep }) {
  const activeIndex = orderedSteps.indexOf(currentStep);

  return (
    <ol className="mx-auto mt-8 grid max-w-[28rem] grid-cols-4 gap-2" aria-label="Experience progress">
      {orderedSteps.map((step, index) => {
        const isActive = step === currentStep;
        const isComplete = index < activeIndex;

        return (
          <li key={step} className="min-w-0">
            <div
              className={cn(
                "h-1.5 rounded-full border border-white/10 bg-white/[0.08]",
                isComplete && "border-[#b8f0ff]/25 bg-[#b8f0ff]/55",
                isActive && "border-[#aab8ff]/45 bg-[#aab8ff]/80"
              )}
            />
            <span className="sr-only">
              {step} {isActive ? "current step" : isComplete ? "complete" : "pending"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
