// Symmetry, congruence and tessellations for Grade 6 (MAT6-OI3-GQ1-LO1). Two shapes are related by
// symmetry when a reflection or rotation maps one exactly onto the other; congruent shapes match
// when laid on top, in any position. Pure functions for the shape-mapper and tessellation visuals.

/** Affine map: x' = a·x + c·y + e, y' = b·x + d·y + f (screen coordinates, y down). */
export interface M {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}
export type Pt = [number, number];

export const ID: M = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };

/** Reflection across the vertical line x = cx. */
export const reflectV = (cx: number): M => ({ a: -1, b: 0, c: 0, d: 1, e: 2 * cx, f: 0 });
/** Reflection across the horizontal line y = cy. */
export const reflectH = (cy: number): M => ({ a: 1, b: 0, c: 0, d: -1, e: 0, f: 2 * cy });
/** Turn by `deg` degrees clockwise on screen about (cx, cy). */
export function rotate(deg: number, cx: number, cy: number): M {
  const r = (deg * Math.PI) / 180;
  const cos = Math.round(Math.cos(r) * 1e9) / 1e9;
  const sin = Math.round(Math.sin(r) * 1e9) / 1e9;
  return { a: cos, b: sin, c: -sin, d: cos, e: cx - cos * cx + sin * cy, f: cy - sin * cx - cos * cy };
}
export const translate = (dx: number, dy: number): M => ({ a: 1, b: 0, c: 0, d: 1, e: dx, f: dy });

/** `second` after `first`. */
export function compose(first: M, second: M): M {
  return {
    a: second.a * first.a + second.c * first.b,
    b: second.b * first.a + second.d * first.b,
    c: second.a * first.c + second.c * first.d,
    d: second.b * first.c + second.d * first.d,
    e: second.a * first.e + second.c * first.f + second.e,
    f: second.b * first.e + second.d * first.f + second.f,
  };
}

export const apply = (m: M, [x, y]: Pt): Pt => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f];

const key = ([x, y]: Pt) => `${Math.round(x * 1000) / 1000},${Math.round(y * 1000) / 1000}`;

/** Does the image of `shape` under m land exactly on `target` (same corners, in any order)? */
export function matches(m: M, shape: Pt[], target: Pt[]): boolean {
  const got = new Set(shape.map((p) => key(apply(m, p))));
  return target.length === got.size && target.every((p) => got.has(key(p)));
}

export const points = (pts: Pt[], unit = 1) => pts.map(([x, y]) => `${x * unit},${y * unit}`).join(' ');

/** CSS matrix for a map in grid units, drawn at `unit` pixels per grid unit. */
export const cssMatrix = (m: M, unit: number) => `matrix(${m.a}, ${m.b}, ${m.c}, ${m.d}, ${m.e * unit}, ${m.f * unit})`;

// ---------------------------------------------------------------- tessellations

export type TileKind = 'squares' | 'triangles' | 'hexagons' | 'star';

export interface Tile {
  pts: Pt[];
  /** Colour band, so neighbours can differ. */
  band: number;
}

const round = (p: Pt): Pt => [Math.round(p[0] * 100) / 100, Math.round(p[1] * 100) / 100];

/** Tiles covering roughly a W × H area, in drawing order (centre outwards for the star). */
export function tessellation(kind: TileKind, W = 360, H = 240): Tile[] {
  const out: Tile[] = [];
  if (kind === 'squares') {
    const s = 60;
    for (let r = 0; r < H / s; r++) for (let c = 0; c < W / s; c++) out.push({ pts: [[c * s, r * s], [(c + 1) * s, r * s], [(c + 1) * s, (r + 1) * s], [c * s, (r + 1) * s]], band: (r + c) % 2 });
  } else if (kind === 'triangles') {
    const s = 60;
    const h = (s * Math.sqrt(3)) / 2;
    for (let r = 0; r < H / h; r++)
      for (let c = -1; c < W / (s / 2); c++) {
        const x = c * (s / 2);
        const up = (c + r) % 2 === 0;
        const pts: Pt[] = up ? [[x, (r + 1) * h], [x + s / 2, r * h], [x + s, (r + 1) * h]] : [[x, r * h], [x + s, r * h], [x + s / 2, (r + 1) * h]];
        out.push({ pts: pts.map(round), band: up ? 0 : 1 });
      }
  } else if (kind === 'hexagons') {
    const R = 36;
    const w = Math.sqrt(3) * R;
    for (let r = -1; r < H / (1.5 * R) + 1; r++)
      for (let c = -1; c < W / w + 1; c++) {
        const cx = c * w + (r % 2 ? w / 2 : 0);
        const cy = r * 1.5 * R;
        const pts = Array.from({ length: 6 }, (_, i) => round([cx + R * Math.cos(((60 * i - 30) * Math.PI) / 180), cy + R * Math.sin(((60 * i - 30) * Math.PI) / 180)]));
        out.push({ pts, band: (((c + r) % 3) + 3) % 3 });
      }
  } else {
    // An eight-point star: 8 large diamonds around the centre, each a 45° turn of the one before,
    // and each pieced from 3 × 3 small congruent diamonds.
    const cx = W / 2;
    const cy = H / 2;
    const L = Math.min(W, H) / 2 - 6;
    const n = 3;
    for (let k = 0; k < 8; k++) {
      const t = ((k * 45 - 90) * Math.PI) / 180;
      const u: Pt = [Math.cos(t - Math.PI / 8) * (L / (n * 1.848)), Math.sin(t - Math.PI / 8) * (L / (n * 1.848))];
      const v: Pt = [Math.cos(t + Math.PI / 8) * (L / (n * 1.848)), Math.sin(t + Math.PI / 8) * (L / (n * 1.848))];
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
          const at = (a: number, b: number): Pt => round([cx + a * u[0] + b * v[0], cy + a * u[1] + b * v[1]]);
          out.push({ pts: [at(i, j), at(i + 1, j), at(i + 1, j + 1), at(i, j + 1)], band: Math.max(i, j) });
        }
    }
  }
  return out;
}

// ---------------------------------------------------------------- shape pairs

export interface Move {
  label: string;
  m: M;
}
export interface Pair {
  id: string;
  name: string;
  a: Pt[];
  b: Pt[];
  /** Mirror line (x = mirror) and turn centre, drawn on the grid. */
  mirror?: number;
  centre?: Pt;
  moves: Move[];
  /** The single map that lays A on B, for "Lay on top". */
  lay: M;
  /** What the pair shows, once A lands on B. */
  found: string;
}

/** An L shape, so a flip and a turn look different. Grid 12 × 8. */
export const L_SHAPE: Pt[] = [[1, 1], [1, 5], [2, 5], [2, 2], [4, 2], [4, 1]];
const img = (m: M) => L_SHAPE.map((p) => apply(m, p).map((v) => Math.round(v)) as Pt);
const flip = reflectV(6);
const turn = rotate(180, 6, 4);
const slide = translate(6, 2);

export const PAIRS: Pair[] = [
  { id: 'reflect', name: 'Pair 1', a: L_SHAPE, b: img(flip), mirror: 6, centre: [6, 4], moves: [{ label: 'Reflect', m: flip }, { label: 'Rotate 180°', m: turn }], lay: flip, found: 'A reflection maps A onto B. They have reflection symmetry, so they are congruent.' },
  { id: 'rotate', name: 'Pair 2', a: L_SHAPE, b: img(turn), mirror: 6, centre: [6, 4], moves: [{ label: 'Reflect', m: flip }, { label: 'Rotate 180°', m: turn }], lay: turn, found: 'A half turn maps A onto B. They have rotation symmetry, so they are congruent.' },
  { id: 'two', name: 'Pair 3', a: L_SHAPE, b: img(compose(flip, turn)), mirror: 6, centre: [6, 4], moves: [{ label: 'Reflect', m: flip }, { label: 'Rotate 180°', m: turn }], lay: compose(flip, turn), found: 'It took two moves: a reflection, then a rotation. The shapes are symmetrical and congruent.' },
  { id: 'slide', name: 'Pair 4', a: L_SHAPE, b: img(slide), mirror: 6, centre: [6, 4], moves: [{ label: 'Reflect', m: flip }, { label: 'Rotate 180°', m: turn }], lay: slide, found: 'Laid on top, they match: they are congruent. But no reflection or rotation here maps one onto the other, so they are not related by symmetry.' },
];
