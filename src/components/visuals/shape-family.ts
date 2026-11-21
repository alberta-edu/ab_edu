// Geometry for the Grade 4 shape families (MAT4-OI3-GQ1-LO1): side lengths, angles, parallel and
// equal sides of a polygon, and how triangles and quadrilaterals are classified.

export type Pt = [number, number];

export const QUADS: Record<string, { label: string; pts: Pt[] }> = {
  square: { label: 'Square', pts: [[90, 40], [210, 40], [210, 160], [90, 160]] },
  rectangle: { label: 'Rectangle', pts: [[55, 55], [245, 55], [245, 145], [55, 145]] },
  rhombus: { label: 'Rhombus', pts: [[150, 25], [210, 100], [150, 175], [90, 100]] },
  parallelogram: { label: 'Parallelogram', pts: [[90, 50], [250, 50], [210, 150], [50, 150]] },
  trapezoid: { label: 'Trapezoid', pts: [[100, 50], [200, 50], [250, 150], [50, 150]] },
  quadrilateral: { label: 'Other quadrilateral', pts: [[70, 60], [220, 35], [250, 160], [95, 140]] },
};

export const TRIANGLES: Record<string, { pts: Pt[] }> = {
  a: { pts: [[150, 30], [231, 170], [69, 170]] },
  b: { pts: [[150, 20], [205, 170], [95, 170]] },
  c: { pts: [[80, 40], [80, 170], [210, 170]] },
  d: { pts: [[150, 95], [270, 170], [30, 170]] },
  e: { pts: [[100, 30], [240, 170], [60, 170]] },
  f: { pts: [[60, 40], [60, 170], [250, 170]] },
  g: { pts: [[110, 100], [260, 170], [40, 170]] },
};

const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** Side i joins vertex i to vertex i + 1. */
export const sides = (pts: Pt[]) => pts.map((p, i) => dist(p, pts[(i + 1) % pts.length]));

/** Interior angle at each vertex, in whole degrees. */
export function angles(pts: Pt[]): number[] {
  const n = pts.length;
  return pts.map((p, i) => {
    const a = pts[(i + n - 1) % n];
    const b = pts[(i + 1) % n];
    const u = [a[0] - p[0], a[1] - p[1]];
    const v = [b[0] - p[0], b[1] - p[1]];
    const cos = (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(v[0], v[1]));
    return Math.round((Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI);
  });
}

const near = (x: number, y: number) => Math.abs(x - y) <= 0.02 * Math.max(x, y);

/** Groups of equal sides: a group number for each side, or 0 if it matches no other side. */
export function equalGroups(pts: Pt[]): number[] {
  const s = sides(pts);
  const g = s.map(() => 0);
  let next = 1;
  s.forEach((x, i) => {
    if (g[i]) return;
    const same = s.map((y, j) => (j !== i && !g[j] && near(x, y) ? j : -1)).filter((j) => j >= 0);
    if (same.length) {
      g[i] = next;
      same.forEach((j) => (g[j] = next));
      next++;
    }
  });
  return g;
}

/** Pairs of opposite sides that are parallel, in a quadrilateral: [0, 2] and/or [1, 3]. */
export function parallelPairs(pts: Pt[]): [number, number][] {
  if (pts.length !== 4) return [];
  const dir = (i: number) => [pts[(i + 1) % 4][0] - pts[i][0], pts[(i + 1) % 4][1] - pts[i][1]];
  const par = (i: number, j: number) => {
    const [a, b] = [dir(i), dir(j)];
    return Math.abs(a[0] * b[1] - a[1] * b[0]) < 1e-6 * Math.hypot(a[0], a[1]) * Math.hypot(b[0], b[1]) + 1e-9;
  };
  return ([[0, 2], [1, 3]] as [number, number][]).filter(([i, j]) => par(i, j));
}

/** Families a quadrilateral belongs to, from the most general. */
export function quadFamilies(pts: Pt[]): string[] {
  const par = parallelPairs(pts).length;
  const s = sides(pts);
  const allEqual = s.every((x) => near(x, s[0]));
  const allRight = angles(pts).every((a) => a === 90);
  const out = ['quadrilateral'];
  if (par === 1) out.push('trapezoid');
  if (par === 2) {
    out.push('parallelogram');
    if (allRight) out.push('rectangle');
    if (allEqual) out.push('rhombus');
    if (allRight && allEqual) out.push('square');
  }
  return out;
}

export function triangleBySides(pts: Pt[]): 'equilateral' | 'isosceles' | 'scalene' {
  const g = equalGroups(pts);
  if (g.every((x) => x === 1)) return 'equilateral';
  return g.some((x) => x) ? 'isosceles' : 'scalene';
}

export function triangleByAngles(pts: Pt[]): 'acute' | 'right' | 'obtuse' {
  const a = angles(pts);
  if (a.some((x) => x === 90)) return 'right';
  return a.some((x) => x > 90) ? 'obtuse' : 'acute';
}
