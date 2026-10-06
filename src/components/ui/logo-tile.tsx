import type { ProjectLogoTile } from "@/types/project";
import { cn } from "@/lib/utils";
import styles from "./logo-tile.module.css";

type LogoTileProps = {
  logo: ProjectLogoTile;
  size?: "sm" | "lg";
};

type SceneProps = {
  logo: ProjectLogoTile;
  size: "sm" | "lg";
  className?: string;
};

const ANDROID_GREEN = "#3ddc84";

function LogoMark({ logo, size }: SceneProps) {
  if (logo.src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo.src}
        alt={logo.alt}
        className={cn("block h-auto w-auto object-contain", size === "lg" ? "max-h-28 max-w-[22rem]" : "max-h-16 max-w-[13rem]")}
        decoding="async"
      />
    );
  }

  return (
    <span
      className={cn(
        "font-display leading-none tracking-tight",
        size === "lg" ? "text-[clamp(2.6rem,6vw,4.2rem)]" : "text-[2.4rem]"
      )}
      style={{ color: logo.foreground ?? "#f5f4ed" }}
    >
      {logo.wordmark}
    </span>
  );
}

function ZoomScene({ logo, size }: SceneProps) {
  return (
    <div className={styles.zoom}>
      <LogoMark logo={logo} size={size} />
    </div>
  );
}

// A faint ghost of the mark is scanned into solid form by a sweeping laser
// line over a drifting dot grid — a nod to 3D scanning.
function ScanScene({ logo, size }: SceneProps) {
  return (
    <>
      <div className={cn("absolute inset-0", styles.scanGrid)} aria-hidden="true" />
      <div className={styles.scanStage}>
        <div className={styles.scanGhost} aria-hidden="true">
          <LogoMark logo={{ ...logo, alt: "" }} size={size} />
        </div>
        <div className={styles.scanReveal}>
          <LogoMark logo={logo} size={size} />
        </div>
        <div className={styles.scanTrack} aria-hidden="true" />
      </div>
    </>
  );
}

// The Android robot walks in, an anchor ring pulses where it stops, smart
// glasses drop onto its face, then the Android XR wordmark slides in.
// The Android robot is reproduced or modified from work created and shared by
// Google and used according to the terms of the Creative Commons 3.0
// Attribution License.
function AndroidWalkScene({ logo, size, className }: SceneProps) {
  const bg = "#0b1533";

  return (
    <svg
      viewBox="0 0 460 170"
      role="img"
      aria-label={logo.alt}
      className={cn(
        "h-auto",
        styles.walkScene,
        className ?? (size === "lg" ? "w-[min(30rem,82%)]" : "w-[min(17rem,84%)]")
      )}
    >
      <g className={styles.walker}>
        <g transform="translate(36 30) scale(1.15)">
          <ellipse className={styles.ring} cx="30" cy="104" rx="36" ry="7" fill="none" stroke={ANDROID_GREEN} strokeWidth="1.6" />
          <ellipse
            className={cn(styles.ring, styles.ringLate)}
            cx="30"
            cy="104"
            rx="36"
            ry="7"
            fill="none"
            stroke={ANDROID_GREEN}
            strokeWidth="1.2"
          />
          <g className={styles.bob} fill={ANDROID_GREEN}>
            <rect className={styles.legA} x="13" y="72" width="10" height="28" rx="5" />
            <rect className={styles.legB} x="37" y="72" width="10" height="28" rx="5" />
            <rect className={styles.armA} x="-13" y="35" width="10" height="34" rx="5" />
            <rect className={styles.armB} x="63" y="35" width="10" height="34" rx="5" />
            <path d="M0 34h60v38a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z" />
            <g className={styles.head}>
              <path d="M0 30a30 30 0 0 1 60 0z" />
              <path d="M15 7 9-3M45 7l6-10" stroke={ANDROID_GREEN} strokeWidth="3.2" strokeLinecap="round" />
              <circle cx="19" cy="17" r="3.2" fill={bg} />
              <circle cx="41" cy="17" r="3.2" fill={bg} />
              <g className={styles.glasses} fill="rgba(140, 205, 255, 0.28)" stroke="#f5f4ed" strokeWidth="2.2" strokeLinejoin="round">
                <rect x="9.5" y="10.5" width="18" height="13" rx="4.5" />
                <rect x="32.5" y="10.5" width="18" height="13" rx="4.5" />
                <path d="M27.5 16h5M9.5 15H2M50.5 15H58" fill="none" strokeLinecap="round" />
              </g>
            </g>
          </g>
        </g>
      </g>
      {logo.src ? (
        <image className={styles.wordmark} href={logo.src} x="146" y="61" width="300" height="48.5" />
      ) : (
        <text className={styles.wordmark} x="146" y="100" fill="#f5f4ed" fontSize="44">
          {logo.wordmark}
        </text>
      )}
    </svg>
  );
}

// "Aura" glows with a slowly flowing gradient; "Desk" slides out from behind it
// standing on a small desk, and a couple of glanceable widgets light up on the
// desktop. The Android robot scene shrinks to a corner badge.
function AuraDeskScene({ logo, size }: SceneProps) {
  return (
    <>
      <div className={styles.auraBlobs} aria-hidden="true" />
      <div
        role="img"
        aria-label="Aura Desk"
        className={cn(
          "relative z-10 flex items-baseline font-display leading-none tracking-tight",
          size === "lg" ? "text-[clamp(3.6rem,9vw,6.4rem)]" : "text-[clamp(2.6rem,9cqw,3.4rem)]",
          styles.auraTitle
        )}
      >
        <span aria-hidden="true" className={styles.auraWordWrap}>
          <span className={styles.auraGlow}>Aura</span>
          <span className={styles.auraWord}>Aura</span>
        </span>
        <span aria-hidden="true" className={styles.deskReveal}>
          <span className={styles.deskSlide}>
            <span className={styles.deskWord}>Desk</span>
            <svg className={styles.desk} viewBox="0 0 100 34" preserveAspectRatio="none">
              <rect x="0" y="0" width="100" height="5" rx="2.5" fill="#f5f4ed" opacity="0.9" />
              <rect x="7" y="5" width="4" height="29" rx="1.5" fill="#f5f4ed" opacity="0.55" />
              <rect x="89" y="5" width="4" height="29" rx="1.5" fill="#f5f4ed" opacity="0.55" />
            </svg>
            <span className={cn(styles.widget, styles.widgetA)} />
            <span className={cn(styles.widget, styles.widgetB)} />
          </span>
        </span>
      </div>
      <div className={cn("absolute z-10", size === "lg" ? "bottom-5 right-5" : "bottom-3 right-3")}>
        <AndroidWalkScene logo={logo} size={size} className={size === "lg" ? "w-[13rem]" : "w-[8.5rem]"} />
      </div>
    </>
  );
}

type DashCard = {
  kind: "bars" | "line" | "donut" | "rows" | "spark" | "dots";
  layer: "back" | "front";
  box: [left: number, top: number, width: number, height: number];
  tone: "lavender" | "mint" | "peach" | "sky" | "butter" | "rose";
  drift: "a" | "b" | "c";
  duration: number;
};

// Abstract on purpose: shapes that read as "planning dashboard" without any
// labels, numbers, or anything from the real tools.
const DASH_CARDS: DashCard[] = [
  { kind: "bars", layer: "back", box: [-3, 5, 30, 40], tone: "lavender", drift: "a", duration: 27 },
  { kind: "line", layer: "back", box: [69, 57, 36, 40], tone: "mint", drift: "b", duration: 30 },
  { kind: "donut", layer: "back", box: [75, -7, 22, 38], tone: "peach", drift: "c", duration: 24 },
  { kind: "rows", layer: "back", box: [1, 63, 26, 30], tone: "sky", drift: "b", duration: 34 },
  { kind: "spark", layer: "front", box: [33, 75, 19, 17], tone: "butter", drift: "c", duration: 19 },
  { kind: "bars", layer: "front", box: [58, 7, 15, 21], tone: "rose", drift: "a", duration: 18 },
  { kind: "dots", layer: "front", box: [6, 44, 13, 16], tone: "peach", drift: "b", duration: 21 },
  { kind: "donut", layer: "front", box: [84, 40, 11, 19], tone: "sky", drift: "a", duration: 22 }
];

const LINE_PATH = "M0 32 C12 30 18 22 30 24 S48 12 60 16 S82 6 100 4";
const SPARK_PATH = "M0 20 C15 8 25 26 40 14 S65 4 75 16 S92 10 100 6";

function DashCardContent({ kind }: { kind: DashCard["kind"] }) {
  if (kind === "bars") {
    return (
      <div className={styles.bars}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={styles.bar} style={{ animationDelay: `${-i * 0.55}s` }} />
        ))}
      </div>
    );
  }
  if (kind === "line" || kind === "spark") {
    const d = kind === "line" ? LINE_PATH : SPARK_PATH;
    return (
      <svg viewBox="0 0 100 36" preserveAspectRatio="none" className={styles.lineChart}>
        {kind === "line" ? <path className={styles.area} d={d + " L100 36 L0 36 Z"} /> : null}
        <path className={styles.linePath} d={d} fill="none" strokeWidth="2.4" strokeLinecap="round" pathLength="100" />
      </svg>
    );
  }
  if (kind === "donut") {
    return (
      <svg viewBox="0 0 36 36" className={styles.donut}>
        <circle cx="18" cy="18" r="12" fill="none" className={styles.donutTrack} strokeWidth="5.5" />
        <circle className={styles.donutArc} cx="18" cy="18" r="12" fill="none" strokeWidth="5.5" pathLength="100" />
      </svg>
    );
  }
  if (kind === "dots") {
    return (
      <div className={styles.dots}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={styles.dot} style={{ animationDelay: `${-i * 0.4}s` }} />
        ))}
      </div>
    );
  }
  return (
    <div className={styles.rows}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={styles.row} style={{ animationDelay: `${-i * 0.7}s` }} />
      ))}
    </div>
  );
}

// Two layers of pastel cards drift behind the wordmark at different speeds: a
// soft-focus back layer and a smaller, sharper front layer, all kept to the
// edges so the name stays the focus.
function DashboardScene({ logo, size }: SceneProps) {
  return (
    <div className={cn("absolute inset-0", styles.dash)}>
      {DASH_CARDS.map((card, i) => {
        const [left, top, width, height] = card.box;
        return (
          <div
            key={i}
            aria-hidden="true"
            className={cn(
              styles.card,
              styles[`layer-${card.layer}`],
              styles[`tone-${card.tone}`],
              styles[`drift-${card.drift}`]
            )}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${width}%`,
              height: `${height}%`,
              animationDuration: `${card.duration}s`,
              animationDelay: `${-i * 1.7}s`
            }}
          >
            <DashCardContent kind={card.kind} />
          </div>
        );
      })}
      <div className={styles.wordmarkPlate}>
        <LogoMark logo={logo} size={size} />
      </div>
    </div>
  );
}

// Brand tile for projects without a cover or video. Each project picks its own
// motion so the tiles don't all move the same way.
export function LogoTile({ logo, size = "sm" }: LogoTileProps) {
  const motion = logo.motion ?? "zoom";

  return (
    <div
      className={cn("absolute inset-0 flex items-center justify-center overflow-hidden", styles.tile)}
      style={{ backgroundImage: logo.background }}
    >
      {motion === "aura-desk" ? (
        <AuraDeskScene logo={logo} size={size} />
      ) : motion === "dashboard" ? (
        <DashboardScene logo={logo} size={size} />
      ) : motion === "android-walk" ? (
        <AndroidWalkScene logo={logo} size={size} />
      ) : motion === "scan" ? (
        <ScanScene logo={logo} size={size} />
      ) : (
        <ZoomScene logo={logo} size={size} />
      )}
    </div>
  );
}
