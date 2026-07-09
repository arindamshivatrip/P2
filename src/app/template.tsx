"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Global page-content transition. Next.js re-mounts this template on every
// route change, so a plain enter fade is enough — no AnimatePresence/exit
// handling (which is brittle in the App Router). The header and footer live in
// the layout above this wrapper and stay stable across navigations.
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 4 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.12 : 0.22, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
