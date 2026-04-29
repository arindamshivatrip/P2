export type GalleryQuality = "low" | "medium" | "high";

export type GalleryQualitySettings = {
  dpr: [number, number];
  handFps: number;
  camera: {
    width: number;
    height: number;
    frameRate: number;
  };
  shadows: boolean;
  blur: boolean;
  transmission: boolean;
  debugIntervalMs: number;
};

export const QUALITY_SETTINGS: Record<GalleryQuality, GalleryQualitySettings> = {
  low: {
    dpr: [1, 1],
    handFps: 12,
    camera: { width: 480, height: 360, frameRate: 20 },
    shadows: false,
    blur: false,
    transmission: false,
    debugIntervalMs: 650
  },
  medium: {
    dpr: [1, 1.5],
    handFps: 18,
    camera: { width: 640, height: 480, frameRate: 24 },
    shadows: false,
    blur: false,
    transmission: false,
    debugIntervalMs: 500
  },
  high: {
    dpr: [1, 2],
    handFps: 24,
    camera: { width: 640, height: 480, frameRate: 30 },
    shadows: true,
    blur: true,
    transmission: true,
    debugIntervalMs: 500
  }
};

export function getDefaultQuality(): GalleryQuality {
  if (typeof window === "undefined") {
    return "medium";
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSmallScreen = window.innerWidth < 768;
  const lowCoreCount = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
  const highDpr = window.devicePixelRatio > 2;

  if (prefersReducedMotion || isSmallScreen || lowCoreCount || highDpr) {
    return "low";
  }

  return "medium";
}

