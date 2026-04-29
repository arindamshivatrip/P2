import type { AudioAnalyzerValues } from "@/hooks/use-audio-analyzer";

type AudioDebugPanelProps = {
  audio: Pick<
    AudioAnalyzerValues,
    | "volume"
    | "bass"
    | "mids"
    | "highs"
    | "onset"
    | "beat"
    | "beatActivity"
    | "bpm"
    | "bpmConfidence"
    | "brightness"
    | "onsetRate"
    | "energyVariance"
    | "hype"
    | "calm"
    | "isListening"
  >;
};

const meters: Array<{
  key:
    | "volume"
    | "bass"
    | "mids"
    | "highs"
    | "onset"
    | "beatActivity"
    | "brightness"
    | "onsetRate"
    | "energyVariance"
    | "hype"
    | "calm"
    | "bpmConfidence";
  label: string;
}> = [
  { key: "volume", label: "Volume" },
  { key: "bass", label: "Bass" },
  { key: "mids", label: "Mids" },
  { key: "highs", label: "Highs" },
  { key: "onset", label: "Onset" },
  { key: "beatActivity", label: "Rhythm Activity" },
  { key: "brightness", label: "Brightness" },
  { key: "onsetRate", label: "Onset Rate" },
  { key: "energyVariance", label: "Energy Variance" },
  { key: "hype", label: "Hype" },
  { key: "calm", label: "Calm" },
  { key: "bpmConfidence", label: "BPM Confidence" }
];

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function getConfidenceLabel(value: number) {
  if (value >= 0.68) {
    return "high";
  }

  if (value >= 0.34) {
    return "medium";
  }

  if (value > 0) {
    return "low";
  }

  return "listening";
}

function getMoodLabel(hype: number) {
  if (hype >= 0.65) {
    return "Hype";
  }

  if (hype >= 0.35) {
    return "Building";
  }

  return "Calm";
}

export function AudioDebugPanel({ audio }: AudioDebugPanelProps) {
  return (
    <section
      aria-label="Audio analysis preview"
      className="w-full rounded-[0.85rem] border border-white/10 bg-white/[0.06] p-4 text-left shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-body text-sm font-medium text-[#f5f7fa]">Audio debug</h2>
        <span className="font-body text-xs text-[#a8b0bb]">
          {audio.isListening ? "Mic active" : "Mic idle"}
        </span>
      </div>
      <p className="mt-2 font-body text-xs text-[#d7dde5]">
        Mood: <span className="text-[#f5f7fa]">{getMoodLabel(audio.hype)}</span>
      </p>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {meters.map((meter) => (
          <div key={meter.key}>
            <div className="flex items-center justify-between gap-4 font-body text-xs text-[#d7dde5]">
              <dt>{meter.label}</dt>
              <dd>{formatPercent(audio[meter.key])}</dd>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full bg-[#b8f0ff]/75 transition-[width] duration-100"
                style={{ width: formatPercent(audio[meter.key]) }}
              />
            </div>
          </div>
        ))}
      </dl>

      <p className="mt-4 font-body text-sm text-[#d7dde5]" aria-live="polite">
        Beat Pulse:{" "}
        <span className="inline-flex items-center gap-2 text-[#f5f7fa]">
          <span
            className="h-2 w-2 rounded-full bg-[#b8f0ff]"
            style={{ opacity: audio.beat ? 1 : 0.22 }}
            aria-hidden="true"
          />
          {audio.beat ? "flash" : "idle"}
        </span>
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/10 pt-3 font-body text-xs text-[#d7dde5]">
        <div>
          <p className="text-[#a8b0bb]">Estimated BPM</p>
          <p className="mt-1 text-base text-[#f5f7fa]">{audio.bpm ?? "-"}</p>
        </div>
        <div>
          <p className="text-[#a8b0bb]">Confidence</p>
          <p className="mt-1 text-base text-[#f5f7fa]">
            {getConfidenceLabel(audio.bpmConfidence)}
          </p>
        </div>
      </div>
      <p className="mt-3 font-body text-xs leading-relaxed text-[#a8b0bb]">
        Beat Pulse is momentary. Rhythm Activity shows recent beat energy.
      </p>
    </section>
  );
}
