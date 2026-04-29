"use client";

import { useEffect, useRef, useState } from "react";
import { getVideoDisplayRect, type CameraFramingMode, type VideoDisplayRect } from "./camera-framing";

type HandTrackingVideoLayerProps = {
  stream: MediaStream | null;
  mode: "hidden" | "subtle" | "visible";
  opacity: number;
  framingMode: CameraFramingMode;
  showStatus?: boolean;
  onDisplayRectChange?: (rect: VideoDisplayRect | null) => void;
};

export function HandTrackingVideoLayer({
  stream,
  mode,
  opacity,
  framingMode,
  showStatus = false,
  onDisplayRectChange
}: HandTrackingVideoLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStatus, setVideoStatus] = useState({
    readyState: 0,
    width: 0,
    height: 0
  });

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;

    if (!container || !video || !stream) {
      onDisplayRectChange?.(null);
      return;
    }

    function updateRect() {
      const bounds = container?.getBoundingClientRect();

      if (!bounds || !video?.videoWidth || !video.videoHeight) {
        return;
      }

      onDisplayRectChange?.(
        getVideoDisplayRect({
          containerWidth: bounds.width,
          containerHeight: bounds.height,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          mode: framingMode
        })
      );
    }

    const resizeObserver = new ResizeObserver(updateRect);
    resizeObserver.observe(container);
    video.addEventListener("loadedmetadata", updateRect);
    video.addEventListener("playing", updateRect);
    updateRect();

    return () => {
      resizeObserver.disconnect();
      video.removeEventListener("loadedmetadata", updateRect);
      video.removeEventListener("playing", updateRect);
    };
  }, [framingMode, onDisplayRectChange, stream]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !stream) {
      return;
    }

    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }

    function updateStatus() {
      setVideoStatus({
        readyState: video?.readyState ?? 0,
        width: video?.videoWidth ?? 0,
        height: video?.videoHeight ?? 0
      });
    }

    video.addEventListener("loadedmetadata", updateStatus);
    video.addEventListener("playing", updateStatus);
    void video.play().catch(() => undefined);
    updateStatus();

    return () => {
      video.removeEventListener("loadedmetadata", updateStatus);
      video.removeEventListener("playing", updateStatus);
      if (video.srcObject === stream) {
        video.pause();
        video.srcObject = null;
      }
    };
  }, [stream]);

  if (!stream) {
    return null;
  }

  const resolvedOpacity = mode === "hidden" ? 0 : mode === "subtle" ? Math.min(opacity, 0.18) : opacity;
  const objectFit = framingMode === "fill" ? "cover" : "contain";
  const scale = framingMode === "wide" ? 1.04 : 1;

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <video
        ref={videoRef}
        className="h-full w-full saturate-[0.55] contrast-[0.9] brightness-[0.52]"
        style={{ objectFit, transform: `scaleX(-1) scale(${scale})`, opacity: resolvedOpacity }}
        muted
        playsInline
        autoPlay
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(34,211,238,0.05),transparent_34%),linear-gradient(180deg,rgba(5,7,13,0.28),rgba(5,7,13,0.62))]" />
      {showStatus ? (
        <div className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/35 px-3 py-1 font-body text-[0.68rem] text-[#d7dde5] backdrop-blur-md">
          Camera feed: stream active - {videoStatus.width || "-"}x{videoStatus.height || "-"} - ready{" "}
          {videoStatus.readyState}
        </div>
      ) : null}
    </div>
  );
}
