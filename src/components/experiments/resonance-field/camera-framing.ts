export type CameraFramingMode = "fit" | "fill" | "wide";

export type VideoDisplayRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function getVideoDisplayRect({
  containerWidth,
  containerHeight,
  videoWidth,
  videoHeight,
  mode
}: {
  containerWidth: number;
  containerHeight: number;
  videoWidth: number;
  videoHeight: number;
  mode: CameraFramingMode;
}): VideoDisplayRect {
  if (containerWidth <= 0 || containerHeight <= 0 || videoWidth <= 0 || videoHeight <= 0) {
    return {
      x: 0,
      y: 0,
      width: containerWidth,
      height: containerHeight
    };
  }

  const containerAspect = containerWidth / containerHeight;
  const videoAspect = videoWidth / videoHeight;
  const shouldCover = mode === "fill";
  const scale =
    shouldCover === videoAspect > containerAspect
      ? containerHeight / videoHeight
      : containerWidth / videoWidth;
  const wideScale = mode === "wide" ? 1.04 : 1;
  const width = videoWidth * scale * wideScale;
  const height = videoHeight * scale * wideScale;

  return {
    x: (containerWidth - width) / 2,
    y: (containerHeight - height) / 2,
    width,
    height
  };
}
