"use client";

import { useCallback, useEffect, useState } from "react";
import { SparkIcon } from "@/components/arillm/chat-launcher";
import { useArillm } from "@/components/arillm/chat-provider";

/** Marks the region whose text selections can be sent to the chat. */
export const SELECTION_ROOT_ATTR = "data-arillm-content";

const MIN_LENGTH = 10;
// The route rejects messages over 1,000 characters; leave room for the wrapper text.
const MAX_QUOTE = 600;
const DESKTOP_QUERY = "(min-width: 1024px) and (pointer: fine)";

type Pill = { text: string; top: number; left: number };

function readSelection(): Pill | null {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) return null;

  const text = selection.toString().replace(/\s+/g, " ").trim();
  if (text.length <= MIN_LENGTH) return null;

  const range = selection.getRangeAt(0);
  const container =
    range.commonAncestorContainer instanceof Element
      ? range.commonAncestorContainer
      : range.commonAncestorContainer.parentElement;
  if (!container?.closest(`[${SELECTION_ROOT_ATTR}]`)) return null;
  if (container.closest("input, textarea, [contenteditable='true']")) return null;

  const rect = range.getBoundingClientRect();
  if (!rect.width && !rect.height) return null;

  return {
    text,
    // Sit above the selection, or below it when it starts near the top edge.
    top: rect.top > 56 ? rect.top - 44 : rect.bottom + 8,
    left: Math.min(Math.max(rect.left + rect.width / 2, 80), window.innerWidth - 80)
  };
}

export function SelectionAsk() {
  const { ask, status } = useArillm();
  const [enabled, setEnabled] = useState(false);
  const [pill, setPill] = useState<Pill | null>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setPill(null);
      return;
    }

    // Read once the selection is finished (mouse or shift+arrow), not on every
    // selectionchange while dragging.
    const show = () => window.setTimeout(() => setPill(readSelection()), 0);
    const hide = () => setPill(null);
    const onSelectionChange = () => {
      if (window.getSelection()?.isCollapsed) hide();
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Escape") hide();
      else if (event.shiftKey) show();
    };

    document.addEventListener("mouseup", show);
    document.addEventListener("keyup", onKeyUp);
    document.addEventListener("selectionchange", onSelectionChange);
    window.addEventListener("scroll", hide, { passive: true, capture: true });
    window.addEventListener("resize", hide);
    return () => {
      document.removeEventListener("mouseup", show);
      document.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("selectionchange", onSelectionChange);
      window.removeEventListener("scroll", hide, { capture: true });
      window.removeEventListener("resize", hide);
    };
  }, [enabled]);

  const onAsk = useCallback(() => {
    if (!pill) return;
    const quote = pill.text.length > MAX_QUOTE ? `${pill.text.slice(0, MAX_QUOTE).trimEnd()}…` : pill.text;
    ask(`About this part of the page: "${quote}". Can you tell me more?`);
    window.getSelection()?.removeAllRanges();
    setPill(null);
  }, [ask, pill]);

  if (!pill || busy) return null;

  return (
    <button
      type="button"
      // Keep the selection alive through the click; an outside mousedown
      // clears it, which hides the pill via selectionchange.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onAsk}
      style={{ top: pill.top, left: pill.left }}
      className="fixed z-50 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 font-body text-caption text-foreground shadow-card transition-colors hover:border-accent/70"
    >
      <SparkIcon className="h-3.5 w-3.5 text-accent" />
      Ask Ari
    </button>
  );
}
