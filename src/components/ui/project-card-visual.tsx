"use client";

import { motion, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState, type PointerEvent } from "react";
import { springs } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ProjectCardVisualProps = {
  className?: string;
  videoSrc?: string;
  videoTitle?: string;
};

const PARALLAX_RANGE = 4;

export function ProjectCardVisual({ className, videoSrc, videoTitle }: ProjectCardVisualProps) {
  const prefersReducedMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const x = useSpring(0, springs.follow);
  const y = useSpring(0, springs.follow);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    setFinePointer(query.matches);
    const onChange = (event: MediaQueryListEvent) => setFinePointer(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const parallaxEnabled = Boolean(videoSrc) && finePointer && !prefersReducedMotion;

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((((event.clientX - rect.left) / rect.width) * 2 - 1) * PARALLAX_RANGE);
    y.set((((event.clientY - rect.top) / rect.height) * 2 - 1) * PARALLAX_RANGE);
  };

  const resetParallax = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[0.75rem] bg-background/55 transition-transform duration-300 group-hover:scale-[1.015]",
        className
      )}
      aria-hidden="true"
      onPointerMove={parallaxEnabled ? handlePointerMove : undefined}
      onPointerLeave={parallaxEnabled ? resetParallax : undefined}
    >
      {videoSrc ? (
        <>
          {/* scale keeps edges covered while the media translates up to 4px */}
          <motion.div
            className="absolute inset-0 scale-[1.03]"
            style={parallaxEnabled ? { x, y } : undefined}
          >
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              preload="metadata"
              tabIndex={-1}
              title={videoTitle}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f1e47]/50 via-transparent to-[#ff8a4c]/35" />
        </>
      ) : null}
    </div>
  );
}
