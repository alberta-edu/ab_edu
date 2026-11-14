// Areas of parallelograms and triangles, Grade 6 (MAT6-OI5-GQ1-LO1). A parallelogram with base b,
// height h and slant s; cutting off the end triangle and moving it makes a b × h rectangle.

export type Q = [number, number];

export const parallelogram = (b: number, h: number, s: number): Q[] => [[0, 0], [b, 0], [b + s, h], [s, h]];
/** The triangle cut from the left end: under the top-left corner. */
export const endTriangle = (h: number, s: number): Q[] => [[0, 0], [s, 0], [s, h]];
export const parallelogramArea = (b: number, h: number) => b * h;
export const triangleArea = (b: number, h: number) => (b * h) / 2;

/** Shoelace area of any polygon, for checking. */
export function polygonArea(pts: Q[]): number {
  let a = 0;
  pts.forEach(([x, y], i) => {
    const [x2, y2] = pts[(i + 1) % pts.length];
    a += x * y2 - x2 * y;
  });
  return Math.abs(a) / 2;
}
