"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import styles from "./mobile-card-page.module.css";

const MAX_TILT = 12;
const QR_URL = "https://arindamtripathi.com/mobile_card";
const WEBSITE_URL = "https://arindamtripathi.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/arindamtrip/";
const CV_URL = "/files/arindam-tripathi-xr-interactive-systems-cv.pdf";
const PORTRAIT_URL = "/images/about/brooklyn-main-portrait.jpg";

const TICKET_MASK =
  "url(\"data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 160' preserveAspectRatio='none'%3E%3Cpath fill='white' fill-rule='evenodd' d='M14 2H86C92.627 2 98 7.373 98 14V146C98 152.627 92.627 158 86 158H14C7.373 158 2 152.627 2 146V14C2 7.373 7.373 2 14 2ZM2 104a4.8 4.8 0 1 0 .0001 0ZM98 104a4.8 4.8 0 1 0 .0001 0ZM2 133a3.8 3.8 0 1 0 .0001 0ZM98 133a3.8 3.8 0 1 0 .0001 0Z'/%3E%3C/svg%3E\")";

type PermissionState = "unsupported" | "prompt" | "active" | "denied" | "idle";

type LinkRowProps = {
  href: string;
  label: string;
  detail: string;
  icon: ReactNode;
};

type DeviceOrientationPermissionApi = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.94 8.5A1.44 1.44 0 1 0 6.93 5.6a1.44 1.44 0 0 0 .01 2.88ZM5.7 9.75h2.47v8.56H5.7V9.75Zm3.95 0h2.37v1.17h.03c.33-.63 1.14-1.29 2.34-1.29 2.5 0 2.96 1.64 2.96 3.77v4.9h-2.47v-4.34c0-1.04-.02-2.37-1.44-2.37-1.44 0-1.66 1.13-1.66 2.3v4.41H9.65V9.75Z"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm5.88 7.5h-2.3a13.14 13.14 0 0 0-1.06-4.02 7.04 7.04 0 0 1 3.36 4.02ZM12 5.03c.7.84 1.5 2.53 1.83 5.97h-3.66C10.5 7.56 11.3 5.87 12 5.03ZM9.48 6.98A13.14 13.14 0 0 0 8.42 11h-2.3a7.04 7.04 0 0 1 3.36-4.02ZM6.12 13h2.3c.1 1.46.47 2.83 1.06 4.02A7.04 7.04 0 0 1 6.12 13Zm4.05 0h3.66c-.33 3.44-1.13 5.13-1.83 5.97-.7-.84-1.5-2.53-1.83-5.97Zm4.35 4.02c.59-1.19.96-2.56 1.06-4.02h2.3a7.04 7.04 0 0 1-3.36 4.02Z"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 3.75A1.75 1.75 0 0 0 5.25 5.5v13A1.75 1.75 0 0 0 7 20.25h10A1.75 1.75 0 0 0 18.75 18.5V9.56a1.75 1.75 0 0 0-.5-1.22l-3.58-3.59a1.75 1.75 0 0 0-1.24-.5H7Zm6 .75v3.25c0 .41.34.75.75.75H17.5v10h-10v-13H13Z"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
        d="M6 14 14 6M8 6h6v6"
      />
    </svg>
  );
}

function LinkRow({ href, label, detail, icon }: LinkRowProps) {
  return (
    <a className={styles.row} href={href} target="_blank" rel="noreferrer">
      <span className={styles.rowIcon}>{icon}</span>
      <span className={styles.rowCopy}>
        <span className={styles.rowLabel}>{label}</span>
        <span className={styles.rowDetail}>{detail}</span>
      </span>
      <span className={styles.rowArrow}>
        <ArrowIcon />
      </span>
    </a>
  );
}

export function MobileCardPage() {
  const reduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const detachOrientationRef = useRef<(() => void) | null>(null);
  const [permissionState, setPermissionState] = useState<PermissionState>("idle");
  const [tiltSource, setTiltSource] = useState<"static" | "mouse" | "device">("static");

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(42);

  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 22, mass: 0.8 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 22, mass: 0.8 });
  const springGlareX = useSpring(glareX, { stiffness: 110, damping: 22, mass: 0.9 });
  const springGlareY = useSpring(glareY, { stiffness: 110, damping: 22, mass: 0.9 });

  const broadGlareX = useTransform(springGlareX, [0, 100], ["-10%", "10%"]);
  const broadGlareY = useTransform(springGlareY, [0, 100], ["-8%", "8%"]);
  const specGlareX = useTransform(springGlareX, [0, 100], ["-7%", "7%"]);
  const specGlareY = useTransform(springGlareY, [0, 100], ["6%", "-6%"]);

  const ticketMaskStyle = useMemo(
    () =>
      ({
        WebkitMaskImage: TICKET_MASK,
        maskImage: TICKET_MASK,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        WebkitMaskPosition: "center",
        maskPosition: "center"
      }) satisfies CSSProperties,
    []
  );

  const resetTilt = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(42);
    setTiltSource("static");
  }, [glareX, glareY, rotateX, rotateY]);

  const applyTilt = useCallback(
    (normalizedX: number, normalizedY: number, source: "mouse" | "device") => {
      if (reduceMotion) {
        resetTilt();
        return;
      }

      rotateY.set(clamp(normalizedX, -1, 1) * MAX_TILT);
      rotateX.set(clamp(-normalizedY, -1, 1) * MAX_TILT);
      glareX.set(50 + clamp(normalizedX, -1, 1) * 18);
      glareY.set(42 + clamp(normalizedY, -1, 1) * 14);
      setTiltSource(source);
    },
    [glareX, glareY, reduceMotion, resetTilt, rotateX, rotateY]
  );

  const attachDeviceTilt = useCallback(() => {
    if (typeof window === "undefined" || reduceMotion || !window.DeviceOrientationEvent) {
      return false;
    }

    detachOrientationRef.current?.();

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta == null || event.gamma == null) {
        return;
      }

      const normalizedX = clamp(event.gamma / 28, -1, 1);
      const normalizedY = clamp((event.beta - 35) / 32, -1, 1);
      applyTilt(normalizedX, normalizedY, "device");
    };

    window.addEventListener("deviceorientation", handleOrientation, true);
    detachOrientationRef.current = () => window.removeEventListener("deviceorientation", handleOrientation, true);
    setPermissionState("active");
    return true;
  }, [applyTilt, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || typeof window === "undefined") {
      detachOrientationRef.current?.();
      detachOrientationRef.current = null;
      resetTilt();
      return;
    }

    const DeviceOrientationCtor = window.DeviceOrientationEvent as DeviceOrientationPermissionApi | undefined;

    if (!DeviceOrientationCtor) {
      setPermissionState("unsupported");
      return;
    }

    if (typeof DeviceOrientationCtor.requestPermission === "function") {
      setPermissionState("prompt");
      return;
    }

    if (!attachDeviceTilt()) {
      setPermissionState("unsupported");
    }

    return () => {
      detachOrientationRef.current?.();
      detachOrientationRef.current = null;
    };
  }, [attachDeviceTilt, reduceMotion, resetTilt]);

  const enableTilt = useCallback(async () => {
    if (typeof window === "undefined" || reduceMotion) {
      return;
    }

    const DeviceOrientationCtor = window.DeviceOrientationEvent as DeviceOrientationPermissionApi | undefined;

    if (!DeviceOrientationCtor) {
      setPermissionState("unsupported");
      return;
    }

    if (typeof DeviceOrientationCtor.requestPermission === "function") {
      try {
        const result = await DeviceOrientationCtor.requestPermission();
        if (result !== "granted") {
          setPermissionState("denied");
          return;
        }
      } catch {
        setPermissionState("denied");
        return;
      }
    }

    if (!attachDeviceTilt()) {
      setPermissionState("unsupported");
    }
  }, [attachDeviceTilt, reduceMotion]);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (reduceMotion || tiltSource === "device" || event.pointerType !== "mouse" || !cardRef.current) {
        return;
      }

      const rect = cardRef.current.getBoundingClientRect();
      const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const normalizedY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      applyTilt(normalizedX, normalizedY, "mouse");
    },
    [applyTilt, reduceMotion, tiltSource]
  );

  const handlePointerLeave = useCallback(() => {
    if (tiltSource === "mouse") {
      resetTilt();
    }
  }, [resetTilt, tiltSource]);

  const showEnableTilt = !reduceMotion && permissionState === "prompt";
  const showTiltStatus = showEnableTilt || permissionState === "denied";

  return (
    <main className={styles.page}>
      <section className={styles.scene}>
        <div className={styles.frame}>
          {showTiltStatus ? (
            <div className={styles.topbar}>
              {showEnableTilt ? (
                <button className={styles.tiltButton} type="button" onClick={enableTilt}>
                  Enable tilt
                </button>
              ) : (
                <span className={styles.statusPill}>Tilt blocked</span>
              )}
            </div>
          ) : null}

          <motion.div className={styles.tiltShell} style={{ rotateX: springRotateX, rotateY: springRotateY }}>
            <div ref={cardRef} className={styles.cardStack} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
              <div className={styles.slabShadow} />

              <div className={styles.slabBack} style={ticketMaskStyle}>
                <div className={styles.slabBackTint} />
              </div>

              <div className={styles.slabEdge} style={ticketMaskStyle}>
                <div className={styles.edgeGlow} />
                <div className={styles.edgeCore} />
              </div>

              <div className={styles.ticketFrontFace} style={ticketMaskStyle}>
                <div className={styles.faceClip} style={ticketMaskStyle}>
                  <div className={styles.glassBase} />
                  <div className={styles.glassGlow} />
                  <div className={styles.prismUnder} />

                  <motion.div className={styles.broadGlare} style={{ x: broadGlareX, y: broadGlareY }} />

                  <div className={styles.content}>
                    <div className={styles.portraitShell}>
                      <div className={styles.portraitFrame}>
                        <Image src={PORTRAIT_URL} alt="Portrait of Arindam Tripathi" fill sizes="(max-width: 480px) 34vw, 168px" style={{ objectFit: "cover" }} priority />
                        <div className={styles.portraitScrim} />
                      </div>
                    </div>

                    <div className={styles.titleBlock}>
                      <h1 className={styles.name}>Arindam Tripathi</h1>
                      <p className={styles.subtitle}>Builder / Researcher / Technologist</p>
                    </div>

                    <div className={styles.linkGroup}>
                      <LinkRow href={LINKEDIN_URL} label="LinkedIn" detail="linkedin.com/in/arindamtrip" icon={<LinkedInIcon />} />
                      <LinkRow href={WEBSITE_URL} label="Website" detail="arindamtripathi.com" icon={<GlobeIcon />} />

                      <a className={styles.cvButton} href={CV_URL} target="_blank" rel="noreferrer">
                        <span className={styles.rowIcon}>
                          <FileIcon />
                        </span>
                        <span className={styles.rowCopy}>
                          <span className={styles.rowLabel}>CV / Resume</span>
                          <span className={styles.rowDetail}>Open current PDF</span>
                        </span>
                        <span className={styles.rowArrow}>
                          <ArrowIcon />
                        </span>
                      </a>
                    </div>

                    <div className={styles.perforation} />

                    <div className={styles.bottomSection}>
                      <div className={styles.scanBlock}>
                        <p className={styles.scanLabel}>Scan to connect</p>
                        <p className={styles.scanText}>Open the mobile card directly, then save or share it from your phone.</p>
                      </div>

                      <div className={styles.qrFrame}>
                        <QRCodeSVG
                          value={QR_URL}
                          size={88}
                          bgColor="#ffffff"
                          fgColor="#0a1020"
                          includeMargin={false}
                          level="M"
                          aria-label="QR code linking to the mobile card page"
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.edgeRim} />
                  <motion.div className={styles.prismEdge} style={{ x: specGlareX, y: specGlareY }} />
                </div>

              </div>
            </div>
          </motion.div>

          <p className={styles.hint}>
            {reduceMotion
              ? "Motion is reduced on this device. The card stays static."
              : "Tilt your phone or move your cursor to shift the glass and edge highlights."}
          </p>
        </div>
      </section>
    </main>
  );
}
