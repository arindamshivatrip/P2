"use client";

import { useMemo } from "react";

export function AmbientFieldBackground() {
  const dots = useMemo(
    () => [
      { left: "14%", top: "28%", delay: "0s", duration: "18s" },
      { left: "24%", top: "68%", delay: "-8s", duration: "24s" },
      { left: "52%", top: "19%", delay: "-5s", duration: "22s" },
      { left: "70%", top: "58%", delay: "-11s", duration: "26s" },
      { left: "82%", top: "34%", delay: "-15s", duration: "20s" },
      { left: "42%", top: "76%", delay: "-3s", duration: "28s" }
    ],
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(184,240,255,0.12),transparent_34%),linear-gradient(180deg,#0d1117_0%,#090c12_100%)]" />
      <div className="resonance-orb resonance-orb-a" />
      <div className="resonance-orb resonance-orb-b" />
      <div className="resonance-orb resonance-orb-c" />
      {dots.map((dot, index) => (
        <span
          key={index}
          className="resonance-drift-dot"
          style={{
            left: dot.left,
            top: dot.top,
            animationDelay: dot.delay,
            animationDuration: dot.duration
          }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#090c12] to-transparent" />
    </div>
  );
}
