"use client";

import { useEffect, useState, type CSSProperties } from "react";
import styles from "./visitor-counter.module.css";

const HEARTBEAT_MS = 30_000;
const MIN_PING_GAP_MS = 10_000;
const VISITOR_ID_KEY = "ari-visitor-id";
// one flap = two halves; a digit steps through every number on its way, like a real board
const FLAP_STEP_MS = 170;

type Counts = { online: number; total: number };
type PingResponse = { online: number; total?: number };

function getVisitorId(): string {
  const fresh = () => crypto.randomUUID();
  try {
    const existing = window.localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return existing;
    const id = fresh();
    window.localStorage.setItem(VISITOR_ID_KEY, id);
    return id;
  } catch {
    // private windows can block storage; count this page view on its own
    return fresh();
  }
}

function FlapDigit({ digit }: { digit: number }) {
  // `from` is what the flap is falling away from, `to` what it lands on.
  const [flap, setFlap] = useState({ from: 0, to: 0, step: 0 });

  useEffect(() => {
    if (flap.to === digit) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(
      () =>
        setFlap((f) => ({
          from: f.to,
          to: reduceMotion ? digit : (f.to + 1) % 10,
          step: f.step + 1
        })),
      flap.step === 0 ? 0 : FLAP_STEP_MS
    );
    return () => window.clearTimeout(timer);
  }, [digit, flap]);

  return (
    <span
      className={styles.digit}
      style={{ "--flap-half": `${FLAP_STEP_MS / 2}ms` } as CSSProperties}
    >
      <span className={`${styles.half} ${styles.top}`}>
        <span className={styles.glyph}>{flap.to}</span>
      </span>
      <span className={`${styles.half} ${styles.bottom}`}>
        <span className={styles.glyph}>{flap.from}</span>
      </span>
      {flap.step > 0 ? (
        <span key={flap.step}>
          <span className={`${styles.half} ${styles.top} ${styles.flapTop}`}>
            <span className={styles.glyph}>{flap.from}</span>
          </span>
          <span className={`${styles.half} ${styles.bottom} ${styles.flapBottom}`}>
            <span className={styles.glyph}>{flap.to}</span>
          </span>
        </span>
      ) : null}
    </span>
  );
}

function FlapNumber({ value, minDigits }: { value: number; minDigits: number }) {
  const digits = String(value).padStart(minDigits, "0").split("").map(Number);
  return (
    <span aria-hidden="true" className="inline-flex gap-[3px] text-base">
      {digits.map((digit, i) => (
        <FlapDigit key={digits.length - i} digit={digit} />
      ))}
    </span>
  );
}

export function VisitorCounter() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    const visitorId = getVisitorId();
    let stopped = false;
    // The total is counted once per page load; later pings only keep this
    // visitor in "here now". Stays true until a ping actually returns a total.
    let needTotal = true;
    let lastPing = 0;

    const ping = async () => {
      if (document.visibilityState !== "visible") return;
      // Rapid tab switching fires visibilitychange in bursts; one ping per 10s is plenty.
      const now = Date.now();
      if (!needTotal && now - lastPing < MIN_PING_GAP_MS) return;
      lastPing = now;
      try {
        const res = await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, first: needTotal })
        });
        if (!res.ok) return;
        const next: PingResponse = await res.json();
        if (stopped) return;
        if (next.total !== undefined) {
          needTotal = false;
          setCounts({ online: next.online, total: next.total });
        } else {
          setCounts((previous) => (previous ? { ...previous, online: next.online } : previous));
        }
      } catch {
        // offline or blocked: keep whatever we last showed
      }
    };

    ping();
    const interval = window.setInterval(ping, HEARTBEAT_MS);
    document.addEventListener("visibilitychange", ping);
    return () => {
      stopped = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", ping);
    };
  }, []);

  // no counter backend (or first ping pending): show nothing rather than zeros,
  // but hold the row's height so the footer doesn't jump when it arrives
  if (!counts) return <div aria-hidden="true" className="h-6" />;

  return (
    <p
      className="flex flex-wrap items-center gap-x-4 gap-y-2 font-body text-xs text-text-muted"
      aria-label={`${counts.total} visitors so far, ${counts.online} here now`}
    >
      <span className="inline-flex items-center gap-2">
        <FlapNumber value={counts.total} minDigits={4} />
        <span aria-hidden="true">visitors so far</span>
      </span>
      <span className="inline-flex items-center gap-2">
        <FlapNumber value={counts.online} minDigits={2} />
        <span aria-hidden="true">here now</span>
      </span>
    </p>
  );
}
