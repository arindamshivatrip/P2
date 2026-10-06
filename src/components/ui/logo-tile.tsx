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
function AndroidWalkScene({ logo, size }: SceneProps) {
  const bg = "#0b1533";

  return (
    <svg
      viewBox="0 0 460 170"
      role="img"
      aria-label={logo.alt}
      className={cn("h-auto", styles.walkScene, size === "lg" ? "w-[min(30rem,82%)]" : "w-[min(17rem,84%)]")}
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

// Brand tile for projects without a cover or video. Each project picks its own
// motion so the tiles don't all move the same way.
export function LogoTile({ logo, size = "sm" }: LogoTileProps) {
  const motion = logo.motion ?? "zoom";

  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: logo.background }}
    >
      {motion === "android-walk" ? (
        <AndroidWalkScene logo={logo} size={size} />
      ) : motion === "scan" ? (
        <ScanScene logo={logo} size={size} />
      ) : (
        <ZoomScene logo={logo} size={size} />
      )}
    </div>
  );
}
