"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AudioAnalyzerValues = {
  volume: number;
  bass: number;
  mids: number;
  highs: number;
  onset: number;
  beat: boolean;
  beatActivity: number;
  bpm: number | null;
  bpmConfidence: number;
  brightness: number;
  onsetRate: number;
  energyVariance: number;
  hype: number;
  calm: number;
  waveform: number[];
  isListening: boolean;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
};

export type AudioAnalyzerSettings = {
  inputSensitivity: number;
  noiseGate: number;
  beatSensitivity: number;
};

type AnalyzerRefs = {
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  source: MediaStreamAudioSourceNode | null;
  stream: MediaStream | null;
  frameId: number | null;
  frequencyData: Uint8Array<ArrayBuffer> | null;
  timeData: Uint8Array<ArrayBuffer> | null;
  previousSpectrum: Float32Array<ArrayBuffer> | null;
  smoothed: {
    volume: number;
    bass: number;
    mids: number;
    highs: number;
    onset: number;
    brightness: number;
    onsetRate: number;
    energyVariance: number;
    hype: number;
    calm: number;
  };
  noiseFloor: {
    bass: number;
    mids: number;
    highs: number;
  };
  bassBaseline: number;
  volumeBaseline: number;
  onsetBaseline: number;
  lastBeatAt: number;
  beatUntil: number;
  lastFrameAt: number | null;
  beatActivity: number;
  beatTimestamps: number[];
  onsetTimestamps: number[];
  volumeHistory: number[];
  waveform: number[];
  bpm: number | null;
  bpmConfidence: number;
  settings: AudioAnalyzerSettings;
};

const BEAT_NOISE_GATE = 0.045;
const BEAT_MIN_ONSET = 0.012;
const BEAT_SENSITIVITY_MULTIPLIER = 1.55;
const BEAT_COOLDOWN_MS = 260;
const BEAT_HOLD_MS = 120;
const BEAT_BASS_FLUX_MIN = 0.018;
const BEAT_BASS_ABOVE_BASELINE = 0.06;
const BEAT_ACTIVITY_DECAY_RATE = 1.8;
const AUDIO_QUIET_GATE = 0.025;
const BAND_NOISE_MARGIN = 0.015;
const BASS_MIN_HZ = 60;
const BASS_MAX_HZ = 250;
const MIDS_MIN_HZ = 250;
const MIDS_MAX_HZ = 2000;
const HIGHS_MIN_HZ = 2000;
const HIGHS_MAX_HZ = 8000;
const MIN_BRIGHTNESS_HZ = 250;
const MAX_BRIGHTNESS_HZ = 6000;
const ONSET_RATE_WINDOW_MS = 4000;
const ONSET_RATE_MAX_PER_SECOND = 4;
const ENERGY_VARIANCE_WINDOW = 90;
const WAVEFORM_SIZE = 64;

export const defaultAudioAnalyzerSettings: AudioAnalyzerSettings = {
  inputSensitivity: 1.5,
  noiseGate: AUDIO_QUIET_GATE,
  beatSensitivity: 1
};

const BPM_WINDOW_MS = 10000;
const BPM_MIN_INTERVAL_MS = 300;
const BPM_MAX_INTERVAL_MS = 1200;
const BPM_MIN_BEATS = 4;
const BPM_RESET_AFTER_MS = 8000;
const BPM_CONFIDENCE_FADE_AFTER_MS = 4000;
const BPM_SMOOTHING = 0.2;

const initialRefs: AnalyzerRefs = {
  audioContext: null,
  analyser: null,
  source: null,
  stream: null,
  frameId: null,
  frequencyData: null,
  timeData: null,
  previousSpectrum: null,
  smoothed: {
    volume: 0,
    bass: 0,
    mids: 0,
    highs: 0,
    onset: 0,
    brightness: 0,
    onsetRate: 0,
    energyVariance: 0,
    hype: 0,
    calm: 1
  },
  noiseFloor: {
    bass: 0,
    mids: 0,
    highs: 0
  },
  bassBaseline: 0,
  volumeBaseline: 0,
  onsetBaseline: 0,
  lastBeatAt: 0,
  beatUntil: 0,
  lastFrameAt: null,
  beatActivity: 0,
  beatTimestamps: [],
  onsetTimestamps: [],
  volumeHistory: [],
  waveform: Array.from({ length: WAVEFORM_SIZE }, () => 0),
  bpm: null,
  bpmConfidence: 0,
  settings: defaultAudioAnalyzerSettings
};

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function averageFrequencyRange(
  data: Uint8Array<ArrayBuffer>,
  binHz: number,
  minHz: number,
  maxHz: number
) {
  const start = Math.max(1, Math.floor(minHz / binHz));
  const end = Math.min(data.length - 1, Math.ceil(maxHz / binHz));
  const safeStart = Math.max(0, Math.min(data.length - 1, start));
  const safeEnd = Math.max(safeStart + 1, Math.min(data.length, end));
  let total = 0;

  for (let index = safeStart; index <= safeEnd; index += 1) {
    total += data[index] / 255;
  }

  return total / (safeEnd - safeStart + 1);
}

function spectralFlux(
  data: Uint8Array<ArrayBuffer>,
  previous: Float32Array<ArrayBuffer> | null,
  start: number,
  end: number
) {
  if (!previous) {
    return 0;
  }

  const safeStart = Math.max(0, Math.min(data.length - 1, start));
  const safeEnd = Math.max(safeStart + 1, Math.min(data.length, end));
  let flux = 0;

  for (let index = safeStart; index < safeEnd; index += 1) {
    const normalized = data[index] / 255;
    const diff = normalized - previous[index];

    if (diff > 0) {
      flux += diff;
    }
  }

  return flux / (safeEnd - safeStart);
}

function copyNormalizedSpectrum(data: Uint8Array<ArrayBuffer>) {
  const normalized = new Float32Array(data.length);

  for (let index = 0; index < data.length; index += 1) {
    normalized[index] = data[index] / 255;
  }

  return normalized;
}

function getSpectralBrightness(data: Uint8Array<ArrayBuffer>, binHz: number) {
  let weightedSum = 0;
  let magnitudeSum = 0;

  for (let index = 1; index < data.length; index += 1) {
    const magnitude = data[index] / 255;
    const frequencyHz = index * binHz;

    weightedSum += frequencyHz * magnitude;
    magnitudeSum += magnitude;
  }

  const centroidHz = magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;

  return clamp01(
    (centroidHz - MIN_BRIGHTNESS_HZ) / (MAX_BRIGHTNESS_HZ - MIN_BRIGHTNESS_HZ)
  );
}

function getEnergyVariance(history: number[]) {
  if (history.length < 2) {
    return 0;
  }

  const mean = average(history);
  const variance = average(history.map((value) => Math.pow(value - mean, 2)));

  return clamp01(Math.sqrt(variance) / 0.08);
}

function resampleWaveform(data: Uint8Array<ArrayBuffer>) {
  const waveform = new Array<number>(WAVEFORM_SIZE);
  const step = data.length / WAVEFORM_SIZE;

  for (let index = 0; index < WAVEFORM_SIZE; index += 1) {
    const sourceIndex = Math.min(data.length - 1, Math.floor(index * step));
    waveform[index] = (data[sourceIndex] - 128) / 128;
  }

  return waveform;
}

function getFrequencyBin(frequency: number, binHz: number, length: number) {
  return Math.max(1, Math.min(length - 1, Math.floor(frequency / binHz)));
}

function smooth(previous: number, next: number, amount = 0.18) {
  return previous + (next - previous) * amount;
}

function calibrateBandValue(rawValue: number, noiseFloor: number) {
  return clamp01((rawValue - noiseFloor - BAND_NOISE_MARGIN) / Math.max(0.001, 1 - noiseFloor));
}

function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function getBpmEstimate(timestamps: number[]) {
  const intervals: number[] = [];

  for (let index = 1; index < timestamps.length; index += 1) {
    const interval = timestamps[index] - timestamps[index - 1];

    if (interval >= BPM_MIN_INTERVAL_MS && interval <= BPM_MAX_INTERVAL_MS) {
      intervals.push(interval);
    }
  }

  if (intervals.length < BPM_MIN_BEATS - 1) {
    return null;
  }

  const medianInterval = median(intervals);
  const estimatedBpm = 60000 / medianInterval;
  const mean = average(intervals);
  const variance = average(intervals.map((interval) => Math.pow(interval - mean, 2)));
  const stdDev = Math.sqrt(variance);
  const consistency = 1 - Math.min(1, stdDev / mean);
  const amount = Math.min(1, intervals.length / 8);

  return {
    bpm: estimatedBpm,
    confidence: clamp01(consistency * amount)
  };
}

export function useAudioAnalyzer(settings: AudioAnalyzerSettings = defaultAudioAnalyzerSettings): AudioAnalyzerValues {
  const refs = useRef<AnalyzerRefs>({
    ...initialRefs,
    smoothed: { ...initialRefs.smoothed },
    noiseFloor: { ...initialRefs.noiseFloor },
    waveform: [...initialRefs.waveform],
    settings
  });

  const [values, setValues] = useState<Omit<AudioAnalyzerValues, "start" | "stop">>({
    volume: 0,
    bass: 0,
    mids: 0,
    highs: 0,
    onset: 0,
    beat: false,
    beatActivity: 0,
    bpm: null,
    bpmConfidence: 0,
    brightness: 0,
    onsetRate: 0,
    energyVariance: 0,
    hype: 0,
    calm: 1,
    waveform: Array.from({ length: WAVEFORM_SIZE }, () => 0),
    isListening: false,
    error: null
  });

  const stop = useCallback(() => {
    const current = refs.current;

    if (current.frameId !== null) {
      cancelAnimationFrame(current.frameId);
      current.frameId = null;
    }

    current.source?.disconnect();
    current.analyser?.disconnect();
    current.stream?.getTracks().forEach((track) => track.stop());

    if (current.audioContext && current.audioContext.state !== "closed") {
      void current.audioContext.close().catch(() => undefined);
    }

    refs.current = {
      ...initialRefs,
      smoothed: { ...initialRefs.smoothed },
      noiseFloor: { ...initialRefs.noiseFloor },
      waveform: [...initialRefs.waveform],
      settings: refs.current.settings
    };

    setValues((previous) => ({
      ...previous,
      volume: 0,
      bass: 0,
      mids: 0,
      highs: 0,
      onset: 0,
      beat: false,
      beatActivity: 0,
      bpm: null,
      bpmConfidence: 0,
      brightness: 0,
      onsetRate: 0,
      energyVariance: 0,
      hype: 0,
      calm: 1,
      waveform: Array.from({ length: WAVEFORM_SIZE }, () => 0),
      isListening: false
    }));
  }, []);

  useEffect(() => {
    refs.current.settings = settings;
  }, [settings]);

  const analyze = useCallback(() => {
    const current = refs.current;

    if (!current.analyser || !current.frequencyData || !current.timeData || !current.audioContext) {
      return;
    }

    current.analyser.getByteFrequencyData(current.frequencyData);
    current.analyser.getByteTimeDomainData(current.timeData);

    const nyquist = current.audioContext.sampleRate / 2;
    const binHz = nyquist / current.frequencyData.length;
    const bassStart = getFrequencyBin(BASS_MIN_HZ, binHz, current.frequencyData.length);
    const bassEnd = getFrequencyBin(BASS_MAX_HZ, binHz, current.frequencyData.length);
    const midsStart = getFrequencyBin(MIDS_MIN_HZ, binHz, current.frequencyData.length);
    const midsEnd = getFrequencyBin(MIDS_MAX_HZ, binHz, current.frequencyData.length);
    const highsStart = getFrequencyBin(HIGHS_MIN_HZ, binHz, current.frequencyData.length);
    const highsEnd = getFrequencyBin(HIGHS_MAX_HZ, binHz, current.frequencyData.length);
    const rawBass = averageFrequencyRange(current.frequencyData, binHz, BASS_MIN_HZ, BASS_MAX_HZ);
    const rawMids = averageFrequencyRange(current.frequencyData, binHz, MIDS_MIN_HZ, MIDS_MAX_HZ);
    const rawHighs = averageFrequencyRange(current.frequencyData, binHz, HIGHS_MIN_HZ, HIGHS_MAX_HZ);
    const rawVolume = averageFrequencyRange(current.frequencyData, binHz, BASS_MIN_HZ, HIGHS_MAX_HZ);
    const inputSensitivity = Math.max(0.1, current.settings.inputSensitivity);
    const quietGate = current.settings.noiseGate;
    const beatSensitivity = Math.max(0.1, current.settings.beatSensitivity);
    const gatedVolume = rawVolume < quietGate ? rawVolume * 0.45 : rawVolume;
    const volume = clamp01(gatedVolume * inputSensitivity);
    const brightness = rawVolume < quietGate ? 0 : clamp01(getSpectralBrightness(current.frequencyData, binHz) * (0.75 + inputSensitivity * 0.18));

    if (rawVolume < quietGate) {
      current.noiseFloor.bass = smooth(current.noiseFloor.bass, rawBass, 0.05);
      current.noiseFloor.mids = smooth(current.noiseFloor.mids, rawMids, 0.04);
      current.noiseFloor.highs = smooth(current.noiseFloor.highs, rawHighs, 0.04);
    }

    const gatedBandScale = rawVolume < quietGate ? rawVolume / Math.max(0.001, quietGate) : 1;
    const bass = clamp01(calibrateBandValue(rawBass, current.noiseFloor.bass) * gatedBandScale * inputSensitivity);
    const mids = clamp01(calibrateBandValue(rawMids, current.noiseFloor.mids) * gatedBandScale * inputSensitivity);
    const highs = clamp01(calibrateBandValue(rawHighs, current.noiseFloor.highs) * gatedBandScale * inputSensitivity);
    const flux = spectralFlux(
      current.frequencyData,
      current.previousSpectrum,
      0,
      current.frequencyData.length
    );
    const bassFlux = spectralFlux(current.frequencyData, current.previousSpectrum, bassStart, bassEnd);
    const midFlux = spectralFlux(current.frequencyData, current.previousSpectrum, midsStart, midsEnd);
    const highFlux = spectralFlux(current.frequencyData, current.previousSpectrum, highsStart, highsEnd);
    const onsetScore = (flux * 0.45 + bassFlux * 0.3 + midFlux * 0.18 + highFlux * 0.07) * (0.7 + inputSensitivity * 0.2);

    current.smoothed.volume = smooth(current.smoothed.volume, volume);
    current.smoothed.bass = smooth(current.smoothed.bass, bass);
    current.smoothed.mids = smooth(current.smoothed.mids, mids);
    current.smoothed.highs = smooth(current.smoothed.highs, highs);
    current.smoothed.onset = smooth(current.smoothed.onset, clamp01(onsetScore * 8), 0.22);

    const now = performance.now();
    const hasEnoughEnergy = volume > Math.max(quietGate, BEAT_NOISE_GATE / beatSensitivity);
    const onsetAboveBaseline =
      onsetScore > current.onsetBaseline * (BEAT_SENSITIVITY_MULTIPLIER / beatSensitivity);
    const onsetAboveFloor = onsetScore > BEAT_MIN_ONSET / beatSensitivity;
    const bassSpike =
      bassFlux > BEAT_BASS_FLUX_MIN / beatSensitivity && bass > current.bassBaseline + BEAT_BASS_ABOVE_BASELINE / beatSensitivity;
    const hasOnset = (onsetAboveBaseline && onsetAboveFloor) || bassSpike;
    const previousFrameAt = current.lastFrameAt ?? now;
    const deltaSeconds = Math.max(0, (now - previousFrameAt) / 1000);
    const cooldownPassed = now - current.lastBeatAt > BEAT_COOLDOWN_MS;
    let beat = now < current.beatUntil;

    current.bassBaseline = smooth(current.bassBaseline, bass, 0.03);
    current.volumeBaseline = smooth(current.volumeBaseline, volume, 0.03);
    current.onsetBaseline = current.onsetBaseline * 0.96 + onsetScore * 0.04;
    current.beatActivity = Math.max(
      0,
      current.beatActivity - deltaSeconds * BEAT_ACTIVITY_DECAY_RATE
    );

    if (hasEnoughEnergy && hasOnset && cooldownPassed) {
      beat = true;
      current.lastBeatAt = now;
      current.beatUntil = now + BEAT_HOLD_MS;
      current.beatActivity = 1;
      current.beatTimestamps = [...current.beatTimestamps, now].filter(
        (timestamp) => now - timestamp <= BPM_WINDOW_MS
      );
      current.onsetTimestamps = [...current.onsetTimestamps, now].filter(
        (timestamp) => now - timestamp <= ONSET_RATE_WINDOW_MS
      );

      const estimate = getBpmEstimate(current.beatTimestamps);

      if (estimate) {
        current.bpm =
          current.bpm === null
            ? estimate.bpm
            : current.bpm * (1 - BPM_SMOOTHING) + estimate.bpm * BPM_SMOOTHING;
        current.bpmConfidence = estimate.confidence;
      }
    } else if (now - current.lastBeatAt > BPM_RESET_AFTER_MS) {
      current.beatTimestamps = [];
      current.bpm = null;
      current.bpmConfidence = 0;
    } else if (now - current.lastBeatAt > BPM_CONFIDENCE_FADE_AFTER_MS) {
      current.bpmConfidence *= 0.95;
    }

    current.onsetTimestamps = current.onsetTimestamps.filter(
      (timestamp) => now - timestamp <= ONSET_RATE_WINDOW_MS
    );
    current.volumeHistory = [...current.volumeHistory, volume].slice(-ENERGY_VARIANCE_WINDOW);

    const onsetsPerSecond = current.onsetTimestamps.length / (ONSET_RATE_WINDOW_MS / 1000);
    const onsetRate = clamp01(onsetsPerSecond / ONSET_RATE_MAX_PER_SECOND);
    const energyVariance = getEnergyVariance(current.volumeHistory);
    const hypeRaw =
      volume * 0.25 +
      current.beatActivity * 0.2 +
      onsetRate * 0.25 +
      brightness * 0.15 +
      highs * 0.1 +
      energyVariance * 0.05;
    const hype = clamp01(hypeRaw);

    current.smoothed.brightness = smooth(current.smoothed.brightness, brightness, 0.08);
    current.smoothed.onsetRate = smooth(current.smoothed.onsetRate, onsetRate, 0.08);
    current.smoothed.energyVariance = smooth(current.smoothed.energyVariance, energyVariance, 0.08);
    current.smoothed.hype = smooth(current.smoothed.hype, hype, 0.05);
    current.smoothed.calm = clamp01(1 - current.smoothed.hype);
    current.waveform = resampleWaveform(current.timeData);

    current.previousSpectrum = copyNormalizedSpectrum(current.frequencyData);
    current.lastFrameAt = now;

    setValues((previous) => ({
      ...previous,
      volume: clamp01(current.smoothed.volume),
      bass: clamp01(current.smoothed.bass),
      mids: clamp01(current.smoothed.mids),
      highs: clamp01(current.smoothed.highs),
      onset: clamp01(current.smoothed.onset),
      beat,
      beatActivity: clamp01(current.beatActivity),
      bpm: current.bpm === null ? null : Math.round(current.bpm),
      bpmConfidence: clamp01(current.bpmConfidence),
      brightness: clamp01(current.smoothed.brightness),
      onsetRate: clamp01(current.smoothed.onsetRate),
      energyVariance: clamp01(current.smoothed.energyVariance),
      hype: clamp01(current.smoothed.hype),
      calm: clamp01(current.smoothed.calm),
      waveform: current.waveform
    }));

    current.frameId = requestAnimationFrame(analyze);
  }, []);

  const start = useCallback(async () => {
    stop();

    if (!navigator.mediaDevices?.getUserMedia) {
      setValues((previous) => ({
        ...previous,
        error: "Microphone access is not available in this browser."
      }));
      return;
    }

    setValues((previous) => ({
      ...previous,
      error: null,
      isListening: false
    }));

    try {
      let stream: MediaStream;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false
          }
        });
      } catch (constraintError) {
        if (constraintError instanceof DOMException && constraintError.name === "NotAllowedError") {
          throw constraintError;
        }

        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      const AudioContextConstructor = window.AudioContext;

      if (!AudioContextConstructor) {
        stream.getTracks().forEach((track) => track.stop());
        throw new Error("AudioContext is not available in this browser.");
      }

      const audioContext = new AudioContextConstructor();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.45;
      source.connect(analyser);

      refs.current = {
        ...refs.current,
        audioContext,
        analyser,
        source,
        stream,
        frequencyData: new Uint8Array(analyser.frequencyBinCount),
        timeData: new Uint8Array(analyser.fftSize)
      };

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      setValues((previous) => ({
        ...previous,
        isListening: true,
        error: null
      }));

      refs.current.frameId = requestAnimationFrame(analyze);
    } catch (error) {
      stop();
      const message =
        error instanceof DOMException && error.name === "NotAllowedError"
          ? "Microphone access was blocked. Enable it in your browser settings to use the live audio field."
          : error instanceof Error
            ? error.message
            : "Audio input could not be initialized.";

      setValues((previous) => ({
        ...previous,
        error: message,
        isListening: false
      }));
    }
  }, [analyze, stop]);

  useEffect(() => stop, [stop]);

  return {
    ...values,
    start,
    stop
  };
}
