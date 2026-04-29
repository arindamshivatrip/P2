import type { HandTrackerState, TrackedHand } from "@/hooks/use-hand-tracker";
import type { GestureControls } from "./gesture-controls";

type HandDebugPanelProps = {
  tracker: HandTrackerState;
  gestureControls: GestureControls;
  paletteName: string;
};

function formatPercent(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "-";
  }

  return `${Math.round(value * 100)}%`;
}

function getCameraStatus(tracker: HandTrackerState) {
  if (tracker.error) {
    return "blocked";
  }

  if (tracker.isInitializing) {
    return "initializing";
  }

  if (tracker.isTracking) {
    return "active";
  }

  return "inactive";
}

function HandSummary({ label, hand }: { label: string; hand: TrackedHand | null }) {
  return (
    <div className="rounded-[0.7rem] border border-white/10 bg-white/[0.04] p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-body text-xs font-medium text-[#f5f7fa]">{label}</p>
        <p className="font-body text-xs text-[#a8b0bb]">{hand?.handedness ?? "-"}</p>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 font-body text-xs text-[#d7dde5]">
        <div>
          <dt className="text-[#a8b0bb]">Pinch</dt>
          <dd>{formatPercent(hand?.pinch)}</dd>
        </div>
        <div>
          <dt className="text-[#a8b0bb]">Open</dt>
          <dd>{formatPercent(hand?.openness)}</dd>
        </div>
        <div>
          <dt className="text-[#a8b0bb]">Speed</dt>
          <dd>{formatPercent(hand?.movementSpeed)}</dd>
        </div>
        <div>
          <dt className="text-[#a8b0bb]">Palm</dt>
          <dd>
            {hand ? `${Math.round(hand.palm.x * 100)}, ${Math.round(hand.palm.y * 100)}` : "-"}
          </dd>
        </div>
        <div>
          <dt className="text-[#a8b0bb]">Open palm</dt>
          <dd>{hand ? (hand.openPalm ? "yes" : "no") : "-"}</dd>
        </div>
        <div>
          <dt className="text-[#a8b0bb]">Fist</dt>
          <dd>{hand ? (hand.fist ? "yes" : "no") : "-"}</dd>
        </div>
      </dl>
    </div>
  );
}

export function HandDebugPanel({ tracker, gestureControls, paletteName }: HandDebugPanelProps) {
  return (
    <section
      aria-label="Hand tracking preview"
      className="w-full rounded-[0.85rem] border border-white/10 bg-white/[0.06] p-4 text-left shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-body text-sm font-medium text-[#f5f7fa]">Hand debug</h2>
        <span className="font-body text-xs text-[#a8b0bb]">Camera {getCameraStatus(tracker)}</span>
      </div>
      <p className="mt-2 font-body text-xs text-[#d7dde5]">
        Hands detected: <span className="text-[#f5f7fa]">{tracker.hands.length}</span>
      </p>

      {tracker.error ? (
        <p
          role="alert"
          className="mt-3 rounded-[0.7rem] border border-red-300/25 bg-red-400/10 px-3 py-2 font-body text-xs leading-relaxed text-red-100"
        >
          {tracker.error}
        </p>
      ) : null}

      <div className="mt-3 space-y-3">
        <HandSummary label="Primary hand" hand={tracker.primaryHand} />
        <HandSummary label="Secondary hand" hand={tracker.secondaryHand} />
      </div>

      <p className="mt-3 font-body text-xs text-[#d7dde5]">
        Two-hand distance:{" "}
        <span className="text-[#f5f7fa]">{formatPercent(tracker.twoHandDistance)}</span>
      </p>
      <div className="mt-3 border-t border-white/10 pt-3 font-body text-xs text-[#d7dde5]">
        <p>
          Hand control:{" "}
          <span className="text-[#f5f7fa]">{gestureControls.enabled ? "active" : "inactive"}</span>
        </p>
        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
          <p>Primary: {gestureControls.primaryLabel}</p>
          <p>Freeze: {gestureControls.freeze > 0.5 ? "active" : "inactive"}</p>
          <p className="col-span-2">Palette: {paletteName}</p>
          <p className="col-span-2 text-[#a8b0bb]">Pinch-hold for palette selector. P / Shift+P cycles.</p>
          <p>Compression: {formatPercent(gestureControls.compression)}</p>
          <p>Palette heat: {formatPercent(gestureControls.paletteHeat)}</p>
          <p>Scale: {formatPercent(gestureControls.twoHandScale)}</p>
          <p>Motion: {formatPercent(gestureControls.movementEnergy)}</p>
        </div>
      </div>
    </section>
  );
}
