// Tiny generated interaction sounds — no audio files, no dependencies. Every
// call happens inside a user-gesture handler (the AudioContext is created
// lazily on first use, so nothing can autoplay). Sounds are very quiet, under
// 150ms, throttled against spam, disabled under prefers-reduced-motion, and
// always optional: no interaction depends on hearing them.

let context: AudioContext | null = null;
let muted = false;
let lastPlayedAt = 0;

const THROTTLE_MS = 90;

export function setSoundMuted(value: boolean) {
  muted = value;
}

export function isSoundMuted() {
  return muted;
}

function canPlay(): boolean {
  if (muted || typeof window === "undefined") {
    return false;
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }
  const now = performance.now();
  if (now - lastPlayedAt < THROTTLE_MS) {
    return false;
  }
  lastPlayedAt = now;
  return true;
}

function getContext(): AudioContext | null {
  try {
    if (!context) {
      context = new AudioContext();
    }
    if (context.state === "suspended") {
      void context.resume();
    }
    return context;
  } catch {
    return null;
  }
}

// A short pitched blip with a fast exponential decay.
function blip(frequency: number, duration: number, type: OscillatorType, peak: number) {
  const ctx = getContext();
  if (!ctx) {
    return;
  }
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(peak, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
}

// A short filtered noise burst (paper / key / scatter textures).
function noiseBurst(duration: number, filterFrequency: number, peak: number) {
  const ctx = getContext();
  if (!ctx) {
    return;
  }
  const length = Math.ceil(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = filterFrequency;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(peak, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start();
}

export const interactionSounds = {
  // journey route / crossroads: soft map tick
  tick: () => {
    if (canPlay()) {
      blip(1400, 0.05, "square", 0.02);
    }
  },
  // split-flap board: tiny flap
  flap: () => {
    if (canPlay()) {
      blip(820, 0.06, "triangle", 0.025);
    }
  },
  // terminal: very soft key tap
  key: () => {
    if (canPlay()) {
      noiseBurst(0.045, 3800, 0.02);
    }
  },
  // intentional: clean snap
  snap: () => {
    if (canPlay()) {
      blip(520, 0.04, "triangle", 0.03);
      blip(1560, 0.05, "sine", 0.02);
    }
  },
  // overwhelming: brief soft scatter
  scatter: () => {
    if (canPlay()) {
      noiseBurst(0.13, 900, 0.018);
    }
  },
  // polaroid: subtle card slide
  card: () => {
    if (canPlay()) {
      noiseBurst(0.1, 1600, 0.02);
    }
  }
};
