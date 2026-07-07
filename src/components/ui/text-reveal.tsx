"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { transitions } from "@/lib/motion";

type TextRevealProps = {
  lines: ReactNode[];
  className?: string;
  delay?: number;
};

export function TextReveal({ lines, className, delay = 0 }: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <span className={className}>
        {lines.map((line, index) => (
          <span key={index} className="block">
            {line}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span className={className}>
      {lines.map((line, index) => (
        // pb/-mb keeps descenders inside the overflow mask at tight leading
        <span key={index} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
          <motion.span
            className="block will-change-transform"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ ...transitions.base, duration: 0.6, delay: delay + index * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
