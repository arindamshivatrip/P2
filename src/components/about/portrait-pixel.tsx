"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

type PortraitPixelProps = {
  src: string;
  alt: string;
};

// Block grid resolution. 4:5 like the frame, so the upscaled canvas stretches
// exactly onto it with no further cropping. Fine enough to read as neat blocks
// rather than a chunky mosaic (bricks roughly half their earlier size).
const COLS = 56;
const ROWS = 70;

// Must mirror the base image's crop (cover + object-[60%_34%] + scale-1.46)
// closely enough that the block version reads as the same picture.
const ZOOM = 1.46;
const ANCHOR_X = 0.6;
const ANCHOR_Y = 0.34;

const FRAME_CLASS =
  "relative aspect-[4/5] w-full overflow-hidden rounded-[0.95rem] bg-surface/65";
const IMAGE_SIZES = "(max-width: 768px) 92vw, (max-width: 1280px) 38vw, 24rem";

// Cell-aligned stud + hairline overlay that sells "built from blocks": one
// highlight dot per cell plus a faint grid. Sized in fractions of the frame so
// it tracks the canvas cells at any rendered width.
const STUD_STYLE: CSSProperties = {
  backgroundImage: [
    "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.26) 0 20%, rgba(31,31,31,0.08) 26%, transparent 32%)",
    "linear-gradient(rgba(31,31,31,0.10) 1px, transparent 1px)",
    "linear-gradient(90deg, rgba(31,31,31,0.10) 1px, transparent 1px)"
  ].join(", "),
  backgroundSize: `${100 / COLS}% ${100 / ROWS}%`
};

// One-time pixelation: draw the same crop the visitor sees into a tiny canvas
// (each canvas pixel = one block), then let CSS upscale it crisp.
function usePixelatedPortrait(src: string): string | null {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const image = new window.Image();
    image.decoding = "async";
    image.src = src;
    image.onload = () => {
      if (cancelled) {
        return;
      }
      const iw = image.naturalWidth;
      const ih = image.naturalHeight;
      // Reproduce the base layer's CSS exactly: object-fit cover places the
      // image at a scale s0 with an offset given by object-position, and the
      // scale-1.46 transform then magnifies about the frame's center. Nominal
      // frame units cancel out; only the 4:5 aspect matters.
      const frameW = 800;
      const frameH = 1000;
      const s0 = Math.max(frameW / iw, frameH / ih);
      const offX = (frameW - iw * s0) * ANCHOR_X;
      const offY = (frameH - ih * s0) * ANCHOR_Y;
      // the region of the (pre-transform) frame visible after scaling about center
      const visW = frameW / ZOOM;
      const visH = frameH / ZOOM;
      const x0 = (frameW - visW) / 2;
      const y0 = (frameH - visH) / 2;
      // map that region back into source-image pixels
      const sx = (x0 - offX) / s0;
      const sy = (y0 - offY) / s0;
      const sw = visW / s0;
      const sh = visH / s0;

      const canvas = document.createElement("canvas");
      canvas.width = COLS;
      canvas.height = ROWS;
      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }
      context.imageSmoothingEnabled = true;
      context.drawImage(image, sx, sy, sw, sh, 0, 0, COLS, ROWS);
      setDataUrl(canvas.toDataURL());
    };
    return () => {
      cancelled = true;
    };
  }, [src]);

  return dataUrl;
}

// Live-action portrait that reveals a block/pixel translation of itself.
// Desktop hover shows the block layer through a cursor-following circular
// window; keyboard focus and mobile tap reveal the full block portrait.
// Reduced motion: no moving mask, instant full-layer fade. The block layer is
// produced once on mount (a 28×35 canvas draw), so there is no per-frame work.
export function PortraitPixel({ src, alt }: PortraitPixelProps) {
  const prefersReducedMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const [active, setActive] = useState(false);
  const [full, setFull] = useState(false);
  const frameRef = useRef<HTMLButtonElement>(null);
  const pixelUrl = usePixelatedPortrait(src);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    setFinePointer(query.matches);
    const onChange = (event: MediaQueryListEvent) => setFinePointer(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!finePointer || prefersReducedMotion || !frameRef.current) {
      return;
    }
    const rect = frameRef.current.getBoundingClientRect();
    frameRef.current.style.setProperty(
      "--x",
      `${((event.clientX - rect.left) / rect.width) * 100}%`
    );
    frameRef.current.style.setProperty(
      "--y",
      `${((event.clientY - rect.top) / rect.height) * 100}%`
    );
  };

  const handleEnter = () => {
    if (finePointer) {
      setActive(true);
    }
  };
  const handleLeave = () => {
    if (finePointer) {
      setActive(false);
    }
  };
  const handleFocus = () => {
    setActive(true);
    setFull(true);
  };
  const handleBlur = () => {
    setActive(false);
    setFull(false);
  };
  const handleClick = () => {
    if (!finePointer) {
      setFull((value) => !value);
      setActive((value) => !value);
    }
  };

  // Cursor window only for the pointer path; focus/tap/reduced show the whole
  // layer. Small window with a feathered edge (opaque core fading out) so the
  // reveal reads as a soft lens, not a hard-cut circle.
  const useMask = finePointer && !prefersReducedMotion && !full;
  const maskImage =
    "radial-gradient(circle 3.4rem at var(--x) var(--y), #000 0, #000 1.2rem, rgba(0,0,0,0.5) 2.3rem, transparent 3.4rem)";

  return (
    <button
      ref={frameRef}
      type="button"
      aria-pressed={active}
      aria-label="See the portrait rebuilt from blocks"
      onPointerMove={handlePointerMove}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      style={{ ["--x" as string]: "50%", ["--y" as string]: "42%" }}
      className={`group ${FRAME_CLASS} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={IMAGE_SIZES}
        quality={95}
        priority
        className="scale-[1.46] object-cover object-[60%_34%]"
      />

      {pixelUrl ? (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${
            prefersReducedMotion ? "" : "transition-opacity duration-300"
          } ${active ? "opacity-100" : "opacity-0"}`}
          style={useMask ? { WebkitMaskImage: maskImage, maskImage } : undefined}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pixelUrl}
            alt=""
            className="absolute inset-0 h-full w-full [image-rendering:pixelated]"
          />
          <div className="absolute inset-0" style={STUD_STYLE} />
        </div>
      ) : null}
    </button>
  );
}
