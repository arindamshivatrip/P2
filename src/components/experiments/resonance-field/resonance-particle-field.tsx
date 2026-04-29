"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { AudioAnalyzerValues } from "@/hooks/use-audio-analyzer";
import { createNeutralGestureControls, type GestureControls } from "./gesture-controls";
import type { ParticlePalette } from "./particle-palettes";

type ResonanceParticleFieldProps = {
  audio: AudioAnalyzerValues;
  gestureControls: GestureControls;
  palette: ParticlePalette;
  palettePulseToken: number;
  visualIntensity: number;
  handInfluence: number;
  trailStrength: number;
  interactionDebug: InteractionDebugOptions;
  onDebugMetrics?: (metrics: InteractionDebugMetrics) => void;
};

export type InteractionDebugOptions = {
  enabled: boolean;
  showBlobInfluence: boolean;
  showWakeVectors: boolean;
  showTrailEmitters: boolean;
  showParticleInfluence: boolean;
  showTunnelInfluence: boolean;
  handOnlyEffects: boolean;
};

export type InteractionDebugMetrics = {
  influenceRadius: number;
  displacementStrength: number;
  wakeStrength: number;
  compression: number;
  freezeDamping: number;
  burstActive: boolean;
  blobLocalPull: number;
  blobWakeDrag: number;
  waveformBend: number;
  particleAttractor: number;
  tunnelDisturbance: number;
  trailEmission: number;
  trailDirectFromHand: boolean;
  trailFieldDerived: boolean;
};

type WakeSample = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  strength: number;
  ageMs: number;
  active: boolean;
};

type AudioSnapshot = Pick<
  AudioAnalyzerValues,
  | "volume"
  | "bass"
  | "mids"
  | "highs"
  | "onset"
  | "beat"
  | "beatActivity"
  | "brightness"
  | "onsetRate"
  | "energyVariance"
  | "hype"
  | "calm"
  | "waveform"
>;

type ParticleLayerData = {
  positions: Float32Array;
  basePositions: Float32Array;
  colors: Float32Array;
  seeds: Float32Array;
};

type ParticleLayerProps = {
  count: number;
  radius: number;
  colorA: string;
  colorB: string;
  reactiveColor: string;
  size: number;
  opacity: number;
  layer: "dust" | "sparks";
  palette: ParticlePalette;
  palettePulseToken: number;
  audioRef: React.RefObject<AudioSnapshot>;
  gestureRef: React.RefObject<GestureControls>;
  reducedMotionRef: React.RefObject<boolean>;
  visualIntensityRef: React.RefObject<number>;
  handInfluenceRef: React.RefObject<number>;
  trailStrengthRef: React.RefObject<number>;
  interactionDebugRef: React.RefObject<InteractionDebugOptions>;
  wakeHistoryRef: React.RefObject<WakeSample[]>;
};

const quietAudio: AudioSnapshot = {
  volume: 0,
  bass: 0,
  mids: 0,
  highs: 0,
  onset: 0,
  beat: false,
  beatActivity: 0,
  brightness: 0,
  onsetRate: 0,
  energyVariance: 0,
  hype: 0,
  calm: 1,
  waveform: Array.from({ length: 64 }, () => 0)
};

const BURST_COLLAPSE_SECONDS = 0.22;
const BURST_EXPLODE_SECONDS = 0.72;
const CORE_SEGMENTS = 112;
const HALO_SEGMENTS = 72;
const TUNNEL_BANDS = 18;
const BLOB_SEGMENTS = 136;
const WAKE_HISTORY_LENGTH = 12;
const WAKE_SAMPLE_MIN_SPEED = 0.015;
const WAKE_SAMPLE_LIFETIME_MS = 900;
const WAKE_INNER_RADIUS = 0.62;
const WAKE_OUTER_RADIUS = 1.45;
const MAX_HAND_SURFACE_DISPLACEMENT = 0.35;
const MAX_WAKE_SURFACE_DISPLACEMENT = 0.28;
const MAX_TOTAL_SURFACE_DISPLACEMENT = 0.55;

function getEffectiveAudio(audio: AudioSnapshot, handOnlyEffects: boolean): AudioSnapshot {
  if (!handOnlyEffects) {
    return audio;
  }

  return {
    ...audio,
    volume: audio.volume * 0.18,
    bass: audio.bass * 0.14,
    mids: audio.mids * 0.2,
    highs: audio.highs * 0.2,
    onset: audio.onset * 0.16,
    beatActivity: audio.beatActivity * 0.18,
    brightness: audio.brightness * 0.18,
    onsetRate: audio.onsetRate * 0.14,
    energyVariance: audio.energyVariance * 0.2,
    hype: audio.hype * 0.14,
    calm: Math.min(1, audio.calm + 0.12),
    waveform: audio.waveform.map((sample) => sample * 0.2)
  };
}

function getGestureBurstStage(age: number | null) {
  if (age === null) {
    return {
      collapse: 0,
      explosion: 0,
      active: false
    };
  }

  if (age < BURST_COLLAPSE_SECONDS) {
    return {
      collapse: 1 - age / BURST_COLLAPSE_SECONDS,
      explosion: 0,
      active: true
    };
  }

  if (age < BURST_COLLAPSE_SECONDS + BURST_EXPLODE_SECONDS) {
    return {
      collapse: 0,
      explosion: 1 - (age - BURST_COLLAPSE_SECONDS) / BURST_EXPLODE_SECONDS,
      active: true
    };
  }

  return {
    collapse: 0,
    explosion: 0,
    active: false
  };
}

function useReducedMotionRef() {
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updateReducedMotion() {
      reducedMotionRef.current = query.matches;
    }

    updateReducedMotion();
    query.addEventListener("change", updateReducedMotion);

    return () => query.removeEventListener("change", updateReducedMotion);
  }, [reducedMotionRef]);

  return reducedMotionRef;
}

function createParticleLayer(
  count: number,
  radius: number,
  colorA: string,
  colorB: string,
  shellBias: number
): ParticleLayerData {
  const positions = new Float32Array(count * 3);
  const basePositions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const startColor = new THREE.Color(colorA);
  const endColor = new THREE.Color(colorB);
  const mixedColor = new THREE.Color();

  for (let index = 0; index < count; index += 1) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const distance = radius * Math.pow(Math.random(), shellBias);
    const x = Math.sin(phi) * Math.cos(theta) * distance;
    const y = Math.sin(phi) * Math.sin(theta) * distance * 0.72;
    const z = Math.cos(phi) * distance;
    const offset = index * 3;
    const colorMix = Math.random();

    positions[offset] = x;
    positions[offset + 1] = y;
    positions[offset + 2] = z;
    basePositions[offset] = x;
    basePositions[offset + 1] = y;
    basePositions[offset + 2] = z;
    seeds[index] = Math.random() * Math.PI * 2;

    mixedColor.copy(startColor).lerp(endColor, colorMix);
    colors[offset] = mixedColor.r;
    colors[offset + 1] = mixedColor.g;
    colors[offset + 2] = mixedColor.b;
  }

  return { positions, basePositions, colors, seeds };
}

function createRibbonGeometry(segmentCount: number) {
  const positions = new Float32Array(segmentCount * 2 * 3);
  const colors = new Float32Array(segmentCount * 2 * 3);
  const indices = new Uint16Array(segmentCount * 6);
  const angles = new Float32Array(segmentCount);
  const cosines = new Float32Array(segmentCount);
  const sines = new Float32Array(segmentCount);

  for (let index = 0; index < segmentCount; index += 1) {
    const next = (index + 1) % segmentCount;
    const vertex = index * 2;
    const nextVertex = next * 2;
    const offset = index * 6;
    const angle = (index / segmentCount) * Math.PI * 2;

    indices[offset] = vertex;
    indices[offset + 1] = vertex + 1;
    indices[offset + 2] = nextVertex;
    indices[offset + 3] = vertex + 1;
    indices[offset + 4] = nextVertex + 1;
    indices[offset + 5] = nextVertex;
    angles[index] = angle;
    cosines[index] = Math.cos(angle);
    sines[index] = Math.sin(angle);
  }

  return { positions, colors, indices, angles, cosines, sines };
}

function createRibbonBufferGeometry(data: ReturnType<typeof createRibbonGeometry>) {
  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(data.colors, 3));
  geometry.setIndex(new THREE.BufferAttribute(data.indices, 1));

  return geometry;
}

function getAngleDelta(angle: number, target: number) {
  return Math.atan2(Math.sin(angle - target), Math.cos(angle - target));
}

function getHandAngle(gesture: GestureControls) {
  return Math.atan2(gesture.attractor.y / 0.72, gesture.attractor.x || 0.001);
}

function getWakeMagnitude(gesture: GestureControls) {
  return THREE.MathUtils.clamp(Math.sqrt(gesture.wake.x * gesture.wake.x + gesture.wake.y * gesture.wake.y), 0, 1);
}

function smoothFalloff(distance: number, radius: number) {
  const t = THREE.MathUtils.clamp(1 - distance / Math.max(0.0001, radius), 0, 1);

  return t * t * (3 - 2 * t);
}

function distributedWakeAt(x: number, y: number, wakeHistory: WakeSample[], wakeRadius: number) {
  let sumX = 0;
  let sumY = 0;
  let weightSum = 0;

  for (let index = 0; index < wakeHistory.length; index += 1) {
    const sample = wakeHistory[index];

    if (!sample.active || sample.strength <= 0) {
      continue;
    }

    const dx = x - sample.x;
    const dy = y - sample.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const influence = smoothFalloff(distance, wakeRadius) * sample.strength;

    if (influence <= 0.0001) {
      continue;
    }

    sumX += sample.vx * influence;
    sumY += sample.vy * influence;
    weightSum += influence;
  }

  if (weightSum <= 0.0001) {
    return { x: 0, y: 0, strength: 0 };
  }

  return {
    x: sumX / weightSum,
    y: sumY / weightSum,
    strength: Math.min(1, weightSum)
  };
}

function PaletteWash({
  palette,
  palettePulseToken,
  audioRef,
  gestureRef,
  reducedMotionRef,
  visualIntensityRef,
  interactionDebugRef
}: {
  palette: ParticlePalette;
  palettePulseToken: number;
  audioRef: React.RefObject<AudioSnapshot>;
  gestureRef: React.RefObject<GestureControls>;
  reducedMotionRef: React.RefObject<boolean>;
  visualIntensityRef: React.RefObject<number>;
  interactionDebugRef: React.RefObject<InteractionDebugOptions>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRefs = useRef<Array<THREE.MeshBasicMaterial | null>>([]);
  const lastPalettePulseTokenRef = useRef(0);
  const palettePulseRef = useRef(0);
  const coreColor = useMemo(() => new THREE.Color(palette.coreA), [palette.coreA]);
  const accentColor = useMemo(() => new THREE.Color(palette.accent), [palette.accent]);
  const ringColor = useMemo(() => new THREE.Color(palette.ring), [palette.ring]);
  const hotColor = useMemo(() => new THREE.Color(palette.hot), [palette.hot]);
  const tempColor = useMemo(() => new THREE.Color(palette.coreA), [palette.coreA]);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    const audioRaw = audioRef.current ?? quietAudio;
    const debugOptions = interactionDebugRef.current;
    const audio = getEffectiveAudio(audioRaw, debugOptions.handOnlyEffects);
    const gesture = gestureRef.current ?? createNeutralGestureControls();
    const reducedMotion = reducedMotionRef.current;
    const visualIntensity = visualIntensityRef.current;

    if (!group) {
      return;
    }

    if (palettePulseToken !== lastPalettePulseTokenRef.current) {
      palettePulseRef.current = 1;
      lastPalettePulseTokenRef.current = palettePulseToken;
    }

    palettePulseRef.current = Math.max(0, palettePulseRef.current - delta * 1.35);
    const speed = reducedMotion ? 0.04 : 0.08 + audio.hype * 0.08;
    const saturation = THREE.MathUtils.clamp(
      0.2 + audio.hype * 0.34 + audio.brightness * 0.18 + gesture.paletteHeat * 0.28 + palettePulseRef.current * 0.32,
      0,
      1
    );

    group.rotation.z += delta * speed;
    group.scale.setScalar(1 + audio.volume * 0.035 + palettePulseRef.current * 0.08);
    materialRefs.current.forEach((material, index) => {
      if (!material) {
        return;
      }

      const colorMix = index === 0 ? saturation * 0.45 : index === 1 ? saturation : Math.max(audio.brightness, gesture.paletteHeat);

      tempColor
        .copy(index === 0 ? coreColor : ringColor)
        .lerp(index === 2 ? hotColor : accentColor, colorMix);
      material.color.copy(tempColor);
      material.opacity =
        (index === 0 ? 0.08 : index === 1 ? 0.06 : 0.045) +
        audio.volume * 0.045 * visualIntensity +
        palettePulseRef.current * (index === 1 ? 0.12 : 0.07);
    });
    group.position.x = Math.sin(clock.elapsedTime * 0.18) * 0.04;
    group.position.y = Math.cos(clock.elapsedTime * 0.14) * 0.035;
  });

  return (
    <group ref={groupRef} position={[0, 0, -1.35]}>
      {[3.9, 3.15, 2.45].map((radius, index) => (
        <mesh
          key={radius}
          position={[index === 0 ? -0.42 : index === 1 ? 0.5 : 0, index === 0 ? 0.3 : -0.2, -0.18 * index]}
          scale={[1.45, 0.78, 1]}
        >
          <circleGeometry args={[radius, 96]} />
          <meshBasicMaterial
            ref={(material) => {
              materialRefs.current[index] = material;
            }}
            transparent
            opacity={0.06}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function createTunnelArcGeometry(radius: number, yScale: number, seed: number) {
  const chunkCount = 4;
  const pointsPerChunk = 10;
  const positions = new Float32Array(chunkCount * (pointsPerChunk - 1) * 2 * 3);
  let cursor = 0;

  for (let chunk = 0; chunk < chunkCount; chunk += 1) {
    const chunkStart = seed + chunk * Math.PI * 0.5 + (chunk % 2) * 0.18;
    const chunkLength = 0.42 + (chunk % 3) * 0.11;

    for (let point = 0; point < pointsPerChunk - 1; point += 1) {
      const startAngle = chunkStart + (point / pointsPerChunk) * chunkLength;
      const endAngle = chunkStart + ((point + 1) / pointsPerChunk) * chunkLength;

      positions[cursor] = Math.cos(startAngle) * radius;
      positions[cursor + 1] = Math.sin(startAngle) * radius * yScale;
      positions[cursor + 2] = 0;
      positions[cursor + 3] = Math.cos(endAngle) * radius;
      positions[cursor + 4] = Math.sin(endAngle) * radius * yScale;
      positions[cursor + 5] = 0;
      cursor += 6;
    }
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  return geometry;
}

function DepthTunnel({
  palette,
  palettePulseToken,
  audioRef,
  gestureRef,
  reducedMotionRef,
  visualIntensityRef,
  handInfluenceRef,
  interactionDebugRef
}: {
  palette: ParticlePalette;
  palettePulseToken: number;
  audioRef: React.RefObject<AudioSnapshot>;
  gestureRef: React.RefObject<GestureControls>;
  reducedMotionRef: React.RefObject<boolean>;
  visualIntensityRef: React.RefObject<number>;
  handInfluenceRef: React.RefObject<number>;
  interactionDebugRef: React.RefObject<InteractionDebugOptions>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const lineRefs = useRef<Array<THREE.LineSegments | null>>([]);
  const lastPalettePulseTokenRef = useRef(0);
  const palettePulseRef = useRef(0);
  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      }),
    []
  );
  const geometries = useMemo(
    () =>
      Array.from({ length: TUNNEL_BANDS }, (_, index) =>
        createTunnelArcGeometry(0.54 + index * 0.045, 0.64, index * 0.43)
      ),
    []
  );
  const tunnelColor = useMemo(() => new THREE.Color(palette.dustB), [palette.dustB]);
  const accentColor = useMemo(() => new THREE.Color(palette.ring), [palette.ring]);
  const tempColor = useMemo(() => new THREE.Color(palette.dustB), [palette.dustB]);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    const audioRaw = audioRef.current ?? quietAudio;
    const debugOptions = interactionDebugRef.current;
    const audio = getEffectiveAudio(audioRaw, debugOptions.handOnlyEffects);
    const gesture = gestureRef.current ?? createNeutralGestureControls();
    const reducedMotion = reducedMotionRef.current;
    const visualIntensity = visualIntensityRef.current;
    const handInfluence = handInfluenceRef.current;

    if (!group) {
      return;
    }

    if (palettePulseToken !== lastPalettePulseTokenRef.current) {
      palettePulseRef.current = 1;
      lastPalettePulseTokenRef.current = palettePulseToken;
    }

    palettePulseRef.current = Math.max(0, palettePulseRef.current - delta * 1.35);
    const wakeMagnitude = getWakeMagnitude(gesture);
    const handAngle = getHandAngle(gesture);
    const handPresence = gesture.handPresence * handInfluence;
    const speed = reducedMotion
      ? 0.035
      : 0.12 +
        audio.hype * 0.22 * visualIntensity +
        audio.mids * 0.1 * visualIntensity +
        wakeMagnitude * 0.08 * handInfluence;

    group.rotation.z += delta * (0.015 + audio.mids * 0.025 + gesture.wake.x * 0.016 * handInfluence);
    tempColor.copy(tunnelColor).lerp(accentColor, audio.brightness * 0.42 + palettePulseRef.current * 0.4);
    material.color.copy(tempColor);
    material.opacity =
      0.105 +
      audio.volume * 0.12 * visualIntensity +
      audio.hype * 0.11 * visualIntensity +
      handPresence * 0.07 +
      palettePulseRef.current * 0.08;

    for (let index = 0; index < TUNNEL_BANDS; index += 1) {
      const line = lineRefs.current[index];

      if (!line) {
        continue;
      }

      const phase = (clock.elapsedTime * speed + index / TUNNEL_BANDS) % 1;
      const z = -3.6 + phase * 3.15;
      const scale = 0.55 + phase * 1.45;

      line.position.z = z;
      const bandAngle = (index / TUNNEL_BANDS) * Math.PI * 2;
      const angularDistance = getAngleDelta(bandAngle, handAngle);
      const localDisturbance = Math.exp(-(angularDistance * angularDistance) / 0.22) * wakeMagnitude * handInfluence;

      line.scale.setScalar(scale * (1 + audio.onset * 0.025 + localDisturbance * 0.1));
      line.rotation.z +=
        delta * (index % 2 === 0 ? 0.014 : -0.01) * (1 + audio.highs + localDisturbance * 0.8);
      line.position.x = Math.cos(handAngle) * localDisturbance * 0.12;
      line.position.y = Math.sin(handAngle) * localDisturbance * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -0.8]}>
      {geometries.map((geometry, index) => (
        <lineSegments
          key={index}
          ref={(line) => {
            lineRefs.current[index] = line;
          }}
          geometry={geometry}
          material={material}
        />
      ))}
    </group>
  );
}

function GlassyBlob({
  index,
  palette,
  audioRef,
  gestureRef,
  reducedMotionRef,
  visualIntensityRef,
  handInfluenceRef,
  interactionDebugRef,
  wakeHistoryRef
}: {
  index: number;
  palette: ParticlePalette;
  audioRef: React.RefObject<AudioSnapshot>;
  gestureRef: React.RefObject<GestureControls>;
  reducedMotionRef: React.RefObject<boolean>;
  visualIntensityRef: React.RefObject<number>;
  handInfluenceRef: React.RefObject<number>;
  interactionDebugRef: React.RefObject<InteractionDebugOptions>;
  wakeHistoryRef: React.RefObject<WakeSample[]>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const shellMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const radius = 0.46 + index * 0.12;
  const geometryBundle = useMemo(() => {
    const geometry = new THREE.SphereGeometry(radius, 44, 30);
    const positionAttribute = geometry.getAttribute("position") as THREE.BufferAttribute;
    const basePositions = new Float32Array(positionAttribute.array.length);

    basePositions.set(positionAttribute.array as Float32Array);

    return { geometry, basePositions };
  }, [radius]);
  const coreColor = useMemo(
    () => new THREE.Color(index % 2 === 0 ? palette.coreA : palette.coreB),
    [index, palette.coreA, palette.coreB]
  );
  const ringColor = useMemo(() => new THREE.Color(palette.ring), [palette.ring]);
  const accentColor = useMemo(() => new THREE.Color(palette.accent), [palette.accent]);
  const hotColor = useMemo(() => new THREE.Color(palette.hot), [palette.hot]);
  const tempColor = useMemo(() => new THREE.Color(palette.coreA), [palette.coreA]);
  const blobSeed = useMemo(() => 0.4 + index * 0.93, [index]);

  useFrame(({ clock }, delta) => {
    const mesh = meshRef.current;
    const shell = shellRef.current;
    const material = materialRef.current;
    const shellMaterial = shellMaterialRef.current;
    const audioRaw = audioRef.current ?? quietAudio;
    const debugOptions = interactionDebugRef.current;
    const audio = getEffectiveAudio(audioRaw, debugOptions.handOnlyEffects);
    const gesture = gestureRef.current ?? createNeutralGestureControls();
    const reducedMotion = reducedMotionRef.current;
    const visualIntensity = visualIntensityRef.current;
    const handInfluence = handInfluenceRef.current;

    if (!mesh || !shell || !material || !shellMaterial) {
      return;
    }

    const wakeMagnitude = getWakeMagnitude(gesture);
    const freeze = gesture.freeze;
    const motionMultiplier = THREE.MathUtils.lerp(1, 0.1, freeze);
    const handX = gesture.attractor.x;
    const handY = gesture.attractor.y;
    const handAngle = getHandAngle(gesture);
    const compressionScale = THREE.MathUtils.lerp(1.1, 0.62, gesture.compression);
    const apertureScale = THREE.MathUtils.lerp(0.86, 1.22, gesture.twoHandScale);
    const blobScale = compressionScale * apertureScale * (1 + audio.volume * 0.08 * visualIntensity);
    const paletteHeat = gesture.paletteHeat;
    const handPresence = gesture.handPresence * handInfluence;
    const wakeDrag = wakeMagnitude * (0.22 + gesture.movementEnergy * 0.72) * handInfluence;
    const waveform = audio.waveform.length ? audio.waveform : quietAudio.waveform;
    const positionAttribute = geometryBundle.geometry.getAttribute("position") as THREE.BufferAttribute;
    const positions = positionAttribute.array as Float32Array;
    const base = geometryBundle.basePositions;

    mesh.rotation.z +=
      delta *
      (reducedMotion ? 0.01 : (0.02 + audio.mids * 0.11 * visualIntensity + audio.hype * 0.08) * (index % 2 ? -1 : 1)) *
      motionMultiplier;
    mesh.scale.setScalar(blobScale);
    mesh.position.x = gesture.wake.x * (0.08 + index * 0.03) * handInfluence;
    mesh.position.y = -gesture.wake.y * (0.05 + index * 0.02) * handInfluence;
    shell.position.copy(mesh.position);
    shell.rotation.copy(mesh.rotation);
    shell.scale.copy(mesh.scale).multiplyScalar(1.045 + index * 0.006);

    for (let vertex = 0; vertex < positions.length; vertex += 3) {
      const baseX = base[vertex];
      const baseY = base[vertex + 1];
      const baseZ = base[vertex + 2];
      const baseDistance = Math.max(0.0001, Math.sqrt(baseX * baseX + baseY * baseY + baseZ * baseZ));
      const normalX = baseX / baseDistance;
      const normalY = baseY / baseDistance;
      const normalZ = baseZ / baseDistance;
      const segment = vertex / 3;
      const angle = Math.atan2(normalY, normalX);
      const waveformIndex = Math.floor((segment / (positions.length / 3)) * waveform.length);
      const wave = waveform[waveformIndex] ?? 0;
      const phase = clock.elapsedTime * (0.45 + audio.mids * 1.12 * visualIntensity + index * 0.23) + segment * 0.15 + blobSeed;
      const organicWobble =
        Math.sin(phase) * (0.026 + audio.mids * 0.05 * visualIntensity) +
        Math.cos(phase * 0.72 + blobSeed) * (0.018 + audio.highs * 0.032 * visualIntensity);
      const waveLift = wave * (0.06 + audio.volume * 0.13 * visualIntensity + audio.hype * 0.07);
      const angleDelta = getAngleDelta(angle, handAngle);
      const angleInfluence = Math.exp(-(angleDelta * angleDelta) / (0.42 + index * 0.1)) * handPresence;
      const distanceToHand = Math.sqrt((handX - baseX) ** 2 + (handY - baseY) ** 2);
      const innerInfluence = smoothFalloff(distanceToHand, WAKE_INNER_RADIUS);
      const outerInfluence = smoothFalloff(distanceToHand, WAKE_OUTER_RADIUS);
      const localInfluence =
        THREE.MathUtils.clamp(innerInfluence * 0.62 + outerInfluence * 0.38 + angleInfluence * 0.2, 0, 1) *
        handPresence;
      const pullCap = MAX_HAND_SURFACE_DISPLACEMENT * (0.86 + index * 0.07);
      const rawPullX = (handX - baseX) * localInfluence * 0.36;
      const rawPullY = (handY - baseY) * localInfluence * 0.36;
      const pullX = THREE.MathUtils.clamp(rawPullX, -pullCap, pullCap);
      const pullY = THREE.MathUtils.clamp(rawPullY, -pullCap, pullCap);
      const wakeField = distributedWakeAt(baseX, baseY, wakeHistoryRef.current, WAKE_OUTER_RADIUS * 1.12);
      const wakeDampenByCompression = THREE.MathUtils.lerp(1, 0.65, gesture.compression);
      const wakeCap = MAX_WAKE_SURFACE_DISPLACEMENT * (0.82 + index * 0.08);
      const rawWakeX =
        (gesture.wake.x * 0.38 + wakeField.x * 0.62) *
        wakeDrag *
        localInfluence *
        wakeDampenByCompression;
      const rawWakeY =
        (-gesture.wake.y * 0.38 + wakeField.y * 0.62) *
        wakeDrag *
        localInfluence *
        wakeDampenByCompression;
      const wakeX = THREE.MathUtils.clamp(rawWakeX, -wakeCap, wakeCap);
      const wakeY = THREE.MathUtils.clamp(rawWakeY, -wakeCap, wakeCap);
      const radialDistance =
        baseDistance +
        organicWobble * motionMultiplier +
        waveLift * motionMultiplier +
        localInfluence * 0.24 -
        gesture.compression * 0.11 +
        audio.onset * 0.03 * visualIntensity;
      const zWave = Math.sin(phase * 0.8 + angle * 2.2) * (0.045 + audio.energyVariance * 0.06 * visualIntensity);
      const totalX = THREE.MathUtils.clamp(pullX + wakeX, -MAX_TOTAL_SURFACE_DISPLACEMENT, MAX_TOTAL_SURFACE_DISPLACEMENT);
      const totalY = THREE.MathUtils.clamp(pullY + wakeY, -MAX_TOTAL_SURFACE_DISPLACEMENT, MAX_TOTAL_SURFACE_DISPLACEMENT);
      positions[vertex] = normalX * radialDistance + totalX;
      positions[vertex + 1] = normalY * radialDistance + totalY;
      positions[vertex + 2] = normalZ * radialDistance + zWave * 0.6;
    }

    tempColor
      .copy(coreColor)
      .lerp(ringColor, audio.brightness * 0.3 + audio.hype * 0.2)
      .lerp(accentColor, gesture.paletteHeat * 0.36 + handPresence * 0.3);
    material.color.copy(tempColor);
    material.opacity = THREE.MathUtils.lerp(0.52 + audio.volume * 0.1 + handPresence * 0.12, 0.26, freeze);
    material.thickness = 0.54 + audio.hype * 0.45 + gesture.compression * 0.3;
    material.transmission = THREE.MathUtils.clamp(0.74 + audio.brightness * 0.2, 0.65, 0.95);
    material.roughness = THREE.MathUtils.clamp(0.1 + audio.calm * 0.14 - audio.hype * 0.06, 0.05, 0.28);
    material.ior = 1.32 + gesture.paletteHeat * 0.12;

    shellMaterial
      .color.copy(accentColor)
      .lerp(ringColor, audio.brightness * 0.6)
      .lerp(hotColor, Math.max(0, gesture.paletteHeat - 0.42) * 0.8);
    shellMaterial.opacity = THREE.MathUtils.lerp(0.16 + handPresence * 0.15 + audio.hype * 0.12, 0.06, freeze);

    positionAttribute.needsUpdate = true;
    geometryBundle.geometry.computeVertexNormals();
  });

  return (
    <group position={[0, 0, -0.05 + index * 0.02]}>
      <mesh ref={meshRef} geometry={geometryBundle.geometry}>
        <meshPhysicalMaterial
          ref={materialRef}
          transparent
          opacity={0.55}
          roughness={0.12}
          metalness={0}
          transmission={0.82}
          thickness={0.72}
          ior={1.38}
          envMapIntensity={1.9}
          clearcoat={0.86}
          clearcoatRoughness={0.12}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>
      <mesh ref={shellRef} geometry={geometryBundle.geometry}>
        <meshBasicMaterial
          ref={shellMaterialRef}
          transparent
          opacity={0.16}
          color={palette.accent}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function ResonanceGlassyBlobs({
  palette,
  audioRef,
  gestureRef,
  reducedMotionRef,
  visualIntensityRef,
  handInfluenceRef,
  interactionDebugRef,
  wakeHistoryRef
}: {
  palette: ParticlePalette;
  audioRef: React.RefObject<AudioSnapshot>;
  gestureRef: React.RefObject<GestureControls>;
  reducedMotionRef: React.RefObject<boolean>;
  visualIntensityRef: React.RefObject<number>;
  handInfluenceRef: React.RefObject<number>;
  interactionDebugRef: React.RefObject<InteractionDebugOptions>;
  wakeHistoryRef: React.RefObject<WakeSample[]>;
}) {
  return (
    <group position={[0, 0, 0.02]}>
      {[0, 1, 2].map((index) => (
        <GlassyBlob
          key={index}
          index={index}
          palette={palette}
          audioRef={audioRef}
          gestureRef={gestureRef}
          reducedMotionRef={reducedMotionRef}
          visualIntensityRef={visualIntensityRef}
          handInfluenceRef={handInfluenceRef}
          interactionDebugRef={interactionDebugRef}
          wakeHistoryRef={wakeHistoryRef}
        />
      ))}
    </group>
  );
}

function CoreBodyRibbon({
  index,
  palette,
  palettePulseToken,
  audioRef,
  gestureRef,
  reducedMotionRef,
  visualIntensityRef,
  handInfluenceRef,
  interactionDebugRef,
  wakeHistoryRef
}: {
  index: number;
  palette: ParticlePalette;
  palettePulseToken: number;
  audioRef: React.RefObject<AudioSnapshot>;
  gestureRef: React.RefObject<GestureControls>;
  reducedMotionRef: React.RefObject<boolean>;
  visualIntensityRef: React.RefObject<number>;
  handInfluenceRef: React.RefObject<number>;
  interactionDebugRef: React.RefObject<InteractionDebugOptions>;
  wakeHistoryRef: React.RefObject<WakeSample[]>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const gestureBurstAgeRef = useRef<number | null>(null);
  const lastBurstTokenRef = useRef(0);
  const lastPalettePulseTokenRef = useRef(0);
  const palettePulseRef = useRef(0);
  const ribbon = useMemo(() => createRibbonGeometry(CORE_SEGMENTS), []);
  const geometry = useMemo(() => createRibbonBufferGeometry(ribbon), [ribbon]);
  const baseColor = useMemo(() => new THREE.Color(index % 2 === 0 ? palette.coreA : palette.coreB), [index, palette.coreA, palette.coreB]);
  const accentColor = useMemo(() => new THREE.Color(palette.accent), [palette.accent]);
  const hotColor = useMemo(() => new THREE.Color(palette.hot), [palette.hot]);
  const ringColor = useMemo(() => new THREE.Color(palette.ring), [palette.ring]);
  const tempColor = useMemo(() => new THREE.Color(palette.coreA), [palette.coreA]);

  useFrame(({ clock }, delta) => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    const audioRaw = audioRef.current ?? quietAudio;
    const debugOptions = interactionDebugRef.current;
    const audio = getEffectiveAudio(audioRaw, debugOptions.handOnlyEffects);
    const gesture = gestureRef.current ?? createNeutralGestureControls();
    const reducedMotion = reducedMotionRef.current;
    const visualIntensity = visualIntensityRef.current;
    const handInfluence = handInfluenceRef.current;

    if (!mesh || !material) {
      return;
    }

    if (gesture.burstToken !== lastBurstTokenRef.current) {
      gestureBurstAgeRef.current = 0;
      lastBurstTokenRef.current = gesture.burstToken;
    }

    if (palettePulseToken !== lastPalettePulseTokenRef.current) {
      palettePulseRef.current = 1;
      lastPalettePulseTokenRef.current = palettePulseToken;
    }

    if (gestureBurstAgeRef.current !== null) {
      gestureBurstAgeRef.current += delta;
    }

    const burstStage = getGestureBurstStage(gestureBurstAgeRef.current);

    if (!burstStage.active) {
      gestureBurstAgeRef.current = null;
    }

    palettePulseRef.current = Math.max(0, palettePulseRef.current - delta * 1.5);
    const freeze = gesture.freeze;
    const wakeMagnitude = getWakeMagnitude(gesture);
    const motionScale = THREE.MathUtils.lerp(1, 0.08, freeze);
    const handAngle = getHandAngle(gesture);
    const baseRadius = 0.54 + index * 0.24;
    const baseThickness = 0.014 + index * 0.005;
    const compression = THREE.MathUtils.lerp(1.12, 0.5, gesture.compression);
    const aperture = THREE.MathUtils.lerp(0.86, 1.22, gesture.twoHandScale);
    const breath =
      1 +
      audio.volume * 0.11 * visualIntensity +
      audio.hype * 0.035 * visualIntensity -
      burstStage.collapse * 0.22 +
      burstStage.explosion * 0.22;
    const waveform = audio.waveform.length ? audio.waveform : quietAudio.waveform;
    const handX = gesture.attractor.x;
    const handY = gesture.attractor.y;
    const response = 1 - index * 0.1;

    mesh.rotation.z += delta * (reducedMotion ? 0.008 : (0.018 + audio.mids * 0.055 + audio.hype * 0.035) * (index % 2 === 0 ? 1 : -0.72)) * motionScale;
    mesh.scale.setScalar(compression * aperture * breath);

    for (let segment = 0; segment < CORE_SEGMENTS; segment += 1) {
      const angle = ribbon.angles[segment];
      const cos = ribbon.cosines[segment];
      const sin = ribbon.sines[segment];
      const waveformIndex = Math.floor((segment / CORE_SEGMENTS) * waveform.length);
      const waveSample = waveform[waveformIndex] ?? 0;
      const phase = clock.elapsedTime * (0.32 + audio.mids * 0.75) + segment * 0.09 + index * 1.7;
      const angleDelta = getAngleDelta(angle, handAngle);
      const handFalloff =
        Math.exp(-(angleDelta * angleDelta) / (0.36 + index * 0.12)) *
        gesture.handPresence *
        handInfluence;
      const pointX = cos * baseRadius;
      const pointY = sin * baseRadius * 0.7;
      const distanceToHand = Math.sqrt(Math.pow(handX - pointX, 2) + Math.pow(handY - pointY, 2));
      const proximityInner = smoothFalloff(distanceToHand, WAKE_INNER_RADIUS * 0.9);
      const proximityOuter = smoothFalloff(distanceToHand, WAKE_OUTER_RADIUS);
      const fieldInfluence = (Math.max(handFalloff, proximityInner * 0.6 + proximityOuter * 0.4) * response);
      const wakeField = distributedWakeAt(pointX, pointY, wakeHistoryRef.current, WAKE_OUTER_RADIUS * 1.05);
      const wakePush =
        wakeMagnitude *
        fieldInfluence *
        (0.22 + gesture.movementEnergy * 0.5) *
        handInfluence *
        THREE.MathUtils.lerp(1, 0.65, gesture.compression);
      const localPull = fieldInfluence * gesture.attractor.strength * 0.48 * handInfluence;
      const fluidWave =
        Math.sin(phase) * (0.025 + audio.mids * 0.05 * visualIntensity + audio.energyVariance * 0.04 * visualIntensity) +
        waveSample * (0.05 + audio.volume * 0.12 * visualIntensity + audio.highs * 0.05 * visualIntensity) +
        audio.brightness * 0.018 * visualIntensity * Math.sin(angle * 3 + phase * 0.5);
      const radius =
        baseRadius +
        fluidWave * motionScale +
        fieldInfluence * 0.1 +
        wakePush -
        gesture.compression * 0.08 +
        burstStage.explosion * 0.16 -
        burstStage.collapse * 0.2;
      const thickness =
        baseThickness +
        audio.hype * 0.018 * visualIntensity +
        gesture.compression * 0.014 +
        gesture.paletteHeat * 0.018 +
        palettePulseRef.current * 0.035 +
        burstStage.explosion * 0.05;
      const innerRadius = Math.max(0.08, radius - thickness);
      const outerRadius = radius + thickness;
      const pullX = (handX - pointX) * localPull;
      const pullY = (handY - pointY) * localPull;
      const wakeX = (gesture.wake.x * 0.34 + wakeField.x * 0.66) * wakePush * 0.28;
      const wakeY = (-gesture.wake.y * 0.34 + wakeField.y * 0.66) * wakePush * 0.28;
      const z = Math.sin(phase * 0.8) * 0.035 + index * 0.025;
      const offset = segment * 6;
      const colorFade = THREE.MathUtils.clamp(
        0.34 + audio.hype * 0.28 + fieldInfluence * 0.26 + palettePulseRef.current * 0.4,
        0,
        1
      );

      tempColor
        .copy(baseColor)
        .lerp(ringColor, audio.brightness * 0.48 + index * 0.08)
        .lerp(accentColor, colorFade)
        .lerp(hotColor, Math.max(0, gesture.paletteHeat - 0.45) * 0.7 + burstStage.explosion * 0.35);
      ribbon.positions[offset] = cos * innerRadius + pullX + wakeX;
      ribbon.positions[offset + 1] = sin * innerRadius * 0.7 + pullY + wakeY;
      ribbon.positions[offset + 2] = z;
      ribbon.positions[offset + 3] = cos * outerRadius + pullX + wakeX;
      ribbon.positions[offset + 4] = sin * outerRadius * 0.7 + pullY + wakeY;
      ribbon.positions[offset + 5] = z + 0.012;
      ribbon.colors[offset] = tempColor.r * 0.72;
      ribbon.colors[offset + 1] = tempColor.g * 0.72;
      ribbon.colors[offset + 2] = tempColor.b * 0.72;
      ribbon.colors[offset + 3] = tempColor.r;
      ribbon.colors[offset + 4] = tempColor.g;
      ribbon.colors[offset + 5] = tempColor.b;
    }

    material.opacity = THREE.MathUtils.lerp(
      0.11 + audio.volume * 0.06 * visualIntensity + audio.hype * 0.05 * visualIntensity + gesture.compression * 0.03 + palettePulseRef.current * 0.08,
      0.06,
      freeze
    );
    (geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    (geometry.getAttribute("color") as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0, index * 0.015]}>
      <meshBasicMaterial
        ref={materialRef}
        transparent
        opacity={0.32}
        vertexColors
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function CoreSoundBody({
  palette,
  palettePulseToken,
  audioRef,
  gestureRef,
  reducedMotionRef,
  visualIntensityRef,
  handInfluenceRef,
  interactionDebugRef,
  wakeHistoryRef
}: {
  palette: ParticlePalette;
  palettePulseToken: number;
  audioRef: React.RefObject<AudioSnapshot>;
  gestureRef: React.RefObject<GestureControls>;
  reducedMotionRef: React.RefObject<boolean>;
  visualIntensityRef: React.RefObject<number>;
  handInfluenceRef: React.RefObject<number>;
  interactionDebugRef: React.RefObject<InteractionDebugOptions>;
  wakeHistoryRef: React.RefObject<WakeSample[]>;
}) {
  return (
    <group position={[0, 0, 0.08]}>
      {[0, 1].map((index) => (
        <CoreBodyRibbon
          key={index}
          index={index}
          palette={palette}
          palettePulseToken={palettePulseToken}
          audioRef={audioRef}
          gestureRef={gestureRef}
          reducedMotionRef={reducedMotionRef}
          visualIntensityRef={visualIntensityRef}
          handInfluenceRef={handInfluenceRef}
          interactionDebugRef={interactionDebugRef}
          wakeHistoryRef={wakeHistoryRef}
        />
      ))}
    </group>
  );
}

function SpectrumHalo({
  palette,
  palettePulseToken,
  audioRef,
  gestureRef,
  reducedMotionRef,
  visualIntensityRef,
  handInfluenceRef,
  interactionDebugRef
}: {
  palette: ParticlePalette;
  palettePulseToken: number;
  audioRef: React.RefObject<AudioSnapshot>;
  gestureRef: React.RefObject<GestureControls>;
  reducedMotionRef: React.RefObject<boolean>;
  visualIntensityRef: React.RefObject<number>;
  handInfluenceRef: React.RefObject<number>;
  interactionDebugRef: React.RefObject<InteractionDebugOptions>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<Array<THREE.Mesh | null>>([]);
  const lastPalettePulseTokenRef = useRef(0);
  const palettePulseRef = useRef(0);
  const baseColor = useMemo(() => new THREE.Color(palette.ring), [palette.ring]);
  const accentColor = useMemo(() => new THREE.Color(palette.accent), [palette.accent]);
  const hotColor = useMemo(() => new THREE.Color(palette.hot), [palette.hot]);
  const tempColor = useMemo(() => new THREE.Color(palette.ring), [palette.ring]);
  const haloMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      }),
    []
  );

  useFrame((_, delta) => {
    const group = groupRef.current;
    const audioRaw = audioRef.current ?? quietAudio;
    const debugOptions = interactionDebugRef.current;
    const audio = getEffectiveAudio(audioRaw, debugOptions.handOnlyEffects);
    const gesture = gestureRef.current ?? createNeutralGestureControls();
    const reducedMotion = reducedMotionRef.current;
    const visualIntensity = visualIntensityRef.current;
    const handInfluence = handInfluenceRef.current;

    if (!group) {
      return;
    }

    if (palettePulseToken !== lastPalettePulseTokenRef.current) {
      palettePulseRef.current = 1;
      lastPalettePulseTokenRef.current = palettePulseToken;
    }

    palettePulseRef.current = Math.max(0, palettePulseRef.current - delta * 1.6);
    const freeze = gesture.freeze;
    const haloScale = THREE.MathUtils.lerp(0.88, 1.2, gesture.twoHandScale) * THREE.MathUtils.lerp(1, 0.84, gesture.compression);
    const activity = THREE.MathUtils.clamp(
      (audio.volume * 0.8 + audio.hype * 0.7) * visualIntensity +
        gesture.paletteHeat * 0.35 +
        gesture.handPresence * 0.18 * handInfluence,
      0,
      1
    );

    group.scale.setScalar(haloScale);
    group.rotation.z +=
      delta *
      (reducedMotion ? 0.015 : 0.035 + audio.mids * 0.07 * visualIntensity + gesture.wake.x * 0.035 * handInfluence) *
      THREE.MathUtils.lerp(1, 0.12, freeze);
    tempColor.copy(baseColor).lerp(accentColor, audio.mids * 0.55 + gesture.paletteHeat * 0.4).lerp(hotColor, palettePulseRef.current * 0.5);
    haloMaterial.color.copy(tempColor);
    haloMaterial.opacity = THREE.MathUtils.lerp(0.16 + activity * 0.26 + palettePulseRef.current * 0.22, 0.06, freeze);

    for (let index = 0; index < HALO_SEGMENTS; index += 1) {
      const mesh = meshRefs.current[index];

      if (!mesh) {
        continue;
      }

      const band = index % 3 === 0 ? audio.bass : index % 3 === 1 ? audio.mids : audio.highs;
      const fine = Math.sin(index * 1.7 + audio.onsetRate * 6) * 0.04;
      const angle = (index / HALO_SEGMENTS) * Math.PI * 2;
      const handAngle = getHandAngle(gesture);
      const localHand =
        Math.exp(-(getAngleDelta(angle, handAngle) ** 2) / 0.2) * getWakeMagnitude(gesture) * handInfluence;
      const height =
        0.04 +
        band * (index % 3 === 0 ? 0.22 : index % 3 === 1 ? 0.2 : 0.32) * visualIntensity +
        audio.onset * 0.055 * visualIntensity +
        fine +
        localHand * 0.18;

      mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, THREE.MathUtils.lerp(height, 0.04, freeze), 0.22);
      mesh.scale.x = index % 3 === 2 ? 0.42 : index % 3 === 0 ? 0.92 : 0.62;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -0.48]}>
      {Array.from({ length: HALO_SEGMENTS }, (_, index) => {
        const angle = (index / HALO_SEGMENTS) * Math.PI * 2;
        const radius = index % 3 === 0 ? 1.6 : index % 3 === 1 ? 1.82 : 2.04;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.72;

        return (
          <mesh
            key={index}
            ref={(mesh) => {
              meshRefs.current[index] = mesh;
            }}
            position={[x, y, 0]}
            rotation={[0, 0, angle - Math.PI / 2]}
          >
            <boxGeometry args={[index % 3 === 0 ? 0.026 : 0.014, 0.18, 0.01]} />
            <primitive object={haloMaterial} attach="material" />
          </mesh>
        );
      })}
    </group>
  );
}

function ParticleLayer({
  count,
  radius,
  colorA,
  colorB,
  reactiveColor,
  size,
  opacity,
  layer,
  palette,
  palettePulseToken,
  audioRef,
  gestureRef,
  reducedMotionRef,
  visualIntensityRef,
  handInfluenceRef,
  trailStrengthRef,
  interactionDebugRef,
  wakeHistoryRef
}: ParticleLayerProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const impulseRef = useRef(0);
  const gestureBurstAgeRef = useRef<number | null>(null);
  const lastBeatRef = useRef(false);
  const lastBurstTokenRef = useRef(0);
  const lastPalettePulseTokenRef = useRef(0);
  const palettePulseRef = useRef(0);
  const smoothedGestureRef = useRef<GestureControls>(createNeutralGestureControls());
  const calmColor = useMemo(() => new THREE.Color(colorA), [colorA]);
  const coolColor = useMemo(() => new THREE.Color(colorB), [colorB]);
  const reactiveColorValue = useMemo(() => new THREE.Color(reactiveColor), [reactiveColor]);
  const hotColor = useMemo(() => new THREE.Color(palette.hot), [palette.hot]);
  const tempColor = useMemo(() => new THREE.Color(colorA), [colorA]);
  const layerData = useMemo(
    () =>
      createParticleLayer(
        count,
        radius,
        colorA,
        colorB,
        layer === "dust" ? 0.34 : layer === "sparks" ? 0.58 : 0.72
      ),
    [colorA, colorB, count, layer, radius]
  );

  useFrame(({ clock }, delta) => {
    const points = pointsRef.current;
    const material = materialRef.current;
    const audioRaw = audioRef.current ?? quietAudio;
    const debugOptions = interactionDebugRef.current;
    const audio = getEffectiveAudio(audioRaw, debugOptions.handOnlyEffects);
    const gesture = gestureRef.current ?? createNeutralGestureControls();
    const reducedMotion = reducedMotionRef.current;
    const visualIntensity = visualIntensityRef.current;
    const handInfluence = handInfluenceRef.current;
    const trailStrength = trailStrengthRef.current;

    if (!points || !material) {
      return;
    }

    if (audio.beat && !lastBeatRef.current) {
      impulseRef.current = 1;
    }

    if (gesture.burstToken !== lastBurstTokenRef.current) {
      gestureBurstAgeRef.current = 0;
      lastBurstTokenRef.current = gesture.burstToken;
    }

    if (palettePulseToken !== lastPalettePulseTokenRef.current) {
      palettePulseRef.current = 1;
      lastPalettePulseTokenRef.current = palettePulseToken;
    }

    lastBeatRef.current = audio.beat;
    impulseRef.current = Math.max(0, impulseRef.current - delta * (reducedMotion ? 2.1 : 3.6));
    palettePulseRef.current = Math.max(0, palettePulseRef.current - delta * 1.9);
    if (gestureBurstAgeRef.current !== null) {
      gestureBurstAgeRef.current += delta;
    }

    const burstStage = getGestureBurstStage(gestureBurstAgeRef.current);

    if (!burstStage.active) {
      gestureBurstAgeRef.current = null;
    }

    const smoothedGesture = smoothedGestureRef.current;
    smoothedGesture.enabled = gesture.enabled;
    smoothedGesture.attractor.x += (gesture.attractor.x - smoothedGesture.attractor.x) * 0.13;
    smoothedGesture.attractor.y += (gesture.attractor.y - smoothedGesture.attractor.y) * 0.13;
    smoothedGesture.attractor.strength +=
      (gesture.attractor.strength - smoothedGesture.attractor.strength) * 0.1;
    smoothedGesture.wake.x += (gesture.wake.x - smoothedGesture.wake.x) * 0.22;
    smoothedGesture.wake.y += (gesture.wake.y - smoothedGesture.wake.y) * 0.22;
    smoothedGesture.compression += (gesture.compression - smoothedGesture.compression) * 0.12;
    smoothedGesture.energy += (gesture.energy - smoothedGesture.energy) * 0.08;
    smoothedGesture.paletteHeat += (gesture.paletteHeat - smoothedGesture.paletteHeat) * 0.09;
    smoothedGesture.handPresence += (gesture.handPresence - smoothedGesture.handPresence) * 0.12;
    smoothedGesture.twoHandScale += (gesture.twoHandScale - smoothedGesture.twoHandScale) * 0.08;
    smoothedGesture.freeze += (gesture.freeze - smoothedGesture.freeze) * 0.12;
    smoothedGesture.movementEnergy += (gesture.movementEnergy - smoothedGesture.movementEnergy) * 0.16;

    const impulse = impulseRef.current;
    const gestureCollapse = burstStage.collapse;
    const gestureExplosion = burstStage.explosion;
    const palettePulse = palettePulseRef.current;
    const volume = audio.volume;
    const onset = audio.onset;
    const activity = audio.beatActivity;
    const mids = audio.mids;
    const highs = audio.highs;
    const bass = audio.bass;
    const brightness = audio.brightness;
    const onsetRate = audio.onsetRate;
    const energyVariance = audio.energyVariance;
    const hype = audio.hype;
    const calm = audio.calm;
    const motionMultiplier = THREE.MathUtils.lerp(1, 0.12, smoothedGesture.freeze);
    const compressionScale = THREE.MathUtils.lerp(1.08, 0.78, smoothedGesture.compression);
    const handScale = THREE.MathUtils.lerp(0.92, 1.14, smoothedGesture.twoHandScale);
    const gestureEnergy = smoothedGesture.energy;
    const paletteHeat = smoothedGesture.paletteHeat;
    const wakeMagnitude = THREE.MathUtils.clamp(
      Math.sqrt(
        smoothedGesture.wake.x * smoothedGesture.wake.x +
          smoothedGesture.wake.y * smoothedGesture.wake.y
      ),
      0,
      1
    );
    const wakeEnergy = Math.max(smoothedGesture.movementEnergy * 3.4 * trailStrength, wakeMagnitude);
    const ambientMotionMultiplier = THREE.MathUtils.lerp(1, 0.64, smoothedGesture.handPresence * handInfluence);
    const baseSpeed = reducedMotion ? 0.03 : 0.09;
    const layerSpeed = layer === "dust" ? 0.24 : 0.76;
    const intensity = THREE.MathUtils.clamp(
      (volume * 1.05 + hype * 0.75 + brightness * 0.35 + activity * 0.35 + highs * 0.25) * visualIntensity,
      0,
      1
    );
    const radialPulse =
      1 +
      volume * (layer === "dust" ? 0.035 : 0.09) * visualIntensity +
      onset * (layer === "sparks" ? 0.04 : 0.025) * ambientMotionMultiplier * visualIntensity +
      impulse * (reducedMotion ? 0.006 : layer === "sparks" ? 0.045 : 0.022) * ambientMotionMultiplier +
      bass * (layer === "dust" ? 0.006 : 0.018);
    const swirlAmount =
      (reducedMotion ? 0.006 : 0.012 + mids * (layer === "dust" ? 0.022 : 0.08) * visualIntensity + hype * 0.028 * visualIntensity + gestureEnergy * 0.02) *
      motionMultiplier;
    const waveAmount =
      (reducedMotion ? 0.004 : 0.01 + volume * 0.028 * visualIntensity + energyVariance * 0.042 * visualIntensity + calm * 0.012) *
      motionMultiplier;
    const jitterAmount =
      (reducedMotion
        ? 0.001
        : highs * (layer === "sparks" ? 0.036 : 0.008) + hype * 0.003) *
      motionMultiplier *
      ambientMotionMultiplier;
    const scale =
      1 +
      volume * (layer === "dust" ? 0.025 : 0.045) * visualIntensity +
      impulse * (reducedMotion ? 0.002 : layer === "sparks" ? 0.02 : 0.01) * ambientMotionMultiplier +
      gestureExplosion * (reducedMotion ? 0.006 : layer === "sparks" ? 0.035 : 0.02) -
      gestureCollapse * (layer === "dust" ? 0.015 : 0.035);

    points.rotation.y +=
      delta * (baseSpeed + mids * 0.08 * visualIntensity + hype * 0.08 * visualIntensity + gestureEnergy * 0.035) * layerSpeed * motionMultiplier;
    points.rotation.x +=
      delta * (baseSpeed * 0.28 + highs * 0.05 + energyVariance * 0.06) * layerSpeed * motionMultiplier;
    points.scale.setScalar(scale * handScale);

    material.opacity = Math.min(
      0.95,
      opacity +
        intensity * (layer === "dust" ? 0.025 : 0.07) +
        onsetRate * (layer === "sparks" ? 0.05 : 0.015) * visualIntensity +
        gestureEnergy * (layer === "sparks" ? 0.035 : 0.015) +
        smoothedGesture.movementEnergy * (layer === "sparks" ? 0.045 : 0.015) +
        paletteHeat * (layer === "dust" ? 0.025 : 0.055) +
        impulse * 0.012 +
        gestureExplosion * 0.08 +
        palettePulse * (layer === "dust" ? 0.018 : 0.06)
    );
    material.size =
      size *
      (1 +
        activity * (layer === "dust" ? 0.03 : 0.08) +
        onset * 0.04 +
        impulse * 0.04 +
        highs * (layer === "sparks" ? 0.12 : 0.04) +
        smoothedGesture.movementEnergy * (layer === "sparks" ? 0.12 : 0.04) +
        gestureExplosion * (layer === "sparks" ? 0.14 : 0.06));
    tempColor
      .copy(calmColor)
      .lerp(coolColor, Math.max(brightness * 0.55, calm * 0.2))
      .lerp(
        reactiveColorValue,
        layer === "sparks"
          ? Math.max(highs, onsetRate, paletteHeat * 0.85, gestureExplosion)
          : Math.max(intensity * 0.52, paletteHeat * 0.72, gestureExplosion * 0.55, palettePulse * 0.72)
      )
      .lerp(hotColor, Math.max(0, paletteHeat - 0.42) * 0.9 + palettePulse * 0.32);
    material.color.copy(tempColor);

    const elapsed = clock.elapsedTime;
    const { positions, basePositions, seeds } = layerData;

    let fieldCoalesceAccum = 0;

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      const baseX = basePositions[offset];
      const baseY = basePositions[offset + 1];
      const baseZ = basePositions[offset + 2];
      const distance = Math.max(0.001, Math.sqrt(baseX * baseX + baseY * baseY + baseZ * baseZ));
      const directionX = baseX / distance;
      const directionY = baseY / distance;
      const directionZ = baseZ / distance;
      const seed = seeds[index];
      const swirlPhase = elapsed * (0.22 + mids * 1.35 + hype * 0.85 + gestureEnergy * 0.55) + seed;
      const wavePhase =
        elapsed * (0.32 + highs * 0.9 + onsetRate * 0.75 + gestureEnergy * 0.55) + distance * 2.1 + seed;
      const swirlX = -baseY * Math.sin(swirlPhase) * swirlAmount;
      const swirlY = baseX * Math.cos(swirlPhase * 0.9) * swirlAmount;
      const wave = Math.sin(wavePhase) * waveAmount;
      const jitterX = Math.sin(wavePhase * 1.71 + seed) * jitterAmount;
      const jitterY = Math.cos(wavePhase * 1.31 + seed) * jitterAmount;
      const jitterZ = Math.sin(wavePhase * 1.13 + seed) * jitterAmount;

      const collapseScale = 1 - gestureCollapse * (layer === "dust" ? 0.28 : layer === "sparks" ? 0.42 : 0.52);
      const compressedX = baseX * radialPulse * compressionScale * collapseScale;
      const compressedY = baseY * radialPulse * compressionScale * collapseScale;
      const compressedZ = baseZ * radialPulse * compressionScale * collapseScale;
      const dx = smoothedGesture.attractor.x - compressedX;
      const dy = smoothedGesture.attractor.y - compressedY;
      const attractorDistance = Math.sqrt(dx * dx + dy * dy + compressedZ * compressedZ);
      const attractorFalloff = 1 / (1 + attractorDistance * attractorDistance);
      const attractorStrength =
        smoothedGesture.attractor.strength *
        handInfluence *
        attractorFalloff *
        (layer === "dust" ? 0.1 : 0.22);
      const wakeDistance = Math.max(0.001, Math.sqrt(dx * dx + dy * dy));
      const wakeFalloff = smoothFalloff(wakeDistance, layer === "dust" ? WAKE_OUTER_RADIUS * 1.2 : WAKE_OUTER_RADIUS);
      const wakeField = distributedWakeAt(compressedX, compressedY, wakeHistoryRef.current, WAKE_OUTER_RADIUS * 1.1);
      const wakeStrength =
        wakeEnergy *
        wakeFalloff *
        (layer === "dust" ? 0.1 : 0.28) *
        handInfluence *
        THREE.MathUtils.lerp(1, 0.65, smoothedGesture.compression);
      const fieldCoalesce = layer === "dust" ? wakeField.strength * 0.22 : wakeField.strength * 0.08;
      fieldCoalesceAccum += fieldCoalesce;
      const burstPush = gestureExplosion * (layer === "sparks" ? 0.26 : 0.12);

      positions[offset] =
        compressedX +
        directionX * (wave + burstPush) +
        swirlX +
        jitterX +
        dx * attractorStrength +
        (smoothedGesture.wake.x * 0.32 + wakeField.x * 0.68) * wakeStrength;
      positions[offset + 1] =
        compressedY +
        directionY * (wave + burstPush) +
        swirlY +
        jitterY +
        dy * attractorStrength -
        (smoothedGesture.wake.y * 0.32 - wakeField.y * 0.68) * wakeStrength;
      positions[offset + 2] = compressedZ + directionZ * (wave + burstPush + wakeStrength * 0.35) + jitterZ;

    }

    if (layer === "dust") {
      const averagedCoalesce = fieldCoalesceAccum / Math.max(1, count);
      material.opacity = Math.min(0.96, material.opacity + averagedCoalesce * 0.65);
      material.size = material.size * (1 + averagedCoalesce * 0.22);
    }

    const positionAttribute = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[layerData.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[layerData.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={size}
        transparent
        opacity={opacity}
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function HandTrailRibbon({
  palette,
  gestureRef,
  reducedMotionRef,
  handInfluenceRef,
  trailStrengthRef,
  interactionDebugRef,
  wakeHistoryRef
}: {
  palette: ParticlePalette;
  gestureRef: React.RefObject<GestureControls>;
  reducedMotionRef: React.RefObject<boolean>;
  handInfluenceRef: React.RefObject<number>;
  trailStrengthRef: React.RefObject<number>;
  interactionDebugRef: React.RefObject<InteractionDebugOptions>;
  wakeHistoryRef: React.RefObject<WakeSample[]>;
}) {
  const segmentCount = 40;
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const writeIndexRef = useRef(0);
  const sampleAccumulatorRef = useRef(0);
  const trailColor = useMemo(() => new THREE.Color(palette.trail), [palette.trail]);
  const accentColor = useMemo(() => new THREE.Color(palette.accent), [palette.accent]);
  const hotColor = useMemo(() => new THREE.Color(palette.hot), [palette.hot]);
  const tempColor = useMemo(() => new THREE.Color(palette.trail), [palette.trail]);
  const data = useMemo(() => {
    const positions = new Float32Array(segmentCount * 2 * 3);
    const colors = new Float32Array(segmentCount * 2 * 3);
    const samples = new Float32Array(segmentCount * 4);
    const indices = new Uint16Array((segmentCount - 1) * 6);

    for (let index = 0; index < segmentCount; index += 1) {
      const sampleOffset = index * 4;

      samples[sampleOffset] = 0;
      samples[sampleOffset + 1] = 0;
      samples[sampleOffset + 2] = -20;
      samples[sampleOffset + 3] = 0;
    }

    for (let index = 0; index < segmentCount - 1; index += 1) {
      const vertex = index * 2;
      const nextVertex = vertex + 2;
      const offset = index * 6;

      indices[offset] = vertex;
      indices[offset + 1] = vertex + 1;
      indices[offset + 2] = nextVertex;
      indices[offset + 3] = vertex + 1;
      indices[offset + 4] = nextVertex + 1;
      indices[offset + 5] = nextVertex;
    }

    return { positions, colors, samples, indices };
  }, [segmentCount]);
  const geometry = useMemo(() => {
    const nextGeometry = new THREE.BufferGeometry();

    nextGeometry.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    nextGeometry.setAttribute("color", new THREE.BufferAttribute(data.colors, 3));
    nextGeometry.setIndex(new THREE.BufferAttribute(data.indices, 1));

    return nextGeometry;
  }, [data.colors, data.indices, data.positions]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    const gesture = gestureRef.current ?? createNeutralGestureControls();
    const debugOptions = interactionDebugRef.current;
    const reducedMotion = reducedMotionRef.current;
    const handInfluence = handInfluenceRef.current;
    const trailStrength = trailStrengthRef.current;

    if (!mesh || !material) {
      return;
    }

    const wakeMagnitude = Math.min(
      1,
      Math.sqrt(gesture.wake.x * gesture.wake.x + gesture.wake.y * gesture.wake.y)
    );
    const movement = reducedMotion
      ? Math.max(gesture.movementEnergy * 0.2, wakeMagnitude * 0.16) * trailStrength
      : Math.max(gesture.movementEnergy * 3.2, wakeMagnitude) * trailStrength;
    const shouldSample = gesture.enabled && gesture.handPresence > 0.2 && gesture.freeze < 0.75;

    sampleAccumulatorRef.current += delta * (shouldSample ? 30 + movement * 12 : 10);

    while (sampleAccumulatorRef.current >= 1) {
      sampleAccumulatorRef.current -= 1;
      const offset = writeIndexRef.current * 4;
      const history = wakeHistoryRef.current;
      let chosen: WakeSample | null = null;

      for (let index = 0; index < history.length; index += 1) {
        const sample = history[index];
        if (!sample.active) {
          continue;
        }
        if (!chosen || sample.ageMs < chosen.ageMs) {
          chosen = sample;
        }
      }

      const sourceX = chosen ? chosen.x : gesture.attractor.x;
      const sourceY = chosen ? chosen.y : gesture.attractor.y;
      const sourceVx = chosen ? chosen.vx : gesture.wake.x;
      const sourceVy = chosen ? chosen.vy : -gesture.wake.y;
      const normalLength = Math.max(0.001, Math.sqrt(sourceVx * sourceVx + sourceVy * sourceVy));
      const normalX = -sourceVy / normalLength;
      const normalY = sourceVx / normalLength;
      const spread = (Math.random() - 0.5) * 0.18;

      data.samples[offset] = sourceX + normalX * spread;
      data.samples[offset + 1] = sourceY + normalY * spread;
      data.samples[offset + 2] = 0.42;
      data.samples[offset + 3] = shouldSample ? Math.max(0.12, movement * handInfluence) : 0;
      writeIndexRef.current = (writeIndexRef.current + 1) % segmentCount;
    }

    for (let ageIndex = 0; ageIndex < segmentCount; ageIndex += 1) {
      const sampleIndex = (writeIndexRef.current + ageIndex) % segmentCount;
      const nextSampleIndex = (writeIndexRef.current + Math.min(segmentCount - 1, ageIndex + 1)) % segmentCount;
      const sampleOffset = sampleIndex * 4;
      const nextSampleOffset = nextSampleIndex * 4;
      const vertexOffset = ageIndex * 6;
      const x = data.samples[sampleOffset];
      const y = data.samples[sampleOffset + 1];
      const z = data.samples[sampleOffset + 2];
      const energy = data.samples[sampleOffset + 3];
      const nextX = data.samples[nextSampleOffset];
      const nextY = data.samples[nextSampleOffset + 1];
      const tangentX = nextX - x;
      const tangentY = nextY - y;
      const tangentLength = Math.max(0.001, Math.sqrt(tangentX * tangentX + tangentY * tangentY));
      const normalX = -tangentY / tangentLength;
      const normalY = tangentX / tangentLength;
      const age = ageIndex / Math.max(1, segmentCount - 1);
      const fade = Math.pow(age, 1.2) * Math.min(1, energy * 1.15);
      const width = (0.012 + energy * 0.05 * trailStrength) * fade;

      tempColor
        .copy(trailColor)
        .lerp(accentColor, energy * 0.74 + gesture.movementEnergy * 0.18)
        .lerp(hotColor, gesture.paletteHeat * 0.78 + energy * 0.22);
      data.positions[vertexOffset] = x + normalX * width;
      data.positions[vertexOffset + 1] = y + normalY * width;
      data.positions[vertexOffset + 2] = z;
      data.positions[vertexOffset + 3] = x - normalX * width;
      data.positions[vertexOffset + 4] = y - normalY * width;
      data.positions[vertexOffset + 5] = z;
      data.colors[vertexOffset] = tempColor.r * fade;
      data.colors[vertexOffset + 1] = tempColor.g * fade;
      data.colors[vertexOffset + 2] = tempColor.b * fade;
      data.colors[vertexOffset + 3] = tempColor.r * fade;
      data.colors[vertexOffset + 4] = tempColor.g * fade;
      data.colors[vertexOffset + 5] = tempColor.b * fade;

      data.samples[sampleOffset + 3] = Math.max(0, energy - delta * (reducedMotion ? 0.7 : 0.52));
    }

    material.opacity = Math.min(
      0.62,
      (0.1 + movement * 0.26 * handInfluence + gesture.paletteHeat * 0.12) *
        (debugOptions.handOnlyEffects ? 1.12 : 1)
    );
    (geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    (geometry.getAttribute("color") as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial
        ref={materialRef}
        transparent
        opacity={0.16}
        vertexColors
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function WaveformRing({
  palette,
  palettePulseToken,
  audioRef,
  gestureRef,
  reducedMotionRef,
  visualIntensityRef,
  handInfluenceRef,
  trailStrengthRef,
  interactionDebugRef,
  wakeHistoryRef
}: {
  palette: ParticlePalette;
  palettePulseToken: number;
  audioRef: React.RefObject<AudioSnapshot>;
  gestureRef: React.RefObject<GestureControls>;
  reducedMotionRef: React.RefObject<boolean>;
  visualIntensityRef: React.RefObject<number>;
  handInfluenceRef: React.RefObject<number>;
  trailStrengthRef: React.RefObject<number>;
  interactionDebugRef: React.RefObject<InteractionDebugOptions>;
  wakeHistoryRef: React.RefObject<WakeSample[]>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const impulseRef = useRef(0);
  const gestureBurstAgeRef = useRef<number | null>(null);
  const lastBeatRef = useRef(false);
  const lastBurstTokenRef = useRef(0);
  const lastPalettePulseTokenRef = useRef(0);
  const palettePulseRef = useRef(0);
  const pointCount = 160;
  const ringData = useMemo(() => {
    const positions = new Float32Array(pointCount * 2 * 3);
    const indices = new Uint16Array(pointCount * 6);

    for (let index = 0; index < pointCount; index += 1) {
      const next = (index + 1) % pointCount;
      const vertex = index * 2;
      const nextVertex = next * 2;
      const offset = index * 6;

      indices[offset] = vertex;
      indices[offset + 1] = vertex + 1;
      indices[offset + 2] = nextVertex;
      indices[offset + 3] = vertex + 1;
      indices[offset + 4] = nextVertex + 1;
      indices[offset + 5] = nextVertex;
    }

    return { positions, indices };
  }, [pointCount]);
  const geometry = useMemo(() => {
    const nextGeometry = new THREE.BufferGeometry();

    nextGeometry.setAttribute("position", new THREE.BufferAttribute(ringData.positions, 3));
    nextGeometry.setIndex(new THREE.BufferAttribute(ringData.indices, 1));

    return nextGeometry;
  }, [ringData.indices, ringData.positions]);
  const calmColor = useMemo(() => new THREE.Color(palette.coreA), [palette.coreA]);
  const brightColor = useMemo(() => new THREE.Color(palette.ring), [palette.ring]);
  const hypeColor = useMemo(() => new THREE.Color(palette.accent), [palette.accent]);
  const hotColor = useMemo(() => new THREE.Color(palette.hot), [palette.hot]);
  const tempColor = useMemo(() => new THREE.Color(palette.ring), [palette.ring]);

  useFrame(({ clock }, delta) => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    const audioRaw = audioRef.current ?? quietAudio;
    const debugOptions = interactionDebugRef.current;
    const audio = getEffectiveAudio(audioRaw, debugOptions.handOnlyEffects);
    const gesture = gestureRef.current ?? createNeutralGestureControls();
    const reducedMotion = reducedMotionRef.current;
    const visualIntensity = visualIntensityRef.current;
    const handInfluence = handInfluenceRef.current;
    const trailStrength = trailStrengthRef.current;

    if (!mesh || !material) {
      return;
    }

    if (audio.beat && !lastBeatRef.current) {
      impulseRef.current = 1;
    }

    if (gesture.burstToken !== lastBurstTokenRef.current) {
      gestureBurstAgeRef.current = 0;
      lastBurstTokenRef.current = gesture.burstToken;
    }

    if (palettePulseToken !== lastPalettePulseTokenRef.current) {
      palettePulseRef.current = 1;
      lastPalettePulseTokenRef.current = palettePulseToken;
    }

    lastBeatRef.current = audio.beat;
    impulseRef.current = Math.max(0, impulseRef.current - delta * (reducedMotion ? 2.5 : 4));
    palettePulseRef.current = Math.max(0, palettePulseRef.current - delta * 1.8);
    if (gestureBurstAgeRef.current !== null) {
      gestureBurstAgeRef.current += delta;
    }

    const burstStage = getGestureBurstStage(gestureBurstAgeRef.current);

    if (!burstStage.active) {
      gestureBurstAgeRef.current = null;
    }

    const waveform = audio.waveform.length ? audio.waveform : quietAudio.waveform;
    const wakeMagnitude = Math.min(
      1,
      Math.sqrt(gesture.wake.x * gesture.wake.x + gesture.wake.y * gesture.wake.y)
    ) * handInfluence;
    const handAngle = Math.atan2(gesture.attractor.y / 0.62, gesture.attractor.x || 0.001);
    const freezeMultiplier = THREE.MathUtils.lerp(1, 0.18, gesture.freeze);
    const compressionRadius = THREE.MathUtils.lerp(0.12, -0.28, gesture.compression);
    const apertureRadius = THREE.MathUtils.lerp(-0.18, 0.22, gesture.twoHandScale);
    const burstRadius = -burstStage.collapse * 0.12 + burstStage.explosion * 0.22;
    const radius =
      1.42 +
      audio.volume * 0.045 * visualIntensity +
      audio.calm * 0.025 +
      compressionRadius +
      apertureRadius +
      burstRadius;
    const amplitude =
      ((reducedMotion ? 0.01 : 0.035) +
      audio.hype * 0.07 * visualIntensity +
      audio.energyVariance * 0.075 * visualIntensity +
      gesture.movementEnergy * 0.04 * trailStrength +
      impulseRef.current * 0.012 * visualIntensity +
      burstStage.explosion * 0.08) *
      freezeMultiplier;
    const shimmer =
      (reducedMotion ? 0 : audio.highs * 0.018 + gesture.movementEnergy * 0.05 * trailStrength) * freezeMultiplier;
    const thickness =
      (0.01 +
      audio.volume * 0.012 * visualIntensity +
      gesture.paletteHeat * 0.012 +
      gesture.movementEnergy * 0.018 +
      burstStage.collapse * 0.012 +
      burstStage.explosion * 0.025) *
      THREE.MathUtils.lerp(1, 0.34, gesture.freeze);

    for (let index = 0; index < pointCount; index += 1) {
      const waveformIndex = Math.floor((index / pointCount) * waveform.length);
      const angle = (index / pointCount) * Math.PI * 2;
      const wave = waveform[waveformIndex] ?? 0;
      const angleDelta = Math.atan2(Math.sin(angle - handAngle), Math.cos(angle - handAngle));
      const handBulge = Math.exp(-(angleDelta * angleDelta) / 0.7) * wakeMagnitude;
      const ringX = Math.cos(angle) * radius;
      const ringY = Math.sin(angle) * radius * 0.62;
      const wakeField = distributedWakeAt(ringX, ringY, wakeHistoryRef.current, WAKE_OUTER_RADIUS * 1.2);
      const ringRadius =
        radius +
        wave * amplitude +
        Math.sin(clock.elapsedTime * (0.55 + audio.onsetRate * 1.8) + index * 0.37) * shimmer +
        handBulge * (0.06 + gesture.movementEnergy * 0.08 * trailStrength) +
        wakeField.strength * 0.05;
      const normalX = Math.cos(angle);
      const normalY = Math.sin(angle);
      const innerRadius = Math.max(0.2, ringRadius - thickness);
      const outerRadius = ringRadius + thickness;
      const innerOffset = index * 6;
      const outerOffset = innerOffset + 3;

      ringData.positions[innerOffset] = normalX * innerRadius;
      ringData.positions[innerOffset + 1] = normalY * innerRadius * 0.62;
      ringData.positions[innerOffset + 2] = -0.18 + Math.sin(angle * 2 + clock.elapsedTime * 0.4) * 0.08;
      ringData.positions[outerOffset] = normalX * outerRadius;
      ringData.positions[outerOffset + 1] = normalY * outerRadius * 0.62;
      ringData.positions[outerOffset + 2] = ringData.positions[innerOffset + 2];
    }

    const positionAttribute = geometry.getAttribute("position") as THREE.BufferAttribute;
    positionAttribute.needsUpdate = true;
    tempColor
      .copy(calmColor)
      .lerp(brightColor, Math.max(audio.brightness, gesture.movementEnergy * 0.5))
      .lerp(hypeColor, Math.max(audio.hype * 0.35, gesture.paletteHeat * 0.78, burstStage.explosion * 0.38))
      .lerp(hotColor, Math.max(0, gesture.paletteHeat - 0.5) * 0.7);
    material.color.copy(tempColor);
    material.opacity = Math.min(
      0.88,
      0.12 +
        audio.volume * 0.08 +
        audio.hype * 0.1 * visualIntensity +
        gesture.paletteHeat * 0.08 +
        gesture.movementEnergy * 0.05 +
        impulseRef.current * 0.025 +
        burstStage.collapse * 0.04 +
        burstStage.explosion * 0.08 +
        palettePulseRef.current * 0.12
    );
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial
        ref={materialRef}
        transparent
        opacity={0.28}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function InteractionDebugHelpers({
  gestureRef,
  handInfluenceRef,
  trailStrengthRef,
  interactionDebugRef,
  wakeHistoryRef
}: {
  gestureRef: React.RefObject<GestureControls>;
  handInfluenceRef: React.RefObject<number>;
  trailStrengthRef: React.RefObject<number>;
  interactionDebugRef: React.RefObject<InteractionDebugOptions>;
  wakeHistoryRef: React.RefObject<WakeSample[]>;
}) {
  const influenceRef = useRef<THREE.Mesh>(null);
  const particleInfluenceRef = useRef<THREE.Mesh>(null);
  const tunnelMarkerRef = useRef<THREE.Mesh>(null);
  const wakeLineRef = useRef<THREE.LineSegments>(null);
  const trailEmitterRef = useRef<THREE.Points>(null);
  const wakePoints = useMemo(
    () => new Float32Array([0, 0, 0.25, 0, 0, 0.25]),
    []
  );
  const trailEmitterPositions = useMemo(() => new Float32Array(18), []);

  useFrame(() => {
    const debug = interactionDebugRef.current;
    const gesture = gestureRef.current ?? createNeutralGestureControls();
    const handInfluence = handInfluenceRef.current;
    const trailStrength = trailStrengthRef.current;
    const influenceRadius = 0.5 * handInfluence;

    if (influenceRef.current) {
      influenceRef.current.visible = debug.enabled && debug.showBlobInfluence;
      influenceRef.current.position.set(gesture.attractor.x, gesture.attractor.y, 0.15);
      influenceRef.current.scale.setScalar(influenceRadius * (1 + gesture.compression * 0.2));
    }

    if (particleInfluenceRef.current) {
      particleInfluenceRef.current.visible = debug.enabled && debug.showParticleInfluence;
      particleInfluenceRef.current.position.set(gesture.attractor.x, gesture.attractor.y, -0.1);
      particleInfluenceRef.current.scale.setScalar(0.26 + handInfluence * 0.22 + gesture.movementEnergy * 0.18);
    }

    if (tunnelMarkerRef.current) {
      const handAngle = getHandAngle(gesture);
      tunnelMarkerRef.current.visible = debug.enabled && debug.showTunnelInfluence;
      tunnelMarkerRef.current.position.set(
        Math.cos(handAngle) * 1.8,
        Math.sin(handAngle) * 1.1,
        -0.6
      );
      tunnelMarkerRef.current.scale.setScalar(0.08 + getWakeMagnitude(gesture) * 0.18 * handInfluence);
    }

    if (wakeLineRef.current) {
      const positions = (wakeLineRef.current.geometry.getAttribute("position") as THREE.BufferAttribute)
        .array as Float32Array;
      const endX = gesture.attractor.x + gesture.wake.x * (0.9 + trailStrength * 0.6);
      const endY = gesture.attractor.y - gesture.wake.y * (0.9 + trailStrength * 0.6);
      wakeLineRef.current.visible = debug.enabled && debug.showWakeVectors;
      positions[0] = gesture.attractor.x;
      positions[1] = gesture.attractor.y;
      positions[2] = 0.3;
      positions[3] = endX;
      positions[4] = endY;
      positions[5] = 0.3;
      (wakeLineRef.current.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    }

    if (trailEmitterRef.current) {
      trailEmitterRef.current.visible = debug.enabled && debug.showTrailEmitters;
      const history = wakeHistoryRef.current;
      for (let index = 0; index < 6; index += 1) {
        const offset = index * 3;
        const sample = history[(history.length + history.length - 1 - index) % history.length];
        if (!sample.active) {
          trailEmitterPositions[offset] = gesture.attractor.x;
          trailEmitterPositions[offset + 1] = gesture.attractor.y;
          trailEmitterPositions[offset + 2] = 0.22 - (index / 5) * 0.04;
          continue;
        }
        trailEmitterPositions[offset] = sample.x;
        trailEmitterPositions[offset + 1] = sample.y;
        trailEmitterPositions[offset + 2] = 0.22 - (index / 5) * 0.04;
      }
      (trailEmitterRef.current.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <group>
      <mesh ref={influenceRef}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshBasicMaterial
          transparent
          opacity={0.08}
          color="#b8f0ff"
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={particleInfluenceRef}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshBasicMaterial
          transparent
          opacity={0.1}
          color="#aab8ff"
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={tunnelMarkerRef}>
        <sphereGeometry args={[1, 14, 10]} />
        <meshBasicMaterial
          transparent
          opacity={0.2}
          color="#ec4899"
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <lineSegments ref={wakeLineRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[wakePoints, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#f5f7fa" transparent opacity={0.65} />
      </lineSegments>
      <points ref={trailEmitterRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[trailEmitterPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          transparent
          opacity={0.75}
          color="#22d3ee"
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function ResonanceScene({
  audioRef,
  gestureRef,
  palette,
  palettePulseToken,
  reducedMotionRef,
  visualIntensityRef,
  handInfluenceRef,
  trailStrengthRef,
  interactionDebugRef,
  wakeHistoryRef
}: {
  audioRef: React.RefObject<AudioSnapshot>;
  gestureRef: React.RefObject<GestureControls>;
  palette: ParticlePalette;
  palettePulseToken: number;
  reducedMotionRef: React.RefObject<boolean>;
  visualIntensityRef: React.RefObject<number>;
  handInfluenceRef: React.RefObject<number>;
  trailStrengthRef: React.RefObject<number>;
  interactionDebugRef: React.RefObject<InteractionDebugOptions>;
  wakeHistoryRef: React.RefObject<WakeSample[]>;
}) {
  return (
    <>
      <fog attach="fog" args={["#05070d", 4.5, 9]} />
      <ambientLight intensity={0.28} color="#c8d5ff" />
      <directionalLight position={[2.8, 2.4, 3.1]} intensity={0.48} color="#b8f0ff" />
      <pointLight position={[-1.4, 1.2, 1.5]} intensity={0.42} color={palette.accent} distance={5.6} />
      <pointLight position={[1.6, -0.8, 1.7]} intensity={0.34} color={palette.ring} distance={4.8} />
      <PaletteWash
        palette={palette}
        palettePulseToken={palettePulseToken}
        audioRef={audioRef}
        gestureRef={gestureRef}
        reducedMotionRef={reducedMotionRef}
        visualIntensityRef={visualIntensityRef}
        interactionDebugRef={interactionDebugRef}
      />
      <DepthTunnel
        palette={palette}
        palettePulseToken={palettePulseToken}
        audioRef={audioRef}
        gestureRef={gestureRef}
        reducedMotionRef={reducedMotionRef}
        visualIntensityRef={visualIntensityRef}
        handInfluenceRef={handInfluenceRef}
        interactionDebugRef={interactionDebugRef}
      />
      <SpectrumHalo
        palette={palette}
        palettePulseToken={palettePulseToken}
        audioRef={audioRef}
        gestureRef={gestureRef}
        reducedMotionRef={reducedMotionRef}
        visualIntensityRef={visualIntensityRef}
        handInfluenceRef={handInfluenceRef}
        interactionDebugRef={interactionDebugRef}
      />
      <ResonanceGlassyBlobs
        palette={palette}
        audioRef={audioRef}
        gestureRef={gestureRef}
        reducedMotionRef={reducedMotionRef}
        visualIntensityRef={visualIntensityRef}
        handInfluenceRef={handInfluenceRef}
        interactionDebugRef={interactionDebugRef}
        wakeHistoryRef={wakeHistoryRef}
      />
      <CoreSoundBody
        palette={palette}
        palettePulseToken={palettePulseToken}
        audioRef={audioRef}
        gestureRef={gestureRef}
        reducedMotionRef={reducedMotionRef}
        visualIntensityRef={visualIntensityRef}
        handInfluenceRef={handInfluenceRef}
        interactionDebugRef={interactionDebugRef}
        wakeHistoryRef={wakeHistoryRef}
      />
      <WaveformRing
        palette={palette}
        palettePulseToken={palettePulseToken}
        audioRef={audioRef}
        gestureRef={gestureRef}
        reducedMotionRef={reducedMotionRef}
        visualIntensityRef={visualIntensityRef}
        handInfluenceRef={handInfluenceRef}
        trailStrengthRef={trailStrengthRef}
        interactionDebugRef={interactionDebugRef}
        wakeHistoryRef={wakeHistoryRef}
      />
      <HandTrailRibbon
        palette={palette}
        gestureRef={gestureRef}
        reducedMotionRef={reducedMotionRef}
        handInfluenceRef={handInfluenceRef}
        trailStrengthRef={trailStrengthRef}
        interactionDebugRef={interactionDebugRef}
        wakeHistoryRef={wakeHistoryRef}
      />
      <ParticleLayer
        count={520}
        radius={4.2}
        colorA={palette.dustA}
        colorB={palette.dustB}
        reactiveColor={palette.ring}
        size={0.009}
        opacity={0.11}
        layer="dust"
        palette={palette}
        palettePulseToken={palettePulseToken}
        audioRef={audioRef}
        gestureRef={gestureRef}
        reducedMotionRef={reducedMotionRef}
        visualIntensityRef={visualIntensityRef}
        handInfluenceRef={handInfluenceRef}
        trailStrengthRef={trailStrengthRef}
        interactionDebugRef={interactionDebugRef}
        wakeHistoryRef={wakeHistoryRef}
      />
      <ParticleLayer
        count={90}
        radius={2.8}
        colorA={palette.spark}
        colorB={palette.ring}
        reactiveColor={palette.hot}
        size={0.017}
        opacity={0.18}
        layer="sparks"
        palette={palette}
        palettePulseToken={palettePulseToken}
        audioRef={audioRef}
        gestureRef={gestureRef}
        reducedMotionRef={reducedMotionRef}
        visualIntensityRef={visualIntensityRef}
        handInfluenceRef={handInfluenceRef}
        trailStrengthRef={trailStrengthRef}
        interactionDebugRef={interactionDebugRef}
        wakeHistoryRef={wakeHistoryRef}
      />
      <InteractionDebugHelpers
        gestureRef={gestureRef}
        handInfluenceRef={handInfluenceRef}
        trailStrengthRef={trailStrengthRef}
        interactionDebugRef={interactionDebugRef}
        wakeHistoryRef={wakeHistoryRef}
      />
    </>
  );
}

export function ResonanceParticleField({
  audio,
  gestureControls,
  palette,
  palettePulseToken,
  visualIntensity,
  handInfluence,
  trailStrength,
  interactionDebug,
  onDebugMetrics
}: ResonanceParticleFieldProps) {
  const audioRef = useRef<AudioSnapshot>(quietAudio);
  const gestureRef = useRef<GestureControls>(createNeutralGestureControls());
  const visualIntensityRef = useRef(visualIntensity);
  const handInfluenceRef = useRef(handInfluence);
  const trailStrengthRef = useRef(trailStrength);
  const interactionDebugRef = useRef(interactionDebug);
  const wakeHistoryRef = useRef<WakeSample[]>(
    Array.from({ length: WAKE_HISTORY_LENGTH }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      strength: 0,
      ageMs: WAKE_SAMPLE_LIFETIME_MS + 1,
      active: false
    }))
  );
  const wakeWriteIndexRef = useRef(0);
  const previousWakePosRef = useRef<{ x: number; y: number } | null>(null);
  const lastMetricsPushAtRef = useRef(0);
  const lastBurstTokenRef = useRef(gestureControls.burstToken);
  const lastBurstAtRef = useRef(0);
  const reducedMotionRef = useReducedMotionRef();

  useEffect(() => {
    audioRef.current = {
      volume: audio.volume,
      bass: audio.bass,
      mids: audio.mids,
      highs: audio.highs,
      onset: audio.onset,
      beat: audio.beat,
      beatActivity: audio.beatActivity,
      brightness: audio.brightness,
      onsetRate: audio.onsetRate,
      energyVariance: audio.energyVariance,
      hype: audio.hype,
      calm: audio.calm,
      waveform: audio.waveform
    };
  }, [
    audio.bass,
    audio.beat,
    audio.beatActivity,
    audio.brightness,
    audio.calm,
    audio.energyVariance,
    audio.highs,
    audio.hype,
    audio.mids,
    audio.onset,
    audio.onsetRate,
    audio.volume,
    audio.waveform
  ]);

  useEffect(() => {
    gestureRef.current = gestureControls;
  }, [gestureControls]);

  useEffect(() => {
    visualIntensityRef.current = visualIntensity;
  }, [visualIntensity]);

  useEffect(() => {
    handInfluenceRef.current = handInfluence;
  }, [handInfluence]);

  useEffect(() => {
    trailStrengthRef.current = trailStrength;
  }, [trailStrength]);

  useEffect(() => {
    interactionDebugRef.current = interactionDebug;
  }, [interactionDebug]);

  useEffect(() => {
    const now = performance.now();
    const history = wakeHistoryRef.current;

    for (let index = 0; index < history.length; index += 1) {
      const sample = history[index];

      if (sample.active) {
        sample.ageMs += 16;
        sample.strength = THREE.MathUtils.clamp(1 - sample.ageMs / WAKE_SAMPLE_LIFETIME_MS, 0, 1);
        if (sample.ageMs > WAKE_SAMPLE_LIFETIME_MS) {
          sample.active = false;
          sample.strength = 0;
        }
      }
    }

    const prev = previousWakePosRef.current;
    const current = {
      x: gestureControls.attractor.x,
      y: gestureControls.attractor.y
    };

    if (prev) {
      const dx = current.x - prev.x;
      const dy = current.y - prev.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > WAKE_SAMPLE_MIN_SPEED) {
        const slot = wakeHistoryRef.current[wakeWriteIndexRef.current];

        slot.x = current.x;
        slot.y = current.y;
        slot.vx = dx;
        slot.vy = dy;
        slot.ageMs = 0;
        slot.strength = THREE.MathUtils.clamp(speed * 8, 0, 1);
        slot.active = true;

        wakeWriteIndexRef.current = (wakeWriteIndexRef.current + 1) % WAKE_HISTORY_LENGTH;
      }
    }

    previousWakePosRef.current = current;
    void now;
  }, [gestureControls.attractor.x, gestureControls.attractor.y]);

  useEffect(() => {
    if (!onDebugMetrics) {
      return;
    }

    const now = performance.now();
    const elapsed = now - lastMetricsPushAtRef.current;

    if (elapsed < 85) {
      return;
    }

    lastMetricsPushAtRef.current = now;
    const gesture = gestureControls;
    if (gesture.burstToken !== lastBurstTokenRef.current) {
      lastBurstTokenRef.current = gesture.burstToken;
      lastBurstAtRef.current = now;
    }
    const wakeMagnitude = Math.min(
      1,
      Math.sqrt(gesture.wake.x * gesture.wake.x + gesture.wake.y * gesture.wake.y)
    );

    onDebugMetrics({
      influenceRadius: 0.5 * handInfluence,
      displacementStrength: gesture.attractor.strength * handInfluence,
      wakeStrength: wakeMagnitude * handInfluence,
      compression: gesture.compression,
      freezeDamping: gesture.freeze,
      burstActive: now - lastBurstAtRef.current < 900,
      blobLocalPull: gesture.attractor.strength * gesture.handPresence * handInfluence * 0.48,
      blobWakeDrag: wakeMagnitude * (0.26 + gesture.movementEnergy * 1.05) * handInfluence,
      waveformBend: wakeMagnitude * (0.08 + gesture.movementEnergy * 0.12 * trailStrength),
      particleAttractor: gesture.attractor.strength * handInfluence * 0.22,
      tunnelDisturbance: wakeMagnitude * handInfluence,
      trailEmission: Math.max(gesture.movementEnergy * 3.2, wakeMagnitude) * trailStrength,
      trailDirectFromHand: false,
      trailFieldDerived: true
    });
  }, [gestureControls, handInfluence, onDebugMetrics, trailStrength]);

  return (
    <div className="absolute inset-0 z-10">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 48 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.background = null;
          const pmremGenerator = new THREE.PMREMGenerator(gl);
          const roomEnvironment = new RoomEnvironment();
          const envTexture = pmremGenerator.fromScene(roomEnvironment).texture;

          scene.environment = envTexture;
          roomEnvironment.dispose();
          pmremGenerator.dispose();
        }}
        style={{ background: "transparent" }}
      >
        <ResonanceScene
          audioRef={audioRef}
          gestureRef={gestureRef}
          palette={palette}
          palettePulseToken={palettePulseToken}
          reducedMotionRef={reducedMotionRef}
          visualIntensityRef={visualIntensityRef}
          handInfluenceRef={handInfluenceRef}
          trailStrengthRef={trailStrengthRef}
          interactionDebugRef={interactionDebugRef}
          wakeHistoryRef={wakeHistoryRef}
        />
      </Canvas>
    </div>
  );
}
