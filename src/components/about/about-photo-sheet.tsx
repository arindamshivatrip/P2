"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { AboutGalleryItem } from "@/data/about";

type AboutPhotoSheetProps = {
  items: AboutGalleryItem[];
};

// Controlled contact-sheet scatter: small static rotations + staggered vertical
// offsets (desktop only). Literal class strings so Tailwind keeps them.
const ROTATIONS = [-3, 2.2, -1.8, 2.6, -2.4, 1.6];
const OFFSETS = ["md:mt-0", "md:mt-10", "md:mt-3", "md:mt-12", "md:mt-1", "md:mt-8"];

// One polaroid print. Front is the photo + typed caption; the short field note
// is revealed by hover (fine pointer), keyboard focus, or tap (coarse pointer).
// The note lives in the DOM at all times, so it is never hover-only content —
// screen readers always reach it and keyboard focus always surfaces it. Motion
// path is a CSS 3D flip; reduced motion swaps to a plain opacity reveal.
function Polaroid({ item, rotation }: { item: AboutGalleryItem; rotation: number }) {
  const prefersReducedMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  // Hover, keyboard focus, and tap are tracked separately so they never fight:
  // on a fine pointer, hover + focus reveal (a pointer-leave can't hide a note
  // that still has keyboard focus); on a coarse pointer, tap toggles and focus
  // is ignored so the tap→focus→click sequence can't cancel itself out.
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tapped, setTapped] = useState(false);
  const revealed = hovered || focused || tapped;

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    setFinePointer(query.matches);
    const onChange = (event: MediaQueryListEvent) => setFinePointer(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <figure className="group mx-auto w-full max-w-[15.5rem]">
      <div className="transition-transform duration-300 ease-out motion-safe:group-hover:-translate-y-1.5 motion-safe:group-focus-within:-translate-y-1.5">
        <div
          style={{ transform: `rotate(${rotation}deg)` }}
          className="rounded-[0.45rem] border border-border/45 bg-surface p-2.5 pb-0 shadow-[0_10px_28px_rgba(28,23,19,0.10)] transition-shadow duration-300 group-hover:shadow-[0_18px_40px_rgba(28,23,19,0.16)] group-focus-within:shadow-[0_18px_40px_rgba(28,23,19,0.16)]"
        >
          <button
            type="button"
            aria-expanded={revealed}
            aria-label={`${item.caption} — reveal note`}
            onPointerEnter={finePointer ? () => setHovered(true) : undefined}
            onPointerLeave={finePointer ? () => setHovered(false) : undefined}
            onFocus={finePointer ? () => setFocused(true) : undefined}
            onBlur={finePointer ? () => setFocused(false) : undefined}
            onClick={finePointer ? undefined : () => setTapped((value) => !value)}
            className="relative block aspect-square w-full rounded-[0.3rem] [perspective:900px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <div
              className={cn(
                "relative h-full w-full rounded-[0.3rem]",
                !prefersReducedMotion &&
                  "transition-transform duration-[550ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] [transform-style:preserve-3d]",
                !prefersReducedMotion && revealed && "[transform:rotateY(180deg)]"
              )}
            >
              {/* Front — the photograph */}
              <div
                className={cn(
                  "absolute inset-0 overflow-hidden rounded-[0.3rem] bg-background",
                  !prefersReducedMotion && "[backface-visibility:hidden]"
                )}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 44vw, 15.5rem"
                  quality={92}
                  className="object-cover object-center"
                />
              </div>

              {/* Reveal — the field note */}
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center rounded-[0.3rem] bg-surface px-5 text-center",
                  prefersReducedMotion
                    ? cn("opacity-0 transition-opacity duration-300", revealed && "opacity-100")
                    : "[transform:rotateY(180deg)] [backface-visibility:hidden]"
                )}
              >
                <span className="font-body text-[0.95rem] leading-relaxed text-text-secondary">
                  {item.note}
                </span>
              </div>
            </div>
          </button>

          <figcaption className="px-1 pb-3 pt-3 text-center font-body text-caption tracking-[0.02em] text-text-secondary">
            {item.caption}
          </figcaption>
        </div>
      </div>
    </figure>
  );
}

// Cream contact-sheet of loose photo prints — a stack of personal field notes
// rather than a gallery widget. 2-column grid on mobile, a controlled scattered
// 3-column composition on desktop.
export function AboutPhotoSheet({ items }: AboutPhotoSheetProps) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-3 md:gap-x-8 md:gap-y-6">
      {items.map((item, index) => (
        <li key={item.assetName} className={OFFSETS[index % OFFSETS.length]}>
          <Polaroid item={item} rotation={ROTATIONS[index % ROTATIONS.length]} />
        </li>
      ))}
    </ul>
  );
}
