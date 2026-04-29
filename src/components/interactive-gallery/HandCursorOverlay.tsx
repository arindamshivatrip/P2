"use client";

import type { TrackedHand } from "@/lib/interactive-gallery/gestureMath";
import { cn } from "@/lib/utils";

type HandCursorOverlayProps = {
  hands: TrackedHand[];
  enabled: boolean;
};

export function HandCursorOverlay({ hands, enabled }: HandCursorOverlayProps) {
  if (!enabled) {
    return null;
  }

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 hidden md:block">
      {hands.map((hand) => {
        const isLeft = hand.label === "Left";

        return (
          <div
            key={hand.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${hand.cursor.x * 100}vw`,
              top: `${hand.cursor.y * 100}vh`
            }}
          >
            <div
              className={cn(
                "grid h-9 w-9 place-items-center rounded-full border backdrop-blur-md transition-transform",
                isLeft
                  ? "border-accent/85 bg-accent/16 text-accent"
                  : "border-foreground/55 bg-background/22 text-foreground",
                hand.isPinching && "scale-75 bg-accent/42 shadow-[0_0_0_8px_rgba(255,153,50,0.14)]"
              )}
            >
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  hand.isPinching ? "bg-accent" : isLeft ? "bg-accent/55" : "bg-foreground/55"
                )}
              />
            </div>
            <div className="mt-1 rounded-full border border-border/70 bg-background/70 px-2 py-0.5 text-[10px] uppercase text-text-secondary shadow-sm backdrop-blur-md">
              {hand.label} {hand.isPinching ? "pinch" : "open"}
            </div>
          </div>
        );
      })}
    </div>
  );
}

