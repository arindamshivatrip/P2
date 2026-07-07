"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { PointerEvent } from "react";
import { springs } from "@/lib/motion";
import { cn } from "@/lib/utils";

const REST_Y = 12;
const MAX_BEND = 9;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

// The orange rule under the hero headline, drawn as a quadratic bezier the
// pointer can bend; it springs back and settles on its own. Touch and
// reduced-motion get a plain static rule.
export function HeroAccentRule({ className }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const bendX = useMotionValue(50);
  const bendY = useMotionValue(REST_Y);
  const bendYSpring = useSpring(bendY, springs.settle);
  const path = useTransform([bendX, bendYSpring], (latest: number[]) => {
    return `M 0 ${REST_Y} Q ${latest[0]} ${latest[1]} 100 ${REST_Y}`;
  });

  if (prefersReducedMotion) {
    return (
      <div className={cn("flex h-6 items-center", className)} aria-hidden="true">
        <div className="h-[2px] w-full bg-accent" />
      </div>
    );
  }

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (event.pointerType !== "mouse") {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = ((event.clientX - rect.left) / rect.width) * 100;
    const offsetY = ((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * MAX_BEND;
    bendX.set(clamp(relativeX, 10, 90));
    bendY.set(REST_Y + clamp(offsetY, -MAX_BEND, MAX_BEND));
  };

  return (
    <svg
      className={cn("h-6 w-full touch-none", className)}
      viewBox="0 0 100 24"
      preserveAspectRatio="none"
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => bendY.set(REST_Y)}
    >
      <motion.path
        d={path}
        fill="none"
        style={{ stroke: "rgb(var(--color-accent))" }}
        strokeWidth={2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
