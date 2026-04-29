"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAudioAnalyzer } from "@/hooks/use-audio-analyzer";
import { AmbientFieldBackground } from "./ambient-field-background";
import { ResonanceLiveScreen } from "./resonance-live-screen";
import { ResonanceStatusStep, type ResonanceStep } from "./resonance-status-step";
import {
  defaultResonanceTuning,
  resonanceTuningStorageKey,
  type ResonanceTuningSettings
} from "./resonance-tuning";

const permissionNotes = [
  "Microphone listens for audio energy.",
  "Camera hand tracking arrives in a later phase.",
  "Nothing is recorded or uploaded."
];

function ResonanceSetupScreen({
  onStart,
  error,
  isStarting
}: {
  onStart: () => void;
  error: string | null;
  isStarting: boolean;
}) {
  return (
    <section className="relative z-10 flex min-h-[calc(100svh-4.4rem)] items-center px-container py-16 md:min-h-[calc(100svh-4.8rem)] md:py-20">
      <div className="mx-auto flex w-full max-w-[48rem] flex-col items-center text-center">
        <p className="font-body text-xs font-medium uppercase tracking-[0.16em] text-[#b8f0ff]/75">
          Experiment - Phase 2 audio preview
        </p>
        <h1 className="mt-5 font-display text-5xl leading-[0.98] tracking-tight text-[#f5f7fa] sm:text-6xl md:text-[5.6rem]">
          Resonance Field
        </h1>
        <p className="mt-5 max-w-[38rem] font-body text-xl font-light leading-relaxed text-[#f5f7fa]/90 md:text-2xl">
          A hand-tracked audio visualizer for sculpting sound into light.
        </p>
        <p className="mt-5 max-w-[35rem] font-body text-base font-light leading-relaxed text-[#a8b0bb] md:text-lg">
          Use your microphone to listen. Use your hands to shape the field. No audio or video is stored.
        </p>
        <p className="mt-4 max-w-[35rem] font-body text-sm leading-relaxed text-[#d7dde5]">
          Microphone access is used only to analyze audio energy in real time. Nothing is recorded or uploaded.
        </p>

        <button
          type="button"
          onClick={onStart}
          disabled={isStarting}
          className="mt-9 rounded-full border border-[#b8f0ff]/35 bg-white/[0.07] px-6 py-3 font-body text-sm font-medium text-[#f5f7fa] shadow-[0_0_36px_rgba(170,184,255,0.16)] transition duration-300 hover:border-[#b8f0ff]/65 hover:bg-white/[0.11] hover:shadow-[0_0_46px_rgba(184,240,255,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f0ff]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117] disabled:cursor-wait disabled:opacity-60"
        >
          {isStarting ? "Requesting microphone" : "Start experience"}
        </button>

        {error ? (
          <p
            role="alert"
            className="mt-5 max-w-[34rem] rounded-[0.85rem] border border-red-300/25 bg-red-400/10 px-4 py-3 font-body text-sm leading-relaxed text-red-100"
          >
            {error}
          </p>
        ) : null}

        <div className="mt-8 w-full max-w-[30rem] rounded-[0.85rem] border border-white/10 bg-white/[0.06] p-4 text-left shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur-md">
          <ul className="space-y-2.5 font-body text-sm leading-relaxed text-[#d7dde5]">
            {permissionNotes.map((note) => (
              <li key={note} className="flex gap-3">
                <span
                  className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#b8f0ff]/70"
                  aria-hidden="true"
                />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-5 font-body text-sm text-[#a8b0bb]">
          Best experienced on desktop with music playing nearby.
        </p>
      </div>
    </section>
  );
}

function ResonancePermissionScreen({ error, onRetry }: { error: string | null; onRetry: () => void }) {
  return (
    <section className="relative z-10 flex min-h-[calc(100svh-4.4rem)] items-center px-container py-16 md:min-h-[calc(100svh-4.8rem)] md:py-20">
      <div className="mx-auto w-full max-w-[34rem] text-center">
        <p className="font-body text-xs font-medium uppercase tracking-[0.16em] text-[#b8f0ff]/75">
          Microphone permission
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight tracking-tight text-[#f5f7fa] md:text-6xl">
          Listening setup
        </h1>
        <p className="mt-5 font-body text-base font-light leading-relaxed text-[#a8b0bb] md:text-lg">
          Your browser may ask for microphone access. Resonance Field only reads live energy levels in this tab.
        </p>
        <ResonanceStatusStep currentStep="permissions" />
        {error ? (
          <>
            <p
              role="alert"
              className="mt-6 rounded-[0.85rem] border border-red-300/25 bg-red-400/10 px-4 py-3 font-body text-sm leading-relaxed text-red-100"
            >
              {error}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-7 rounded-full border border-[#b8f0ff]/35 bg-white/[0.07] px-6 py-3 font-body text-sm font-medium text-[#f5f7fa] transition duration-300 hover:border-[#b8f0ff]/65 hover:bg-white/[0.11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f0ff]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117]"
            >
              Try microphone again
            </button>
          </>
        ) : (
          <p className="mt-6 font-body text-sm text-[#d7dde5]" aria-live="polite">
            Waiting for microphone permission...
          </p>
        )}
      </div>
    </section>
  );
}

function ResonanceCalibrationScreen({ volume }: { volume: number }) {
  const hasSignal = volume > 0.025;

  return (
    <section className="relative z-10 flex min-h-[calc(100svh-4.4rem)] items-center px-container py-16 md:min-h-[calc(100svh-4.8rem)] md:py-20">
      <div className="mx-auto w-full max-w-[34rem] text-center">
        <p className="font-body text-xs font-medium uppercase tracking-[0.16em] text-[#b8f0ff]/75">
          Calibration
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight tracking-tight text-[#f5f7fa] md:text-6xl">
          Finding the signal
        </h1>
        <p className="mt-5 font-body text-base font-light leading-relaxed text-[#a8b0bb] md:text-lg">
          {hasSignal
            ? "Audio energy is coming through. Opening the field preview."
            : "Listening for input energy. Play music nearby or speak near the microphone."}
        </p>
        <ResonanceStatusStep currentStep="calibrating" />
        <div className="mx-auto mt-7 h-1.5 max-w-[18rem] overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className="h-full rounded-full bg-[#b8f0ff]/75 transition-[width] duration-100"
            style={{ width: `${Math.max(4, Math.round(volume * 100))}%` }}
          />
        </div>
      </div>
    </section>
  );
}

export function ResonanceFieldPage() {
  const [tuning, setTuning] = useState<ResonanceTuningSettings>(defaultResonanceTuning);
  const audioSettings = useMemo(
    () => ({
      inputSensitivity: tuning.inputSensitivity,
      noiseGate: tuning.noiseGate,
      beatSensitivity: tuning.beatSensitivity
    }),
    [tuning.beatSensitivity, tuning.inputSensitivity, tuning.noiseGate]
  );
  const audio = useAudioAnalyzer(audioSettings);
  const [step, setStep] = useState<ResonanceStep>("idle");
  const [isStarting, setIsStarting] = useState(false);
  const calibrationTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(resonanceTuningStorageKey);

      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored) as Partial<ResonanceTuningSettings>;

      setTuning({
        inputSensitivity: parsed.inputSensitivity ?? defaultResonanceTuning.inputSensitivity,
        noiseGate: parsed.noiseGate ?? defaultResonanceTuning.noiseGate,
        beatSensitivity: parsed.beatSensitivity ?? defaultResonanceTuning.beatSensitivity,
        visualIntensity: parsed.visualIntensity ?? defaultResonanceTuning.visualIntensity,
        cameraOpacity: parsed.cameraOpacity ?? defaultResonanceTuning.cameraOpacity,
        handInfluence: parsed.handInfluence ?? defaultResonanceTuning.handInfluence,
        trailStrength: parsed.trailStrength ?? defaultResonanceTuning.trailStrength
      });
    } catch {
      setTuning(defaultResonanceTuning);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(resonanceTuningStorageKey, JSON.stringify(tuning));
    } catch {
      // Local storage is optional tuning persistence.
    }
  }, [tuning]);

  function clearCalibrationTimeout() {
    if (calibrationTimeoutRef.current !== null) {
      window.clearTimeout(calibrationTimeoutRef.current);
      calibrationTimeoutRef.current = null;
    }
  }

  async function handleStart() {
    clearCalibrationTimeout();
    setIsStarting(true);
    setStep("permissions");
    await audio.start();
    setIsStarting(false);
  }

  function handleStop() {
    clearCalibrationTimeout();
    audio.stop();
    setStep("idle");
  }

  useEffect(() => {
    if (step === "permissions" && audio.isListening && !audio.error) {
      setStep("calibrating");
    }
  }, [audio.error, audio.isListening, step]);

  useEffect(() => {
    if (step !== "calibrating") {
      return undefined;
    }

    clearCalibrationTimeout();
    calibrationTimeoutRef.current = window.setTimeout(() => {
      setStep("live");
      calibrationTimeoutRef.current = null;
    }, 1400);

    return clearCalibrationTimeout;
  }, [step]);

  return (
    <main className="relative isolate overflow-hidden bg-[#0d1117] text-[#f5f7fa]">
      {/* TODO Phase 4: MediaPipe hand tracking */}
      {/* TODO Phase 5: gesture-to-particle mappings */}
      {/* TODO Phase 6: rave visual polish and live HUD */}
      <AmbientFieldBackground />
      {step === "idle" ? (
        <ResonanceSetupScreen onStart={handleStart} error={audio.error} isStarting={isStarting} />
      ) : null}
      {step === "permissions" ? (
        <ResonancePermissionScreen error={audio.error} onRetry={handleStart} />
      ) : null}
      {step === "calibrating" ? <ResonanceCalibrationScreen volume={audio.volume} /> : null}
      {step === "live" ? (
        <ResonanceLiveScreen
          audio={audio}
          onStop={handleStop}
          tuning={tuning}
          onTuningChange={setTuning}
        />
      ) : null}
    </main>
  );
}
