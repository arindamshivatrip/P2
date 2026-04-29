"use client";

import type { SpatialGestureTransform, TrackedHand } from "@/lib/interactive-gallery/gestureMath";
import type { GalleryQuality, GalleryQualitySettings } from "@/lib/interactive-gallery/performance";
import type { GalleryProject } from "@/lib/interactive-gallery/projectAdapter";

type TrackingStatusPanelProps = {
  hands: TrackedHand[];
  selectedProject: GalleryProject | null;
  transform: SpatialGestureTransform | null;
  pointerActive: boolean;
  cameraActive: boolean;
  videoVisible: boolean;
  quality: GalleryQuality;
  settings: GalleryQualitySettings;
  cameraResolution: string;
  detectionFps: number;
  objectTransform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
  };
};

export function TrackingStatusPanel({
  hands,
  selectedProject,
  transform,
  pointerActive,
  cameraActive,
  videoVisible,
  quality,
  settings,
  cameraResolution,
  detectionFps,
  objectTransform
}: TrackingStatusPanelProps) {
  const left = hands.find((hand) => hand.label === "Left");
  const right = hands.find((hand) => hand.label === "Right");
  const mode = transform?.mode ?? (pointerActive ? "pointer drag" : "pointer");

  return (
    <div className="absolute left-4 top-4 z-30 w-[min(24rem,calc(100%-2rem))] rounded-card border border-border/70 bg-background/72 p-3 text-xs text-text-secondary shadow-card backdrop-blur-md">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-border/80 bg-surface/55 px-2.5 py-1">
          Camera: {cameraActive ? "on" : "off"}
        </span>
        <span className="rounded-full border border-border/80 bg-surface/55 px-2.5 py-1">
          Video visible: {videoVisible ? "yes" : "no"}
        </span>
        <span className="rounded-full border border-border/80 bg-surface/55 px-2.5 py-1">
          Quality: {quality}
        </span>
        <span className="rounded-full border border-border/80 bg-surface/55 px-2.5 py-1">
          DPR: {settings.dpr.join("-")}
        </span>
        <span className="rounded-full border border-border/80 bg-surface/55 px-2.5 py-1">
          Hands tracked: {hands.length}
        </span>
        <span className="rounded-full border border-border/80 bg-surface/55 px-2.5 py-1">Mode: {mode}</span>
      </div>
      <div className="mt-2 grid gap-1 sm:grid-cols-2">
        <span>Left: {left ? `${left.isPinching ? "pinch" : "open"} (${Math.round(left.confidence * 100)}%)` : "not tracked"}</span>
        <span>Right: {right ? `${right.isPinching ? "pinch" : "open"} (${Math.round(right.confidence * 100)}%)` : "not tracked"}</span>
      </div>
      <div className="mt-1 truncate">Selected: {selectedProject?.title ?? "none"}</div>
      <div className="mt-1">
        Hand FPS target/actual: {settings.handFps} / {detectionFps || 0}
      </div>
      <div className="mt-1">Camera resolution: {cameraResolution}</div>
      <div className="mt-1">
        Position: {objectTransform.position.map((value) => value.toFixed(2)).join(" / ")}
      </div>
      <div className="mt-1">
        Rotation: {objectTransform.rotation.map((value) => value.toFixed(2)).join(" / ")}
      </div>
      <div className="mt-1">
        Scale: {objectTransform.scale.toFixed(2)}
      </div>
    </div>
  );
}
