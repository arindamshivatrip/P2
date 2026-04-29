export type Point2D = {
  x: number;
  y: number;
};

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const lerp = (from: number, to: number, amount: number): number =>
  from * (1 - amount) + to * amount;

export const smoothPoint = (previous: Point2D | null, next: Point2D, amount = 0.25): Point2D => {
  if (!previous) {
    return next;
  }

  return {
    x: lerp(previous.x, next.x, amount),
    y: lerp(previous.y, next.y, amount)
  };
};

export const distance = (a: Point2D, b: Point2D): number =>
  Math.hypot(a.x - b.x, a.y - b.y);

