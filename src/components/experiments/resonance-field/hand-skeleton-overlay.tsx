import type { HandTrackerState, Handedness } from "@/hooks/use-hand-tracker";
import type { VideoDisplayRect } from "./camera-framing";

type HandSkeletonOverlayProps = {
  tracker: HandTrackerState;
  displayRect: VideoDisplayRect | null;
};

const handConnections = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [0, 17]
] as const;

function getHandColor(handedness: Handedness) {
  if (handedness === "Right") {
    return "#22D3EE";
  }

  if (handedness === "Left") {
    return "#EC4899";
  }

  return "#8B5CF6";
}

function mapX(x: number, displayRect: VideoDisplayRect | null) {
  if (!displayRect) {
    return x * 100;
  }

  return displayRect.x + x * displayRect.width;
}

function mapY(y: number, displayRect: VideoDisplayRect | null) {
  if (!displayRect) {
    return y * 100;
  }

  return displayRect.y + y * displayRect.height;
}

export function HandSkeletonOverlay({ tracker, displayRect }: HandSkeletonOverlayProps) {
  if (!tracker.hands.length) {
    return null;
  }

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <filter id="resonance-hand-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {tracker.hands.map((hand) => {
        const color = getHandColor(hand.handedness);

        return (
          <g key={hand.id} filter="url(#resonance-hand-glow)">
            {handConnections.map(([startIndex, endIndex]) => {
              const start = hand.landmarks[startIndex];
              const end = hand.landmarks[endIndex];

              if (!start || !end) {
                return null;
              }

              return (
                <line
                  key={`${startIndex}-${endIndex}`}
                  x1={mapX(start.x, displayRect)}
                  y1={mapY(start.y, displayRect)}
                  x2={mapX(end.x, displayRect)}
                  y2={mapY(end.y, displayRect)}
                  stroke={color}
                  strokeOpacity="0.72"
                  strokeWidth="0.16"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
            {hand.landmarks.map((landmark, index) => (
              <circle
                key={index}
                cx={mapX(landmark.x, displayRect)}
                cy={mapY(landmark.y, displayRect)}
                r={index === 0 ? 0.56 : 0.34}
                fill={index === 0 ? "#B8F0FF" : color}
                fillOpacity={index === 0 ? 0.9 : 0.78}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
