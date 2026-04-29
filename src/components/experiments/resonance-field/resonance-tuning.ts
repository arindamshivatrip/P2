export type ResonanceTuningSettings = {
  inputSensitivity: number;
  noiseGate: number;
  beatSensitivity: number;
  visualIntensity: number;
  cameraOpacity: number;
  handInfluence: number;
  trailStrength: number;
};

export const defaultResonanceTuning: ResonanceTuningSettings = {
  inputSensitivity: 1.5,
  noiseGate: 0.025,
  beatSensitivity: 1,
  visualIntensity: 1.2,
  cameraOpacity: 0.22,
  handInfluence: 1.4,
  trailStrength: 1.3
};

export const resonanceTuningStorageKey = "resonance.tuning";
