"use client";

import { useRouter } from "next/navigation";

const FALLBACK_ROUTE = "/experiments";

export function ExperimentBackLink() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window === "undefined") {
      router.push(FALLBACK_ROUTE);
      return;
    }

    const hasHistory = window.history.length > 1;
    const hasSameOriginReferrer =
      Boolean(document.referrer) &&
      new URL(document.referrer).origin === window.location.origin;

    if (hasHistory && hasSameOriginReferrer) {
      router.back();
      return;
    }

    router.push(FALLBACK_ROUTE);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="font-body text-xs leading-none tracking-[0.01em] text-text-muted transition-colors hover:text-foreground"
    >
      ← Back
    </button>
  );
}
