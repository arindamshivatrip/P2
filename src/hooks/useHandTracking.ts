"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { deriveTrackedHand, type Landmark3D, type TrackedHand } from "@/lib/interactive-gallery/gestureMath";
import { smoothLandmarks } from "@/lib/interactive-gallery/handSmoothing";
import type { GalleryQualitySettings } from "@/lib/interactive-gallery/performance";

type HandTrackingStatus = "idle" | "loading" | "active" | "unsupported" | "permission-denied" | "error";

type VisionModule = {
  FilesetResolver: {
    forVisionTasks: (basePath: string) => Promise<unknown>;
  };
  HandLandmarker: {
    createFromOptions: (
      resolver: unknown,
      options: Record<string, unknown>
    ) => Promise<{
      detectForVideo: (video: HTMLVideoElement, timestamp: number) => {
        landmarks?: Landmark3D[][];
        handednesses?: Array<Array<{ categoryName?: string }>>;
      };
      close?: () => void;
    }>;
  };
};

type HandLandmarkerInstance = Awaited<ReturnType<VisionModule["HandLandmarker"]["createFromOptions"]>>;

const importVisionTasks = async (): Promise<VisionModule> =>
  (await import("@mediapipe/tasks-vision")) as unknown as VisionModule;

type HandTrackingDebug = {
  hands: TrackedHand[];
  cameraResolution: string;
  lastDetectionFps: number;
};

type UseHandTrackingOptions = {
  settings: GalleryQualitySettings;
};

export function useHandTracking({ settings }: UseHandTrackingOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const landmarkerRef = useRef<HandLandmarkerInstance | null>(null);
  const previousLandmarksRef = useRef<Record<string, Landmark3D[]>>({});
  const previousHandsRef = useRef<Record<string, TrackedHand>>({});
  const handsRef = useRef<TrackedHand[]>([]);
  const lastDetectionTimeRef = useRef(0);
  const lastDebugUpdateTimeRef = useRef(0);
  const detectionFpsRef = useRef(0);
  const settingsRef = useRef(settings);

  const [status, setStatus] = useState<HandTrackingStatus>("idle");
  const [message, setMessage] = useState("Hand interaction is off.");
  const [hands, setHands] = useState<TrackedHand[]>([]);
  const [debug, setDebug] = useState<HandTrackingDebug>({
    hands: [],
    cameraResolution: "off",
    lastDetectionFps: 0
  });
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const stop = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    landmarkerRef.current?.close?.();
    landmarkerRef.current = null;

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    previousLandmarksRef.current = {};
    previousHandsRef.current = {};
    handsRef.current = [];
    setHands([]);
    setDebug({ hands: [], cameraResolution: "off", lastDetectionFps: 0 });
    setVideoReady(false);
    setStatus("idle");
    setMessage("Hand interaction is off.");
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      setMessage("This browser does not expose camera access for hand interaction.");
      return;
    }

    setStatus("loading");
    setMessage("Requesting camera access for optional two-hand interaction.");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: settings.camera.width },
          height: { ideal: settings.camera.height },
          frameRate: { ideal: settings.camera.frameRate, max: Math.min(settings.camera.frameRate + 6, 30) }
        },
        audio: false
      });
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) {
        throw new Error("Video element is unavailable.");
      }

      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      await video.play();
      setVideoReady(true);

      const vision = await importVisionTasks();
      const fileset = await vision.FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm"
      );
      const handLandmarker = await vision.HandLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 2,
        minHandDetectionConfidence: 0.55,
        minTrackingConfidence: 0.55,
        minHandPresenceConfidence: 0.55
      });

      landmarkerRef.current = handLandmarker;
      setStatus("active");
      setMessage("Two-hand interaction is active. Pinch one hand to move; pinch both to scale and rotate.");

      const tick = () => {
        const currentVideo = videoRef.current;
        const landmarker = landmarkerRef.current;

        if (!currentVideo || !landmarker) {
          return;
        }

        if (currentVideo.videoWidth === 0 || currentVideo.videoHeight === 0) {
          frameRef.current = window.requestAnimationFrame(tick);
          return;
        }

        const now = performance.now();
        const currentSettings = settingsRef.current;
        const targetFrameMs = 1000 / currentSettings.handFps;

        if (now - lastDetectionTimeRef.current < targetFrameMs) {
          frameRef.current = window.requestAnimationFrame(tick);
          return;
        }

        detectionFpsRef.current = lastDetectionTimeRef.current
          ? 1000 / Math.max(now - lastDetectionTimeRef.current, 1)
          : currentSettings.handFps;
        lastDetectionTimeRef.current = now;

        const result = landmarker.detectForVideo(currentVideo, now);
        const nextHands = (result.landmarks ?? [])
          .slice(0, 2)
          .map((landmarks, index) => {
            const handednessCategory = result.handednesses?.[index]?.[0];
            const handedness =
              handednessCategory?.categoryName === "Left" || handednessCategory?.categoryName === "Right"
                ? handednessCategory.categoryName
                : "Unknown";
            const label = handedness === "Unknown" ? `Hand ${index + 1}` : handedness;
            const confidence = "score" in (handednessCategory ?? {})
              ? Number((handednessCategory as { score?: number }).score ?? 0)
              : 0;
            const visuallyMirroredLandmarks = landmarks.map((landmark) => ({
              ...landmark,
              x: 1 - landmark.x
            }));
            const smoothedLandmarks = smoothLandmarks(previousLandmarksRef.current[label], visuallyMirroredLandmarks);
            previousLandmarksRef.current[label] = smoothedLandmarks;

            return deriveTrackedHand(
              smoothedLandmarks,
              handedness,
              label,
              confidence,
              previousHandsRef.current[label]
            );
          })
          .filter((hand): hand is TrackedHand => Boolean(hand));

        handsRef.current = nextHands;
        previousHandsRef.current = Object.fromEntries(nextHands.map((hand) => [hand.id, hand]));
        setHands(nextHands);

        if (now - lastDebugUpdateTimeRef.current >= currentSettings.debugIntervalMs) {
          lastDebugUpdateTimeRef.current = now;
          setDebug({
            hands: nextHands,
            cameraResolution: `${currentVideo.videoWidth}x${currentVideo.videoHeight}`,
            lastDetectionFps: Math.round(detectionFpsRef.current)
          });
        }

        frameRef.current = window.requestAnimationFrame(tick);
      };

      frameRef.current = window.requestAnimationFrame(tick);
    } catch (error) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setVideoReady(false);
      const errorName = error instanceof DOMException ? error.name : "";
      setStatus(errorName === "NotAllowedError" ? "permission-denied" : "error");
      setMessage(
        errorName === "NotAllowedError"
          ? "Camera permission was denied. The gallery still works with pointer and keyboard input."
          : "Hand tracking could not load. The gallery still works with pointer and keyboard input."
      );
    }
  }, [settings.camera.frameRate, settings.camera.height, settings.camera.width]);

  useEffect(() => stop, [stop]);

  return {
    videoRef,
    status,
    message,
    handsRef,
    hands,
    debugHands: debug.hands,
    cameraResolution: debug.cameraResolution,
    lastDetectionFps: debug.lastDetectionFps,
    videoReady,
    isActive: status === "active",
    isLoading: status === "loading",
    start,
    stop
  };
}
