import type { HandTrackerState, TrackedHand } from "@/hooks/use-hand-tracker";

export type GestureControls = {
  enabled: boolean;
  attractor: {
    x: number;
    y: number;
    strength: number;
  };
  wake: {
    x: number;
    y: number;
  };
  compression: number;
  energy: number;
  paletteHeat: number;
  handPresence: number;
  twoHandScale: number;
  freeze: number;
  movementEnergy: number;
  burstToken: number;
  primaryLabel: string;
};

const OPEN_PALM_BURST_COOLDOWN_MS = 700;

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function getHandLabel(hand: TrackedHand | null) {
  return hand?.handedness ?? "none";
}

export function createNeutralGestureControls(burstToken = 0): GestureControls {
  return {
    enabled: false,
    attractor: {
      x: 0,
      y: 0,
      strength: 0
    },
    wake: {
      x: 0,
      y: 0
    },
    compression: 0,
    energy: 0.25,
    paletteHeat: 0,
    handPresence: 0,
    twoHandScale: 0.5,
    freeze: 0,
    movementEnergy: 0,
    burstToken,
    primaryLabel: "none"
  };
}

export function deriveGestureControls({
  tracker,
  previousOpenPalm,
  lastBurstAt,
  burstToken,
  previousPrimaryPalm,
  now
}: {
  tracker: HandTrackerState;
  previousOpenPalm: boolean;
  lastBurstAt: number;
  burstToken: number;
  previousPrimaryPalm: { x: number; y: number } | null;
  now: number;
}) {
  const primaryHand = tracker.primaryHand;
  const secondaryHand = tracker.secondaryHand;
  const primaryOpenPalm = Boolean(primaryHand?.openPalm);
  const anyFist = tracker.hands.some((hand) => hand.fist);
  let nextBurstToken = burstToken;
  let nextLastBurstAt = lastBurstAt;

  if (primaryOpenPalm && !previousOpenPalm && now - lastBurstAt > OPEN_PALM_BURST_COOLDOWN_MS) {
    nextBurstToken += 1;
    nextLastBurstAt = now;
  }

  if (!primaryHand) {
    return {
      controls: createNeutralGestureControls(nextBurstToken),
      openPalm: primaryOpenPalm,
      lastBurstAt: nextLastBurstAt,
      burstToken: nextBurstToken,
      primaryPalm: null
    };
  }

  const secondaryEnergy = secondaryHand ? 1 - secondaryHand.pinch : 0.25;
  const paletteHeat = secondaryHand ? secondaryEnergy : 0;
  const movementEnergy = clamp01(
    Math.max(primaryHand.movementSpeed, secondaryHand?.movementSpeed ?? 0)
  );
  const primaryPalm = {
    x: primaryHand.palm.x,
    y: primaryHand.palm.y
  };
  const wake =
    previousPrimaryPalm === null
      ? { x: 0, y: 0 }
      : {
          x: clamp01(Math.abs(primaryPalm.x - previousPrimaryPalm.x) * 6) *
            Math.sign(primaryPalm.x - previousPrimaryPalm.x),
          y: clamp01(Math.abs(primaryPalm.y - previousPrimaryPalm.y) * 6) *
            Math.sign(primaryPalm.y - previousPrimaryPalm.y)
        };
  const twoHandScale =
    tracker.twoHandDistance === null ? 0.5 : clamp01((tracker.twoHandDistance - 0.12) / 0.58);

  return {
    controls: {
      enabled: true,
      attractor: {
        x: (primaryHand.palm.x - 0.5) * 4.4,
        y: (0.5 - primaryHand.palm.y) * 3.0,
        strength: 0.34
      },
      wake,
      compression: clamp01(primaryHand.pinch),
      energy: clamp01(secondaryEnergy * 0.25 + movementEnergy * 0.55 + 0.2),
      paletteHeat: clamp01(paletteHeat),
      handPresence: 1,
      twoHandScale,
      freeze: anyFist ? 1 : 0,
      movementEnergy,
      burstToken: nextBurstToken,
      primaryLabel: getHandLabel(primaryHand)
    },
    openPalm: primaryOpenPalm,
    lastBurstAt: nextLastBurstAt,
    burstToken: nextBurstToken,
    primaryPalm
  };
}
