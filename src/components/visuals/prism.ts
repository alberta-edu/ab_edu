// 3D prisms for comparing faces (MAT4-OI3-GQ1-LO1, S1.3): which faces are parallel and which are
// perpendicular. Faces are lists of 3D points; the drawing is a turned, flat projection.

export type V3 = [number, number, number];
export interface Face {
  name: string;
  pts: V3[];
}

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a: V3): V3 => {
  const l = Math.hypot(...a);
  return [a[0] / l, a[1] / l, a[2] / l];
};

/** Outward normal, from points listed counterclockwise when seen from outside. */
export const normal = (f: Face): V3 => unit(cross(sub(f.pts[1], f.pts[0]), sub(f.pts[2], f.pts[0])));

export function boxFaces(w = 3, h = 2, d = 1.6): Face[] {
  const [x, y, z] = [w / 2, h / 2, d / 2];
  const P = (a: number, b: number, c: number): V3 => [a * x, b * y, c * z];
  return [
    { name: 'top', pts: [P(-1, 1, 1), P(1, 1, 1), P(1, 1, -1), P(-1, 1, -1)] },
    { name: 'bottom', pts: [P(-1, -1, 1), P(-1, -1, -1), P(1, -1, -1), P(1, -1, 1)] },
    { name: 'front', pts: [P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1)] },
    { name: 'back', pts: [P(-1, -1, -1), P(-1, 1, -1), P(1, 1, -1), P(1, -1, -1)] },
    { name: 'right', pts: [P(1, -1, 1), P(1, -1, -1), P(1, 1, -1), P(1, 1, 1)] },
    { name: 'left', pts: [P(-1, -1, 1), P(-1, 1, 1), P(-1, 1, -1), P(-1, -1, -1)] },
  ];
}

/** A prism with equilateral triangle ends, lying along the x axis. */
export function triFaces(len = 3, side = 2): Face[] {
  const h = (side * Math.sqrt(3)) / 2;
  const tri = (x: number): V3[] => [[x, -h / 3, side / 2], [x, -h / 3, -side / 2], [x, (2 * h) / 3, 0]];
  const L = tri(-len / 2);
  const R = tri(len / 2);
  return [
    { name: 'left end', pts: [L[0], L[2], L[1]] },
    { name: 'right end', pts: [R[0], R[1], R[2]] },
    { name: 'bottom', pts: [L[0], L[1], R[1], R[0]] },
    { name: 'front slope', pts: [L[0], R[0], R[2], L[2]] },
    { name: 'back slope', pts: [L[1], L[2], R[2], R[1]] },
  ];
}

export type Relation = 'self' | 'parallel' | 'perpendicular' | 'neither';

export function relation(a: Face, b: Face): Relation {
  if (a === b) return 'self';
  const c = dot(normal(a), normal(b));
  if (Math.abs(Math.abs(c) - 1) < 1e-6) return 'parallel';
  if (Math.abs(c) < 1e-6) return 'perpendicular';
  return 'neither';
}

export function relationText(faces: Face[], i: number): string {
  const rel = faces.map((f) => relation(faces[i], f));
  const par = rel.filter((r) => r === 'parallel').length;
  const per = rel.filter((r) => r === 'perpendicular').length;
  const nei = rel.filter((r) => r === 'neither').length;
  const parts = [`${par} parallel face${par === 1 ? '' : 's'}`, `${per} perpendicular face${per === 1 ? '' : 's'}`];
  if (nei) parts.push(`${nei} face${nei === 1 ? '' : 's'} that ${nei === 1 ? 'is' : 'are'} neither`);
  return `The ${faces[i].name} face has ${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}.`;
}

/** Turn a point by yaw (around the up axis) then pitch (around the left-right axis), in degrees. */
export function turn(p: V3, yaw: number, pitch: number): V3 {
  const a = (yaw * Math.PI) / 180;
  const b = (pitch * Math.PI) / 180;
  const x1 = p[0] * Math.cos(a) + p[2] * Math.sin(a);
  const z1 = -p[0] * Math.sin(a) + p[2] * Math.cos(a);
  const y2 = p[1] * Math.cos(b) - z1 * Math.sin(b);
  const z2 = p[1] * Math.sin(b) + z1 * Math.cos(b);
  return [x1, y2, z2];
}
