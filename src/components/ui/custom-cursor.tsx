"use client";

import { useEffect, useRef } from "react";

type CursorVariant = "default" | "interactive" | "media" | "hidden";

const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button",
  "summary",
  "[role='button']",
  "[tabindex='0']",
  "label[for]",
  "input[type='button']",
  "input[type='submit']",
  "input[type='reset']",
  "[data-cursor='interactive']",
  "[data-cursor-label]"
].join(",");

const TEXT_INPUT_SELECTOR = [
  "textarea",
  "[contenteditable='']",
  "[contenteditable='true']",
  "input:not([type='button']):not([type='submit']):not([type='reset']):not([type='checkbox']):not([type='radio']):not([type='range']):not([type='color']):not([type='file'])",
  "[data-cursor='text']"
].join(",");

const TEXT_BLOCK_SELECTOR = [
  "p",
  "li",
  "blockquote",
  "figcaption",
  "cite",
  "dd",
  "dt",
  "span",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "pre",
  "code"
].join(",");

const MEDIA_SELECTOR = ["video", "audio", "img", "picture", "canvas", "svg", "[data-cursor-media]"].join(",");
const PROJECT_DETAIL_PATH_PATTERN = /^\/(work|experiments)\/[^/?#]+/;

const isDisabledElement = (element: Element | null) => {
  if (!element) return false;
  const htmlElement = element as HTMLElement;
  return htmlElement.dataset.cursor === "hidden" || htmlElement.getAttribute("aria-disabled") === "true";
};

const isExternalHref = (href: string) => {
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return true;
  if (!href.startsWith("http://") && !href.startsWith("https://")) return false;

  try {
    return new URL(href).origin !== window.location.origin;
  } catch {
    return false;
  }
};

const getActionElement = (target: Element) =>
  target.closest(INTERACTIVE_SELECTOR) as HTMLElement | null;

const normalizeSpace = (value: string) => value.replace(/\s+/g, " ").trim();

const isBackAction = (element: HTMLElement) => {
  const explicit = element.dataset.cursorLabel?.toLowerCase().trim();
  if (explicit === "back") return true;

  const aria = normalizeSpace((element.getAttribute("aria-label") ?? "").toLowerCase());
  const text = normalizeSpace((element.textContent ?? "").toLowerCase());
  const backPattern = /^(?:\u2190|←|↩|‹|<)?\s*back$/i;

  return backPattern.test(aria) || backPattern.test(text);
};

const isCardLikeAction = (element: HTMLElement) => {
  if (element.dataset.cursorCard === "true") return true;

  const className = element.className.toString().toLowerCase();
  if (className.includes("card") || className.includes("tile")) return true;
  if (element.querySelector("article")) return true;
  return Boolean(element.querySelector("h2, h3, h4"));
};

const isSelectableText = (target: Element) => {
  const textInput = target.closest(TEXT_INPUT_SELECTOR);
  if (textInput && !isDisabledElement(textInput)) return true;

  const textBlock = target.closest(TEXT_BLOCK_SELECTOR);
  if (!textBlock) return false;
  if (textBlock.closest(INTERACTIVE_SELECTOR)) return false;

  const style = window.getComputedStyle(textBlock);
  if (style.userSelect === "none") return false;

  return (textBlock.textContent ?? "").trim().length > 0;
};

const resolveVariant = (target: Element): CursorVariant => {
  if (target.closest("[data-cursor='hidden']")) return "hidden";
  if (isSelectableText(target)) return "default";

  const interactive = getActionElement(target);
  if (interactive && !isDisabledElement(interactive)) {
    const media = target.closest(MEDIA_SELECTOR);
    if (media) return "media";
    return "interactive";
  }

  return "default";
};

const resolveLabel = (target: Element, variant: CursorVariant) => {
  const explicit = target.closest("[data-cursor-label]") as HTMLElement | null;
  const explicitLabel = explicit?.dataset.cursorLabel?.trim();
  if (explicitLabel) return explicitLabel;

  const action = getActionElement(target);
  if (!action || isDisabledElement(action)) return "";

  if (isBackAction(action)) return "Back";

  if (action instanceof HTMLAnchorElement) {
    const hrefAttr = action.getAttribute("href") ?? "";
    const href = hrefAttr.trim();

    if (href) {
      if (isExternalHref(href)) return "Visit";
      if (PROJECT_DETAIL_PATH_PATTERN.test(href)) {
        return isCardLikeAction(action) ? "Open" : "Case Study";
      }
    }
  }

  if (variant === "media") {
    const media = target.closest(MEDIA_SELECTOR);
    if (media?.matches("video,audio")) return "Play";
    return "View";
  }

  if (isCardLikeAction(action)) return "Open";
  return "";
};

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const label = labelRef.current;
    if (!cursor || !label) return;

    const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointerQuery.matches) return;

    document.body.classList.add("custom-cursor-enabled");
    if (reducedMotionQuery.matches) {
      document.body.classList.add("custom-cursor-reduced-motion");
    }

    let rafId = 0;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isVisible = false;
    let lastTarget: EventTarget | null = null;
    let isRunning = false;
    const smoothing = reducedMotionQuery.matches ? 1 : 0.34;

    const applyTransform = () => {
      currentX += (targetX - currentX) * smoothing;
      currentY += (targetY - currentY) * smoothing;

      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

      const isNearTarget = Math.abs(targetX - currentX) < 0.15 && Math.abs(targetY - currentY) < 0.15;
      if (isNearTarget) {
        isRunning = false;
        rafId = 0;
        return;
      }

      rafId = window.requestAnimationFrame(applyTransform);
    };

    const setVisibility = (visible: boolean) => {
      if (isVisible === visible) return;
      isVisible = visible;
      cursor.dataset.visible = visible ? "true" : "false";
    };

    const updateVariantFromTarget = (eventTarget: EventTarget | null) => {
      if (!(eventTarget instanceof Element)) {
        cursor.dataset.variant = "default";
        label.textContent = "";
        cursor.dataset.hasLabel = "false";
        return;
      }

      const variant = resolveVariant(eventTarget);
      const nextLabel = resolveLabel(eventTarget, variant);

      cursor.dataset.variant = variant;
      label.textContent = nextLabel;
      cursor.dataset.hasLabel = nextLabel ? "true" : "false";
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      setVisibility(true);

      if (event.target !== lastTarget) {
        lastTarget = event.target;
        updateVariantFromTarget(event.target);
      }

      if (!isRunning) {
        isRunning = true;
        rafId = window.requestAnimationFrame(applyTransform);
      }
    };

    const onPointerLeave = () => {
      setVisibility(false);
      cursor.dataset.variant = "default";
      label.textContent = "";
      cursor.dataset.hasLabel = "false";
      lastTarget = null;
      targetX = currentX;
      targetY = currentY;
    };

    const onPointerDown = () => {
      cursor.dataset.pressed = "true";
    };

    const onPointerUp = () => {
      cursor.dataset.pressed = "false";
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setVisibility(false);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      document.body.classList.remove("custom-cursor-enabled");
      document.body.classList.remove("custom-cursor-reduced-motion");
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor" data-variant="default" data-visible="false" data-has-label="false" data-pressed="false" aria-hidden="true">
      <span ref={labelRef} className="custom-cursor__label" />
    </div>
  );
}
