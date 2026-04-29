"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAudioAnalyzer } from "@/hooks/use-audio-analyzer";
import { useHandTracker } from "@/hooks/use-hand-tracker";
import { AudioDebugPanel } from "./audio-debug-panel";
import type { CameraFramingMode, VideoDisplayRect } from "./camera-framing";
import {
  deriveGestureControls,
  type GestureControls
} from "./gesture-controls";
import { HandDebugPanel } from "./hand-debug-panel";
import { HandSkeletonOverlay } from "./hand-skeleton-overlay";
import { HandTrackingVideoLayer } from "./hand-tracking-video-layer";
import { PARTICLE_PALETTES } from "./particle-palettes";
import type { InteractionDebugMetrics, InteractionDebugOptions } from "./resonance-particle-field";
import { ResonanceStatusStep } from "./resonance-status-step";
import { defaultResonanceTuning, type ResonanceTuningSettings } from "./resonance-tuning";

const ResonanceParticleField = dynamic(
  () =>
    import("./resonance-particle-field").then((module) => module.ResonanceParticleField),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(170,184,255,0.13),transparent_34%),#05070d]" />
    )
  }
);

const PALETTE_MODE_PINCH_THRESHOLD = 0.82;
const PALETTE_MODE_HOLD_MS = 600;

type ResonanceLiveScreenProps = {
  audio: ReturnType<typeof useAudioAnalyzer>;
  onStop: () => void;
  tuning: ResonanceTuningSettings;
  onTuningChange: (next: ResonanceTuningSettings | ((current: ResonanceTuningSettings) => ResonanceTuningSettings)) => void;
};

function SettingSlider({
  id,
  label,
  min,
  max,
  step,
  value,
  suffix,
  onChange
}: {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label htmlFor={id} className="block font-body text-xs text-[#d7dde5]">
      <span className="flex items-center justify-between gap-4">
        <span>{label}</span>
        <span className="text-[#f5f7fa]">
          {value.toFixed(step < 0.01 ? 3 : step < 0.05 ? 2 : 1)}
          {suffix}
        </span>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        className="mt-2 w-full accent-[#b8f0ff]"
      />
    </label>
  );
}

export function ResonanceLiveScreen({ audio, onStop, tuning, onTuningChange }: ResonanceLiveScreenProps) {
  const [showDebug, setShowDebug] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [cameraMode, setCameraMode] = useState<"hidden" | "subtle" | "visible">("visible");
  const [cameraFramingMode, setCameraFramingMode] = useState<CameraFramingMode>("wide");
  const [videoDisplayRect, setVideoDisplayRect] = useState<VideoDisplayRect | null>(null);
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [palettePreviewIndex, setPalettePreviewIndex] = useState(0);
  const [isPaletteModeActive, setIsPaletteModeActive] = useState(false);
  const [palettePulseToken, setPalettePulseToken] = useState(0);
  const [interactionDebug, setInteractionDebug] = useState<InteractionDebugOptions>({
    enabled: false,
    showBlobInfluence: true,
    showWakeVectors: true,
    showTrailEmitters: true,
    showParticleInfluence: true,
    showTunnelInfluence: true,
    handOnlyEffects: false
  });
  const [interactionMetrics, setInteractionMetrics] = useState<InteractionDebugMetrics | null>(null);
  const gestureStateRef = useRef({
    previousOpenPalm: false,
    lastBurstAt: 0,
    burstToken: 0,
    previousPrimaryPalm: null as { x: number; y: number } | null
  });
  const paletteHoldStartedAtRef = useRef<number | null>(null);
  const handTracker = useHandTracker();
  const hasSignal = audio.volume > 0.025 || audio.onset > 0.04 || audio.beatActivity > 0.05;
  const activePalette = PARTICLE_PALETTES[paletteIndex];
  const gestureControls = useMemo<GestureControls>(() => {
    const result = deriveGestureControls({
      tracker: handTracker,
      previousOpenPalm: gestureStateRef.current.previousOpenPalm,
      lastBurstAt: gestureStateRef.current.lastBurstAt,
      burstToken: gestureStateRef.current.burstToken,
      previousPrimaryPalm: gestureStateRef.current.previousPrimaryPalm,
      now: performance.now()
    });

    gestureStateRef.current.previousOpenPalm = result.openPalm;
    gestureStateRef.current.lastBurstAt = result.lastBurstAt;
    gestureStateRef.current.burstToken = result.burstToken;
    gestureStateRef.current.previousPrimaryPalm = result.primaryPalm;

    return result.controls;
  }, [handTracker]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowSettings(false);
        return;
      }

      if (event.key.toLowerCase() !== "p") {
        return;
      }

      event.preventDefault();
      cyclePalette(event.shiftKey ? -1 : 1);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  function updateTuning<Key extends keyof ResonanceTuningSettings>(
    key: Key,
    value: ResonanceTuningSettings[Key]
  ) {
    onTuningChange((current) => ({
      ...current,
      [key]: value
    }));
  }

  useEffect(() => {
    const primaryHand = handTracker.primaryHand;
    const isPinching = Boolean(primaryHand && primaryHand.pinch > PALETTE_MODE_PINCH_THRESHOLD);
    const now = performance.now();

    if (!isPinching) {
      paletteHoldStartedAtRef.current = null;

      if (isPaletteModeActive) {
        setPaletteIndex(palettePreviewIndex);
        setPalettePulseToken((current) => current + 1);
        setIsPaletteModeActive(false);
      }

      return;
    }

    if (paletteHoldStartedAtRef.current === null) {
      paletteHoldStartedAtRef.current = now;
      setPalettePreviewIndex(paletteIndex);
      return;
    }

    if (!isPaletteModeActive && now - paletteHoldStartedAtRef.current >= PALETTE_MODE_HOLD_MS) {
      setIsPaletteModeActive(true);
    }

    if (isPaletteModeActive && primaryHand) {
      const nextPreview = Math.min(
        PARTICLE_PALETTES.length - 1,
        Math.max(0, Math.floor(primaryHand.palm.x * PARTICLE_PALETTES.length))
      );

      setPalettePreviewIndex(nextPreview);
    }
  }, [handTracker.primaryHand, isPaletteModeActive, paletteIndex, palettePreviewIndex]);

  function cycleCameraMode() {
    setCameraMode((current) => {
      if (current === "visible") {
        return "subtle";
      }

      if (current === "subtle") {
        return "hidden";
      }

      return "visible";
    });
  }

  function handleStop() {
    handTracker.stop();
    onStop();
  }

  function cycleCameraFramingMode() {
    setCameraFramingMode((current) => {
      if (current === "wide") {
        return "fit";
      }

      if (current === "fit") {
        return "fill";
      }

      return "wide";
    });
  }

  function cyclePalette(direction: -1 | 1) {
    setPaletteIndex((current) => {
      const next = current + direction;

      return (next + PARTICLE_PALETTES.length) % PARTICLE_PALETTES.length;
    });
    setPalettePulseToken((current) => current + 1);
  }

  const primaryHand = handTracker.primaryHand;
  const influenceOverlayPosition = useMemo(() => {
    if (!primaryHand || !videoDisplayRect) {
      return null;
    }

    const mirroredX = 1 - primaryHand.palm.x;

    return {
      x: videoDisplayRect.x + mirroredX * videoDisplayRect.width,
      y: videoDisplayRect.y + primaryHand.palm.y * videoDisplayRect.height
    };
  }, [primaryHand, videoDisplayRect]);

  return (
    <section className="relative z-10 min-h-[calc(100svh-4.4rem)] overflow-hidden bg-[#05070d] md:min-h-[calc(100svh-4.8rem)]">
      <HandTrackingVideoLayer
        stream={handTracker.cameraStream}
        mode={cameraMode}
        opacity={tuning.cameraOpacity}
        framingMode={cameraFramingMode}
        showStatus={showDebug}
        onDisplayRectChange={setVideoDisplayRect}
      />
      <ResonanceParticleField
        audio={audio}
        gestureControls={gestureControls}
        palette={isPaletteModeActive ? PARTICLE_PALETTES[palettePreviewIndex] : activePalette}
        palettePulseToken={palettePulseToken}
        visualIntensity={tuning.visualIntensity}
        handInfluence={tuning.handInfluence}
        trailStrength={tuning.trailStrength}
        interactionDebug={interactionDebug}
        onDebugMetrics={setInteractionMetrics}
      />
      <HandSkeletonOverlay tracker={handTracker} displayRect={videoDisplayRect} />
      {interactionDebug.enabled && influenceOverlayPosition ? (
        <div className="pointer-events-none absolute inset-0 z-30">
          <div
            className="absolute rounded-full border border-[#b8f0ff]/55 bg-[#b8f0ff]/10"
            style={{
              left: influenceOverlayPosition.x - 48 * tuning.handInfluence,
              top: influenceOverlayPosition.y - 48 * tuning.handInfluence,
              width: 96 * tuning.handInfluence,
              height: 96 * tuning.handInfluence
            }}
          />
          <div
            className="absolute h-px origin-left bg-white/80"
            style={{
              left: influenceOverlayPosition.x,
              top: influenceOverlayPosition.y,
              width: Math.max(8, Math.min(180, Math.sqrt(gestureControls.wake.x ** 2 + gestureControls.wake.y ** 2) * 180)),
              transform: `rotate(${Math.atan2(-gestureControls.wake.y, gestureControls.wake.x) * (180 / Math.PI)}deg)`
            }}
          />
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-0 z-[12] bg-[radial-gradient(circle_at_50%_45%,transparent_0%,rgba(5,7,13,0.08)_40%,rgba(5,7,13,0.72)_100%)]" />

      <div className="relative z-30 flex min-h-[calc(100svh-4.4rem)] flex-col justify-between gap-8 px-container py-6 md:min-h-[calc(100svh-4.8rem)] md:py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-[28rem]">
            <p className="font-body text-xs font-medium uppercase tracking-[0.16em] text-[#b8f0ff]/70">
              Live field
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight tracking-tight text-[#f5f7fa] md:text-6xl">
              Resonance Field
            </h1>
            <p className="mt-3 font-body text-sm leading-relaxed text-[#a8b0bb]">
              {hasSignal
                ? "Audio is shaping the point cloud in real time."
                : "Quiet input. The field is idling until new energy arrives."}
            </p>
            <p className="mt-2 max-w-[26rem] font-body text-xs leading-relaxed text-[#a8b0bb]">
              Camera access is used only to track hand movement in real time. No video is recorded or uploaded.
            </p>
            <ResonanceStatusStep currentStep="live" />
            <p className="mt-3 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 font-body text-xs text-[#f5f7fa] backdrop-blur-md">
              Palette: {activePalette.name}
            </p>
            <p className="mt-2 max-w-[24rem] font-body text-[0.68rem] leading-relaxed text-[#a8b0bb]">
              Pinch-hold for palette selector. Press P / Shift+P to cycle.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="flex items-center overflow-hidden rounded-full border border-white/15 bg-white/[0.05] backdrop-blur-md">
              <button
                type="button"
                onClick={() => cyclePalette(-1)}
                className="px-3 py-2 font-body text-xs font-medium text-[#f5f7fa] transition duration-300 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f0ff]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
              >
                Prev palette
              </button>
              <span className="h-5 w-px bg-white/15" />
              <button
                type="button"
                onClick={() => cyclePalette(1)}
                className="px-3 py-2 font-body text-xs font-medium text-[#f5f7fa] transition duration-300 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f0ff]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
              >
                Next palette
              </button>
            </div>
            <button
              type="button"
              onClick={cycleCameraMode}
              className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 font-body text-xs font-medium capitalize text-[#f5f7fa] backdrop-blur-md transition duration-300 hover:border-[#b8f0ff]/45 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f0ff]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
            >
              Camera {cameraMode}
            </button>
            <button
              type="button"
              onClick={cycleCameraFramingMode}
              className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 font-body text-xs font-medium capitalize text-[#f5f7fa] backdrop-blur-md transition duration-300 hover:border-[#b8f0ff]/45 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f0ff]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
            >
              Framing {cameraFramingMode}
            </button>
            <button
              type="button"
              onClick={() => setShowSettings((current) => !current)}
              className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 font-body text-xs font-medium text-[#f5f7fa] backdrop-blur-md transition duration-300 hover:border-[#b8f0ff]/45 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f0ff]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
              aria-expanded={showSettings}
            >
              Settings
            </button>
            <button
              type="button"
              onClick={() =>
                setInteractionDebug((current) => ({ ...current, enabled: !current.enabled }))
              }
              className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 font-body text-xs font-medium text-[#f5f7fa] backdrop-blur-md transition duration-300 hover:border-[#b8f0ff]/45 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f0ff]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
            >
              {interactionDebug.enabled ? "Interaction debug on" : "Interaction debug"}
            </button>
            <button
              type="button"
              onClick={handTracker.isTracking ? handTracker.stop : handTracker.start}
              disabled={handTracker.isInitializing}
              className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 font-body text-xs font-medium text-[#f5f7fa] backdrop-blur-md transition duration-300 hover:border-[#b8f0ff]/45 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f0ff]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d] disabled:cursor-wait disabled:opacity-60"
            >
              {handTracker.isInitializing
                ? "Starting camera"
                : handTracker.isTracking
                  ? "Stop hand tracking"
                  : "Enable hand tracking"}
            </button>
            <button
              type="button"
              onClick={() => setShowDebug((current) => !current)}
              className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 font-body text-xs font-medium text-[#f5f7fa] backdrop-blur-md transition duration-300 hover:border-[#b8f0ff]/45 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f0ff]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
            >
              {showDebug ? "Hide debug" : "Show debug"}
            </button>
            <button
              type="button"
              onClick={handleStop}
              className="rounded-full border border-[#b8f0ff]/30 bg-white/[0.07] px-4 py-2 font-body text-xs font-medium text-[#f5f7fa] backdrop-blur-md transition duration-300 hover:border-[#b8f0ff]/60 hover:bg-white/[0.11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f0ff]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
            >
              Stop listening
            </button>
          </div>
        </div>

        {showSettings ? (
          <aside className="absolute right-6 top-20 z-40 w-[min(22rem,calc(100vw-3rem))] rounded-[0.95rem] border border-white/12 bg-[#070a12]/80 p-4 shadow-[0_22px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-body text-sm font-medium text-[#f5f7fa]">Live tuning</h2>
                <p className="mt-1 font-body text-xs leading-relaxed text-[#a8b0bb]">
                  Adjust mic sensitivity and visual response for your room.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="rounded-full border border-white/10 px-2 py-1 font-body text-xs text-[#f5f7fa] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f0ff]/80"
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <SettingSlider
                id="resonance-input-sensitivity"
                label="Input sensitivity"
                min={0.5}
                max={4}
                step={0.1}
                value={tuning.inputSensitivity}
                suffix="x"
                onChange={(value) => updateTuning("inputSensitivity", value)}
              />
              <SettingSlider
                id="resonance-noise-gate"
                label="Noise gate"
                min={0}
                max={0.12}
                step={0.005}
                value={tuning.noiseGate}
                onChange={(value) => updateTuning("noiseGate", value)}
              />
              <SettingSlider
                id="resonance-beat-sensitivity"
                label="Beat sensitivity"
                min={0.5}
                max={2}
                step={0.05}
                value={tuning.beatSensitivity}
                suffix="x"
                onChange={(value) => updateTuning("beatSensitivity", value)}
              />
              <SettingSlider
                id="resonance-visual-intensity"
                label="Visual intensity"
                min={0.5}
                max={2}
                step={0.05}
                value={tuning.visualIntensity}
                suffix="x"
                onChange={(value) => updateTuning("visualIntensity", value)}
              />
              <SettingSlider
                id="resonance-camera-opacity"
                label="Camera opacity"
                min={0}
                max={0.45}
                step={0.01}
                value={tuning.cameraOpacity}
                onChange={(value) => updateTuning("cameraOpacity", value)}
              />
              <SettingSlider
                id="resonance-hand-influence"
                label="Hand influence"
                min={0.5}
                max={2.5}
                step={0.05}
                value={tuning.handInfluence}
                suffix="x"
                onChange={(value) => updateTuning("handInfluence", value)}
              />
              <SettingSlider
                id="resonance-trail-strength"
                label="Trail strength"
                min={0.5}
                max={2.5}
                step={0.05}
                value={tuning.trailStrength}
                suffix="x"
                onChange={(value) => updateTuning("trailStrength", value)}
              />
              <button
                type="button"
                onClick={() => onTuningChange(defaultResonanceTuning)}
                className="w-full rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 font-body text-xs font-medium text-[#f5f7fa] transition hover:border-[#b8f0ff]/45 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f0ff]/80"
              >
                Reset tuning
              </button>
              <div className="rounded-[0.7rem] border border-white/10 bg-white/[0.03] p-3">
                <p className="font-body text-xs font-medium text-[#f5f7fa]">Interaction debug</p>
                <div className="mt-2 space-y-2 font-body text-xs text-[#d7dde5]">
                  {(
                    [
                      ["showBlobInfluence", "Show blob influence"],
                      ["showWakeVectors", "Show wake vectors"],
                      ["showTrailEmitters", "Show trail emitters"],
                      ["showParticleInfluence", "Show particle influence"],
                      ["showTunnelInfluence", "Show tunnel influence"],
                      ["handOnlyEffects", "Show only hand effects"]
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={interactionDebug[key]}
                        onChange={(event) =>
                          setInteractionDebug((current) => ({ ...current, [key]: event.currentTarget.checked }))
                        }
                        className="accent-[#b8f0ff]"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        ) : null}

        <div className="flex justify-end">
          {showDebug ? (
            <div className="grid w-full max-w-[46rem] gap-4 md:grid-cols-2">
              <AudioDebugPanel audio={audio} />
              <HandDebugPanel
                tracker={handTracker}
                gestureControls={gestureControls}
                paletteName={activePalette.name}
              />
              {interactionDebug.enabled ? (
                <section className="w-full rounded-[0.85rem] border border-white/10 bg-white/[0.06] p-4 text-left shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur-md md:col-span-2">
                  <h2 className="font-body text-sm font-medium text-[#f5f7fa]">Interaction diagnostics</h2>
                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-body text-xs text-[#d7dde5] md:grid-cols-3">
                    <p>Influence radius: {interactionMetrics ? `${interactionMetrics.influenceRadius.toFixed(2)}` : "-"}</p>
                    <p>Displacement: {interactionMetrics ? `${interactionMetrics.displacementStrength.toFixed(2)}` : "-"}</p>
                    <p>Wake: {interactionMetrics ? `${interactionMetrics.wakeStrength.toFixed(2)}` : "-"}</p>
                    <p>Compression: {interactionMetrics ? `${Math.round(interactionMetrics.compression * 100)}%` : "-"}</p>
                    <p>Freeze damping: {interactionMetrics ? `${Math.round(interactionMetrics.freezeDamping * 100)}%` : "-"}</p>
                    <p>Burst active: {interactionMetrics?.burstActive ? "yes" : "no"}</p>
                    <p>Blob local pull: {interactionMetrics ? `${interactionMetrics.blobLocalPull.toFixed(2)}` : "-"}</p>
                    <p>Blob wake drag: {interactionMetrics ? `${interactionMetrics.blobWakeDrag.toFixed(2)}` : "-"}</p>
                    <p>Waveform bend: {interactionMetrics ? `${interactionMetrics.waveformBend.toFixed(2)}` : "-"}</p>
                    <p>Particle attractor: {interactionMetrics ? `${interactionMetrics.particleAttractor.toFixed(2)}` : "-"}</p>
                    <p>Tunnel disturbance: {interactionMetrics ? `${interactionMetrics.tunnelDisturbance.toFixed(2)}` : "-"}</p>
                    <p>Trail emission: {interactionMetrics ? `${interactionMetrics.trailEmission.toFixed(2)}` : "-"}</p>
                    <p>Trail direct: {interactionMetrics?.trailDirectFromHand ? "yes" : "no"}</p>
                    <p>Trail field-derived: {interactionMetrics?.trailFieldDerived ? "yes" : "no"}</p>
                    <p>Falloff: smoothstep (inner/outer)</p>
                    <p>Wake model: distributed history</p>
                    <p>Wake samples: 12</p>
                    <p>Max disp cap: 0.55</p>
                    <p>Compression dampens wake: yes</p>
                    <p>Direct trail contribution: minimal</p>
                  </div>
                </section>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-8 z-40 flex justify-center px-6 transition duration-300 ${
          isPaletteModeActive ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={!isPaletteModeActive}
      >
        <div className="flex items-center gap-3 rounded-full border border-white/15 bg-[#05070d]/70 px-4 py-3 shadow-[0_18px_70px_rgba(0,0,0,0.36)] backdrop-blur-md">
          {PARTICLE_PALETTES.map((palette, index) => (
            <div
              key={palette.name}
              className={`h-10 w-10 rounded-full border transition duration-200 ${
                index === palettePreviewIndex
                  ? "scale-125 border-white shadow-[0_0_28px_rgba(184,240,255,0.42)]"
                  : "border-white/20 opacity-70"
              }`}
              style={{
                background: `linear-gradient(135deg, ${palette.coreA}, ${palette.accent} 52%, ${palette.ring})`
              }}
            />
          ))}
          <span className="pl-2 font-body text-xs text-[#f5f7fa]">
            {PARTICLE_PALETTES[palettePreviewIndex].name}
          </span>
        </div>
      </div>
    </section>
  );
}
