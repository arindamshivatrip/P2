"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type PointerEvent
} from "react";
import { cn } from "@/lib/utils";
import styles from "./messages.module.css";

// Drawn at 640px for crisp lines, exported at 320px to stay tiny.
const SIZE = 640;
const EXPORT_SIZE = 320;

type Point = [number, number];
type Stroke = { color: string; width: number; points: Point[] };

export type DrawingPadHandle = {
  undo: () => void;
  clear: () => void;
  exportImage: () => string | null;
};

type DrawingPadProps = {
  color: string;
  width: number;
  onStrokesChange: (count: number) => void;
  className?: string;
};

function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke) {
  const { points } = stroke;
  if (points.length === 0) return;
  ctx.strokeStyle = stroke.color;
  ctx.fillStyle = stroke.color;
  ctx.lineWidth = stroke.width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (points.length === 1) {
    ctx.beginPath();
    ctx.arc(points[0][0], points[0][1], stroke.width / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  // Midpoint quadratic curves smooth out jittery pointer samples.
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length - 1; i += 1) {
    const [x, y] = points[i];
    const [nx, ny] = points[i + 1];
    ctx.quadraticCurveTo(x, y, (x + nx) / 2, (y + ny) / 2);
  }
  const last = points[points.length - 1];
  ctx.lineTo(last[0], last[1]);
  ctx.stroke();
}

export const DrawingPad = forwardRef<DrawingPadHandle, DrawingPadProps>(function DrawingPad(
  { color, width, onStrokesChange, className },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const active = useRef<Stroke | null>(null);

  const redraw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, SIZE, SIZE);
    strokes.current.forEach((stroke) => drawStroke(ctx, stroke));
  }, []);

  useEffect(redraw, [redraw]);

  useImperativeHandle(
    ref,
    () => ({
      undo: () => {
        strokes.current = strokes.current.slice(0, -1);
        redraw();
        onStrokesChange(strokes.current.length);
      },
      clear: () => {
        strokes.current = [];
        redraw();
        onStrokesChange(0);
      },
      exportImage: () => {
        const source = canvasRef.current;
        if (!source || strokes.current.length === 0) return null;
        const out = document.createElement("canvas");
        out.width = EXPORT_SIZE;
        out.height = EXPORT_SIZE;
        const ctx = out.getContext("2d");
        if (!ctx) return null;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(source, 0, 0, EXPORT_SIZE, EXPORT_SIZE);
        // Safari can't encode webp and quietly returns png, which the API also takes.
        return out.toDataURL("image/webp", 0.82);
      }
    }),
    [onStrokesChange, redraw]
  );

  const toCanvas = (event: PointerEvent<HTMLCanvasElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return [
      ((event.clientX - rect.left) / rect.width) * SIZE,
      ((event.clientY - rect.top) / rect.height) * SIZE
    ];
  };

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    active.current = { color, width, points: [toCanvas(event)] };
    strokes.current = [...strokes.current, active.current];
    redraw();
  };

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const stroke = active.current;
    if (!stroke) return;
    const samples = event.nativeEvent.getCoalescedEvents?.() ?? [event.nativeEvent];
    const rect = event.currentTarget.getBoundingClientRect();
    samples.forEach((sample) => {
      stroke.points.push([
        ((sample.clientX - rect.left) / rect.width) * SIZE,
        ((sample.clientY - rect.top) / rect.height) * SIZE
      ]);
    });
    redraw();
  };

  const endStroke = () => {
    if (!active.current) return;
    active.current = null;
    onStrokesChange(strokes.current.length);
  };

  return (
    <canvas
      ref={canvasRef}
      width={SIZE}
      height={SIZE}
      aria-label="Drawing pad. Draw with your mouse, finger or stylus."
      role="img"
      className={cn(styles.canvas, "block aspect-square w-full bg-white", className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endStroke}
      onPointerCancel={endStroke}
    />
  );
});
