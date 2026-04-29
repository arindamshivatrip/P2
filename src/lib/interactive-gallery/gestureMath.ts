import { clamp, distance, lerp, smoothPoint, type Point2D } from "@/lib/interactive-gallery/math";

export type Landmark3D = Point2D & {
  z?: number;
};

export type TrackedHand = {
  id: string;
  handedness: "Left" | "Right" | "Unknown";
  label: string;
  confidence: number;
  landmarks: Landmark3D[];
  indexTip: Landmark3D;
  thumbTip: Landmark3D;
  wrist: Landmark3D;
  cursor: Point2D;
  pinchDistance: number;
  pinchStrength: number;
  isPinching: boolean;
};

export type SpatialGestureTransform = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  mode: "single-hand" | "two-hand";
};

const PINCH_ACTIVE_THRESHOLD = 0.055;
const PINCH_RELEASE_THRESHOLD = 0.078;

export function deriveTrackedHand(
  landmarks: Landmark3D[],
  handedness: TrackedHand["handedness"],
  label: string,
  confidence: number,
  previous?: TrackedHand
): TrackedHand | null {
  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];

  if (!wrist || !thumbTip || !indexTip) {
    return null;
  }

  const pinchDistance = distance(thumbTip, indexTip);
  const wasPinching = previous?.isPinching ?? false;
  const isPinching = wasPinching
    ? pinchDistance < PINCH_RELEASE_THRESHOLD
    : pinchDistance < PINCH_ACTIVE_THRESHOLD;
  const cursor = smoothPoint(previous?.cursor ?? null, indexTip, 0.22);

  return {
    id: label,
    handedness,
    label,
    confidence,
    landmarks,
    indexTip,
    thumbTip,
    wrist,
    cursor,
    pinchDistance,
    pinchStrength: clamp(1 - pinchDistance / PINCH_RELEASE_THRESHOLD, 0, 1),
    isPinching
  };
}

export function getSpatialGestureTransform(hands: TrackedHand[]): SpatialGestureTransform | null {
  const pinchingHands = hands.filter((hand) => hand.isPinching);

  if (pinchingHands.length >= 2) {
    const [a, b] = pinchingHands;
    const midpoint = {
      x: (a.cursor.x + b.cursor.x) / 2,
      y: (a.cursor.y + b.cursor.y) / 2
    };
    const handDistance = distance(a.cursor, b.cursor);
    const angle = Math.atan2(b.cursor.y - a.cursor.y, b.cursor.x - a.cursor.x);
    const verticalDelta = b.cursor.y - a.cursor.y;

    return {
      position: [
        clamp((midpoint.x - 0.5) * 3.6, -1.6, 1.6),
        clamp((0.5 - midpoint.y) * 2.15, -0.9, 0.9),
        clamp((handDistance - 0.34) * 1.4, -0.3, 0.65)
      ],
      rotation: [
        clamp(verticalDelta * 2.1, -0.72, 0.72),
        clamp((midpoint.x - 0.5) * 1.05, -0.58, 0.58),
        clamp(angle, -1.25, 1.25)
      ],
      scale: clamp(0.86 + handDistance * 1.15, 0.88, 1.22),
      mode: "two-hand"
    };
  }

  const hand = pinchingHands[0];
  if (!hand) {
    return null;
  }

  return {
    position: [
      clamp((hand.cursor.x - 0.5) * 3.4, -1.6, 1.6),
      clamp((0.5 - hand.cursor.y) * 2.05, -0.9, 0.9),
      clamp((0.08 - (hand.indexTip.z ?? 0)) * 1.2, -0.35, 0.55)
    ],
    rotation: [
      clamp((0.5 - hand.cursor.y) * 0.78, -0.55, 0.55),
      clamp((hand.cursor.x - 0.5) * 1.08, -0.65, 0.65),
      clamp((hand.thumbTip.y - hand.indexTip.y) * 3, -0.72, 0.72)
    ],
    scale: lerp(0.96, 1.14, hand.pinchStrength),
    mode: "single-hand"
  };
}
