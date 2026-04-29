"use client";

import { useMemo } from "react";
import { getSpatialGestureTransform } from "@/lib/interactive-gallery/gestureMath";
import type { TrackedHand } from "@/lib/interactive-gallery/gestureMath";

type UseTwoHandGestureControllerOptions = {
  hands: TrackedHand[];
  hoveredSlug: string | null;
  selectedSlug: string | null;
  enabled: boolean;
};

export function useTwoHandGestureController({
  hands,
  hoveredSlug,
  selectedSlug,
  enabled
}: UseTwoHandGestureControllerOptions) {
  return useMemo(() => {
    if (!enabled) {
      return {
        activeSlug: null,
        transform: null,
        engagedHands: 0
      };
    }

    const transform = getSpatialGestureTransform(hands);
    const activeSlug = selectedSlug ?? hoveredSlug;

    if (!transform || !activeSlug) {
      return {
        activeSlug: null,
        transform: null,
        engagedHands: hands.filter((hand) => hand.isPinching).length
      };
    }

    return {
      activeSlug,
      transform,
      engagedHands: hands.filter((hand) => hand.isPinching).length
    };
  }, [enabled, hands, hoveredSlug, selectedSlug]);
}

