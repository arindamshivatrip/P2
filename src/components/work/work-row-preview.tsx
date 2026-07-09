"use client";

import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
  type MotionValue
} from "framer-motion";
import { springs, transitions } from "@/lib/motion";
import type { WorkIndexItem } from "@/components/work/work-index";

type WorkRowPreviewProps = {
  item: WorkIndexItem | null;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
};

const PANEL_WIDTH = 384;
const PANEL_HEIGHT = 288;
const POINTER_OFFSET = 32;
const VIEWPORT_MARGIN = 16;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

// Floating media panel for the work index. Purely presentational — every piece
// of information it shows is already visible in the row itself.
export function WorkRowPreview({ item, pointerX, pointerY }: WorkRowPreviewProps) {
  const x = useSpring(
    useTransform(pointerX, (value) => {
      if (typeof window === "undefined") return value;
      const preferred = value + POINTER_OFFSET;
      const max = window.innerWidth - PANEL_WIDTH - VIEWPORT_MARGIN;
      // flip to the left of the cursor when the right side would overflow
      return preferred > max ? value - PANEL_WIDTH - POINTER_OFFSET : preferred;
    }),
    springs.follow
  );
  const y = useSpring(
    useTransform(pointerY, (value) => {
      if (typeof window === "undefined") return value;
      return clamp(
        value - PANEL_HEIGHT / 2,
        VIEWPORT_MARGIN,
        window.innerHeight - PANEL_HEIGHT - VIEWPORT_MARGIN
      );
    }),
    springs.follow
  );

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          key={item.id}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-40 hidden overflow-hidden rounded-[0.9rem] shadow-card-hover md:block"
          style={{ width: PANEL_WIDTH, height: PANEL_HEIGHT, x, y, willChange: "transform" }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ ...transitions.quick, duration: 0.18 }}
        >
          {item.video ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={item.video}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              preload="metadata"
              tabIndex={-1}
            />
          ) : item.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src={item.cover}
              alt=""
              loading="eager"
              decoding="async"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ backgroundImage: item.fallbackGradient }}
            >
              <div className="absolute inset-0 bg-[rgba(31,31,31,0.3)]" />
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <span className="font-body text-label uppercase text-background/80">
                  {item.year} · {item.statusLabel}
                </span>
                <span className="max-w-[16ch] font-display text-[1.7rem] leading-[1.1] tracking-tight text-background">
                  {item.title}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
