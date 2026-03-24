"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType, EmblaEventType } from "embla-carousel";
import { cn } from "@/lib/utils";
import type { AboutGalleryItem } from "@/data/about";

type AboutParallaxRailProps = {
  id: string;
  items: AboutGalleryItem[];
  railLabel: string;
};

const TWEEN_FACTOR_BASE = 0.11;
const TWEEN_FACTOR_STEP = 0.012;
const TWEEN_FACTOR_MAX = 0.19;
const MAX_CENTER_SHIFT = 3.8;
const MAX_SIDE_SHIFT = 1.35;
const OFF_CENTER_DAMPING = 0.5;

export function AboutParallaxRail({ id, items, railLabel }: AboutParallaxRailProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: false
  });

  const parallaxNodesRef = useRef<HTMLElement[]>([]);
  const tweenFactorRef = useRef(TWEEN_FACTOR_BASE);

  const setParallaxNodes = useCallback((api: EmblaCarouselType) => {
    parallaxNodesRef.current = api
      .slideNodes()
      .map((slideNode) => slideNode.querySelector<HTMLElement>("[data-parallax-layer]"))
      .filter((node): node is HTMLElement => node !== null);
  }, []);

  const setTweenFactor = useCallback((api: EmblaCarouselType) => {
    const snapCount = api.scrollSnapList().length;
    const scaled = TWEEN_FACTOR_BASE + Math.max(0, snapCount - 1) * TWEEN_FACTOR_STEP;
    tweenFactorRef.current = Math.min(TWEEN_FACTOR_MAX, scaled);
  }, []);

  const applyParallax = useCallback(
    (api: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = api.internalEngine();
      const progress = api.scrollProgress();
      const snaps = api.scrollSnapList();
      const visibleSlides = api.slidesInView();
      const selectedSnap = api.selectedScrollSnap();
      const isScrollEvent = eventName === "scroll";

      snaps.forEach((snap, snapIndex) => {
        let diffToTarget = snap - progress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !visibleSlides.includes(slideIndex)) {
            return;
          }

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopPoint) => {
              const target = loopPoint.target();

              if (slideIndex === loopPoint.index && target !== 0) {
                const sign = Math.sign(target);
                if (sign < 0) {
                  diffToTarget = snap - (1 + progress);
                } else if (sign > 0) {
                  diffToTarget = snap + (1 - progress);
                }
              }
            });
          }

          const rawTranslate = diffToTarget * (-100 * tweenFactorRef.current);
          const proximityWeight = Math.max(0.28, 1 - Math.abs(diffToTarget) * 2.7);
          const isSelected = snapIndex === selectedSnap;
          const weightedTranslate = rawTranslate * proximityWeight;
          const dampedTranslate = isSelected
            ? weightedTranslate
            : weightedTranslate * OFF_CENTER_DAMPING;
          const maxShift = isSelected ? MAX_CENTER_SHIFT : MAX_SIDE_SHIFT;
          const translate = Math.max(-maxShift, Math.min(maxShift, dampedTranslate));
          const node = parallaxNodesRef.current[slideIndex];
          if (!node) {
            return;
          }

          node.style.transform = `translateX(${translate.toFixed(2)}%)`;
        });
      });
    },
    []
  );

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    setParallaxNodes(emblaApi);
    setTweenFactor(emblaApi);
    applyParallax(emblaApi);

    emblaApi
      .on("reInit", setParallaxNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", applyParallax)
      .on("scroll", applyParallax)
      .on("slideFocus", applyParallax);

    return () => {
      emblaApi
        .off("reInit", setParallaxNodes)
        .off("reInit", setTweenFactor)
        .off("reInit", applyParallax)
        .off("scroll", applyParallax)
        .off("slideFocus", applyParallax);
    };
  }, [emblaApi, setParallaxNodes, setTweenFactor, applyParallax]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-2 md:grid-cols-[3.25rem_minmax(0,1fr)_3.25rem] md:gap-3">
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={scrollPrev}
          aria-label={`Scroll ${railLabel} left`}
          aria-controls={id}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/45 bg-surface/96 text-foreground/70 shadow-[0_8px_18px_rgba(28,23,19,0.08)] transition-colors hover:border-accent/30 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 md:h-10 md:w-10"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none">
            <path
              d="M9.5 3.5 5 8l4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="relative min-w-0 rounded-[1.15rem] bg-[#0d0d0f] px-1.5 py-3 shadow-[0_14px_30px_rgba(12,12,14,0.34)] md:px-2 md:py-3.5">
        <div className="relative min-w-0 overflow-hidden" ref={emblaRef}>
          <div id={id} className="flex touch-pan-y pr-3">
          {items.map((image) => (
            <div
              key={image.assetName}
              className="min-w-0 flex-[0_0_16.5rem] pl-3 md:flex-[0_0_17.25rem]"
            >
              <article className="group h-full">
                <div className="relative aspect-[5/4] overflow-hidden rounded-[0.7rem] bg-[#17171a]">
                  <div
                    data-parallax-layer
                    className={cn(
                      "absolute inset-0 will-change-transform",
                      "scale-[1.08] transition-transform duration-300 group-hover:scale-[1.09]"
                    )}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 768px) 72vw, (max-width: 1280px) 28vw, 17.25rem"
                      quality={93}
                      unoptimized
                      className="object-cover object-center"
                    />
                  </div>
                </div>
                <p className="mt-2.5 font-body text-[0.72rem] tracking-[0.04em] text-neutral-300/90">
                  {image.caption}
                </p>
              </article>
            </div>
          ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={scrollNext}
          aria-label={`Scroll ${railLabel} right`}
          aria-controls={id}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/45 bg-surface/96 text-foreground/70 shadow-[0_8px_18px_rgba(28,23,19,0.08)] transition-colors hover:border-accent/30 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 md:h-10 md:w-10"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none">
            <path
              d="M6.5 3.5 11 8l-4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
