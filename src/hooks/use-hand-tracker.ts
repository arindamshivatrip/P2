"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Category,
  HandLandmarker as MediaPipeHandLandmarker,
  NormalizedLandmark
} from "@mediapipe/tasks-vision";

export type Handedness = "Left" | "Right" | "Unknown";

export type TrackedHand = {
  id: string;
  handedness: Handedness;
  palm: {
    x: number;
    y: number;
    z?: number;
  };
  pinch: number;
  openness: number;
  fist: boolean;
  openPalm: boolean;
  movementSpeed: number;
  landmarks: Array<{ x: number; y: number; z?: number }>;
};

export type HandTrackerState = {
  hands: TrackedHand[];
  primaryHand: TrackedHand | null;
  secondaryHand: TrackedHand | null;
  twoHandDistance: number | null;
  cameraStream: MediaStream | null;
  isTracking: boolean;
  isInitializing: boolean;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
};

type SmoothedHand = Pick<TrackedHand, "palm" | "pinch" | "openness" | "movementSpeed">;

const WASM_BASE_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const HAND_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

const PALM_ALPHA = 0.25;
const PINCH_ALPHA = 0.2;
const OPENNESS_ALPHA = 0.2;
const SPEED_ALPHA = 0.15;

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function lerp(previous: number, next: number, alpha: number) {
  return previous + (next - previous) * alpha;
}

function distance3d(
  a: { x: number; y: number; z?: number },
  b: { x: number; y: number; z?: number }
) {
  const zA = a.z ?? 0;
  const zB = b.z ?? 0;

  return Math.sqrt(
    Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(zA - zB, 2)
  );
}

function getHandedness(categories: Category[] | undefined): Handedness {
  const categoryName = categories?.[0]?.categoryName;

  if (categoryName === "Left" || categoryName === "Right") {
    return categoryName;
  }

  return "Unknown";
}

function getPalm(landmarks: NormalizedLandmark[]) {
  const wrist = landmarks[0];
  const indexMcp = landmarks[5];
  const pinkyMcp = landmarks[17];

  return {
    // Mirrored for future screen-space control so movement feels natural to the user.
    x: 1 - (wrist.x + indexMcp.x + pinkyMcp.x) / 3,
    y: (wrist.y + indexMcp.y + pinkyMcp.y) / 3,
    z: (wrist.z + indexMcp.z + pinkyMcp.z) / 3
  };
}

function getPinch(landmarks: NormalizedLandmark[]) {
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const indexMcp = landmarks[5];
  const pinkyMcp = landmarks[17];
  const palmWidth = Math.max(0.001, distance3d(indexMcp, pinkyMcp));
  const normalizedDistance = distance3d(thumbTip, indexTip) / palmWidth;

  return clamp01(1 - (normalizedDistance - 0.18) / 0.72);
}

function getOpenness(landmarks: NormalizedLandmark[]) {
  const fingerPairs = [
    [8, 6],
    [12, 10],
    [16, 14],
    [20, 18]
  ];
  const extendedFingers = fingerPairs.reduce((count, [tipIndex, pipIndex]) => {
    return count + (landmarks[tipIndex].y < landmarks[pipIndex].y ? 1 : 0);
  }, 0);
  const thumbOpen =
    distance3d(landmarks[4], landmarks[5]) > distance3d(landmarks[5], landmarks[17]) * 0.55
      ? 1
      : 0;

  return clamp01((extendedFingers + thumbOpen) / 5);
}

function smoothHand(next: TrackedHand, previous: SmoothedHand | undefined): TrackedHand {
  if (!previous) {
    return next;
  }

  const palm = {
    x: lerp(previous.palm.x, next.palm.x, PALM_ALPHA),
    y: lerp(previous.palm.y, next.palm.y, PALM_ALPHA),
    z:
      previous.palm.z !== undefined && next.palm.z !== undefined
        ? lerp(previous.palm.z, next.palm.z, PALM_ALPHA)
        : next.palm.z
  };
  const rawSpeed = distance3d(palm, previous.palm) * 8;
  const openness = lerp(previous.openness, next.openness, OPENNESS_ALPHA);

  return {
    ...next,
    palm,
    pinch: lerp(previous.pinch, next.pinch, PINCH_ALPHA),
    openness,
    movementSpeed: lerp(previous.movementSpeed, clamp01(rawSpeed), SPEED_ALPHA),
    fist: openness < 0.25,
    openPalm: openness > 0.75
  };
}

function getPrimaryHands(hands: TrackedHand[]) {
  const rightHand = hands.find((hand) => hand.handedness === "Right");
  const leftHand = hands.find((hand) => hand.handedness === "Left");
  const primaryHand = rightHand ?? hands[0] ?? null;
  const secondaryHand =
    primaryHand === rightHand ? leftHand ?? hands.find((hand) => hand !== primaryHand) ?? null : hands[1] ?? null;

  return { primaryHand, secondaryHand };
}

function getTwoHandDistance(primaryHand: TrackedHand | null, secondaryHand: TrackedHand | null) {
  if (!primaryHand || !secondaryHand) {
    return null;
  }

  return clamp01(distance3d(primaryHand.palm, secondaryHand.palm));
}

export function useHandTracker(): HandTrackerState {
  const landmarkerRef = useRef<MediaPipeHandLandmarker | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const smoothedHandsRef = useRef<Map<string, SmoothedHand>>(new Map());
  const isRunningRef = useRef(false);

  const [state, setState] = useState<
    Omit<HandTrackerState, "start" | "stop">
  >({
    hands: [],
    primaryHand: null,
    secondaryHand: null,
    twoHandDistance: null,
    cameraStream: null,
    isTracking: false,
    isInitializing: false,
    error: null
  });

  const stop = useCallback(() => {
    isRunningRef.current = false;

    if (frameIdRef.current !== null) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      videoRef.current.remove();
      videoRef.current = null;
    }

    landmarkerRef.current?.close();
    landmarkerRef.current = null;
    smoothedHandsRef.current.clear();

    setState((previous) => ({
      ...previous,
      hands: [],
      primaryHand: null,
      secondaryHand: null,
      twoHandDistance: null,
      cameraStream: null,
      isTracking: false,
      isInitializing: false
    }));
  }, []);

  const detectHands = useCallback(() => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;

    if (!isRunningRef.current || !video || !landmarker) {
      return;
    }

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      const result = landmarker.detectForVideo(video, performance.now());
      const nextHands = result.landmarks.slice(0, 2).map((landmarks, index) => {
        const handedness = getHandedness(result.handedness[index]);
        const id = `${handedness}-${index}`;
        const palm = getPalm(landmarks);
        const openness = getOpenness(landmarks);
        const rawHand: TrackedHand = {
          id,
          handedness,
          palm,
          pinch: getPinch(landmarks),
          openness,
          fist: openness < 0.25,
          openPalm: openness > 0.75,
          movementSpeed: 0,
          landmarks: landmarks.map((landmark) => ({
            x: 1 - landmark.x,
            y: landmark.y,
            z: landmark.z
          }))
        };
        const smoothed = smoothHand(rawHand, smoothedHandsRef.current.get(id));

        smoothedHandsRef.current.set(id, {
          palm: smoothed.palm,
          pinch: smoothed.pinch,
          openness: smoothed.openness,
          movementSpeed: smoothed.movementSpeed
        });

        return smoothed;
      });
      const activeIds = new Set(nextHands.map((hand) => hand.id));

      for (const id of smoothedHandsRef.current.keys()) {
        if (!activeIds.has(id)) {
          smoothedHandsRef.current.delete(id);
        }
      }

      const { primaryHand, secondaryHand } = getPrimaryHands(nextHands);

      setState((previous) => ({
        ...previous,
        hands: nextHands,
        primaryHand,
        secondaryHand,
        twoHandDistance: getTwoHandDistance(primaryHand, secondaryHand),
        cameraStream: streamRef.current,
        isTracking: true,
        isInitializing: false,
        error: null
      }));
    }

    frameIdRef.current = requestAnimationFrame(detectHands);
  }, []);

  const start = useCallback(async () => {
    stop();

    if (!navigator.mediaDevices?.getUserMedia) {
      setState((previous) => ({
        ...previous,
        error: "Camera access is not available in this browser.",
        isInitializing: false
      }));
      return;
    }

    setState((previous) => ({
      ...previous,
      error: null,
      isInitializing: true
    }));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      streamRef.current = stream;

      const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(WASM_BASE_URL);
      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: HAND_MODEL_URL,
          delegate: "CPU"
        },
        runningMode: "VIDEO",
        numHands: 2,
        minHandDetectionConfidence: 0.55,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      const video = document.createElement("video");

      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.srcObject = stream;
      video.style.display = "none";
      document.body.appendChild(video);
      await video.play();

      videoRef.current = video;
      landmarkerRef.current = handLandmarker;
      isRunningRef.current = true;
      setState((previous) => ({
        ...previous,
        cameraStream: stream,
        isInitializing: false
      }));
      frameIdRef.current = requestAnimationFrame(detectHands);
    } catch (error) {
      stop();
      const message =
        error instanceof DOMException && error.name === "NotAllowedError"
          ? "Camera access was blocked. The audio field still works, but hand control needs camera permission."
          : error instanceof Error
            ? error.message
            : "Hand tracking could not be initialized.";

      setState((previous) => ({
        ...previous,
        error: message,
        isTracking: false,
        isInitializing: false
      }));
    }
  }, [detectHands, stop]);

  useEffect(() => stop, [stop]);

  return {
    ...state,
    start,
    stop
  };
}
