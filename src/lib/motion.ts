import type { Transition, Variants } from "framer-motion";

export const transitions: Record<"base" | "smooth", Transition> = {
  base: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] },
  smooth: { duration: 0.72, ease: [0.2, 0.8, 0.2, 1] }
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.base
  }
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06
    }
  }
};

export const pageSlide: Variants = {
  initial: { opacity: 0, x: 28 },
  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth
  },
  exit: {
    opacity: 0,
    x: -16,
    transition: transitions.base
  }
};

export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2, ease: "easeOut" as const } },
  whileTap: { y: -1, transition: { duration: 0.15 } }
};
