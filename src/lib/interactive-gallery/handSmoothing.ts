import { smoothPoint, type Point2D } from "@/lib/interactive-gallery/math";
import type { Landmark3D } from "@/lib/interactive-gallery/gestureMath";

export function smoothLandmarks(previous: Landmark3D[] | undefined, next: Landmark3D[]): Landmark3D[] {
  return next.map((landmark, index) => {
    const smoothed = smoothPoint((previous?.[index] as Point2D | undefined) ?? null, landmark, 0.22);

    return {
      x: smoothed.x,
      y: smoothed.y,
      z:
        typeof landmark.z === "number"
          ? (previous?.[index]?.z ?? landmark.z) * 0.78 + landmark.z * 0.22
          : landmark.z
    };
  });
}
