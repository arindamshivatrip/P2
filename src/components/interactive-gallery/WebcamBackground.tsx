"use client";

import type { RefObject } from "react";
import { cn } from "@/lib/utils";

type WebcamBackgroundProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  active: boolean;
  visible: boolean;
  blur: boolean;
};

export function WebcamBackground({ videoRef, active, visible, blur }: WebcamBackgroundProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[1.25rem] border border-border/70 bg-surface/40 transition-opacity duration-500",
        active ? "opacity-100" : "opacity-0"
      )}
      aria-hidden="true"
      data-video-visible={active && visible ? "true" : "false"}
    >
      <video
        ref={videoRef}
        className={cn(
          "absolute inset-0 h-full w-full scale-x-[-1] object-cover opacity-50 saturate-[0.82] contrast-[0.92]",
          blur && "blur-[2px]"
        )}
        autoPlay
        playsInline
        muted
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,244,237,0.1),rgba(245,244,237,0.58)_76%),linear-gradient(to_bottom,rgba(245,244,237,0.12),rgba(245,244,237,0.68))] dark:bg-[radial-gradient(circle_at_center,rgba(15,17,19,0.04),rgba(15,17,19,0.64)_76%),linear-gradient(to_bottom,rgba(15,17,19,0.16),rgba(15,17,19,0.76))]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/75 to-transparent" />
    </div>
  );
}
