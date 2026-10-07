import type { CSSProperties } from "react";
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

type CssVars = CSSProperties & Record<`--${string}`, string | number>;

/* ---------- diary-clusters: phone moments -> diary cards -> clusters ---------- */

type Mood = "stress" | "boredom" | "calm";

type DiaryMoment = {
  mood: Mood;
  // Phone position on the day arc and the card's offset into its cluster, in
  // tile percentages (so cqw on x, cqh on y).
  x: number;
  y: number;
  dx: number;
  dy: number;
  rot: number;
};

// Arc box spans x 10-90%, y 42-56%; y = 42 + 14 * (1 - 2u)^2 along it.
const DIARY_ROW_Y = 66;
const DIARY_MOMENTS: DiaryMoment[] = [
  { mood: "stress", x: 16.4, y: 51.9, dx: 4.1, dy: 4, rot: -6 },
  { mood: "boredom", x: 27.6, y: 46.4, dx: 19.4, dy: 5, rot: 4 },
  { mood: "stress", x: 38.8, y: 43.1, dx: -11.3, dy: 6.5, rot: 5 },
  { mood: "calm", x: 50, y: 42, dx: 23, dy: 5, rot: -4 },
  { mood: "boredom", x: 61.2, y: 43.1, dx: -8.2, dy: 9.5, rot: 3 },
  { mood: "stress", x: 72.4, y: 46.4, dx: -48.9, dy: 10.5, rot: -3 },
  { mood: "calm", x: 83.6, y: 51.9, dx: -4.6, dy: 9.5, rot: 6 }
];

const DIARY_CLUSTERS: { mood: Mood; x: number }[] = [
  { mood: "stress", x: 24 },
  { mood: "boredom", x: 50 },
  { mood: "calm", x: 76 }
];

// 10s loop. Moment i is logged at 0.3s + i * 0.24s and lands as a card 2s later.
function DiaryClustersScene({ logo }: SceneProps) {
  return (
    <div role="img" aria-label={logo.alt} className={cn("absolute inset-0", styles.diary)}>
      <div className={styles.diaryGlow} aria-hidden="true" />

      <div className={styles.diaryHeading} aria-hidden="true">
        <span className={styles.diaryTitle}>
          Smartphone Use
          <br />
          &amp; Wellbeing
        </span>
      </div>

      <div className={styles.diaryDay} aria-hidden="true">
        <svg className={styles.diaryArc} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 Q50 -100 100 100" pathLength="100" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className={styles.diarySun} />
        <span className={styles.diaryMoon} />
        {DIARY_MOMENTS.map((m, i) => (
          <span
            key={i}
            className={styles.diaryPhone}
            style={{ left: `${m.x}%`, top: `${m.y}%`, animationDelay: `${0.2 + i * 0.24}s` }}
          />
        ))}
      </div>

      {DIARY_CLUSTERS.map((c) => (
        <span
          key={c.mood}
          aria-hidden="true"
          className={cn(styles.diaryHalo, styles[`mood-${c.mood}`])}
          style={{ left: `${c.x}%` }}
        />
      ))}

      {DIARY_MOMENTS.map((m, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(styles.diaryDot, styles[`mood-${m.mood}`])}
          style={
            {
              left: `${m.x}%`,
              top: `${m.y}%`,
              "--fall": `${DIARY_ROW_Y - m.y}cqh`,
              animationDelay: `${0.3 + i * 0.24}s`
            } as CssVars
          }
        />
      ))}

      {DIARY_MOMENTS.map((m, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(styles.diarySlot, styles[`mood-${m.mood}`])}
          style={
            {
              left: `${m.x}%`,
              top: `${DIARY_ROW_Y}%`,
              "--dx": `${m.dx}cqw`,
              "--dy": `${m.dy}cqh`,
              "--rot": `${m.rot}deg`,
              animationDelay: `${i * 0.06}s`
            } as CssVars
          }
        >
          <span className={styles.diaryCard} style={{ animationDelay: `${2.2 + i * 0.24}s` }}>
            <i />
            <i />
            <i />
          </span>
        </span>
      ))}

      {DIARY_CLUSTERS.map((c, i) => (
        <span
          key={c.mood}
          aria-hidden="true"
          className={cn(styles.diaryPill, styles[`mood-${c.mood}`])}
          style={{ left: `${c.x}%`, animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  );
}

/* ---------- laser-tag: aim, lock, fire, sync, hit, haptics ---------- */

// 8s loop. Target sits at (64%, 36%); the shot comes from the phone at (58%, 89%).
function LaserTagScene({ logo }: SceneProps) {
  return (
    <div role="img" aria-label={logo.alt} className={cn("absolute inset-0", styles.laser)}>
      <div className={styles.laserFloor} aria-hidden="true">
        <div className={styles.laserGrid} />
      </div>

      <svg className={styles.laserLines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path className={styles.laserArc} d="M11 27 Q50 -3 89 27" />
        <path className={styles.laserBeam} d="M58 87 L64 36" pathLength="100" />
      </svg>

      <span className={cn(styles.laserDevice, styles.laserDeviceA)} aria-hidden="true" />
      <span className={cn(styles.laserDevice, styles.laserDeviceB)} aria-hidden="true" />
      <span className={styles.laserPacket} aria-hidden="true">
        <span className={cn(styles.sceneLabel, styles.laserPacketLabel)}>~50ms</span>
      </span>

      <span className={styles.laserHealth} aria-hidden="true">
        <span className={styles.laserHealthFill} />
      </span>

      <span className={styles.laserTarget} aria-hidden="true">
        <span className={styles.laserHitGlow} />
        <svg viewBox="0 0 40 40" className={styles.laserTargetMark}>
          <circle cx="20" cy="20" r="16" fill="none" strokeWidth="1.6" />
          <path d="M20 13 L27 20 L20 27 L13 20 Z" strokeWidth="1.6" />
        </svg>
        <svg viewBox="0 0 40 40" className={styles.laserHit}>
          <path d="M9 9 L17 17 M31 9 L23 17 M9 31 L17 23 M31 31 L23 23" strokeWidth="3.4" strokeLinecap="round" />
        </svg>
      </span>

      <span className={styles.laserBrackets} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>

      <span className={styles.laserReticle} aria-hidden="true">
        <svg viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="15" fill="none" strokeWidth="1.4" />
          <path d="M20 1 V10 M20 30 V39 M1 20 H10 M30 20 H39" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="20" cy="20" r="1.4" />
        </svg>
      </span>

      <span className={styles.laserPhone} aria-hidden="true" />
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(styles.laserRing, i === 0 && styles.laserRingFirst)}
          style={{ animationDelay: `${i * 0.22}s` }}
        />
      ))}

      <div className={styles.laserHeading} aria-hidden="true">
        <span className={styles.laserTitle}>{logo.wordmark}</span>
      </div>
    </div>
  );
}

/* ---------- ab-race: same payment task on two layouts, revised wins ---------- */

function RacePhone({ variant }: { variant: "original" | "revised" }) {
  const revised = variant === "revised";
  return (
    <span className={cn(styles.racePhone, revised && styles.racePhoneRevised)}>
      <span className={styles.raceScreen}>
        {revised ? (
          <span className={styles.raceHeader} />
        ) : (
          <span className={styles.raceTopMenu}>
            <i />
            <i />
            <i />
          </span>
        )}
        <span className={styles.raceAmount} />
        <span className={styles.raceRow} />
        <span className={styles.raceRow} />
        <span className={styles.raceRow} />
        <span className={styles.racePay} />
        {revised ? (
          <span className={styles.raceNav}>
            <i />
            <i />
            <i />
            <i />
          </span>
        ) : null}
        <span className={cn(styles.raceCursor, revised ? styles.raceCursorRevised : styles.raceCursorOriginal)}>
          <span className={styles.raceDot} />
          <span className={cn(styles.raceTap, revised ? styles.raceTapRevised : styles.raceTapOriginal)} />
        </span>
      </span>
    </span>
  );
}

// 9s loop. Revised taps three times via the bottom nav and finishes first;
// original detours to the top menu between steps and finishes a beat later.
function AbRaceScene({ logo }: SceneProps) {
  return (
    <div role="img" aria-label={logo.alt} className={cn("absolute inset-0", styles.race)}>
      <div className={styles.raceHeading} aria-hidden="true">
        <span className={styles.raceTitle}>{logo.wordmark}</span>
      </div>

      <div className={styles.raceStage} aria-hidden="true">
        {(["original", "revised"] as const).map((variant) => {
          const revised = variant === "revised";
          return (
            <div key={variant} className={cn(styles.raceCol, revised && styles.raceColRevised)}>
              <RacePhone variant={variant} />
              <span className={cn(styles.sceneLabel, styles.raceCaption)}>{variant}</span>
              <span className={styles.raceBar}>
                <span className={cn(styles.raceFill, revised ? styles.raceFillRevised : styles.raceFillOriginal)} />
                {revised ? (
                  <span className={styles.raceResult}>
                    <svg viewBox="0 0 20 20" className={styles.raceCheck}>
                      <circle cx="10" cy="10" r="10" />
                      <path d="M5.5 10.4 L8.6 13.3 L14.5 7" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className={cn(styles.sceneLabel, styles.racePill)}>Faster</span>
                  </span>
                ) : null}
              </span>
            </div>
          );
        })}
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
      {motion === "diary-clusters" ? (
        <DiaryClustersScene logo={logo} size={size} />
      ) : motion === "laser-tag" ? (
        <LaserTagScene logo={logo} size={size} />
      ) : motion === "ab-race" ? (
        <AbRaceScene logo={logo} size={size} />
      ) : motion === "aura-desk" ? (
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
