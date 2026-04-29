"use client";

import { Button } from "@/components/ui/button";
import type { GalleryQuality } from "@/lib/interactive-gallery/performance";
import { cn } from "@/lib/utils";

type HandTrackingControlsProps = {
  isActive: boolean;
  isLoading: boolean;
  message: string;
  handCount: number;
  engagedHands: number;
  quality: GalleryQuality;
  reducedMotion: boolean;
  onQualityChange: (quality: GalleryQuality) => void;
  onStart: () => void;
  onStop: () => void;
};

export function HandTrackingControls({
  isActive,
  isLoading,
  message,
  handCount,
  engagedHands,
  quality,
  reducedMotion,
  onQualityChange,
  onStart,
  onStop
}: HandTrackingControlsProps) {
  const disabled = reducedMotion || isLoading;

  return (
    <div className="rounded-card border border-border/70 bg-surface/70 p-4 shadow-card backdrop-blur-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="font-display text-xl text-foreground">Spatial hand interaction</p>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Hand interaction is optional. Your camera feed is processed locally in the browser and is only
            used to estimate hand position.
          </p>
          <p className="mt-2 text-xs uppercase text-text-muted" aria-live="polite">
            {reducedMotion ? "Hand interaction is disabled while reduced motion is preferred." : message}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 rounded-full border border-border/80 bg-background/45 px-3 py-1 text-xs text-text-secondary">
            Quality
            <select
              value={quality}
              onChange={(event) => onQualityChange(event.target.value as GalleryQuality)}
              className="bg-transparent text-foreground outline-none"
              aria-label="Gallery quality"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <span className="rounded-full border border-border/80 bg-background/45 px-3 py-1 text-xs text-text-secondary">
            Hands: {handCount}
          </span>
          <span className="rounded-full border border-border/80 bg-background/45 px-3 py-1 text-xs text-text-secondary">
            Pinches: {engagedHands}
          </span>
          <Button
            variant={isActive ? "ghost" : "primary"}
            onClick={isActive ? onStop : onStart}
            disabled={disabled}
            aria-pressed={isActive}
            className={cn("shrink-0", disabled && "cursor-not-allowed opacity-55")}
          >
            {isLoading ? "Loading camera" : isActive ? "Disable camera interaction" : "Enable camera interaction"}
          </Button>
        </div>
      </div>
    </div>
  );
}
